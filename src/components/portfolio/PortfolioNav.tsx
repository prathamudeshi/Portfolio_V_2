"use client";

/**
 * PortfolioNav.tsx — Premium Floating Glass Dock.
 * Appears after scrolling past the hero (50vh).
 * Implements iOS-style glassmorphism with Framer Motion layout animations.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { id: "about", title: "About" },
  { id: "experience", title: "Experience" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "contact", title: "Contact" },
];

export default function PortfolioNav() {
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleCheckMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      // Show navbar after 50vh scroll
      setVisible(window.scrollY > window.innerHeight * 0.4);

      // Auto-detect active section based on scroll position
      const scrollPosition = window.scrollY + 120;

      // Check each section
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActive(link.title);
            break;
          }
        }
      }
    };

    handleCheckMobile();
    window.addEventListener("resize", handleCheckMobile);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleCheckMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, x: "-50%", opacity: 0 }}
          animate={{ y: 0, x: "-50%", opacity: 1 }}
          exit={{ y: -100, x: "-50%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            zIndex: 9999,
            width: isMobile ? "calc(100% - 32px)" : "fit-content",
            pointerEvents: "none",
          }}
        >
          <nav
            className="glass-ios"
            style={{
              display: "flex",
              alignItems: "center",
              padding: isMobile ? "6px" : "8px 12px",
              gap: isMobile ? 4 : 8,
              borderRadius: 100,
              background: "rgba(10, 10, 20, 0.75)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow:
                "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
              pointerEvents: "auto",
              margin: "0 auto",
              justifyContent: "center",
            }}
          >
            {/* Logo Pill — Desktop Only or very small on mobile */}
            {!isMobile && (
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActive("");
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "var(--md-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--md-on-primary)",
                  fontWeight: 800,
                  fontSize: 11,
                  fontFamily: "var(--lg-font-mono)",
                  textDecoration: "none",
                  marginRight: 8,
                  boxShadow:
                    "0 0 20px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.3)",
                  flexShrink: 0,
                }}
              >
                PU
              </motion.a>
            )}

            {/* Nav Links List */}
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                gap: isMobile ? 2 : 4,
                margin: 0,
                padding: 0,
                flex: isMobile ? 1 : "none",
                justifyContent: isMobile ? "space-around" : "flex-start",
              }}
            >
              {navLinks.map((link) => {
                const isActive = active === link.title;
                return (
                  <li key={link.id} style={{ position: "relative" }}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setActive(link.title)}
                      style={{
                        display: "block",
                        padding: isMobile ? "10px 12px" : "10px 20px",
                        borderRadius: 100,
                        fontFamily: "var(--md-font-display)",
                        fontSize: isMobile ? 12 : 18,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "white" : "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        transition: "color 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                        position: "relative",
                        zIndex: 1,
                        whiteSpace: "nowrap",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {isMobile && link.title === "Experience"
                        ? "Exp"
                        : link.title}
                    </a>

                    {/* Animated Background Pill */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill-bg"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(135deg, rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.25) 0%, rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.1) 100%)",
                          border:
                            "1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.3)",
                          borderRadius: 100,
                          zIndex: 0,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
