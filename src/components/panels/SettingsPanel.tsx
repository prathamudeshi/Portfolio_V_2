'use client';
/**
 * SettingsPanel.tsx — Full settings UI with grouped sections and theme selector.
 */

import { useSettings, type ThemeName } from '@/hooks/useSettings';

const themes: { id: ThemeName; label: string; color: string }[] = [
  { id: 'indigo', label: 'Indigo', color: '#818cf8' },
  { id: 'emerald', label: 'Emerald', color: '#34d399' },
  { id: 'rose', label: 'Rose', color: '#fb7185' },
  { id: 'amber', label: 'Amber', color: '#fbbf24' },
  { id: 'cyan', label: 'Cyan', color: '#22d3ee' },
];

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        background: value
          ? 'linear-gradient(135deg, var(--accent), var(--accent-mid))'
          : 'rgba(255, 255, 255, 0.08)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.25s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: value ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: value ? '#fff' : '#64748b',
          transition: 'left 0.25s, background 0.25s',
          boxShadow: value ? '0 0 6px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.4)' : 'none',
        }}
      />
    </button>
  );
}

function Slider({
  value, min, max, step, onChange,
}: { value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          flex: 1,
          WebkitAppearance: 'none',
          appearance: 'none',
          height: 4,
          borderRadius: 2,
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, rgba(255,255,255,0.08) ${pct}%, rgba(255,255,255,0.08) 100%)`,
          outline: 'none',
          cursor: 'pointer',
        }}
      />
      <span style={{ fontSize: 11, color: 'var(--accent)', minWidth: 36, textAlign: 'right', fontFamily: '"JetBrains Mono", monospace' }}>
        {value.toFixed(step < 1 ? 2 : 0)}
      </span>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
      gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 500 }}>{label}</div>
        {description && (
          <div style={{ fontSize: 10, color: '#475569', marginTop: 2, lineHeight: 1.4 }}>{description}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 120, justifyContent: 'flex-end' }}>
        {children}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '12px 0 6px',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--accent)',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    }}>
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
}

function ThemeSelector() {
  const currentTheme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);

  return (
    <div style={{ display: 'flex', gap: 10, padding: '8px 0' }}>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            border: currentTheme === t.id
              ? `2px solid ${t.color}`
              : '2px solid rgba(255,255,255,0.06)',
            background: currentTheme === t.id
              ? `rgba(${hexToRgb(t.color)}, 0.15)`
              : 'rgba(255,255,255,0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            position: 'relative',
          }}
        >
          <span style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: t.color,
            display: 'block',
            boxShadow: currentTheme === t.id ? `0 0 12px ${t.color}50` : 'none',
            transition: 'box-shadow 0.2s',
          }} />
        </button>
      ))}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default function SettingsPanel() {
  const settings = useSettings();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      overflow: 'auto',
      padding: '4px 12px 16px',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* ── Theme ── */}
      <SectionHeader icon="🎨" title="Theme" />
      <ThemeSelector />

      {/* ── Hand Tracking ── */}
      <SectionHeader icon="🤚" title="Hand Tracking" />
      <SettingRow label="Enable Hand Tracking" description="Track hand gestures via webcam">
        <ToggleSwitch value={settings.handTrackingEnabled} onChange={settings.setHandTrackingEnabled} />
      </SettingRow>
      <SettingRow label="Smoothing" description="Higher = smoother but more latency">
        <Slider value={settings.handSmoothingFactor} min={0.1} max={0.9} step={0.05} onChange={settings.setHandSmoothingFactor} />
      </SettingRow>
      <SettingRow label="Pinch Sensitivity" description="Lower = easier to trigger pinch">
        <Slider value={settings.pinchThreshold} min={0.03} max={0.08} step={0.005} onChange={settings.setPinchThreshold} />
      </SettingRow>
      <SettingRow label="Cursor Size" description="Hand cursor diameter in pixels">
        <Slider value={settings.cursorSize} min={8} max={32} step={1} onChange={settings.setCursorSize} />
      </SettingRow>

      {/* ── Face Tracking ── */}
      <SectionHeader icon="👤" title="Face Tracking" />
      <SettingRow label="Enable Face Parallax" description="3D parallax based on head movement">
        <ToggleSwitch value={settings.faceTrackingEnabled} onChange={settings.setFaceTrackingEnabled} />
      </SettingRow>
      <SettingRow label="Face Sensitivity" description="Parallax movement multiplier">
        <Slider value={settings.faceSensitivity} min={0.5} max={3.0} step={0.1} onChange={settings.setFaceSensitivity} />
      </SettingRow>

      {/* ── Display ── */}
      <SectionHeader icon="🖥️" title="Display" />
      <SettingRow label="Show Webcam Preview" description="Small camera feed in bottom-left">
        <ToggleSwitch value={settings.showWebcam} onChange={settings.setShowWebcam} />
      </SettingRow>
      {settings.showWebcam && (
        <SettingRow label="Webcam Opacity">
          <Slider value={settings.webcamOpacity} min={0.3} max={1.0} step={0.05} onChange={settings.setWebcamOpacity} />
        </SettingRow>
      )}
      <SettingRow label="Show Status Overlay" description="Tracking status in top-left corner">
        <ToggleSwitch value={settings.showStatusOverlay} onChange={settings.setShowStatusOverlay} />
      </SettingRow>
      <SettingRow label="Fullscreen" description="Toggle immersive fullscreen mode">
        <button
          onClick={settings.toggleFullscreen}
          style={{
            padding: '6px 16px',
            borderRadius: 8,
            border: '1px solid rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.3)',
            background: settings.isFullscreen
              ? 'rgba(239, 68, 68, 0.15)'
              : 'rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.1)',
            color: settings.isFullscreen ? '#fca5a5' : 'var(--accent)',
            fontSize: 11,
            fontFamily: '"JetBrains Mono", monospace',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {settings.isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </button>
      </SettingRow>

      {/* ── Reset ── */}
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={settings.resetAll}
          style={{
            padding: '8px 24px',
            borderRadius: 8,
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'rgba(239, 68, 68, 0.06)',
            color: '#f87171',
            fontSize: 11,
            fontFamily: '"JetBrains Mono", monospace',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
          }}
        >
          Reset All Settings
        </button>
      </div>

      {/* Custom style for range inputs */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.4);
          border: 2px solid rgba(255,255,255,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--accent);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.4);
          border: 2px solid rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
