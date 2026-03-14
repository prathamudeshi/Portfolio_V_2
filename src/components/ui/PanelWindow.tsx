'use client';
/**
 * PanelWindow.tsx — Glassmorphism window with drag and resize.
 *
 * DRAG: Pointer-drag on title bar → emits deltas to parent via onDrag callback.
 * RESIZE: Corner handle → updates panel size in the Zustand store.
 * Positioned by ScenePanel in 3D space. Maximize breaks out to fixed overlay.
 */

import { motion } from 'framer-motion';
import { type ReactNode, useCallback, useRef } from 'react';
import { usePanelManager, type PanelId } from '@/hooks/usePanelManager';

interface Props {
  id: PanelId;
  title: string;
  icon: string;
  children: ReactNode;
}

export default function PanelWindow({ id, title, icon, children }: Props) {
  const { panels, closePanel, minimizePanel, maximizePanel, restorePanel, focusPanel, movePanel, resizePanel } =
    usePanelManager();
  const panel = panels[id];
  const [width, height] = panel.size;

  const handleFocus = useCallback(() => focusPanel(id), [focusPanel, id]);

  // ── Drag state ──────────────────────────────────────────────
  const dragRef = useRef<{ startX: number; startY: number } | null>(null);

  const onDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = { startX: e.clientX, startY: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    focusPanel(id);
  }, [focusPanel, id]);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current = { startX: e.clientX, startY: e.clientY };
    movePanel(id, dx, dy);
  }, [movePanel, id]);

  const onDragEnd = useCallback((e: React.PointerEvent) => {
    dragRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // ── Resize state ────────────────────────────────────────────
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  const onResizeStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: width, startH: height };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [width, height]);

  const onResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    const dx = e.clientX - resizeRef.current.startX;
    const dy = e.clientY - resizeRef.current.startY;
    resizePanel(id, resizeRef.current.startW + dx, resizeRef.current.startH + dy);
  }, [resizePanel, id]);

  const onResizeEnd = useCallback((e: React.PointerEvent) => {
    resizeRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  if (!panel.isOpen || panel.isMinimized) return null;

  // ── Maximized overlay ─────────────────────────────────────────
  if (panel.isMaximized) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)',
        }}
        onClick={() => restorePanel(id)}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '90vw', height: '85vh',
            display: 'flex', flexDirection: 'column',
            background: 'rgba(10, 10, 30, 0.92)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 16,
            border: '1px solid rgba(130, 140, 248, 0.2)',
            boxShadow: '0 12px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflow: 'hidden', color: '#e2e8f0',
          }}
        >
          <TitleBar id={id} title={title} icon={icon} />
          <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>{children}</div>
        </motion.div>
      </div>
    );
  }

  // ── Normal (3D-anchored) panel ────────────────────────────────
  return (
    <motion.div
      onPointerDown={handleFocus}
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 10, 30, 0.78)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 14,
        border: '1px solid rgba(130, 140, 248, 0.15)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        overflow: 'hidden',
        color: '#e2e8f0',
        userSelect: 'none',
        pointerEvents: 'auto',
        position: 'relative',
      }}
    >
      {/* Drag handle = title bar */}
      <div
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px',
          cursor: 'grab',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          background: 'rgba(0,0,0,0.2)',
        }}
      >
        {/* macOS dots */}
        <div style={{ display: 'flex', gap: 6, marginRight: 6 }}>
          <button onClick={(e) => { e.stopPropagation(); closePanel(id); }} aria-label="Close"
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer' }} />
          <button onClick={(e) => { e.stopPropagation(); minimizePanel(id); }} aria-label="Minimize"
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', border: 'none', cursor: 'pointer' }} />
          <button onClick={(e) => { e.stopPropagation(); maximizePanel(id) ; }} aria-label="Maximize"
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: 'none', cursor: 'pointer' }} />
        </div>
        <span style={{ fontSize: 13, opacity: 0.5 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8, fontFamily: 'monospace' }}>{title}</span>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}
        onPointerDown={(e) => e.stopPropagation()}>
        {children}
      </div>

      {/* Resize handle (bottom-right corner) */}
      <div
        onPointerDown={onResizeStart}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeEnd}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 18,
          height: 18,
          cursor: 'nwse-resize',
          background: 'transparent',
          zIndex: 5,
        }}
      >
        {/* Visual grip lines */}
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', bottom: 2, right: 2 }}>
          <line x1="14" y1="4" x2="4" y2="14" stroke="rgba(130,140,248,0.3)" strokeWidth="1.5" />
          <line x1="14" y1="8" x2="8" y2="14" stroke="rgba(130,140,248,0.3)" strokeWidth="1.5" />
          <line x1="14" y1="12" x2="12" y2="14" stroke="rgba(130,140,248,0.3)" strokeWidth="1.5" />
        </svg>
      </div>
    </motion.div>
  );
}

// ── Title bar (for maximized mode) ──────────────────────────────
function TitleBar({ id, title, icon }: { id: PanelId; title: string; icon: string }) {
  const { closePanel, minimizePanel, restorePanel } = usePanelManager();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, background: 'rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', gap: 6, marginRight: 6 }}>
        <button onClick={() => closePanel(id)} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', border: 'none', cursor: 'pointer' }} />
        <button onClick={() => minimizePanel(id)} style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', border: 'none', cursor: 'pointer' }} />
        <button onClick={() => restorePanel(id)} style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', border: 'none', cursor: 'pointer' }} />
      </div>
      <span style={{ fontSize: 13, opacity: 0.5 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.8, fontFamily: 'monospace' }}>{title}</span>
    </div>
  );
}
