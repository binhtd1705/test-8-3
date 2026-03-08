"use client";

import { motion } from "framer-motion";

const MONTHS = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4",
  "Tháng 5","Tháng 6","Tháng 7","Tháng 8",
  "Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];
const WEEKDAYS = ["CN","T2","T3","T4","T5","T6","T7"];

const MONTH    = 2; // March (0-indexed)
const YEAR     = 2026;
const SPECIAL  = 8;
const PRIMARY  = "#9b2355";

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDayOfMonth(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}

export function WeddingCalendar() {
  const daysInMonth = getDaysInMonth(YEAR, MONTH);
  const firstDay    = getFirstDayOfMonth(YEAR, MONTH);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const gridContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.018, delayChildren: 0.3 } },
  };
  const cellItem = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE_EXPO } },
  };

  return (
    <div className="inline-block mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-white/50 mb-1"
          style={{ fontFamily: "'Cinzel', serif" }}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_EXPO }}
        >
          {MONTHS[MONTH]}
        </motion.p>
        <motion.p
          className="text-5xl font-bold text-white"
          style={{ fontFamily: "'Cinzel', serif" }}
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 }}
        >
          {YEAR}
        </motion.p>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <motion.div
            key={d}
            className="calendar-day text-white/40 text-xs font-medium"
            style={{ fontFamily: "'Cinzel', serif" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.04, duration: 0.4 }}
          >
            {d}
          </motion.div>
        ))}
      </div>

      {/* Days grid */}
      <motion.div
        className="grid grid-cols-7"
        variants={gridContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {cells.map((day, i) => {
          if (!day) {
            return <motion.div key={i} variants={cellItem} className="calendar-day" />;
          }

          if (day === SPECIAL) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 14,
                  delay: 0.6,
                }}
                className="calendar-day active text-white font-bold relative"
                style={{
                  fontFamily: "'Cinzel', serif",
                  background: PRIMARY,
                  borderRadius: "50%",
                }}
              >
                {day}
                <motion.span
                  className="absolute"
                  style={{ top: -6, right: -4, fontSize: 10 }}
                  animate={{ scale: [1, 0.65, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  🌸
                </motion.span>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={i}
              variants={cellItem}
              className="calendar-day text-white/65"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {day}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Date badge */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.8 }}
      >
        <div
          className="inline-flex items-center gap-3 border border-white/25 rounded-full px-7 py-2"
          style={{ background: `${PRIMARY}55` }}
        >
          <motion.span
            className="text-sm"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          >
            🌹
          </motion.span>
          <span
            className="text-white text-sm tracking-widest"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            08 • 03 • 2026
          </span>
          <motion.span
            className="text-sm"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.7 }}
          >
            🌹
          </motion.span>
        </div>
        <p
          className="mt-2 text-white/50 text-xs tracking-widest"
          style={{ fontFamily: "'Lora', serif" }}
        >
          Ngày Quốc tế Phụ nữ
        </p>
      </motion.div>
    </div>
  );
}
