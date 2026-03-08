"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Floating sparkle field ───────────────────────────────────────────────────
function SparkleField({
  count   = 120,
  radius  = 14,
  color   = "#c9a24a",
  speed   = 0.03,
  size    = 0.055,
}: {
  count?: number;
  radius?: number;
  color?: string;
  speed?: number;
  size?: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = radius * (0.4 + Math.random() * 0.6);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * speed;
    ref.current.rotation.x = Math.sin(t * speed * 0.4) * 0.15;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </Points>
  );
}

// ─── Second ring (closer, smaller, pink) ─────────────────────────────────────
function InnerRing({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 3;
      pos[i * 3]     = Math.cos(angle) * (5 + spread);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * (5 + spread);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.06;
    ref.current.rotation.x = 0.4;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color="#c44a6e"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </Points>
  );
}

// ─── Public component: Canvas wrapper ────────────────────────────────────────
export function ThreeParticles({
  color   = "#c9a24a",
  count   = 120,
  speed   = 0.025,
  size    = 0.055,
  ring    = false,
}: {
  color?:  string;
  count?:  number;
  speed?:  number;
  size?:   number;
  ring?:   boolean;
}) {
  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 9], fov: 55 }}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <SparkleField count={count} color={color} speed={speed} size={size} />
      {ring && <InnerRing />}
    </Canvas>
  );
}
