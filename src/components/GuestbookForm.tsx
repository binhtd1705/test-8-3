"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WishEntry {
  name: string;
  message: string;
  emoji: string;
  time: string;
}

const EMOJIS = ["🌸", "🌹", "💐", "🌺", "✨", "❤️", "🥰", "💗"];
const PRIMARY = "#c44a6e";
const ACCENT  = "#c9a24a";
const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_CINEMATIC = [0.76, 0, 0.24, 1] as const;

// Viewport config - trigger khi element vào view
const VP = { once: true, amount: 0.3 } as const;

export function GuestbookForm() {
  const [entries, setEntries] = useState<WishEntry[]>([
    {
      name: "Bố Mẹ",
      message: "Chúc con gái luôn mạnh khỏe, hạnh phúc và ngày càng xinh đẹp hơn! ❤️",
      emoji: "❤️",
      time: "5 phút trước",
    },
    {
      name: "Hồng Nhung",
      message: "Chúc Thương ngày 8/3 thật vui — mày xứng đáng được yêu thương nhiều hơn nữa 🌸",
      emoji: "🌸",
      time: "12 phút trước",
    },
    {
      name: "Minh Tâm",
      message: "Chúc mừng 8/3! Chị Thương ơi, chị luôn là người phụ nữ đáng ngưỡng mộ nhất 💐",
      emoji: "💐",
      time: "20 phút trước",
    },
  ]);

  const [form, setForm] = useState({ name: "", message: "", emoji: "🌸" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setEntries([{ ...form, time: "Vừa xong" }, ...entries]);
    setForm({ name: "", message: "", emoji: "🌸" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Form - với animation cinematic */}
      <motion.form
        onSubmit={handleSubmit}
        className="rounded-2xl p-7 mb-10 relative overflow-hidden"
        style={{
          background: "transparent",
          border: "1px solid rgba(201,162,74,0.2)",
          boxShadow: "0 12px 50px rgba(0,0,0,0.3)",
        }}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={VP}
        transition={{ duration: 0.9, ease: EASE_CINEMATIC }}
      >
        {/* Decorative top border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT}, ${PRIMARY})` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VP}
          transition={{ duration: 1, ease: EASE_EXPO, delay: 0.3 }}
        />
        {/* Name field - slide in from left */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.1 }}
        >
          <label
            htmlFor="gb-name"
            className="block text-sm font-medium mb-2"
            style={{ fontFamily: "'Lora', serif", color: "rgba(255,255,255,0.85)" }}
          >
            Tên của bạn
          </label>
          <input
            id="gb-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nhập tên..."
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              border: "1.5px solid rgba(201,162,74,0.2)",
              fontFamily: "'Lora', serif",
              color: "#fff",
              background: "rgba(0,0,0,0.2)",
            }}
            onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
            onBlur={(e) => (e.target.style.borderColor = "rgba(196,74,110,0.2)")}
          />
        </motion.div>

        {/* Message field - slide in from right */}
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.2 }}
        >
          <label
            htmlFor="gb-message"
            className="block text-sm font-medium mb-2"
            style={{ fontFamily: "'Lora', serif", color: "rgba(255,255,255,0.85)" }}
          >
            Lời chúc 8/3
          </label>
          <textarea
            id="gb-message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Gửi lời chúc đến Thương nhân ngày 8/3..."
            required
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
            style={{
              border: "1.5px solid rgba(201,162,74,0.2)",
              fontFamily: "'Lora', serif",
              color: "#fff",
              background: "rgba(0,0,0,0.2)",
            }}
            onFocus={(e) => (e.target.style.borderColor = PRIMARY)}
            onBlur={(e) => (e.target.style.borderColor = "rgba(196,74,110,0.2)")}
          />
        </motion.div>

        {/* Emoji selector - fade in with stagger */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.3 }}
        >
          <p
            className="text-sm font-medium mb-3"
            style={{ fontFamily: "'Lora', serif", color: "rgba(255,255,255,0.85)" }}
          >
            Chọn emoji
          </p>
          <div className="flex gap-2 flex-wrap">
            {EMOJIS.map((emoji, idx) => (
              <motion.button
                key={emoji}
                type="button"
                onClick={() => setForm({ ...form, emoji })}
                className="text-2xl p-2 rounded-xl transition-all"
                style={{
                  background: form.emoji === emoji ? "rgba(196,74,110,0.3)" : "rgba(255,255,255,0.05)",
                  boxShadow: form.emoji === emoji ? `0 0 0 2px ${PRIMARY}, 0 4px 12px rgba(196,74,110,0.2)` : "0 2px 8px rgba(0,0,0,0.05)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VP}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.35 + idx * 0.05
                }}
                whileHover={{ scale: 1.25, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Submit button - scale up from bottom */}
        <motion.button
          type="submit"
          className="w-full py-3.5 rounded-xl text-white text-sm font-medium tracking-wider relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY} 0%, #a83860 100%)`,
            fontFamily: "'Lora', serif",
            boxShadow: "0 6px 25px rgba(196,74,110,0.35)",
          }}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.5 }}
          whileHover={{ scale: 1.03, boxShadow: "0 10px 40px rgba(196,74,110,0.45)" }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            }}
            initial={{ x: "-100%" }}
            whileInView={{ x: "100%" }}
            viewport={VP}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.8 }}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={submitted ? "sent" : "send"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="block relative z-10"
            >
              {submitted ? "✓ Đã gửi lời chúc! 🌸" : "🌸 Gửi lời chúc"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.form>

      {/* Section header for entries */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VP}
        transition={{ duration: 0.7, ease: EASE_EXPO }}
      >
        <motion.p
          className="text-xs uppercase tracking-[0.4em] mb-2"
          style={{ fontFamily: "'Cinzel', serif", color: ACCENT }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ delay: 0.2 }}
        >
          Những lời chúc
        </motion.p>
        <motion.div
          className="w-16 h-px mx-auto"
          style={{ background: `linear-gradient(90deg, transparent, ${PRIMARY}, transparent)` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VP}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.3 }}
        />
      </motion.div>

      {/* Entries - hiển thị từ từ khi scroll */}
      <div className="space-y-5">
        <AnimatePresence>
          {entries.map((entry, i) => (
            <motion.div
              key={`${entry.name}-${i}`}
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "transparent",
                border: "1px solid rgba(201,162,74,0.15)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 0, y: 60, scale: 0.92, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={VP}
              transition={{
                duration: 0.9,
                ease: EASE_CINEMATIC,
                delay: i * 0.15, // Stagger effect - mỗi card delay thêm 0.15s
              }}
              whileHover={{
                y: -4,
                boxShadow: "0 12px 40px rgba(196,74,110,0.15)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Decorative gradient line */}
              <motion.div
                className="absolute top-0 left-0 h-1 rounded-t-2xl"
                style={{
                  background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
                  width: "100%",
                  transformOrigin: "left",
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={VP}
                transition={{
                  duration: 0.8,
                  ease: EASE_EXPO,
                  delay: i * 0.15 + 0.3,
                }}
              />

              <div className="flex items-start gap-4">
                {/* Emoji with bounce animation */}
                <motion.div
                  className="text-3xl flex-shrink-0"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={VP}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: i * 0.15 + 0.2,
                  }}
                >
                  <motion.span
                    className="block"
                    animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: "easeInOut" }}
                  >
                    {entry.emoji}
                  </motion.span>
                </motion.div>

                <div className="flex-1">
                  {/* Name and time - fade in from left */}
                  <motion.div
                    className="flex items-center justify-between mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VP}
                    transition={{
                      duration: 0.6,
                      ease: EASE_EXPO,
                      delay: i * 0.15 + 0.25,
                    }}
                  >
                    <span
                      className="font-semibold text-sm"
                      style={{ fontFamily: "'Lora', serif", color: "#fff" }}
                    >
                      {entry.name}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ color: ACCENT, background: "rgba(201,162,74,0.1)" }}
                    >
                      {entry.time}
                    </span>
                  </motion.div>

                  {/* Message - fade in with slight blur */}
                  <motion.p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "'Lora', serif", color: "rgba(255,255,255,0.7)" }}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={VP}
                    transition={{
                      duration: 0.7,
                      ease: EASE_EXPO,
                      delay: i * 0.15 + 0.35,
                    }}
                  >
                    {entry.message}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
