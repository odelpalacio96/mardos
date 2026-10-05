import Image from "next/image";
import type { ShowcaseItem } from "@/lib/showcase";

export default function MaterialShowcase({ items }: { items: ShowcaseItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {items.map((item) => (
        <figure key={item.title} className="overflow-hidden rounded-2xl border border-line bg-white">
          {item.kind === "cutout" ? (
            <div className="relative aspect-[4/3] bg-gradient-to-b from-surface to-[#eaefeb]">
              <div className="absolute inset-x-[24%] bottom-[8%] h-4 rounded-[50%] bg-black/25 blur-md" />
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 50vw"
                className="object-contain px-5 pb-6 pt-4 sm:px-8 sm:pb-7 sm:pt-5 drop-shadow-[0_14px_18px_rgba(0,0,0,0.18)]"
              />
            </div>
          ) : (
            <div className="relative aspect-[4/3]">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
          <figcaption className="p-4 sm:p-5">
            <h3 className="font-semibold text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{item.text}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
