'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeColors } from '@/hooks/useThemeColors';

interface Session {
  visitorId: string;
  userAgent: string;
  language: string;
  screenResolution: string;
  referrer: string;
  lastSeen: string;
  firstSeen: string;
}

interface Snapshot {
  _id: string;
  visitorId: string;
  snapshot: string;
  trackingState: any;
  timestamp: string;
  path: string;
}

export default function TrackingDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const colors = useThemeColors();

  const fetchData = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setSessions(data.sessions || []);
      setSnapshots(data.snapshots || []);
    } catch (err) {
      console.error('[Dashboard] Fetch fail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredSnapshots = selectedSession 
    ? snapshots.filter(s => s.visitorId === selectedSession)
    : snapshots;

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
      LOADING_DECRYPTING_TELEMETRY...
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#05050f', 
      color: '#cbd5e1', 
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{ 
        padding: '20px 40px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(10, 10, 20, 0.5)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <div style={{ 
            width: 40, height: 40, borderRadius: 10, 
            background: 'linear-gradient(135deg, var(--accent), var(--accent-mid))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
          }}>👁️</div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>Illusion_V2 Telemetry</h1>
            <p style={{ fontSize: 11, color: 'var(--accent)', margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>SECRET_HOSPITALITY_PROTOCOL_v0.92</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
          <div>SESSIONS: <span style={{ color: 'var(--accent)' }}>{sessions.length}</span></div>
          <div>SNAPSHOTS: <span style={{ color: 'var(--accent)' }}>{snapshots.length}</span></div>
          <button onClick={fetchData} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>🔄</button>
        </div>
      </header>

      <main style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar: Sessions */}
        <aside style={{ 
          width: 320, 
          borderRight: '1px solid rgba(255,255,255,0.05)', 
          overflowY: 'auto',
          background: 'rgba(5, 5, 10, 0.3)'
        }}>
          <div style={{ padding: '20px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Recent Sessions
          </div>
          {sessions.map(session => (
            <div 
              key={session.visitorId}
              onClick={() => setSelectedSession(selectedSession === session.visitorId ? null : session.visitorId)}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.02)',
                cursor: 'pointer',
                background: selectedSession === session.visitorId ? 'rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.08)' : 'transparent',
                borderLeft: selectedSession === session.visitorId ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: selectedSession === session.visitorId ? '#fff' : '#94a3b8' }}>
                {session.visitorId.slice(0, 12)}...
              </div>
              <div style={{ fontSize: 10, color: '#475569', marginTop: 4 }}>
                {new Date(session.lastSeen).toLocaleString()}
              </div>
              <div style={{ fontSize: 9, color: 'var(--accent)', marginTop: 4, opacity: 0.7 }}>
                {session.referrer.includes('linkedin') ? '🔗 LinkedIn' : '🌐 Web'} • {session.screenResolution}
              </div>
            </div>
          ))}
        </aside>

        {/* Content: Snapshot Gallery */}
        <section style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>
              {selectedSession ? `Tracking Session: ${selectedSession.slice(0, 8)}...` : 'Visual Telemetry Log'}
            </h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
            gap: 20 
          }}>
            <AnimatePresence mode='popLayout'>
              {filteredSnapshots.map(snapshot => (
                <motion.div
                  key={snapshot._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative'
                  }}
                >
                  <img 
                    src={snapshot.snapshot} 
                    alt="Webcam capture" 
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '12px', fontSize: 10, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--accent)' }}>{new Date(snapshot.timestamp).toLocaleTimeString()}</span>
                      <span style={{ color: '#475569' }}>{snapshot.path}</span>
                    </div>
                    <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                       {snapshot.trackingState.faceDetected && <span style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', padding: '2px 6px', borderRadius: 4 }}>👤 FACE</span>}
                       {snapshot.trackingState.handDetected && <span style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', padding: '2px 6px', borderRadius: 4 }}>🤚 HAND</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
}
