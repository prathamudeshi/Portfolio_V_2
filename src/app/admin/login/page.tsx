'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'granted' | 'denied'>('idle');
  const [logs, setLogs] = useState<string[]>(['SYSTEM_READY', 'AWAITING_CREDENTIALS...']);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`].slice(-8));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || status === 'verifying') return;

    setStatus('verifying');
    addLog('TRANSMITTING_HASH...');

    const result = await loginAction(password);

    if (result.success) {
      setStatus('granted');
      addLog('ACCESS_GRANTED');
      addLog('REDIRECTING_TO_CORE...');
      setTimeout(() => router.push('/admin/tracking'), 1000);
    } else {
      setStatus('denied');
      addLog('ACCESS_DENIED_INVALID_SECRET');
      setPassword('');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{
      height: '100vh',
      background: '#05050f',
      color: 'var(--accent)',
      fontFamily: 'JetBrains Mono, monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(10, 10, 20, 0.8)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '30px',
        borderRadius: '4px',
        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Scanline effect */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 2px, 3px 100%',
          pointerEvents: 'none',
          zIndex: 10
        }} />

        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '5px' }}>TELEMETRY_TERMINAL_v0.92</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>AUTHENTICATION_REQUIRED</div>
        </div>

        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '15px', 
          marginBottom: '20px', 
          fontSize: '11px',
          borderLeft: '2px solid var(--accent)'
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '3px' }}>{log}</div>
          ))}
          {status === 'verifying' && <div className="animate-pulse">_</div>}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.7 }}>$</span>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'verifying' || status === 'granted'}
              placeholder="ENTER_SECRET_KEY"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '12px 12px 12px 25px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
          </div>
          <button 
            type="submit"
            disabled={status === 'verifying' || status === 'granted'}
            style={{ display: 'none' }}
          >Execute</button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '10px', opacity: 0.3, textAlign: 'center' }}>
          SECURE_CONNECTION_ESTABLISHED
        </div>
      </div>
      
      <style jsx global>{`
        :root {
          --accent: #818cf8;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
