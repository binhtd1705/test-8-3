"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const BLUR_LIGHT =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAGklEQVQImWNg" +
  "YGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg==";

const PHOTOS = [
  { src: "/phuong/111.jpg",  alt: "Gia đình nhỏ" },
  { src: "/phuong/112.jpg", alt: "Kỷ niệm 1" },
  { src: "/phuong/113.jpg", alt: "Kỷ niệm 2" },
  { src: "/phuong/114.jpg", alt: "Kỷ niệm 3" },
  { src: "/phuong/115.jpg", alt: "Kỷ niệm 4" },
  { src: "/phuong/116.jpg",  alt: "Kỷ niệm 5" },
  { src: "/phuong/117.jpg", alt: "Kỷ niệm 6" },
  { src: "/phuong/110.jpg",  alt: "Kỷ niệm 7" },
];

const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
const PRIMARY = "#c44a6e";

export function PhotoAlbum() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDir: number) => {
    setDirection(newDir);
    setActiveIdx((i) => (i + newDir + PHOTOS.length) % PHOTOS.length);
  };

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50,
      scale: 1.04,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
      scale: 0.96,
    }),
  };

  const thumbnailContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
  };
  const thumbnailItem = {
    hidden: { opacity: 0, y: 18, scale: 0.82 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_EXPO } },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Film frame */}
      <motion.div
        className="relative mx-auto mb-6"
        style={{ perspective: 1000, maxWidth: 420 }}
        initial={{ opacity: 0, y: 60, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, ease: EASE_EXPO }}
      >
        {/* Film top perforations */}
        <div className="h-7 bg-gray-900 flex items-center px-3 gap-1.5 rounded-t-sm">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-800 border border-gray-700 rounded-sm flex-shrink-0" />
          ))}
        </div>

        {/* Main photo — portrait 3:4 */}
        <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "3/4" }}>
          <div className="grain-overlay" />

          <AnimatePresence custom={direction} mode="sync">
            <motion.div
              key={activeIdx}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.48, ease: EASE_EXPO }}
              className="absolute inset-0"
            >
              <Image
                src={PHOTOS[activeIdx].src}
                alt={PHOTOS[activeIdx].alt}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR_LIGHT}
                unoptimized
              />
            </motion.div>
          </AnimatePresence>

          {/* Scratch lines */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)",
            }}
          />

          {/* Nav arrows */}
          <motion.button
            onClick={() => paginate(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center text-xl z-20"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.7)", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-label="Ảnh trước"
          >
            ‹
          </motion.button>
          <motion.button
            onClick={() => paginate(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center text-xl z-20"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.7)", scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-label="Ảnh tiếp"
          >
            ›
          </motion.button>
        </div>

        {/* Film bottom perforations */}
        <div className="h-7 bg-gray-900 flex items-center px-3 gap-1.5 rounded-b-sm">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-800 border border-gray-700 rounded-sm flex-shrink-0" />
          ))}
        </div>
      </motion.div>

      {/* Thumbnails */}
      <motion.div
        className="flex justify-center gap-2 flex-wrap"
        variants={thumbnailContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {PHOTOS.map((photo, i) => (
          <motion.button
            key={i}
            variants={thumbnailItem}
            onClick={() => {
              setDirection(i > activeIdx ? 1 : -1);
              setActiveIdx(i);
            }}
            className="relative overflow-hidden rounded"
            style={{ width: 52, height: 68 }}
            animate={{
              opacity: i === activeIdx ? 1 : 0.45,
              scale: i === activeIdx ? 1.1 : 1,
            }}
            whileHover={{ opacity: 0.85, scale: 1.06 }}
            transition={{ duration: 0.22 }}
          >
            {i === activeIdx && (
              <motion.div
                layoutId="thumb-ring"
                className="absolute inset-0 rounded z-10"
                style={{ boxShadow: `inset 0 0 0 2px ${PRIMARY}` }}
              />
            )}
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_LIGHT}
              unoptimized
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Counter */}
      <motion.p
        className="text-center mt-5 text-white/45 text-xs tracking-[0.3em]"
        style={{ fontFamily: "'Cinzel', serif" }}
        key={activeIdx}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeIdx + 1} / {PHOTOS.length}
      </motion.p>
    </div>
  );
}
