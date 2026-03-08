"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { DiskPlayer } from "./DiskPlayer";
import { WeddingCalendar } from "./WeddingCalendar";
import { CountdownTimer } from "./CountdownTimer";
import { GuestbookForm } from "./GuestbookForm";
import { PhotoAlbum } from "./PhotoAlbum";
import {
  FadeUp,
  FadeIn,
  SlideLeft,
  SlideRight,
  ScaleIn,
  SpringPop,
  Flip3D,
  Tilt3D,
  Float3D,
} from "./motion";
import { ThreeParticlesLazy } from "./ThreeParticlesLazy";

// ─── Palette ──────────────────────────────────────────────────────────────────
const PRIMARY = "#c44a6e";
const ACCENT = "#c9a24a";
const BG_COLOR = "#150610";
const BG_WHITE = BG_COLOR;
const BG_BLUSH = BG_COLOR;
const BG_CREAM = BG_COLOR;
const BG_ROSE = BG_COLOR;
const BG_DARK = BG_COLOR;
const BG_DARKER = BG_COLOR;
const TEXT_DARK = "#ffffff";
const TEXT_MED = "rgba(255,255,255,0.85)";
const TEXT_MUTED = "rgba(255,255,255,0.6)";
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_CINEMATIC = [0.76, 0, 0.24, 1] as const;
const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

// Viewport: trigger khi element vào giữa màn hình
const VP = { once: true, amount: 0.35 } as const; // elements thường
const VP_STUDIO = { once: true, amount: 0.2 } as const; // sections toàn màn hình
const VP_TEXT = { once: true, amount: 0.5 } as const; // text nhỏ, cần rõ ràng

const BLUR_PH =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAGklEQVQImWNg" +
  "YGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg==";

// ─── Floating Petals ──────────────────────────────────────────────────────────
function FloatingPetals({ count = 12 }: { count?: number }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 7.8 + 3) % 93}%`,
    delay: (i * 0.65) % 9,
    duration: 10 + ((i * 1.4) % 9),
    size: 13 + ((i * 2.2) % 14),
    opacity: 0.28 + ((i * 0.04) % 0.35),
    symbol: i % 3 === 0 ? "🌸" : i % 3 === 1 ? "🌺" : "✿",
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{ left: p.left, top: -40, fontSize: p.size, opacity: 0 }}
          animate={{
            y: ["0vh", "112vh"],
            x: [0, Math.sin(p.id * 1.3) * 80, Math.cos(p.id * 0.9) * 50, 0],
            rotate: [0, 540],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Word reveal ──────────────────────────────────────────────────────────────
function WordReveal({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <span className={className} style={style}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          initial={{ opacity: 0, y: 22, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={VP_TEXT}
          transition={{
            duration: 0.45,
            ease: EASE_EXPO,
            delay: delay + i * 0.05,
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Section({
  children,
  className = "",
  id,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      className={`py-14 md:py-24 px-4 ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}

function GoldDivider({ dark = false }: { dark?: boolean }) {
  return (
    <FadeIn delay={0.2}>
      <div
        className="ornament-divider my-8"
        style={
          {
            "--wedding-accent": dark ? "rgba(255,255,255,0.3)" : ACCENT,
          } as React.CSSProperties
        }
      >
        <span
          className="text-lg float-anim"
          style={{ color: dark ? "rgba(255,255,255,0.5)" : PRIMARY }}
        >
          🌸
        </span>
      </div>
    </FadeIn>
  );
}

function SectionTitle({
  children,
  light = false,
  sub,
}: {
  children: React.ReactNode;
  light?: boolean;
  sub?: string;
}) {
  return (
    <div className="text-center mb-10 md:mb-14">
      <FadeUp>
        <motion.p
          className="text-xs uppercase tracking-[0.45em] mb-2"
          style={{
            fontFamily: "'Cinzel', serif",
            color: light ? "rgba(255,255,255,0.45)" : ACCENT,
          }}
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.45em" }}
          viewport={VP_TEXT}
          transition={{ duration: 1, ease: EASE_EXPO }}
        >
          {sub ?? "❦"}
        </motion.p>
        <h2
          className="text-2xl md:text-4xl"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: light ? "#fff" : TEXT_DARK,
            fontStyle: "italic",
          }}
        >
          {children}
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VP_TEXT}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.3 }}
          className="w-20 h-px mx-auto mt-5 origin-center"
          style={{
            background: light
              ? "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)"
              : `linear-gradient(90deg,transparent,${ACCENT},transparent)`,
          }}
        />
      </FadeUp>
    </div>
  );
}

// ─── Studio: Wipe Reveal (phủ màu thu lại) ───────────────────────────────────
function StudioWipe({
  src,
  alt,
  height = "95vh",
  children,
  wipeColor = BG_CREAM,
}: {
  src: string;
  alt: string;
  height?: string;
  children?: React.ReactNode;
  wipeColor?: string;
}) {
  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* Wipe cover — shrinks from right */}
      <motion.div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{ background: wipeColor, transformOrigin: "right center" }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={VP_STUDIO}
        transition={{ duration: 1.05, ease: EASE_CINEMATIC }}
      />
      {/* Photo scale reveal */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={VP_STUDIO}
        transition={{ duration: 1.8, ease: EASE_EXPO }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          unoptimized
        />
      </motion.div>
      <div className="grain-overlay" />
      {/* Bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.2) 40%,transparent 70%)",
        }}
      />
      {children && (
        <div className="absolute inset-0 flex items-end z-10">{children}</div>
      )}
    </div>
  );
}

// ─── Studio: Curtain Reveal (rèm mở hai chiều) ───────────────────────────────
function StudioCurtain({
  src,
  alt,
  height = "85vh",
  children,
  curtainColor = BG_DARK,
}: {
  src: string;
  alt: string;
  height?: string;
  children?: React.ReactNode;
  curtainColor?: string;
}) {
  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* Left panel */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 z-20 pointer-events-none"
        style={{
          width: "50%",
          background: curtainColor,
          transformOrigin: "left center",
        }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={VP_STUDIO}
        transition={{ duration: 0.95, ease: EASE_CINEMATIC }}
      />
      {/* Right panel */}
      <motion.div
        className="absolute top-0 right-0 bottom-0 z-20 pointer-events-none"
        style={{
          width: "50%",
          background: curtainColor,
          transformOrigin: "right center",
        }}
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={VP_STUDIO}
        transition={{ duration: 0.95, ease: EASE_CINEMATIC, delay: 0.05 }}
      />
      {/* Photo blur → sharp */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06, filter: "blur(12px)" }}
        whileInView={{ scale: 1, filter: "blur(0px)" }}
        viewport={VP_STUDIO}
        transition={{ duration: 1.5, ease: EASE_EXPO, delay: 0.3 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          unoptimized
        />
      </motion.div>
      <div className="grain-overlay" />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Studio: Letterbox Reveal (thanh đen thu vào) ────────────────────────────
function StudioLetterbox({
  src,
  alt,
  height = "90vh",
  children,
}: {
  src: string;
  alt: string;
  height?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* Top letterbox bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 bg-black pointer-events-none"
        initial={{ height: "16vh" }}
        whileInView={{ height: "0vh" }}
        viewport={VP_STUDIO}
        transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.15 }}
      />
      {/* Bottom letterbox bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 bg-black pointer-events-none"
        initial={{ height: "16vh" }}
        whileInView={{ height: "0vh" }}
        viewport={VP_STUDIO}
        transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.15 }}
      />
      {/* Photo */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, filter: "blur(8px)", opacity: 0.6 }}
        whileInView={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
        viewport={VP_STUDIO}
        transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.35 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          unoptimized
        />
      </motion.div>
      <div className="grain-overlay" />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // 3D perspective tilt khi scroll — ảnh tròn nghiêng nhẹ ra sau
  const heroRotX = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const heroZ = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: BG_COLOR }}
    >
      {/* 3D Particles background */}
      <div className="absolute inset-0 z-0">
        <ThreeParticlesLazy
          count={80}
          color="#e8a0ba"
          speed={0.018}
          size={0.04}
        />
      </div>

      <FloatingPetals count={10} />
      <motion.div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background: `radial-gradient(ellipse at 50% 35%,rgba(196,74,110,0.16) 0%,transparent 65%)`,
          opacity,
        }}
      />

      <motion.div
        className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto"
        style={{ opacity }}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.55em] mb-5"
          style={{ fontFamily: "'Cinzel', serif", color: ACCENT }}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
        >
          Ngày Quốc tế Phụ nữ
        </motion.p>

        {/* 8/3 gradient */}
        <motion.div
          className="mb-2 select-none"
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.2 }}
        >
          {["8", "/", "3"].map((ch, i) => (
            <span
              key={i}
              style={{
                fontFamily:
                  i === 1
                    ? "'Cormorant Garamond',serif"
                    : "'Dancing Script',cursive",
                fontSize:
                  i === 1 ? "clamp(44px,8vw,90px)" : "clamp(88px,16vw,170px)",
                fontWeight: 400,
                lineHeight: 1,
                display: "inline-block",
                verticalAlign: "middle",
                background:
                  i === 1
                    ? "none"
                    : `linear-gradient(135deg,${PRIMARY} 0%,#e8749a 50%,${PRIMARY} 100%)`,
                WebkitBackgroundClip: i === 1 ? "unset" : "text",
                WebkitTextFillColor:
                  i === 1 ? "rgba(255,255,255,0.28)" : "transparent",
                backgroundClip: i === 1 ? "unset" : "text",
                color: i === 1 ? "rgba(255,255,255,0.28)" : undefined,
                margin: i === 1 ? "0 6px" : 0,
              }}
            >
              {ch}
            </span>
          ))}
        </motion.div>

        {/* Name stagger */}
        <div className="flex justify-center flex-wrap mb-1">
          {"NGUYỄN THỊ PHƯỢNG".split("").map((ch, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: "'Lora',serif",
                color: TEXT_MED,
                fontSize: "clamp(13px,1.8vw,18px)",
                display: "inline-block",
                letterSpacing: "0.22em",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: EASE_EXPO,
                delay: 0.5 + i * 0.045,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </div>
        <motion.p
          className="text-xs tracking-[0.35em] mt-2"
          style={{ fontFamily: "'Cinzel',serif", color: TEXT_MUTED }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          08 · 03 · 2026
        </motion.p>

        <GoldDivider />

        {/* Hero photo — 3D perspective tilt khi scroll */}
        <div style={{ perspective: "1000px" }}>
          <motion.div
            className="mx-auto overflow-hidden"
            style={{
              width: "min(360px,82vw)",
              aspectRatio: "1/1",
              position: "relative",
              borderRadius: "50%",
              boxShadow: `0 0 0 4px rgba(196,74,110,0.15), 0 0 0 10px rgba(196,74,110,0.07), 0 24px 80px rgba(196,74,110,0.22)`,
              rotateX: heroRotX,
              z: heroZ,
            }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.3, ease: EASE_EXPO, delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-[-12%] w-[124%] h-[124%]"
              style={{ y: imgY }}
            >
              <Image
                src="/phuong/110.jpg"
                alt="Nguyễn Thị Phượng"
                fill
                priority
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_PH}
                unoptimized
              />
            </motion.div>
            <div
              className="absolute inset-0 rounded-full pointer-events-none z-10"
              style={{ boxShadow: "inset 0 0 60px rgba(196,74,110,0.12)" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <p
          className="text-xs tracking-widest"
          style={{ fontFamily: "'Cinzel',serif", color: TEXT_MUTED }}
        >
          CUỘN XUỐNG
        </p>
        <motion.div
          className="w-px h-10"
          style={{
            background: `linear-gradient(to bottom,${PRIMARY}70,transparent)`,
          }}
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

// ─── 1. Opening — 3 đoạn đầu ──────────────────────────────────────────────────
function OpeningSection() {
  return (
    <Section style={{ background: BG_WHITE }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.p
          className="text-2xl md:text-4xl mb-8"
          style={{ fontFamily: "'Dancing Script',cursive", color: PRIMARY }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VP_TEXT}
          transition={{ duration: 1, ease: EASE_EXPO }}
        >
          Em biết hôm nay là ngày gì không?
        </motion.p>
        <GoldDivider />
        {[
          {
            text: "Hôm nay là ngày 8/3 – ngày dành cho tất cả những người phụ nữ tuyệt vời trên thế giới.",
            delay: 0.1,
            size: "text-base md:text-lg",
            italic: true,
          },
          {
            text: "Với nhiều người, đó là ngày để tặng hoa, tặng quà và gửi những lời chúc.",
            delay: 0.22,
            size: "text-sm md:text-base",
            italic: true,
          },
        ].map((p, i) => (
          <motion.p
            key={i}
            className={`${p.size} leading-loose mb-4`}
            style={{
              fontFamily: "'Lora',serif",
              color: TEXT_MED,
              fontStyle: p.italic ? "italic" : "normal",
            }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.9, ease: EASE_EXPO, delay: p.delay }}
          >
            {p.text}
          </motion.p>
        ))}
        <motion.p
          className="text-lg md:text-2xl mt-6 font-medium"
          style={{
            fontFamily: "'Playfair Display',serif",
            color: TEXT_DARK,
            fontStyle: "italic",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.35 }}
        >
          Nhưng với anh, hôm nay còn là một ngày rất đặc biệt.
        </motion.p>
      </div>
    </Section>
  );
}

// ─── 2. Wipe reveal — 111.jpg: gia đình ──────────────────────────────────────
function FamilyOriginSection() {
  return (
    <StudioWipe
      src="/phuong/111.jpg"
      alt="Gia đình nhỏ ở bệnh viện"
      height="85vh"
    >
      <div className="w-full max-w-4xl mx-auto px-5 md:px-8 pb-10 md:pb-14">
        <motion.p
          className="text-xs uppercase tracking-[0.45em] mb-3"
          style={{
            fontFamily: "'Cinzel',serif",
            color: "rgba(255,255,255,0.55)",
          }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP_STUDIO}
          transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.4 }}
        >
          Câu chuyện của chúng ta
        </motion.p>
        <motion.p
          className="text-xl md:text-3xl mb-3"
          style={{ fontFamily: "'Dancing Script',cursive", color: "#fff" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP_STUDIO}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.5 }}
        >
          Vì anh lại nhớ đến ngày...
        </motion.p>
        <motion.p
          className="text-sm md:text-lg leading-relaxed"
          style={{
            fontFamily: "'Lora',serif",
            color: "rgba(255,255,255,0.78)",
            fontStyle: "italic",
            maxWidth: 560,
          }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP_STUDIO}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.6 }}
        >
          có một cô gái bước vào cuộc sống của anh và làm mọi thứ dần thay đổi.
        </motion.p>
      </div>
    </StudioWipe>
  );
}

// ─── 5. Gratitude split — 110.jpg ────────────────────────────────────────────
function GratitudeSection() {
  return (
    <Section style={{ background: BG_BLUSH }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Photo — blur → clear */}
        <SlideLeft>
          <motion.div
            className="overflow-hidden rounded-2xl relative"
            style={{
              aspectRatio: "1/1",
              boxShadow: "0 24px 80px rgba(196,74,110,0.2)",
            }}
            initial={{ filter: "blur(16px)", scale: 1.06 }}
            whileInView={{ filter: "blur(0px)", scale: 1 }}
            viewport={VP}
            transition={{ duration: 1.3, ease: EASE_EXPO, delay: 0.2 }}
          >
            <Image
              src="/phuong/110.jpg"
              alt="Mẹ và con"
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_PH}
              unoptimized
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: "inset 0 0 40px rgba(196,74,110,0.1)" }}
            />
          </motion.div>
        </SlideLeft>

        {/* Text */}
        <SlideRight>
          <div className="space-y-6">
            <motion.p
              className="text-xs uppercase tracking-[0.4em]"
              style={{ fontFamily: "'Cinzel',serif", color: ACCENT }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VP}
            >
              Lời cảm ơn từ trái tim
            </motion.p>
            <motion.p
              className="text-2xl md:text-4xl leading-snug"
              style={{
                fontFamily: "'Dancing Script',cursive",
                color: TEXT_DARK,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.1 }}
            >
              Cảm ơn em vì đã đến bên anh,
            </motion.p>
            <motion.p
              className="text-2xl md:text-4xl leading-snug"
              style={{ fontFamily: "'Dancing Script',cursive", color: PRIMARY }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VP}
              transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.25 }}
            >
              cảm ơn em vì đã yêu anh.
            </motion.p>
            <motion.div
              className="w-12 h-px"
              style={{
                background: `linear-gradient(90deg,${ACCENT},transparent)`,
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VP}
              transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.4 }}
            />
          </div>
        </SlideRight>
      </div>
    </Section>
  );
}

// ─── 6. TWINS PEAK — 112.jpg + 116.jpg ──────────────────────────────────────
function TwinsSection() {
  return (
    <div style={{ background: BG_DARK }}>
      {/* Heading */}
      <div className="pt-14 md:pt-20 pb-8 md:pb-10 text-center px-4">
        <SectionTitle light sub="Hai cô con gái">
          luôn đầy ắp tiếng cười
        </SectionTitle>
        <FadeUp delay={0.2}>
          <p
            className="text-sm md:text-lg max-w-2xl mx-auto leading-loose"
            style={{
              fontFamily: "'Lora',serif",
              color: "rgba(255,255,255,0.65)",
              fontStyle: "italic",
            }}
          >
            Và cảm ơn em rất nhiều vì đã sinh cho anh hai cô con gái rất đáng
            yêu, để gia đình nhỏ của chúng ta luôn đầy ắp tiếng cười.
          </p>
        </FadeUp>
      </div>

      {/* 112.jpg — curtain reveal (ảnh hai bé sinh đôi bò) */}
      <StudioCurtain
        src="/phuong/112.jpg"
        alt="Hai bé sinh đôi"
        height="75vh"
        curtainColor={BG_DARKER}
      >
        <div className="text-center px-4">
          <motion.p
            className="text-3xl md:text-6xl select-none"
            style={{
              fontFamily: "'Dancing Script',cursive",
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VP_STUDIO}
            transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.4 }}
          >
            ✨ Hai thiên thần nhỏ ✨
          </motion.p>
        </div>
      </StudioCurtain>

      {/* 116.jpg — hai bé đứng + text */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ background: BG_DARKER }}
      >
        {/* Photo — scale + blur reveal */}
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: "3/4" }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1, filter: "blur(14px)", opacity: 0 }}
            whileInView={{ scale: 1, filter: "blur(0px)", opacity: 1 }}
            viewport={VP}
            transition={{ duration: 1.3, ease: EASE_EXPO }}
          >
            <Image
              src="/phuong/116.jpg"
              alt="Hai bé lớn lên"
              fill
              className="object-cover object-top"
              unoptimized
            />
          </motion.div>
          <div className="grain-overlay" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right,transparent 60%,rgba(21,6,16,0.9) 100%)",
            }}
          />
          {/* Studio label */}
          <motion.div
            className="absolute bottom-6 left-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.3 }}
          >
            <p
              className="text-xs uppercase tracking-[0.4em]"
              style={{
                fontFamily: "'Cinzel',serif",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Ngày tháng trôi qua
            </p>
          </motion.div>
        </div>

        {/* Text side */}
        <div className="flex flex-col justify-center p-8 md:p-16 gap-4 md:gap-6">
          <motion.p
            className="text-xs uppercase tracking-[0.45em]"
            style={{ fontFamily: "'Cinzel',serif", color: ACCENT }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VP}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Lớn từng ngày
          </motion.p>
          {[
            "Nhìn các con lớn lên từng ngày,",
            "bước đi những bước đầu tiên,",
            "cười những nụ cười đầu tiên —",
          ].map((line, i) => (
            <motion.p
              key={i}
              className="text-base md:text-2xl"
              style={{
                fontFamily: "'Lora',serif",
                color: "rgba(255,255,255,0.8)",
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={VP}
              transition={{
                duration: 0.7,
                ease: EASE_EXPO,
                delay: 0.2 + i * 0.1,
              }}
            >
              {line}
            </motion.p>
          ))}
          <motion.p
            className="text-xl md:text-3xl"
            style={{ fontFamily: "'Dancing Script',cursive", color: PRIMARY }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.45 }}
          >
            là hạnh phúc lớn nhất của anh. ❤️
          </motion.p>
        </div>
      </div>

      <div className="pb-6" />
    </div>
  );
}

// ─── Cinematic Bokeh Effect ───────────────────────────────────────────────────
function CinematicBokeh({
  count = 8,
  color = "rgba(196,74,110,0.3)",
}: {
  count?: number;
  color?: string;
}) {
  const bokeh = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 13.7 + 5) % 90}%`,
    top: `${(i * 17.3 + 10) % 80}%`,
    size: 40 + ((i * 23) % 80),
    delay: (i * 0.8) % 4,
    duration: 5 + ((i * 1.2) % 4),
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
      {bokeh.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Cinematic Vignette ───────────────────────────────────────────────────────
function CinematicVignette({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-20"
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
}

// ─── 7. Scroll Cascade: Ảnh rơi từ trên xuống như thác nước ───────────────────
function ScrollCascadeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 6 ảnh rơi từ trên xuống với timing khác nhau - STAGGERED hơn cho cinematic
  const CASCADE = [
    {
      src: "/phuong/110.jpg",
      alt: "Mẹ và con",
      startY: -130,
      endY: 140,
      rotate: -15,
      rotateY: 12,
    },
    {
      src: "/phuong/112.jpg",
      alt: "Hai bé sinh đôi",
      startY: -160,
      endY: 110,
      rotate: 10,
      rotateY: -8,
    },
    {
      src: "/phuong/113.jpg",
      alt: "Ông nội",
      startY: -110,
      endY: 150,
      rotate: -8,
      rotateY: 15,
    },
    {
      src: "/phuong/114.jpg",
      alt: "Bé tập đi",
      startY: -190,
      endY: 100,
      rotate: 18,
      rotateY: -10,
    },
    {
      src: "/phuong/115.jpg",
      alt: "Bé mùa đông",
      startY: -140,
      endY: 130,
      rotate: -12,
      rotateY: 8,
    },
    {
      src: "/phuong/116.jpg",
      alt: "Hai bé đứng",
      startY: -170,
      endY: 120,
      rotate: 6,
      rotateY: -14,
    },
  ];

  // Position each image - SPREAD OUT hơn
  const positions = [
    { left: "3%", width: "min(190px,18vw)", zIndex: 6 },
    { left: "20%", width: "min(165px,16vw)", zIndex: 4 },
    { left: "40%", width: "min(210px,21vw)", zIndex: 8 },
    { left: "60%", width: "min(155px,15vw)", zIndex: 5 },
    { left: "77%", width: "min(175px,17vw)", zIndex: 7 },
    { left: "35%", width: "min(145px,14vw)", zIndex: 3 },
  ];

  // Create transforms for each image - SMOOTHER curves
  const y0 = useTransform(
    scrollYProgress,
    [0, 1],
    [`${CASCADE[0].startY}vh`, `${CASCADE[0].endY}vh`],
  );
  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    [`${CASCADE[1].startY}vh`, `${CASCADE[1].endY}vh`],
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [`${CASCADE[2].startY}vh`, `${CASCADE[2].endY}vh`],
  );
  const y3 = useTransform(
    scrollYProgress,
    [0, 1],
    [`${CASCADE[3].startY}vh`, `${CASCADE[3].endY}vh`],
  );
  const y4 = useTransform(
    scrollYProgress,
    [0, 1],
    [`${CASCADE[4].startY}vh`, `${CASCADE[4].endY}vh`],
  );
  const y5 = useTransform(
    scrollYProgress,
    [0, 1],
    [`${CASCADE[5].startY}vh`, `${CASCADE[5].endY}vh`],
  );
  const yArr = [y0, y1, y2, y3, y4, y5];

  // 3D rotateX - ảnh nghiêng ra trước khi rơi, thẳng khi ở giữa, ngả ra sau khi đi qua
  const rx0 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-45, -15, 0, 15, 45],
  );
  const rx1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-40, -12, 0, 12, 40],
  );
  const rx2 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-50, -18, 0, 18, 50],
  );
  const rx3 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-35, -10, 0, 10, 35],
  );
  const rx4 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-42, -14, 0, 14, 42],
  );
  const rx5 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-38, -11, 0, 11, 38],
  );
  const rxArr = [rx0, rx1, rx2, rx3, rx4, rx5];

  // 3D rotateY - xoay sang bên tạo depth
  const ry0 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [CASCADE[0].rotateY, 0, -CASCADE[0].rotateY],
  );
  const ry1 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [CASCADE[1].rotateY, 0, -CASCADE[1].rotateY],
  );
  const ry2 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [CASCADE[2].rotateY, 0, -CASCADE[2].rotateY],
  );
  const ry3 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [CASCADE[3].rotateY, 0, -CASCADE[3].rotateY],
  );
  const ry4 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [CASCADE[4].rotateY, 0, -CASCADE[4].rotateY],
  );
  const ry5 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [CASCADE[5].rotateY, 0, -CASCADE[5].rotateY],
  );
  const ryArr = [ry0, ry1, ry2, ry3, ry4, ry5];

  // translateZ - tạo depth 3D thực sự
  const z0 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-200, -80, 100, -80, -200],
  );
  const z1 = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [-150, -50, 80, -50, -150],
  );
  const z2 = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    [-250, -100, 120, -100, -250],
  );
  const z3 = useTransform(
    scrollYProgress,
    [0, 0.32, 0.5, 0.68, 1],
    [-180, -60, 90, -60, -180],
  );
  const z4 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-220, -70, 110, -70, -220],
  );
  const z5 = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [-160, -40, 70, -40, -160],
  );
  const zArr = [z0, z1, z2, z3, z4, z5];

  // Scale - phóng to khi đi qua trung tâm - SMOOTHER
  const s0 = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.5, 0.7, 0.9],
    [0.6, 0.9, 1.2, 0.9, 0.6],
  );
  const s1 = useTransform(
    scrollYProgress,
    [0.08, 0.28, 0.5, 0.72, 0.92],
    [0.65, 0.88, 1.15, 0.88, 0.65],
  );
  const s2 = useTransform(
    scrollYProgress,
    [0.12, 0.32, 0.5, 0.68, 0.88],
    [0.55, 0.92, 1.25, 0.92, 0.55],
  );
  const s3 = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.5, 0.7, 0.9],
    [0.68, 0.9, 1.12, 0.9, 0.68],
  );
  const s4 = useTransform(
    scrollYProgress,
    [0.1, 0.32, 0.5, 0.68, 0.9],
    [0.62, 0.88, 1.18, 0.88, 0.62],
  );
  const s5 = useTransform(
    scrollYProgress,
    [0.12, 0.3, 0.5, 0.7, 0.88],
    [0.58, 0.85, 1.1, 0.85, 0.58],
  );
  const sArr = [s0, s1, s2, s3, s4, s5];

  // Opacity - fade in khi vào, fade out khi rời
  const op0 = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const op1 = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0, 0.14, 0.86, 1], [0, 1, 1, 0]);
  const op3 = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  const op4 = useTransform(scrollYProgress, [0, 0.11, 0.89, 1], [0, 1, 1, 0]);
  const op5 = useTransform(scrollYProgress, [0, 0.13, 0.87, 1], [0, 1, 1, 0]);
  const opArr = [op0, op1, op2, op3, op4, op5];

  // Glow intensity cho mỗi ảnh
  const glow0 = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);
  const glow1 = useTransform(scrollYProgress, [0.28, 0.5, 0.72], [0, 0.9, 0]);
  const glow2 = useTransform(scrollYProgress, [0.22, 0.5, 0.78], [0, 1.1, 0]);
  const glow3 = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.85, 0]);
  const glow4 = useTransform(scrollYProgress, [0.26, 0.5, 0.74], [0, 0.95, 0]);
  const glow5 = useTransform(scrollYProgress, [0.28, 0.5, 0.72], [0, 0.8, 0]);
  const glowArr = [glow0, glow1, glow2, glow3, glow4, glow5];

  // Text hiển thị ở giữa - LONGER visibility
  const textOp = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.65, 0.8],
    [0, 1, 1, 0],
  );
  const textY = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.65, 0.8],
    [50, 0, 0, -50],
  );
  const textScale = useTransform(
    scrollYProgress,
    [0.2, 0.35, 0.65, 0.8],
    [0.85, 1, 1, 0.85],
  );

  // Background overlay - SMOOTHER
  const bgOp = useTransform(scrollYProgress, [0, 0.08, 0.92, 1], [1, 0, 0, 1]);

  // Ambient glow pulsing
  const ambientGlow = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0.3, 1, 0.3],
  );

  return (
    <div
      ref={ref}
      style={{ height: "180vh", background: BG_DARKER, position: "relative" }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}
      >
        {/* Cinematic Bokeh Background - dark theme */}
        <CinematicBokeh count={12} color="rgba(196,74,110,0.15)" />

        {/* Floating Petals for atmosphere */}
        <FloatingPetals count={8} />

        {/* Ambient background glow - dark theme */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, rgba(196,74,110,0.18) 0%, transparent 50%)`,
            opacity: ambientGlow,
          }}
        />

        {/* Secondary glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 60%, rgba(201,162,74,0.08) 0%, transparent 40%)`,
            opacity: useTransform(
              scrollYProgress,
              [0.2, 0.5, 0.8],
              [0.3, 0.8, 0.3],
            ),
          }}
        />

        {/* Transition overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-40"
          style={{ background: BG_DARKER, opacity: bgOp }}
        />

        {/* Cinematic Vignette - darker */}
        <CinematicVignette intensity={0.5} />

        {/* Floating title with 3D effect - light text for dark bg */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none"
          style={{ opacity: textOp, y: textY, scale: textScale }}
        >
          <div
            className="text-center px-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.p
              className="text-xs uppercase tracking-[0.6em] mb-5"
              style={{
                fontFamily: "'Cinzel',serif",
                color: ACCENT,
                textShadow: "0 2px 15px rgba(201,162,74,0.4)",
              }}
            >
              Khoảnh khắc rơi
            </motion.p>
            <p
              style={{
                fontFamily: "'Dancing Script',cursive",
                fontSize: "clamp(36px,6vw,72px)",
                color: "#fff",
                lineHeight: 1.2,
                textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              }}
            >
              Như những cánh hoa
            </p>
            <p
              className="mt-3"
              style={{
                fontFamily: "'Lora',serif",
                fontSize: "clamp(15px,2.2vw,22px)",
                color: "rgba(255,255,255,0.7)",
                fontStyle: "italic",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              rơi xuống trong khu vườn kỷ niệm
            </p>
          </div>
        </motion.div>

        {/* Cascading images with full 3D - dark theme */}
        {CASCADE.map((img, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: positions[i].left,
              top: "50%",
              width: positions[i].width,
              zIndex: positions[i].zIndex,
              y: yArr[i],
              z: zArr[i],
              rotateZ: img.rotate,
              rotateX: rxArr[i],
              rotateY: ryArr[i],
              scale: sArr[i],
              opacity: opArr[i],
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                aspectRatio: "3/4",
                position: "relative",
                boxShadow:
                  "0 30px 100px rgba(0,0,0,0.7), 0 12px 35px rgba(0,0,0,0.5)",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top"
                unoptimized
              />
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: "inset 0 0 0 2px rgba(201,162,74,0.35)" }}
              />
              {/* Enhanced glow effect - warm tones */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    i % 2 === 0
                      ? "radial-gradient(ellipse at center, rgba(201,162,74,0.25) 0%, transparent 60%)"
                      : "radial-gradient(ellipse at center, rgba(196,74,110,0.2) 0%, transparent 60%)",
                  opacity: glowArr[i],
                }}
              />
              {/* Subtle reflection */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 100%)",
                }}
              />
            </div>
          </motion.div>
        ))}

        {/* Progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 origin-left z-50"
          style={{
            scaleX: scrollYProgress,
            background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
          }}
        />
      </div>
    </div>
  );
}

// ─── 8. Scroll: Ảnh bay lên / bay xuống theo scroll (CẢI TIẾN 3D) ─────────────
// Chiều cao 200vh → animation diễn ra trong 100vh scroll (≈12s tại 84px/s)
function ScrollFlySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Cột trái — bay LÊN từ dưới (bắt đầu dưới màn, kết thúc trên màn)
  const yA = useTransform(scrollYProgress, [0, 1], ["100vh", "-70vh"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["150vh", "-30vh"]);
  // Cột phải — bay XUỐNG từ trên (bắt đầu trên màn, kết thúc dưới màn)
  const yC = useTransform(scrollYProgress, [0, 1], ["-100vh", "70vh"]);
  const yD = useTransform(scrollYProgress, [0, 1], ["-150vh", "30vh"]);

  // Rotation Z nhẹ theo chiều chuyển động
  const rA = useTransform(scrollYProgress, [0, 0.5, 1], [-14, -2, 8]);
  const rB = useTransform(scrollYProgress, [0, 0.5, 1], [10, 1, -7]);
  const rC = useTransform(scrollYProgress, [0, 0.5, 1], [13, -1, -9]);
  const rD = useTransform(scrollYProgress, [0, 0.5, 1], [-9, 2, 11]);

  // 3D rotateX — ảnh nghiêng ra trước khi đến gần, ngả ra sau khi rời (NÂNG CAO)
  const rxA = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [35, 12, 0, -12, -35],
  );
  const rxB = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [28, 8, 0, -8, -28],
  );
  const rxC = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-35, -12, 0, 12, 35],
  );
  const rxD = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-28, -8, 0, 8, 28],
  );

  // 3D rotateY — ảnh xoay nhẹ sang bên (cho cảm giác có chiều sâu) (NÂNG CAO)
  const ryA = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-22, -8, 0, 8, 18],
  );
  const ryB = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [18, 6, 0, -6, -20],
  );
  const ryC = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [20, 8, 0, -8, -18],
  );
  const ryD = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-18, -6, 0, 6, 22],
  );

  // translateZ — tạo độ sâu 3D (ảnh đến gần/xa camera)
  const zA = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [-150, -50, 80, -50, -150],
  );
  const zB = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [-120, -30, 60, -30, -120],
  );
  const zC = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [-150, -50, 80, -50, -150],
  );
  const zD = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [-120, -30, 60, -30, -120],
  );

  // Scale nhẹ khi đi qua trung tâm (cubic bezier smoother)
  const sA = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.5, 0.65, 0.85],
    [0.75, 0.95, 1.15, 0.95, 0.75],
  );
  const sB = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.5, 0.65, 0.85],
    [0.8, 0.92, 1.08, 0.92, 0.8],
  );
  const sC = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.5, 0.65, 0.85],
    [0.75, 0.95, 1.15, 0.95, 0.75],
  );
  const sD = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.5, 0.65, 0.85],
    [0.8, 0.92, 1.08, 0.92, 0.8],
  );

  // Glow intensity khi ảnh ở trung tâm
  const glowA = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const glowB = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 0.8, 0]);
  const glowC = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const glowD = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 0.8, 0]);

  // Text fade in/out giữa scroll
  const textOp = useTransform(
    scrollYProgress,
    [0.3, 0.48, 0.58, 0.75],
    [0, 1, 1, 0],
  );
  const textY = useTransform(
    scrollYProgress,
    [0.3, 0.48, 0.58, 0.75],
    [24, 0, 0, -24],
  );
  const textScale = useTransform(
    scrollYProgress,
    [0.3, 0.48, 0.58, 0.75],
    [0.92, 1, 1, 0.92],
  );

  // Overlay tối nhẹ ở đầu và cuối để transition mượt
  const overlayOp = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [0.6, 0, 0, 0.6],
  );

  // Ambient glow
  const ambientGlow = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0.4, 1, 0.4],
  );

  return (
    <div
      ref={ref}
      style={{ height: "160vh", background: BG_DARK, position: "relative" }}
    >
      {/* perspective container — tạo không gian 3D */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 45%" }}
      >
        {/* Cinematic Bokeh - dark theme */}
        <CinematicBokeh count={10} color="rgba(201,162,74,0.12)" />

        {/* Floating Petals */}
        <FloatingPetals count={6} />

        {/* Background glow - animated - dark theme */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%,rgba(196,74,110,0.15) 0%,transparent 45%)`,
            opacity: ambientGlow,
          }}
        />

        {/* Secondary glow for depth */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 40%,rgba(201,162,74,0.08) 0%,transparent 35%),
                        radial-gradient(ellipse at 70% 60%,rgba(196,74,110,0.06) 0%,transparent 35%)`,
            opacity: useTransform(
              scrollYProgress,
              [0.3, 0.5, 0.7],
              [0.5, 1, 0.5],
            ),
          }}
        />

        {/* Overlay transition mượt */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          style={{ background: BG_DARK, opacity: overlayOp }}
        />

        {/* Cinematic Vignette - darker */}
        <CinematicVignette intensity={0.45} />

        {/* Text giữa màn hình - light text for dark bg */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ opacity: textOp, y: textY, scale: textScale }}
        >
          <div
            className="text-center px-8"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p
              className="text-xs uppercase tracking-[0.6em] mb-5"
              style={{
                fontFamily: "'Cinzel',serif",
                color: ACCENT,
                textShadow: "0 2px 15px rgba(201,162,74,0.4)",
              }}
            >
              Những khoảnh khắc
            </p>
            <p
              style={{
                fontFamily: "'Dancing Script',cursive",
                fontSize: "clamp(34px,5vw,68px)",
                color: "#fff",
                lineHeight: 1.3,
                textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              }}
            >
              không thể nào quên
            </p>
            <motion.div
              className="w-20 h-px mx-auto mt-6"
              style={{
                background: `linear-gradient(90deg,transparent,${ACCENT},transparent)`,
                scaleX: useTransform(
                  scrollYProgress,
                  [0.35, 0.5, 0.65],
                  [0.5, 1, 0.5],
                ),
              }}
            />
          </div>
        </motion.div>

        {/* ══ BAY LÊN (trái) — 3D rotateX + rotateY + translateZ ══ */}

        {/* 113.jpg — ông nội */}
        <motion.div
          className="absolute"
          style={{
            left: "3%",
            top: "50%",
            marginTop: -160,
            width: "min(220px,21vw)",
            zIndex: 6,
            y: yA,
            rotate: rA,
            rotateX: rxA,
            rotateY: ryA,
            z: zA,
            scale: sA,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              aspectRatio: "3/4",
              position: "relative",
              boxShadow:
                "0 30px 100px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <Image
              src="/phuong/113.jpg"
              alt="Ông nội và bé"
              fill
              className="object-cover object-top"
              unoptimized
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 0 0 2px rgba(201,162,74,0.35)" }}
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(201,162,74,0.25) 0%, transparent 60%)",
                opacity: glowA,
              }}
            />
            {/* Reflection gradient */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.15) 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* 114.jpg — bé tập đi */}
        <motion.div
          className="absolute"
          style={{
            left: "24%",
            top: "50%",
            marginTop: 50,
            width: "min(165px,16vw)",
            zIndex: 4,
            y: yB,
            rotate: rB,
            rotateX: rxB,
            rotateY: ryB,
            z: zB,
            scale: sB,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              aspectRatio: "3/4",
              position: "relative",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <Image
              src="/phuong/114.jpg"
              alt="Bé tập đi"
              fill
              className="object-cover object-top"
              unoptimized
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 0 0 2px rgba(196,74,110,0.3)" }}
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(196,74,110,0.2) 0%, transparent 60%)",
                opacity: glowB,
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.12) 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* ══ BAY XUỐNG (phải) — 3D rotateX + rotateY + translateZ ══ */}

        {/* 115.jpg — bé gấu */}
        <motion.div
          className="absolute"
          style={{
            right: "24%",
            top: "50%",
            marginTop: -80,
            width: "min(165px,16vw)",
            zIndex: 5,
            y: yC,
            rotate: rC,
            rotateX: rxC,
            rotateY: ryC,
            z: zC,
            scale: sC,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              aspectRatio: "3/4",
              position: "relative",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35)",
            }}
          >
            <Image
              src="/phuong/115.jpg"
              alt="Bé mùa đông"
              fill
              className="object-cover object-top"
              unoptimized
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 0 0 2px rgba(201,162,74,0.35)" }}
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(201,162,74,0.2) 0%, transparent 60%)",
                opacity: glowC,
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.12) 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* 117.jpg — bé hồng */}
        <motion.div
          className="absolute"
          style={{
            right: "3%",
            top: "50%",
            marginTop: 70,
            width: "min(220px,21vw)",
            zIndex: 7,
            y: yD,
            rotate: rD,
            rotateX: rxD,
            rotateY: ryD,
            z: zD,
            scale: sD,
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              aspectRatio: "3/4",
              position: "relative",
              boxShadow:
                "0 30px 100px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <Image
              src="/phuong/117.jpg"
              alt="Bé hồng"
              fill
              className="object-cover object-top"
              unoptimized
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "inset 0 0 0 2px rgba(196,74,110,0.35)" }}
            />
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(196,74,110,0.2) 0%, transparent 60%)",
                opacity: glowD,
              }}
            />
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.15) 100%)",
              }}
            />
          </div>
        </motion.div>

        {/* Progress line - glowing */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 origin-left z-40"
          style={{
            scaleX: scrollYProgress,
            background: `linear-gradient(90deg,${PRIMARY},${ACCENT})`,
            boxShadow:
              "0 0 20px rgba(196,74,110,0.7), 0 0 40px rgba(201,162,74,0.4)",
          }}
        />
      </div>
    </div>
  );
}

// ─── 9. ScrollGallery3D: Carousel ảnh 3D xoay theo scroll (CINEMATIC) ─────────
function ScrollGallery3D() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 6 ảnh xếp thành hình tròn 3D
  const GALLERY = [
    { src: "/phuong/110.jpg", alt: "Mẹ và con", caption: "Mẹ và con" },
    { src: "/phuong/111.jpg", alt: "Gia đình", caption: "Gia đình nhỏ" },
    {
      src: "/phuong/112.jpg",
      alt: "Hai bé sinh đôi",
      caption: "Hai thiên thần",
    },
    { src: "/phuong/113.jpg", alt: "Ông nội", caption: "Ông nội yêu" },
    { src: "/phuong/116.jpg", alt: "Hai bé đứng", caption: "Lớn từng ngày" },
    { src: "/phuong/117.jpg", alt: "Bé hồng", caption: "Nụ cười" },
  ];

  // Carousel quay 540° (1.5 vòng) cho dramatic hơn
  const carouselRotation = useTransform(scrollYProgress, [0, 1], [-30, 510]);

  // Scale và opacity cho transition - SMOOTHER
  const containerScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [0.6, 1.05, 1.05, 0.6],
  );
  const containerOp = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [0, 1, 1, 0],
  );

  // 3D tilt for cinematic effect
  const tiltX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [15, 5, 0, 5, 15],
  );

  // Background overlay
  const bgOp = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [1, 0, 0, 1]);

  // Ambient glow pulsing
  const ambientGlow = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.85],
    [0.4, 1, 0.4],
  );

  // Radius của carousel (translateZ) - LARGER for more impact
  const RADIUS = 380;
  const ITEM_WIDTH = 200;
  const ITEM_HEIGHT = 270;

  return (
    <div
      ref={ref}
      style={{ height: "180vh", background: BG_DARK, position: "relative" }}
    >
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 45%" }}
      >
        {/* Cinematic Bokeh - dark theme */}
        <CinematicBokeh count={12} color="rgba(201,162,74,0.15)" />

        {/* Background glow - animated */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 45%, rgba(196,74,110,0.2) 0%, transparent 45%)`,
            opacity: ambientGlow,
          }}
        />

        {/* Secondary ambient light */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 30% 30%, rgba(201,162,74,0.1) 0%, transparent 35%),
                         radial-gradient(ellipse at 70% 70%, rgba(196,74,110,0.08) 0%, transparent 35%)`,
            opacity: useTransform(
              scrollYProgress,
              [0.2, 0.5, 0.8],
              [0.5, 1, 0.5],
            ),
          }}
        />

        {/* 3D Particles */}
        <div className="absolute inset-0 z-0">
          <ThreeParticlesLazy
            count={120}
            color="#c9a24a"
            speed={0.015}
            size={0.045}
          />
        </div>

        {/* Floating Petals */}
        <FloatingPetals count={6} />

        {/* Overlay transition */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-40"
          style={{ background: BG_DARK, opacity: bgOp }}
        />

        {/* Cinematic Vignette - darker for drama */}
        <CinematicVignette intensity={0.5} />

        {/* 3D Carousel Container with tilt */}
        <motion.div
          className="relative"
          style={{
            width: ITEM_WIDTH,
            height: ITEM_HEIGHT,
            transformStyle: "preserve-3d",
            rotateY: carouselRotation,
            rotateX: tiltX,
            scale: containerScale,
            opacity: containerOp,
          }}
        >
          {/* Carousel Items */}
          {GALLERY.map((item, i) => {
            const angle = (i / GALLERY.length) * 360;
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: ITEM_WIDTH,
                  height: ITEM_HEIGHT,
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  className="w-full h-full relative overflow-hidden rounded-2xl"
                  style={{
                    boxShadow:
                      "0 30px 80px rgba(0,0,0,0.6), 0 12px 30px rgba(0,0,0,0.4)",
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-top"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      boxShadow: "inset 0 0 0 2px rgba(201,162,74,0.35)",
                    }}
                  />
                  {/* Reflection gradient */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.15) 100%)",
                    }}
                  />
                  {/* Caption overlay - enhanced */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                    }}
                  >
                    <p
                      className="text-sm text-center font-medium"
                      style={{
                        fontFamily: "'Lora',serif",
                        color: "rgba(255,255,255,0.95)",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {item.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floor reflection - enhanced */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: ITEM_WIDTH * 3,
            height: 100,
            bottom: "6%",
            background: `radial-gradient(ellipse at center, rgba(201,162,74,0.2) 0%, rgba(196,74,110,0.1) 50%, transparent 80%)`,
            borderRadius: "50%",
            filter: "blur(25px)",
            opacity: useTransform(
              scrollYProgress,
              [0.08, 0.25, 0.75, 0.92],
              [0, 0.7, 0.7, 0],
            ),
          }}
        />

        {/* Additional light beams */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            background: `conic-gradient(from 180deg at 50% 50%, transparent 0deg, rgba(201,162,74,0.03) 60deg, transparent 120deg, rgba(196,74,110,0.02) 180deg, transparent 240deg, rgba(201,162,74,0.03) 300deg, transparent 360deg)`,
            opacity: useTransform(
              scrollYProgress,
              [0.15, 0.4, 0.6, 0.85],
              [0, 0.8, 0.8, 0],
            ),
          }}
        />

        {/* Progress bar - enhanced glow */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 origin-left z-50"
          style={{
            scaleX: scrollYProgress,
            background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
            boxShadow:
              "0 0 15px rgba(196,74,110,0.6), 0 0 30px rgba(201,162,74,0.3)",
          }}
        />
      </div>
    </div>
  );
}

// ─── 10. Scroll: Nhiều ảnh quay vòng tròn theo scroll (3D ORBIT CINEMATIC) ────
// Chiều cao 260vh → animation diễn ra trong 160vh scroll cho cinematic hơn
// Orbit quay đúng 1 vòng (360°) trong suốt quá trình scroll với 3D perspective
function ScrollOrbitSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Orbit quay 420° (hơn 1 vòng) cho dramatic hơn
  const orbitDeg = useTransform(scrollYProgress, [0, 1], [-30, 390]);
  // Ảnh counter-rotate để luôn đứng thẳng
  const counterDeg = useTransform(scrollYProgress, [0, 1], [30, -390]);
  // Vòng trang trí quay ngược
  const ringRevDeg = useTransform(scrollYProgress, [0, 1], [15, -195]);

  // 3D rotateX cho toàn bộ orbit - SMOOTHER tạo góc nghiêng 3D
  const orbitTiltX = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    [0, 60, 70, 60, 0],
  );

  // Scale: phóng to khi vào, thu nhỏ khi rời - SMOOTHER
  const sc = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.4, 1.05, 1.05, 0.4],
  );
  const centerOp = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 1, 1, 0],
  );
  const bgOp = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [1, 0, 0, 1]);

  // Ambient glow pulsing
  const ambientGlow = useTransform(
    scrollYProgress,
    [0.15, 0.5, 0.85],
    [0.3, 1, 0.3],
  );

  // Radius lớn hơn cho desktop - INCREASED
  const R = 280;

  const ORBIT = [
    {
      src: "/phuong/112.jpg",
      alt: "Hai bé sinh đôi",
      w: 150,
      h: 200,
      zOffset: 0,
    },
    { src: "/phuong/113.jpg", alt: "Ông nội", w: 125, h: 165, zOffset: 40 },
    { src: "/phuong/114.jpg", alt: "Bé tập đi", w: 130, h: 172, zOffset: -30 },
    { src: "/phuong/116.jpg", alt: "Hai bé đứng", w: 150, h: 200, zOffset: 50 },
    { src: "/phuong/117.jpg", alt: "Bé hồng", w: 125, h: 165, zOffset: -40 },
    { src: "/phuong/115.jpg", alt: "Bé mùa đông", w: 130, h: 172, zOffset: 30 },
  ];

  return (
    <div ref={ref} style={{ height: "180vh", background: BG_DARKER }}>
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 42%" }}
      >
        {/* Cinematic Bokeh - darkest theme */}
        <CinematicBokeh count={10} color="rgba(201,162,74,0.12)" />

        {/* Ambient background glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 45%, rgba(196,74,110,0.15) 0%, transparent 45%)`,
            opacity: ambientGlow,
          }}
        />

        {/* Secondary ambient lights */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 25% 35%, rgba(201,162,74,0.08) 0%, transparent 30%),
                         radial-gradient(ellipse at 75% 55%, rgba(196,74,110,0.06) 0%, transparent 30%)`,
            opacity: useTransform(
              scrollYProgress,
              [0.2, 0.5, 0.8],
              [0.4, 1, 0.4],
            ),
          }}
        />

        {/* 3D WebGL sparkle field - ENHANCED */}
        <div className="absolute inset-0 z-0">
          <ThreeParticlesLazy
            count={180}
            color="#c9a24a"
            speed={0.018}
            size={0.055}
            ring
          />
        </div>

        <FloatingPetals count={8} />

        {/* Overlay transition mượt đầu/cuối */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-30"
          style={{ background: BG_DARKER, opacity: bgOp }}
        />

        {/* Cinematic Vignette - dramatic */}
        <CinematicVignette intensity={0.55} />

        {/* 3D Orbit Container với perspective tilt */}
        <motion.div
          className="absolute"
          style={{
            transformStyle: "preserve-3d",
            rotateX: orbitTiltX,
            scale: sc,
          }}
        >
          {/* Vòng trang trí ngoài - 3D với glow */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: R * 2 + 100,
              height: R * 2 + 100,
              left: -(R + 50),
              top: -(R + 50),
              border: "1.5px dashed rgba(201,162,74,0.3)",
              boxShadow: "0 0 30px rgba(201,162,74,0.1)",
              rotate: orbitDeg,
              transformStyle: "preserve-3d",
            }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: R * 2 + 180,
              height: R * 2 + 180,
              left: -(R + 90),
              top: -(R + 90),
              border: "1px dashed rgba(196,74,110,0.2)",
              boxShadow: "0 0 20px rgba(196,74,110,0.08)",
              rotate: ringRevDeg,
              transformStyle: "preserve-3d",
            }}
          />

          {/* Orbit ring + ảnh - với translateZ cho độ sâu */}
          <motion.div
            className="absolute"
            style={{
              width: R * 2,
              height: R * 2,
              left: -R,
              top: -R,
              rotate: orbitDeg,
              transformStyle: "preserve-3d",
            }}
          >
            {ORBIT.map((p, i) => {
              const angle = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
              const cx = Math.cos(angle) * R;
              const cy = Math.sin(angle) * R;
              return (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    x: cx - p.w / 2,
                    y: cy - p.h / 2,
                    width: p.w,
                    height: p.h,
                    rotate: counterDeg,
                    z: p.zOffset,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="w-full h-full relative overflow-hidden rounded-2xl"
                    style={{
                      boxShadow:
                        "0 20px 70px rgba(0,0,0,0.75), 0 6px 20px rgba(0,0,0,0.5)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      className="object-cover object-top"
                      unoptimized
                    />
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        boxShadow: "inset 0 0 0 2px rgba(201,162,74,0.4)",
                      }}
                    />
                    {/* Enhanced depth effect */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.25) 100%)`,
                      }}
                    />
                    {/* Glow overlay */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(201,162,74,0.15) 0%, transparent 60%)",
                        opacity: useTransform(
                          scrollYProgress,
                          [0.3, 0.5, 0.7],
                          [0, 0.8, 0],
                        ),
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Tâm — text trung tâm (không rotate) - ENHANCED */}
        <motion.div
          className="absolute z-20 text-center px-4"
          style={{ opacity: centerOp }}
        >
          <p
            className="text-xs uppercase tracking-[0.6em] mb-4"
            style={{
              fontFamily: "'Cinzel',serif",
              color: "rgba(255,255,255,0.5)",
              textShadow: "0 2px 15px rgba(201,162,74,0.3)",
            }}
          >
            Ngôi nhà của chúng ta
          </p>
          <p
            style={{
              fontFamily: "'Dancing Script',cursive",
              fontSize: "clamp(34px,4.5vw,60px)",
              color: "#fff",
              lineHeight: 1.3,
              textShadow: "0 4px 30px rgba(0,0,0,0.4)",
            }}
          >
            luôn đầy ắp ❤️
          </p>
          <motion.div
            className="w-16 h-px mx-auto mt-5"
            style={{
              background: `linear-gradient(90deg,transparent,${ACCENT},transparent)`,
              scaleX: useTransform(
                scrollYProgress,
                [0.15, 0.35, 0.65, 0.85],
                [0.3, 1, 1, 0.3],
              ),
            }}
          />
          <p
            className="mt-4 text-base italic"
            style={{
              fontFamily: "'Lora',serif",
              color: "rgba(255,255,255,0.6)",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            tiếng cười
          </p>
        </motion.div>

        {/* Floor reflection - enhanced */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: R * 3.5,
            height: 80,
            bottom: "10%",
            background: `radial-gradient(ellipse at center, rgba(201,162,74,0.15) 0%, rgba(196,74,110,0.08) 50%, transparent 80%)`,
            filter: "blur(20px)",
            opacity: useTransform(
              scrollYProgress,
              [0.12, 0.28, 0.72, 0.88],
              [0, 0.9, 0.9, 0],
            ),
          }}
        />

        {/* Rotating light effect */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: "100%",
            height: "100%",
            background: `conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(201,162,74,0.04) 45deg, transparent 90deg, rgba(196,74,110,0.03) 135deg, transparent 180deg, rgba(201,162,74,0.04) 225deg, transparent 270deg, rgba(196,74,110,0.03) 315deg, transparent 360deg)`,
            rotate: orbitDeg,
            opacity: useTransform(
              scrollYProgress,
              [0.15, 0.35, 0.65, 0.85],
              [0, 0.7, 0.7, 0],
            ),
          }}
        />

        {/* Progress bar - glowing */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 origin-left z-40"
          style={{
            scaleX: scrollYProgress,
            background: `linear-gradient(90deg,${PRIMARY},${ACCENT})`,
            boxShadow:
              "0 0 20px rgba(196,74,110,0.7), 0 0 40px rgba(201,162,74,0.4)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function WeddingPage() {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleOpen() {
    setOpened(true);
    audioRef.current?.play().catch(() => {});
    setTimeout(() => {
      let speed = 1.6;
      function smoothScroll() {
        window.scrollBy(0, speed);
        requestAnimationFrame(smoothScroll);
      }
      smoothScroll();
    }, 650);
  }

  const introContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.22 } },
  };
  const introItem = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE_EXPO },
    },
  };

  return (
    <div className="wedding-bg max-w-dvw overflow-x-hidden">
      <audio ref={audioRef} src="/background.mp3" loop />
      <AnimatePresence mode="wait">
        {/* ── INTRO CARD ──────────── */}
        {!opened && (
          <motion.div
            key="intro"
            className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ background: BG_COLOR }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: EASE_SMOOTH }}
          >
            <FloatingPetals count={10} />

            <motion.div
              className="shadow-2xl w-full z-10 relative rounded-2xl overflow-hidden"
              style={{
                background: BG_COLOR,
                maxWidth: 1024,
                boxShadow:
                  "0 32px 100px rgba(0,0,0,0.4),0 4px 20px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 0, scaleY: 0.82, y: 36 }}
              animate={{ opacity: 1, scaleY: 1, y: 0 }}
              transition={{ duration: 0.95, ease: EASE_EXPO, delay: 0.1 }}
            >
              <div className="flex intro-two-col">
                {/* Left — 110.jpg */}
                <motion.div
                  className="intro-left flex flex-col items-start justify-between p-6 md:p-10"
                  style={{ width: "50%" }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.3 }}
                >
                  <p
                    className="text-sm font-bold underline decoration-1 underline-offset-4 tracking-[0.18em]"
                    style={{ fontFamily: "'Cinzel',serif", color: ACCENT }}
                  >
                    NGÀY PHỤ NỮ QUỐC TẾ
                  </p>
                  <motion.div
                    className="photo-frame w-full overflow-hidden rounded"
                    style={{
                      maxWidth: 320,
                      aspectRatio: "1/1",
                      position: "relative",
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src="/phuong/110.jpg"
                      alt="Mẹ và con"
                      fill
                      priority
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_PH}
                      unoptimized
                    />
                  </motion.div>
                  <div />
                </motion.div>

                {/* Right */}
                <motion.div
                  className="intro-right flex flex-col items-center justify-center p-6 md:p-10 gap-4 md:gap-6"
                  style={{
                    width: "50%",
                    borderLeft: "1px solid rgba(255,255,255,0.1)",
                  }}
                  variants={introContainer}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.p
                    variants={introItem}
                    className="text-center text-sm"
                    style={{
                      fontFamily: "'Lora',serif",
                      color: TEXT_MED,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Chủ nhật, Ngày 08 Tháng 03 Năm 2026
                  </motion.p>

                  <motion.div
                    variants={introItem}
                    className="flex items-center gap-1 select-none"
                  >
                    {["8", "/", "3"].map((n, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontFamily: "'Dancing Script',cursive",
                          fontSize: "clamp(48px,10vw,76px)",
                          fontWeight: 400,
                          background: `linear-gradient(135deg,${PRIMARY} 0%,#e8749a 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          lineHeight: 1,
                        }}
                      >
                        {n}
                      </span>
                    ))}
                  </motion.div>

                  <motion.p
                    variants={introItem}
                    className="text-center text-base"
                    style={{
                      fontFamily: "'Dancing Script',cursive",
                      color: TEXT_DARK,
                      fontSize: 22,
                    }}
                  >
                    Em biết hôm nay là ngày gì không?
                  </motion.p>

                  <motion.div variants={introItem} className="text-center">
                    <p
                      className="text-xs tracking-[0.28em] mb-1"
                      style={{ fontFamily: "'Cinzel',serif", color: ACCENT }}
                    >
                      GỬI ĐẾN
                    </p>
                    <p
                      className="text-2xl"
                      style={{
                        fontFamily: "'Playfair Display',serif",
                        color: TEXT_DARK,
                        fontStyle: "italic",
                      }}
                    >
                      Nguyễn Thị Phượng
                    </p>
                  </motion.div>

                  <motion.button
                    variants={introItem}
                    onClick={handleOpen}
                    className="open-btn flex items-center gap-2 px-7 py-3 rounded-full text-sm"
                    style={{
                      fontFamily: "'Lora',serif",
                      color: PRIMARY,
                      border: `1.5px solid rgba(196,74,110,0.3)`,
                      background: "rgba(253,240,245,0.6)",
                    }}
                    whileHover={{
                      background: `rgba(196,74,110,0.08)`,
                      borderColor: PRIMARY,
                      scale: 1.05,
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                  >
                    <span>🌸</span>
                    <span>Mở thiệp</span>
                    <span className="text-xs">💌</span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── FULL PAGE ───────────── */}
        {opened && (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSection />
            <OpeningSection />
            <FamilyOriginSection />
            <GratitudeSection />
            {/* <TwinsSection /> */}
            <ScrollCascadeSection />
            <ScrollFlySection />

            <ScrollOrbitSection />

            {/* Calendar */}
            <Section
              id="calendar"
              style={{
                background: BG_DARK,
                backgroundImage: `radial-gradient(ellipse at 50% 0%,rgba(196,74,110,0.3) 0%,transparent 65%)`,
              }}
            >
              <SectionTitle light sub="Ngày đặc biệt">
                Lịch tháng 3
              </SectionTitle>
              <ScaleIn>
                <div className="flex justify-center">
                  <WeddingCalendar />
                </div>
              </ScaleIn>
            </Section>

            {/* Countdown */}
            <Section
              id="countdown"
              style={{
                background: BG_BLUSH,
                backgroundImage: `radial-gradient(ellipse at 50% 50%,rgba(196,74,110,0.09) 0%,transparent 70%)`,
              }}
            >
              <SectionTitle sub="Đếm ngược">Đến ngày 8/3/2026</SectionTitle>
              <FadeUp>
                <CountdownTimer />
              </FadeUp>
            </Section>

            {/* Guestbook */}
            {/* <Section id="guestbook" style={{ background:BG_WHITE }}>
              <div className="text-center mb-10 md:mb-14">
                <FadeUp>
                  <p className="text-xs uppercase tracking-[0.45em] mb-2" style={{ fontFamily:"'Cinzel',serif", color:ACCENT }}>🌸</p>
                  <motion.h2 className="text-2xl md:text-4xl"
                    style={{ fontFamily:"'Playfair Display',serif", color:TEXT_DARK, fontStyle:"italic" }}
                    animate={{ scale:[1,1.02,1] }} transition={{ repeat:Infinity, duration:3.5, ease:"easeInOut" }}>
                    Gửi lời chúc đến Thương
                  </motion.h2>
                  <motion.div className="w-20 h-px mx-auto mt-5"
                    style={{ background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }}
                    initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={VP_TEXT}
                    transition={{ duration:0.9, ease:EASE_EXPO, delay:0.3 }} />
                </FadeUp>
              </div>
              <FadeUp delay={0.15}><GuestbookForm /></FadeUp>
            </Section> */}

            {/* Final */}
            <div
              className="relative overflow-hidden"
              style={{ minHeight: "80vh" }}
            >
              {/* 3D Particles final */}
              <div className="absolute inset-0 z-0">
                <ThreeParticlesLazy
                  count={100}
                  color="#ffb8cc"
                  speed={0.015}
                  size={0.045}
                />
              </div>
              {/* 117.jpg letterbox reveal */}
              <motion.div
                className="absolute top-0 left-0 right-0 z-20 bg-black pointer-events-none"
                initial={{ height: "18vh" }}
                whileInView={{ height: "0vh" }}
                viewport={VP_STUDIO}
                transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.1 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 z-20 bg-black pointer-events-none"
                initial={{ height: "18vh" }}
                whileInView={{ height: "0vh" }}
                viewport={VP_STUDIO}
                transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.1 }}
              />
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.06, filter: "blur(8px)" }}
                whileInView={{ scale: 1, filter: "blur(0px)" }}
                viewport={VP_STUDIO}
                transition={{ duration: 1.5, ease: EASE_EXPO, delay: 0.35 }}
              >
                <Image
                  src="/phuong/117.jpg"
                  alt="Bé mặc đồ hồng"
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              </motion.div>
              <div className="grain-overlay" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom,rgba(42,13,24,0.3) 0%,rgba(42,13,24,0.7) 100%)",
                }}
              />

              <FloatingPetals count={18} />

              <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
                <div className="text-center">
                  <SpringPop>
                    <p
                      style={{
                        fontFamily: "'Dancing Script',cursive",
                        fontSize: "clamp(36px,9vw,110px)",
                        background:
                          "linear-gradient(135deg,#fff 0%,rgba(255,220,230,0.95) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        lineHeight: 1.15,
                      }}
                    >
                      Chúc em ngày 8/3
                    </p>
                  </SpringPop>
                  <FadeIn delay={0.3}>
                    <motion.p
                      className="text-xl md:text-3xl mt-1"
                      style={{
                        fontFamily: "'Dancing Script',cursive",
                        color: "rgba(255,255,255,0.92)",
                      }}
                      animate={{ scale: [1, 1.04, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "easeInOut",
                      }}
                    >
                      thật vui và hạnh phúc 🌸
                    </motion.p>
                  </FadeIn>
                  <GoldDivider dark />
                  <FadeIn delay={0.5}>
                    <p
                      className="text-base md:text-xl italic"
                      style={{
                        fontFamily: "'Lora',serif",
                        color: "rgba(255,255,255,0.82)",
                      }}
                    >
                      Với anh, em luôn là người phụ nữ tuyệt vời nhất. ❤️
                    </p>
                  </FadeIn>
                  <FadeIn delay={0.7}>
                    <p
                      className="text-xs tracking-widest mt-5"
                      style={{
                        fontFamily: "'Cinzel',serif",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      NGÀY QUỐC TẾ PHỤ NỮ — 08.03.2026
                    </p>
                  </FadeIn>
                </div>
              </div>
            </div>

            <footer
              className="py-10 text-center"
              style={{ background: "#464646" }}
            >
              <p
                className="text-xs tracking-[0.3em] uppercase mb-1"
                style={{
                  fontFamily: "'Cinzel',serif",
                  color: "rgba(189, 189, 189, 0.973)",
                }}
              >
                Made with ❤️
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: "'Lora',serif",
                  color: "rgba(189, 189, 189, 0.973)",
                }}
              >
                Gửi đến Nguyễn Thị Phượng — 08.03.2026
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
