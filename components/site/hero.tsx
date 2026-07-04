"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  id: number;
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
};

export function Hero({
  slides,
  rotationSeconds,
}: {
  slides: HeroSlide[];
  rotationSeconds: number;
}) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const many = slides.length > 1;

  useEffect(() => {
    if (!many) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      rotationSeconds * 1000
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [many, rotationSeconds, slides.length]);

  function go(next: number) {
    if (timer.current) clearInterval(timer.current);
    setIndex((next + slides.length) % slides.length);
  }

  if (slides.length === 0) return null;
  const slide = slides[index];

  return (
    <section className="relative isolate min-h-[520px] overflow-hidden bg-navy md:min-h-[600px]">
      {slides.map((s, i) => (
        <Image
          key={s.id}
          src={s.imageUrl}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-navy/45" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy/70 to-transparent md:hidden"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[520px] max-w-[1120px] flex-col justify-center px-4 py-16 md:min-h-[600px] md:px-6">
        <div className="max-w-2xl">
          {slide.kicker && (
            <span className="inline-block rounded bg-forest px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              {slide.kicker}
            </span>
          )}
          <h1 className="mt-4 text-4xl font-bold uppercase italic leading-tight tracking-tight text-white md:text-6xl">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              {slide.subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {slide.ctaLabel && slide.ctaHref && (
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-forest/85"
              >
                {slide.ctaLabel} <ArrowRight size={16} />
              </Link>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border-2 border-white/80 bg-navy/40 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white hover:text-navy"
            >
              Contact us
            </Link>
          </div>
        </div>

        {many && (
          <div className="mt-10 flex items-center gap-3">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="rounded-lg border border-white/40 p-2 text-white transition hover:bg-white hover:text-navy"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="rounded-lg border border-white/40 p-2 text-white transition hover:bg-white hover:text-navy"
            >
              <ChevronRight size={18} />
            </button>
            <div className="ml-2 flex gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-forest" : "w-4 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
