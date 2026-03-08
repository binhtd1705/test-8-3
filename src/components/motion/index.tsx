"use client";

import { motion, Variants } from "framer-motion";

// ─── Shared variants ──────────────────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1 },
};

const blurInVariants: Variants = {
  hidden: { opacity: 0, scale: 1.08, filter: "blur(12px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const staggerFastVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

// ─── Viewport config ─────────────────────────────────────────────────────────
// Trigger khi element đã vào ~40% màn hình (không fire quá sớm)
const VIEWPORT = { once: true, amount: 0.4 };
const VIEWPORT_CLOSE = { once: true, amount: 0.4 };

// ─── Easing ──────────────────────────────────────────────────────────────────
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const;

// ─── Components ──────────────────────────────────────────────────────────────

interface MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

export function FadeUp({ children, className, delay = 0, style }: MotionProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className, delay = 0, style }: MotionProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE_SMOOTH, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function SlideLeft({ children, className, delay = 0, style }: MotionProps) {
  return (
    <motion.div
      variants={slideLeftVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function SlideRight({ children, className, delay = 0, style }: MotionProps) {
  return (
    <motion.div
      variants={slideRightVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE_EXPO, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0, style }: MotionProps) {
  return (
    <motion.div
      variants={scaleInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE_EXPO, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function BlurIn({ children, className, delay = 0, style }: MotionProps) {
  return (
    <motion.div
      variants={blurInVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CLOSE}
      transition={{ duration: 1.2, ease: EASE_EXPO, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className, style }: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerFast({ children, className, style }: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      variants={staggerFastVariants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Child item used inside StaggerContainer / StaggerFast
export function StaggerItem({ children, className, style }: Omit<MotionProps, "delay">) {
  return (
    <motion.div
      variants={fadeUpVariants}
      transition={{ duration: 0.8, ease: EASE_EXPO }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Spring pop - for calendar date, badges, etc.
export function SpringPop({ children, className, delay = 0, style }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT_CLOSE}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── 3D Motion Components ────────────────────────────────────────────────────

interface Flip3DProps extends MotionProps {
  direction?: "left" | "right";
}

// Flip3D - xoay ảnh quanh trục Y khi scroll vào view
export function Flip3D({ children, className, delay = 0, style, direction = "left" }: Flip3DProps) {
  const initialRotateY = direction === "left" ? -90 : 90;
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: initialRotateY, scale: 0.8 }}
      whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.2, ease: EASE_EXPO, delay }}
      className={className}
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

interface Tilt3DProps extends MotionProps {
  intensity?: number;
}

// Tilt3D - nghiêng ảnh với 3D perspective
export function Tilt3D({ children, className, delay = 0, style, intensity = 1 }: Tilt3DProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        rotateX: 25 * intensity,
        rotateY: -15 * intensity,
        scale: 0.9
      }}
      whileInView={{
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        scale: 1
      }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE_EXPO, delay }}
      className={className}
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

interface Float3DProps extends MotionProps {
  amplitude?: number;
}

// Float3D - bay lơ lửng với 3D perspective (continuous animation)
export function Float3D({ children, className, style, amplitude = 20 }: Float3DProps) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotateX: [-3, 3, -3],
        rotateY: [-5, 5, -5],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxDepthProps extends MotionProps {
  depth?: number;
}

// ParallaxDepth - parallax với translateZ
export function ParallaxDepth({ children, className, delay = 0, style, depth = 1 }: ParallaxDepthProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        z: -100 * depth,
        scale: 0.8 + (0.2 * (1 - depth))
      }}
      whileInView={{
        opacity: 1,
        z: 0,
        scale: 1
      }}
      viewport={VIEWPORT}
      transition={{ duration: 1.2, ease: EASE_EXPO, delay }}
      className={className}
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
