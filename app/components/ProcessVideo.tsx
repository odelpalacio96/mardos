"use client";

import { useEffect, useRef, useState } from "react";
import type { PageVideo } from "@/lib/services";

// Video ilustrativo en bucle: sin sonido, solo se reproduce mientras está en
// pantalla y respeta "reducir movimiento" (muestra la imagen fija con controles).
export default function ProcessVideo({ src, poster, caption }: PageVideo) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduced]);

  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-line bg-navy-dark shadow-sm">
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          controls={reduced}
          aria-label={caption}
          className="aspect-video w-full object-cover"
        />
      </div>
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}
