'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { usePanelManager, type PanelId } from '@/hooks/usePanelManager';

interface DesktopIconProps {
  id: PanelId;
  icon: string;
  label: string;
}

const GRID_SIZE = 100;

export default function DesktopIcon({ id, icon, label }: DesktopIconProps) {
  const { togglePanel } = usePanelManager();
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragTransition={{
        power: 0,
        modifyTarget: (target) => Math.round(target / GRID_SIZE) * GRID_SIZE,
      }}
      onDragStart={() => {
        isDragging.current = true;
      }}
      onDragEnd={() => {
        // Small delay to ensure any trailing tap events are ignored
        setTimeout(() => {
          isDragging.current = false;
        }, 100);
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTap={() => {
        if (!isDragging.current) {
          togglePanel(id);
        }
      }}
      style={{
        width: 80,
        height: 100, // Slightly taller to accommodate label better
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        // In 3D Html transform, we don't need absolute positioning
        position: 'relative',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          borderRadius: 14,
          background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          marginBottom: 8,
          boxShadow: isHovered 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: '#f8fafc',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
          padding: '4px 8px',
          borderRadius: 6,
          background: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          backdropFilter: isHovered ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: isHovered ? 'blur(4px)' : 'none',
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '"Inter", sans-serif',
          transition: 'all 0.2s ease',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}
