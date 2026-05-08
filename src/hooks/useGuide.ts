import { create } from "zustand";

export type GuideAnimation = "idle" | "talking" | "pointing" | "waving";
export type GuideVisual =
  | "overview"
  | "tracking-status"
  | "head-tracking"
  | "hand-pinch"
  | "window-expand"
  | "assistant"
  | "theme-studio"
  | "scroll";

export interface GuideStep {
  title: string;
  text: string;
  target?: string;
  visual: GuideVisual;
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
    title: "Welcome to Nexus OS",
    text: "This is not just a 3D hero. Nexus is a mini spatial OS layered over the portfolio, with webcam-driven input, floating windows, and a classic scroll experience underneath it.",
    visual: "overview",
    position: [3.5, -1, -2.5],
    rotation: [0, -0.5, 0],
    animation: "waving",
  },
  {
    title: "Spatial Input Setup",
    text: "Allow webcam access to unlock the spatial controls. The status pill in the top-left tells you when the camera is active and whether face and hand tracking are currently locked in.",
    visual: "tracking-status",
    position: [3.25, 0.2, -2.95],
    rotation: [0, -0.62, 0],
    animation: "talking",
  },
  {
    title: "Head Tracking",
    text: "Once your face is detected, move slightly left, right, up, or down. The scene shifts with you so the workspace feels more like a real window into a 3D room than a flat landing page.",
    visual: "head-tracking",
    position: [3.2, 0, -3],
    rotation: [0, -0.6, 0],
    animation: "talking",
  },
  {
    title: "Hand Tracking",
    text: "Raise one hand toward the webcam and pinch your thumb with your index finger. That is the core gesture layer of the spatial OS, and it makes the experience feel interactive instead of purely decorative.",
    visual: "hand-pinch",
    position: [3.1, -0.6, -2.9],
    rotation: [0, -0.7, 0],
    animation: "pointing",
  },
  {
    title: "Spatial Windows",
    text: "Open panels from the dock or desktop icons, then drag, resize, or maximize them. This is the OS part of Nexus: portfolio content delivered like floating tools inside a workspace.",
    visual: "window-expand",
    position: [2.9, -0.2, -2.7],
    rotation: [0, -0.65, 0],
    animation: "talking",
  },
  {
    title: "Nexus Bot",
    text: "The robot on the right stays with you across the full website. Tap it for spatial tips, theme shortcuts, and quick navigation even after you scroll beyond the hero section.",
    visual: "assistant",
    position: [3.05, -0.05, -2.55],
    rotation: [0, -0.72, 0],
    animation: "waving",
  },
  {
    title: "Theme Studio",
    text: "Open Settings to recolor the whole workspace live, or type 'theme rose' in the terminal if you want a quicker shortcut. The palette change is one of the signature interactions here.",
    target: "settings",
    visual: "theme-studio",
    position: [3, 0.1, -2.5],
    rotation: [0, -0.8, 0],
    animation: "talking",
  },
  {
    title: "Ready When You Are",
    text: "When you want the full story, scroll down for projects, experience, skills, and contact. The 3D layer is there to create curiosity, not to block the traditional portfolio flow.",
    visual: "scroll",
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
