'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuide } from '@/hooks/useGuide';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function GuideDialog() {
  const { isActive, currentStep, steps, nextStep, prevStep, stopGuide } = useGuide();
  const colors = useThemeColors();
  const [displayedText, setDisplayedText] = useState('');
  
  const step = steps[currentStep];

  // Typewriter effect
  useEffect(() => {
    if (!isActive) return;
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(step.text.slice(0, i + 1));
      i++;
      if (i >= step.text.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [currentStep, isActive, step.text]);

  if (!isActive) return null;

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 120, // Above the dock
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        width: '90%',
        maxWidth: 500,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            background: 'rgba(15, 15, 25, 0.7)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${colors.accent}44`,
            borderRadius: 20,
            padding: '24px',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px ${colors.accent}22`,
            pointerEvents: 'auto',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ 
              margin: 0, 
              color: colors.accent, 
              fontSize: 14, 
              textTransform: 'uppercase', 
              letterSpacing: 2,
              fontWeight: 700 
            }}>
              {step.title}
            </h3>
            <span style={{ color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Content */}
          <div style={{ 
            color: '#e2e8f0', 
            fontSize: 16, 
            lineHeight: 1.6, 
            minHeight: 60,
            marginBottom: 24,
            fontWeight: 400
          }}>
            {displayedText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ display: 'inline-block', width: 2, height: 16, background: colors.accent, marginLeft: 4, verticalAlign: 'middle' }}
            />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={stopGuide}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 13,
                padding: '8px 12px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              Skip Tour
            </button>

            <div style={{ display: 'flex', gap: 12 }}>
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f1f5f9',
                    borderRadius: 8,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                >
                  Back
                </button>
              )}
              <button
                onClick={isLastStep ? stopGuide : nextStep}
                style={{
                  background: colors.accent,
                  border: 'none',
                  color: '#0f172a',
                  borderRadius: 8,
                  padding: '8px 24px',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: `0 0 15px ${colors.accent}44`,
                  transition: 'transform 0.1s, opacity 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {isLastStep ? "Finish" : "Next"}
              </button>
            </div>
          </div>

          {/* Decorative Corner */}
          <div style={{
            position: 'absolute',
            top: -1,
            right: -1,
            width: 40,
            height: 40,
            borderTop: `2px solid ${colors.accent}`,
            borderRight: `2px solid ${colors.accent}`,
            borderTopRightRadius: 20,
            opacity: 0.5,
          }} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
