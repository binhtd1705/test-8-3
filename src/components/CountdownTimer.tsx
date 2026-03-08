"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_DATE = new Date("2026-03-08T00:00:00");
const PRIMARY = "#c44a6e";
const ACCENT  = "#c9a24a";
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function CountBox({ value, label, tick }: { value: number; label: string; tick: boolean }) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_EXPO }}
    >
      <motion.div
        className="countdown-box w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center mx-auto rounded-xl relative overflow-hidden"
        animate={{ scale: label === "Giây" && tick ? 1.06 : 1 }}
        transition={{ duration: 0.12 }}
      >
        {/* Subtle shimmer bg */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, rgba(201,162,74,0.1) 0%, rgba(196,74,110,0.15) 50%, rgba(201,162,74,0.1) 100%)`,
          }}
        />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            className="relative font-bold text-3xl md:text-4xl leading-none"
            style={{ fontFamily: "'Cinzel', serif", color: PRIMARY }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {pad(value)}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      <motion.p
        className="mt-3 text-xs uppercase tracking-[0.25em]"
        style={{ fontFamily: "'Cinzel', serif", color: ACCENT }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {label}
      </motion.p>
    </motion.div>
  );
}

export function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft());
  const [tick, setTick] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(calcTimeLeft());
      setTick((t) => !t);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const arrived = TARGET_DATE.getTime() <= Date.now();

  if (arrived) {
    return (
      <div className="text-center py-8">
        <motion.p
          className="text-4xl md:text-5xl"
          style={{ fontFamily: "'Dancing Script', cursive", color: PRIMARY }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
        >
          Chúc mừng ngày 8/3 yêu thương! 🌸
        </motion.p>
      </div>
    );
  }

  const units: { label: string; value: number }[] = [
    { label: "Ngày",  value: time.days    },
    { label: "Giờ",   value: time.hours   },
    { label: "Phút",  value: time.minutes },
    { label: "Giây",  value: time.seconds },
  ];

  return (
    <div>
      {/* Dots separator */}
      <div className="flex items-center justify-center gap-4 md:gap-10 flex-wrap">
        {units.map(({ label, value }, i) => (
          <div key={label} className="flex items-start gap-4 md:gap-10">
            <CountBox value={value} label={label} tick={tick} />
            {i < units.length - 1 && (
              <motion.span
                className="text-3xl font-thin mt-5 hidden md:block"
                style={{ color: PRIMARY, opacity: 0.35 }}
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                :
              </motion.span>
            )}
          </div>
        ))}
      </div>

      {/* Sub label */}
      <motion.p
        className="text-center mt-8 text-sm tracking-[0.3em] uppercase"
        style={{ fontFamily: "'Lora', serif", color: "rgba(255,255,255,0.6)" }}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        đến ngày Quốc tế Phụ nữ
      </motion.p>
    </div>
  );
}
