"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { clamp01, easeInOut, easeOut, lerp, segment } from "./easing";

// ---------------------------------------------------------------------------
// Dimensiones (unidades de escena)
// ---------------------------------------------------------------------------
const BOARD_W = 6.4;
const BOARD_D = 4.4;
const BOARD_T = 0.14;

const CHIP = 2.2;
const CHIP_H = 0.22;
const STANDOFF = 0.06;
const PINS_PER_SIDE = 28;
const PIN_SPAN = 1.9;
const PITCH = PIN_SPAN / (PINS_PER_SIDE - 1);
const PIN_REACH = 0.18;
const PAD_IN = CHIP / 2 + 0.05;
const PAD_OUT = CHIP / 2 + 0.26;
const SIDES = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

// ---------------------------------------------------------------------------
// Línea de tiempo (segundos desde que la diapositiva se activa)
// ---------------------------------------------------------------------------
const T_DESCENT = 0.35;
const D_DESCENT = 1.25;
const T_PRESS = 1.6;
const D_PRESS = 0.28;
const T_CONTACT = T_PRESS + D_PRESS;
const T_ENERGIZE = T_CONTACT + 0.08;
const T_LED = T_CONTACT + 0.75;
const T_SETTLED = 4;
const HOVER_Y = 1.7;
const ALIGN_Y = 0.3;

const SPARK_COLOR = 0xdff4ff;
const SPARK_GLOW = 0x62b8ff;
const ENERGY_COLOR = new THREE.Color(0x8dff70);

type Vec2 = [number, number];

/** Convierte coordenadas de un lado del chip (u hacia afuera, w a lo largo) a la tablilla. */
function sideToBoard(a: number, u: number, w: number): Vec2 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [u * c + w * s, -u * s + w * c];
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Trace = { pts: Vec2[]; cum: number[]; len: number };

function buildTraces(): Trace[] {
  const rnd = mulberry32(11);
  const traces: Trace[] = [];
  for (const a of SIDES) {
    const alongX = Math.abs(Math.cos(a)) > 0.5;
    const spread = alongX ? 1.55 : 1.25;
    const uMax = alongX ? BOARD_W / 2 - 0.25 : BOARD_D / 2 - 0.25;
    const u0 = PAD_OUT - 0.02;
    const u1 = PAD_OUT + 0.14;
    for (let i = 0; i < PINS_PER_SIDE; i += 2) {
      const w = -PIN_SPAN / 2 + i * PITCH;
      const dw = w * (spread - 1);
      const u2 = u1 + Math.abs(dw);
      const full = rnd() < 0.62;
      const u3 = full ? uMax : Math.min(uMax, u2 + 0.25 + rnd() * 0.7);
      const local: Vec2[] = [
        [u0, w],
        [u1, w],
        [u2, w + dw],
        [u3, w + dw],
      ];
      const pts = local.map(([u, ww]) => sideToBoard(a, u, ww));
      const cum = [0];
      for (let k = 1; k < pts.length; k++) {
        cum.push(
          cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]),
        );
      }
      traces.push({ pts, cum, len: cum[cum.length - 1] });
    }
  }
  return traces;
}

function pointOnTrace(tr: Trace, d: number): Vec2 {
  for (let k = 1; k < tr.pts.length; k++) {
    if (d <= tr.cum[k]) {
      const f = (d - tr.cum[k - 1]) / (tr.cum[k] - tr.cum[k - 1] || 1);
      return [
        lerp(tr.pts[k - 1][0], tr.pts[k][0], f),
        lerp(tr.pts[k - 1][1], tr.pts[k][1], f),
      ];
    }
  }
  return tr.pts[tr.pts.length - 1];
}

// Componentes pequeños sobre la tablilla: [x, z, rotación, etiqueta]
const SMDS: [number, number, number, string][] = [
  [-1.55, -1.9, 0, "R1"],
  [-2.75, -1.9, 0, "R2"],
  [1.55, -1.9, 0, "C3"],
  [2.8, -1.9, 0, "C4"],
  [1.55, 1.9, 0, "R3"],
  [1.9, 1.9, 0, "R4"],
  [2.3, 1.9, 0, "R5"],
  [-1.55, 1.9, 0, "C5"],
];
const CAPS: [number, number, string][] = [
  [-2.1, -1.85, "C1"],
  [2.2, -1.85, "C2"],
];
const CRYSTAL: Vec2 = [-2.35, 1.88];
const LED: Vec2 = [2.78, 1.9];

function radialTexture(stops: [number, string][], size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function drawBoardTextures(traces: Trace[]) {
  const CW = 2048;
  const CH = Math.round((CW * BOARD_D) / BOARD_W);
  const k = CW / BOARD_W;
  const px = (x: number, z: number): Vec2 => [(x + BOARD_W / 2) * k, (z + BOARD_D / 2) * k];

  const base = document.createElement("canvas");
  const glow = document.createElement("canvas");
  base.width = glow.width = CW;
  base.height = glow.height = CH;
  const b = base.getContext("2d")!;
  const g = glow.getContext("2d")!;

  // Máscara antisoldante
  const bg = b.createLinearGradient(0, 0, CW, CH);
  bg.addColorStop(0, "#14532f");
  bg.addColorStop(1, "#0d3f24");
  b.fillStyle = bg;
  b.fillRect(0, 0, CW, CH);
  g.fillStyle = "#000";
  g.fillRect(0, 0, CW, CH);

  // Pistas
  const traceW = 0.03 * k;
  for (const ctx of [b, g]) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = traceW;
    ctx.strokeStyle = ctx === b ? "#2a7d48" : "#ffffff";
    for (const tr of traces) {
      ctx.beginPath();
      tr.pts.forEach(([x, z], i) => {
        const [cx, cy] = px(x, z);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.stroke();
    }
  }

  // Vías al final de cada pista
  for (const tr of traces) {
    const [cx, cy] = px(...tr.pts[tr.pts.length - 1]);
    b.fillStyle = "#d4af37";
    b.beginPath();
    b.arc(cx, cy, 0.045 * k, 0, Math.PI * 2);
    b.fill();
    b.fillStyle = "#0b2616";
    b.beginPath();
    b.arc(cx, cy, 0.02 * k, 0, Math.PI * 2);
    b.fill();
    g.fillStyle = "#fff";
    g.beginPath();
    g.arc(cx, cy, 0.045 * k, 0, Math.PI * 2);
    g.fill();
  }

  // Pads del QFP
  const padHalf = 0.022;
  for (const a of SIDES) {
    for (let i = 0; i < PINS_PER_SIDE; i++) {
      const w = -PIN_SPAN / 2 + i * PITCH;
      const corners = [
        sideToBoard(a, PAD_IN, w - padHalf),
        sideToBoard(a, PAD_OUT, w - padHalf),
        sideToBoard(a, PAD_OUT, w + padHalf),
        sideToBoard(a, PAD_IN, w + padHalf),
      ].map(([x, z]) => px(x, z));
      for (const ctx of [b, g]) {
        ctx.fillStyle = ctx === b ? "#d6b44a" : "#fff";
        ctx.beginPath();
        corners.forEach(([cx, cy], j) => (j ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy)));
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // Serigrafía
  b.strokeStyle = "rgba(236,242,238,0.85)";
  b.fillStyle = "rgba(236,242,238,0.9)";
  b.lineWidth = 0.012 * k;
  const e = PAD_OUT + 0.1;
  const arm = 0.25;
  for (const [sx, sz] of [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]) {
    const [x0, y0] = px(sx * e, sz * e);
    b.beginPath();
    b.moveTo(x0 - sx * arm * k, y0);
    b.lineTo(x0, y0);
    b.lineTo(x0, y0 - sz * arm * k);
    b.stroke();
  }
  {
    const [dx, dy] = px(-e - 0.08, -e - 0.08);
    b.beginPath();
    b.arc(dx, dy, 0.035 * k, 0, Math.PI * 2);
    b.fill();
    b.font = `600 ${0.13 * k}px ui-sans-serif, system-ui, sans-serif`;
    const [lx, ly] = px(e + 0.05, -e - 0.05);
    b.fillText("U1", lx, ly);
  }

  b.font = `600 ${0.1 * k}px ui-sans-serif, system-ui, sans-serif`;
  for (const [x, z, , label] of SMDS) {
    const [cx, cy] = px(x, z);
    b.strokeRect(cx - 0.15 * k, cy - 0.09 * k, 0.3 * k, 0.18 * k);
    b.fillText(label, cx - 0.12 * k, cy - 0.13 * k);
    // pads de los extremos
    b.fillStyle = "#d6b44a";
    b.fillRect(cx - 0.13 * k, cy - 0.06 * k, 0.06 * k, 0.12 * k);
    b.fillRect(cx + 0.07 * k, cy - 0.06 * k, 0.06 * k, 0.12 * k);
    b.fillStyle = "rgba(236,242,238,0.9)";
  }
  for (const [x, z, label] of CAPS) {
    const [cx, cy] = px(x, z);
    b.beginPath();
    b.arc(cx, cy, 0.24 * k, 0, Math.PI * 2);
    b.stroke();
    b.fillText(label, cx + 0.27 * k, cy + 0.04 * k);
  }
  {
    const [cx, cy] = px(...CRYSTAL);
    b.strokeRect(cx - 0.28 * k, cy - 0.13 * k, 0.56 * k, 0.26 * k);
    b.fillText("Y1", cx + 0.32 * k, cy + 0.04 * k);
    const [lx, ly] = px(...LED);
    b.strokeRect(lx - 0.12 * k, ly - 0.09 * k, 0.24 * k, 0.18 * k);
    b.fillText("PWR", lx - 0.2 * k, ly - 0.14 * k);
  }

  // Barrenos de montaje
  for (const [sx, sz] of [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]) {
    const [cx, cy] = px(sx * (BOARD_W / 2 - 0.22), sz * (BOARD_D / 2 - 0.22));
    b.fillStyle = "#d4af37";
    b.beginPath();
    b.arc(cx, cy, 0.12 * k, 0, Math.PI * 2);
    b.fill();
    b.fillStyle = "#0a1a12";
    b.beginPath();
    b.arc(cx, cy, 0.07 * k, 0, Math.PI * 2);
    b.fill();
  }

  b.fillStyle = "rgba(236,242,238,0.7)";
  b.font = `700 ${0.12 * k}px ui-sans-serif, system-ui, sans-serif`;
  {
    const [cx, cy] = px(-BOARD_W / 2 + 0.45, BOARD_D / 2 - 0.12);
    b.fillText("MARDOS · REV 2.6", cx, cy);
  }

  const baseTex = new THREE.CanvasTexture(base);
  baseTex.colorSpace = THREE.SRGBColorSpace;
  baseTex.anisotropy = 8;
  const glowTex = new THREE.CanvasTexture(glow);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  glowTex.anisotropy = 8;
  return { baseTex, glowTex };
}

function drawChipMarking() {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, S, S);
  // Muesca del pin 1
  const grad = g.createRadialGradient(62, 62, 4, 62, 62, 20);
  grad.addColorStop(0, "rgba(0,0,0,0.55)");
  grad.addColorStop(0.8, "rgba(0,0,0,0.35)");
  grad.addColorStop(1, "rgba(255,255,255,0.12)");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(62, 62, 20, 0, Math.PI * 2);
  g.fill();

  g.fillStyle = "rgba(232,234,236,0.92)";
  g.textAlign = "center";
  g.font = "700 46px ui-monospace, SFMono-Regular, Menlo, monospace";
  g.fillText("MARDOS", S / 2, S / 2 - 40);
  g.font = "600 40px ui-monospace, SFMono-Regular, Menlo, monospace";
  g.fillText("MRD128-32PV", S / 2, S / 2 + 18);
  g.fillText("2610A", S / 2, S / 2 + 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function pinGeometry() {
  const shoulder = new THREE.BoxGeometry(0.085, 0.02, 0.036);
  shoulder.translate(0.0425, STANDOFF + CHIP_H / 2, 0);
  const leg = new THREE.BoxGeometry(0.022, STANDOFF + CHIP_H / 2 - 0.01, 0.036);
  leg.translate(0.085, (STANDOFF + CHIP_H / 2) / 2 + 0.005, 0);
  const foot = new THREE.BoxGeometry(PIN_REACH - 0.08, 0.02, 0.036);
  foot.translate(0.08 + (PIN_REACH - 0.08) / 2, 0.01, 0);
  const merged = mergeGeometries([shoulder, leg, foot])!;
  shoulder.dispose();
  leg.dispose();
  foot.dispose();
  return merged;
}

type Spark = {
  core: Line2;
  halo: Line2;
  geo: LineGeometry;
  sprite: THREE.Sprite;
  life: number;
  max: number;
  origin: THREE.Vector3;
  end: THREE.Vector3;
  alive: boolean;
};

type Props = { active: boolean; reducedMotion: boolean };

export default function ChipScene({ active, reducedMotion }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const controlRef = useRef<{ restart: () => void; sync: () => void } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // sin WebGL: el hero se queda solo con el texto
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;
    track(envTex);
    track(pmrem);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x0b1a33, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 9, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7fb2ff, 1.6);
    rim.position.set(-6, 3, -6);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);
    const board = new THREE.Group();
    board.rotation.y = -0.62;
    root.add(board);

    // --- Tablilla ---------------------------------------------------------
    const traces = buildTraces();
    const { baseTex, glowTex } = drawBoardTextures(traces);
    track(baseTex);
    track(glowTex);
    const topMat = track(
      new THREE.MeshStandardMaterial({
        map: baseTex,
        emissiveMap: glowTex,
        emissive: ENERGY_COLOR.clone(),
        emissiveIntensity: 0,
        roughness: 0.5,
        metalness: 0.15,
      }),
    );
    const edgeMat = track(new THREE.MeshStandardMaterial({ color: 0x2f5a37, roughness: 0.8 }));
    const boardGeo = track(new THREE.BoxGeometry(BOARD_W, BOARD_T, BOARD_D));
    const boardMesh = new THREE.Mesh(boardGeo, [edgeMat, edgeMat, topMat, edgeMat, edgeMat, edgeMat]);
    boardMesh.position.y = -BOARD_T / 2;
    board.add(boardMesh);

    // Componentes
    const smdBodyGeo = track(new THREE.BoxGeometry(0.2, 0.07, 0.11));
    const smdEndGeo = track(new THREE.BoxGeometry(0.05, 0.072, 0.112));
    const smdResMat = track(new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.6 }));
    const smdCapMat = track(new THREE.MeshStandardMaterial({ color: 0xb48a58, roughness: 0.55 }));
    const metalMat = track(
      new THREE.MeshStandardMaterial({ color: 0xd9dde2, metalness: 1, roughness: 0.28 }),
    );
    for (const [x, z, r, label] of SMDS) {
      const g = new THREE.Group();
      g.position.set(x, 0.035, z);
      g.rotation.y = r;
      g.add(new THREE.Mesh(smdBodyGeo, label.startsWith("C") ? smdCapMat : smdResMat));
      const e1 = new THREE.Mesh(smdEndGeo, metalMat);
      e1.position.x = -0.1;
      const e2 = new THREE.Mesh(smdEndGeo, metalMat);
      e2.position.x = 0.1;
      g.add(e1, e2);
      board.add(g);
    }
    const capGeo = track(new THREE.CylinderGeometry(0.2, 0.2, 0.42, 32));
    const capTopGeo = track(new THREE.CylinderGeometry(0.185, 0.185, 0.012, 32));
    const capMat = track(new THREE.MeshStandardMaterial({ color: 0x1b3a6b, roughness: 0.35, metalness: 0.2 }));
    for (const [x, z] of CAPS) {
      const c = new THREE.Mesh(capGeo, capMat);
      c.position.set(x, 0.21, z);
      const top = new THREE.Mesh(capTopGeo, metalMat);
      top.position.set(x, 0.426, z);
      board.add(c, top);
    }
    const crystalGeo = track(new RoundedBoxGeometry(0.5, 0.13, 0.2, 2, 0.04));
    const crystal = new THREE.Mesh(crystalGeo, metalMat);
    crystal.position.set(CRYSTAL[0], 0.065, CRYSTAL[1]);
    board.add(crystal);

    const ledGeo = track(new THREE.BoxGeometry(0.16, 0.07, 0.1));
    const ledMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x1f3d22,
        emissive: 0x7dff6a,
        emissiveIntensity: 0,
        roughness: 0.3,
      }),
    );
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(LED[0], 0.035, LED[1]);
    board.add(led);

    const glowTexture = track(
      radialTexture([
        [0, "rgba(255,255,255,1)"],
        [0.25, "rgba(255,255,255,0.55)"],
        [1, "rgba(255,255,255,0)"],
      ]),
    );
    const ledGlowMat = track(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0x7dff6a,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const ledGlow = new THREE.Sprite(ledGlowMat);
    ledGlow.position.set(LED[0], 0.1, LED[1]);
    ledGlow.scale.setScalar(0.7);
    board.add(ledGlow);

    // --- Sombra suave del chip -------------------------------------------
    const shadowTex = track(
      radialTexture([
        [0, "rgba(0,0,0,0.9)"],
        [0.55, "rgba(0,0,0,0.5)"],
        [1, "rgba(0,0,0,0)"],
      ]),
    );
    const shadowMat = track(
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.2 }),
    );
    const shadowGeo = track(new THREE.PlaneGeometry(CHIP * 1.55, CHIP * 1.55));
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.003;
    board.add(shadow);

    // --- Chip ---------------------------------------------------------------
    const chip = new THREE.Group();
    board.add(chip);
    const bodyGeo = track(new RoundedBoxGeometry(CHIP, CHIP_H, CHIP, 3, 0.035));
    const bodyMat = track(new THREE.MeshStandardMaterial({ color: 0x18191c, roughness: 0.6, metalness: 0.05 }));
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = STANDOFF + CHIP_H / 2;
    chip.add(body);

    const markTex = track(drawChipMarking());
    const markMat = track(
      new THREE.MeshStandardMaterial({ map: markTex, transparent: true, roughness: 0.75, depthWrite: false }),
    );
    const markGeo = track(new THREE.PlaneGeometry(CHIP * 0.95, CHIP * 0.95));
    const mark = new THREE.Mesh(markGeo, markMat);
    mark.rotation.x = -Math.PI / 2;
    mark.position.y = STANDOFF + CHIP_H + 0.002;
    chip.add(mark);

    const pinGeo = track(pinGeometry());
    const pins = new THREE.InstancedMesh(pinGeo, metalMat, PINS_PER_SIDE * 4);
    const footTips: { pos: THREE.Vector3; out: THREE.Vector3 }[] = [];
    {
      const m = new THREE.Matrix4();
      const rot = new THREE.Matrix4();
      let n = 0;
      for (const a of SIDES) {
        rot.makeRotationY(a);
        for (let i = 0; i < PINS_PER_SIDE; i++) {
          const w = -PIN_SPAN / 2 + i * PITCH;
          m.makeTranslation(CHIP / 2, 0, w).premultiply(rot);
          pins.setMatrixAt(n++, m);
          const [tx, tz] = sideToBoard(a, CHIP / 2 + PIN_REACH - 0.02, w);
          const [ox, oz] = sideToBoard(a, 1, 0);
          footTips.push({ pos: new THREE.Vector3(tx, 0.02, tz), out: new THREE.Vector3(ox, 0, oz) });
        }
      }
    }
    chip.add(pins);

    // --- Pulsos de corriente por las pistas -------------------------------
    const PULSES = 110;
    const pulsePos = new Float32Array(PULSES * 3);
    const pulseCol = new Float32Array(PULSES * 3);
    const pulseGeo = track(new THREE.BufferGeometry());
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute("color", new THREE.BufferAttribute(pulseCol, 3));
    const pulseMat = track(
      new THREE.PointsMaterial({
        size: 0.16,
        map: glowTexture,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    pulsePoints.frustumCulled = false;
    board.add(pulsePoints);
    const pulseState = Array.from({ length: PULSES }, () => ({ trace: 0, d: 0, speed: 1 }));
    const respawnPulse = (p: (typeof pulseState)[number], d = 0) => {
      p.trace = Math.floor(Math.random() * traces.length);
      p.d = d;
      p.speed = 0.9 + Math.random() * 0.9;
    };

    // --- Chispas --------------------------------------------------------------
    const SPARKS = 14;
    const SEG = 9;
    const sparkSpriteMat = track(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: 0x9fdcff,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const sparks: Spark[] = [];
    for (let i = 0; i < SPARKS; i++) {
      const geo = track(new LineGeometry());
      geo.setPositions(new Array((SEG + 1) * 3).fill(0));
      const coreMat = track(
        new LineMaterial({
          color: SPARK_COLOR,
          linewidth: 3,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const haloMat = track(
        new LineMaterial({
          color: SPARK_GLOW,
          linewidth: 11,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      const core = new Line2(geo, coreMat);
      const halo = new Line2(geo, haloMat);
      core.visible = halo.visible = false;
      core.frustumCulled = halo.frustumCulled = false;
      const sprite = new THREE.Sprite(sparkSpriteMat.clone());
      track(sprite.material);
      sprite.visible = false;
      board.add(halo, core, sprite);
      sparks.push({
        core,
        halo,
        geo,
        sprite,
        life: 0,
        max: 0.2,
        origin: new THREE.Vector3(),
        end: new THREE.Vector3(),
        alive: false,
      });
    }
    const sparkPts: number[] = new Array((SEG + 1) * 3).fill(0);

    const spawnSpark = () => {
      const s = sparks.find((sp) => !sp.alive);
      if (!s) return;
      const tip = footTips[Math.floor(Math.random() * footTips.length)];
      s.origin.copy(tip.pos);
      const along = new THREE.Vector3(-tip.out.z, 0, tip.out.x);
      s.end
        .copy(tip.pos)
        .addScaledVector(tip.out, 0.08 + Math.random() * 0.22)
        .addScaledVector(along, (Math.random() - 0.5) * 0.25);
      s.end.y += 0.18 + Math.random() * 0.32;
      s.life = 0;
      s.max = 0.12 + Math.random() * 0.2;
      s.alive = true;
      s.core.visible = s.halo.visible = s.sprite.visible = true;
      s.sprite.position.copy(tip.pos);
    };

    const flash = new THREE.PointLight(0x9fd8ff, 0, 6, 1.6);
    flash.position.set(0, 0.8, 0);
    board.add(flash);

    // --- Estado y animación ---------------------------------------------------
    let tl = 0;
    let time = 0;
    let burstAcc = 0;
    let nextIdleSpark = 0;
    let flashLevel = 0;
    let energized = false;
    const pointer = { x: 0, y: 0 };
    const sway = { x: 0, y: 0 };

    const resetState = () => {
      tl = reducedMotion ? T_SETTLED : 0;
      burstAcc = 0;
      nextIdleSpark = T_SETTLED + 1;
      flashLevel = 0;
      energized = false;
      for (const s of sparks) {
        s.alive = false;
        s.core.visible = s.halo.visible = s.sprite.visible = false;
      }
      pulseState.forEach((p) => respawnPulse(p, Math.random() * 3));
    };

    const update = (dt: number) => {
      // Chip: flota, se alinea y se inserta
      const d1 = easeInOut(segment(tl, T_DESCENT, D_DESCENT));
      const d2 = easeOut(segment(tl, T_PRESS, D_PRESS));
      let y = lerp(HOVER_Y, ALIGN_Y, d1);
      if (tl >= T_PRESS) y = lerp(ALIGN_Y, 0, d2);
      y += Math.sin(time * 2) * 0.05 * (1 - d1);
      chip.position.y = y;
      chip.rotation.set(lerp(-0.28, 0, d1), lerp(0.85, 0, d1), lerp(0.1, 0, d1));

      const h = clamp01(y / HOVER_Y);
      shadowMat.opacity = lerp(0.6, 0.16, h);
      shadow.scale.setScalar(1 + h * 0.5);

      // Contacto: ráfaga de chispas y destello
      if (!energized && tl >= T_CONTACT) {
        energized = true;
        if (!reducedMotion) {
          flashLevel = 1;
          for (let i = 0; i < 5; i++) spawnSpark();
          pulseState.forEach((p) => respawnPulse(p, -Math.random() * 0.25));
        }
      }
      if (!reducedMotion && tl >= T_CONTACT && tl < T_CONTACT + 0.6) {
        burstAcc += dt * 20;
        while (burstAcc >= 1) {
          spawnSpark();
          burstAcc -= 1;
        }
      }
      if (!reducedMotion && tl >= nextIdleSpark) {
        spawnSpark();
        if (Math.random() < 0.4) spawnSpark();
        nextIdleSpark = tl + 1.6 + Math.random() * 1.8;
      }
      flashLevel *= Math.exp(-dt * 7);
      flash.intensity = flashLevel * 18;

      // Energía en la tablilla
      const e = easeOut(segment(tl, T_ENERGIZE, 1));
      const breathe = reducedMotion ? 0 : Math.sin(time * 2.2) * 0.06;
      topMat.emissiveIntensity = e * (0.55 + breathe) + flashLevel * 0.9;
      const ledOn = easeOut(segment(tl, T_LED, 0.25));
      ledMat.emissiveIntensity = ledOn * 2.4;
      ledGlowMat.opacity = ledOn * (0.85 + breathe);

      // Pulsos
      const pulseAlpha = reducedMotion ? 0 : e;
      for (let i = 0; i < PULSES; i++) {
        const p = pulseState[i];
        const tr = traces[p.trace];
        if (energized) {
          p.d += p.speed * dt;
          if (p.d > tr.len) respawnPulse(p, 0);
        }
        const d = Math.max(0, p.d);
        const [x, z] = pointOnTrace(tr, d);
        pulsePos[i * 3] = x;
        pulsePos[i * 3 + 1] = 0.01;
        pulsePos[i * 3 + 2] = z;
        const fade =
          p.d < 0 ? 0 : clamp01(d / 0.12) * clamp01((traces[p.trace].len - d) / 0.25);
        const a = fade * pulseAlpha;
        pulseCol[i * 3] = ENERGY_COLOR.r * a;
        pulseCol[i * 3 + 1] = ENERGY_COLOR.g * a;
        pulseCol[i * 3 + 2] = ENERGY_COLOR.b * a;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.color.needsUpdate = true;

      // Chispas (se re-dibujan con jitter mientras viven)
      for (const s of sparks) {
        if (!s.alive) continue;
        s.life += dt;
        const k = s.life / s.max;
        if (k >= 1) {
          s.alive = false;
          s.core.visible = s.halo.visible = s.sprite.visible = false;
          continue;
        }
        for (let j = 0; j <= SEG; j++) {
          const f = j / SEG;
          const env = Math.sin(Math.PI * f) * 0.07;
          sparkPts[j * 3] = lerp(s.origin.x, s.end.x, f) + (Math.random() - 0.5) * env;
          sparkPts[j * 3 + 1] = lerp(s.origin.y, s.end.y, f) + (Math.random() - 0.5) * env;
          sparkPts[j * 3 + 2] = lerp(s.origin.z, s.end.z, f) + (Math.random() - 0.5) * env;
        }
        s.geo.setPositions(sparkPts);
        const alpha = (1 - k) * (0.6 + Math.random() * 0.4);
        (s.core.material as LineMaterial).opacity = alpha;
        (s.halo.material as LineMaterial).opacity = alpha * 0.4;
        const sm = s.sprite.material as THREE.SpriteMaterial;
        sm.opacity = alpha;
        s.sprite.scale.setScalar(0.35 + 0.5 * (1 - k));
      }

      // Balanceo sutil + seguimiento del puntero
      const idle = reducedMotion ? 0 : 1;
      const tx = pointer.x * 0.14 + Math.sin(time * 0.35) * 0.05 * idle;
      const ty = pointer.y * 0.06;
      const follow = 1 - Math.exp(-dt * 4);
      sway.x += (tx - sway.x) * follow;
      sway.y += (ty - sway.y) * follow;
      root.rotation.y = sway.x;
      root.rotation.x = sway.y;
    };

    // --- Tamaño y cámara -------------------------------------------------------
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const fit = Math.max(1, 1.25 / camera.aspect);
      camera.position.set(0, 7.4 * fit, 9.2 * fit);
      camera.lookAt(0, 0.35, 0);
      camera.updateProjectionMatrix();
      for (const s of sparks) {
        (s.core.material as LineMaterial).resolution.set(w, h);
        (s.halo.material as LineMaterial).resolution.set(w, h);
      }
      if (!running) renderer.render(scene, camera);
    };

    // --- Bucle ----------------------------------------------------------------
    let raf = 0;
    let running = false;
    let inView = true;
    let last = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      tl += dt;
      time += dt;
      update(dt);
      renderer.render(scene, camera);
    };

    const sync = () => {
      const should = activeRef.current && inView && !document.hidden && !reducedMotion;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const restart = () => {
      resetState();
      update(0);
      renderer.render(scene, camera);
      sync();
    };

    controlRef.current = { restart, sync };

    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(mount);
    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointerMove = (ev: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      pointer.x = clamp01((ev.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = clamp01((ev.clientY - r.top) / r.height) * 2 - 1;
    };
    if (finePointer && !reducedMotion) window.addEventListener("pointermove", onPointerMove);

    resize();
    restart();

    return () => {
      controlRef.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      pins.dispose();
      for (const d of disposables) d.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const wasActive = activeRef.current;
    activeRef.current = active;
    if (active && !wasActive) controlRef.current?.restart();
    else controlRef.current?.sync();
  }, [active]);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
