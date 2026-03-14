'use client';
/**
 * TerminalPanel.tsx — Interactive command-line terminal.
 */

import { useRef, useEffect, type KeyboardEvent } from 'react';
import { useTerminal } from '@/hooks/useTerminal';

export default function TerminalPanel() {
  const { history, input, setInput, executeCommand, navigateHistory, getAutocomplete } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Auto-focus input when panel mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = getAutocomplete(input);
      if (match) setInput(match);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        fontSize: 13,
        lineHeight: 1.6,
        cursor: 'text',
      }}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          paddingBottom: 8,
        }}
      >
        {history.map((line, i) => (
          <div
            key={i}
            style={{
              color: line.color || '#cbd5e1',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>

      {/* Input line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#818cf8', fontWeight: 600, flexShrink: 0 }}>❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            caretColor: '#818cf8',
          }}
        />
      </div>
    </div>
  );
}
