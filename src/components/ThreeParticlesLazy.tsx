"use client";

import dynamic from "next/dynamic";

export const ThreeParticlesLazy = dynamic(
  () => import("./ThreeParticles").then((m) => ({ default: m.ThreeParticles })),
  { ssr: false }
);
