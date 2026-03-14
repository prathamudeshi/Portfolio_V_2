'use client';
/**
 * StatusOverlay.tsx — Top-left status indicator for webcam + face tracking.
 */

interface Props {
  webcamActive: boolean;
  faceDetected: boolean;
  handDetected: boolean;
}

export default function StatusOverlay({ webcamActive, faceDetected, handDetected }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        fontSize: 12,
        fontFamily: '"JetBrains Mono", monospace',
        background: 'rgba(10, 10, 30, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '8px 12px',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.06)',
        color: '#94a3b8',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: webcamActive ? '#22c55e' : '#f59e0b',
            boxShadow: webcamActive ? '0 0 6px #22c55e' : 'none',
          }}
        />
        <span>{webcamActive ? 'Webcam active' : 'Initializing...'}</span>
      </div>
      <div style={{ opacity: 0.7, paddingLeft: 12 }}>
        Face: {faceDetected ? 'detected ✓' : '—'} <br/>
        Hand: {handDetected ? 'detected ✓' : '—'}
      </div>
    </div>
  );
}
