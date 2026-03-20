import { create } from "zustand";

export type GuideAnimation = "idle" | "talking" | "pointing" | "waving";

export interface GuideStep {
  title: string;
  text: string;
  target?: string; // CSS Selector or Panel ID
  position: [number, number, number];
  rotation: [number, number, number];
  animation: GuideAnimation;
}

interface GuideState {
  isActive: boolean;
  currentStep: number;
  steps: GuideStep[];

  startGuide: () => void;
  stopGuide: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (index: number) => void;
}

const defaultSteps: GuideStep[] = [
  {
    title: "Welcome to Nexus",
    text: "I'm Pratham's digital twin. I'll show you around this immersive spatial workspace.",
    position: [3.5, -1, -2.5],
    rotation: [0, -0.5, 0], // Rotate slightly left to face user
    animation: "waving",
  },
  {
    title: "Spatial Interface",
    text: "This platform uses computer vision. If you have a webcam, I can track your head and hands for a truly 3D experience!",
    position: [3.2, 0, -3],
    rotation: [0, -0.6, 0],
    animation: "talking",
  },
  {
    title: "The Terminal",
    text: "Over here is the command center. You can interact with my core systems directly through the terminal.",
    target: "terminal",
    position: [3, 0, -2.5],
    rotation: [0, -0.8, 0],
    animation: "pointing",
  },
  {
    title: "Interactive Panels",
    text: "Every window is a 3D object. You can drag them, resize them, or even push them deeper into the scene.",
    position: [2.8, -1, -3],
    rotation: [0, -0.4, 0],
    animation: "talking",
  },
  {
    title: "Let's Connect",
    text: "Found something interesting? The contact panel is always just a click away in the dock below.",
    target: "contact",
    position: [3.2, -0.5, -2.8],
    rotation: [0, -0.6, 0],
    animation: "pointing",
  },
  {
    title: "Ready to Explore?",
    text: "That's the basics! Feel free to explore my projects, skills, and experience. Have fun!",
    position: [3, 0, -2.5],
    rotation: [0, -0.5, 0],
    animation: "waving",
  },
];

export const useGuide = create<GuideState>((set) => ({
  isActive: false,
  currentStep: 0,
  steps: defaultSteps,

  startGuide: () => set({ isActive: true, currentStep: 0 }),
  stopGuide: () => set({ isActive: false }),
  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),
  setStep: (index) => set({ currentStep: index }),
}));
