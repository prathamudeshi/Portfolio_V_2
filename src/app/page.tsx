'use client';

import dynamic from "next/dynamic";

// Workspace is entirely client-side (Three.js, webcam, framer-motion)
const Workspace = dynamic(() => import("@/components/Workspace"), {
  ssr: false,
});

export default function Home() {
  return <Workspace />;
}
