'use client';
/**
 * SkillsPanel.tsx — Dual-view skills browser.
 * Toggle between force-directed constellation graph and interactive card grid.
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type SimulationNodeDatum, type SimulationLinkDatum } from 'd3-force';
import { skillNodes, skillLinks, groupColors, groupLabels, type SkillNode } from '@/data/skills';

/* ────── Types for D3 simulation ────── */
interface SimNode extends SimulationNodeDatum {
  id: string;
  label: string;
  group: SkillNode['group'];
  proficiency: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

type ViewMode = 'cards' | 'constellation';
type GroupFilter = 'all' | SkillNode['group'];

/* ────── Proficiency stars/bars helper ────── */
function ProficiencyBar({ level }: { level: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 4,
            borderRadius: 2,
            background: i <= level
              ? 'linear-gradient(90deg, var(--accent), var(--accent-mid))'
              : 'rgba(255, 255, 255, 0.06)',
            transition: 'background 0.3s',
          }}
        />
      ))}
      <span style={{ fontSize: 10, color: '#64748b', marginLeft: 4, fontFamily: '"JetBrains Mono", monospace' }}>
        {level}/5
      </span>
    </div>
  );
}

/* ────── Skill Card ────── */
function SkillCard({ skill, onClick, isSelected }: { skill: SkillNode; onClick: () => void; isSelected: boolean }) {
  const color = groupColors[skill.group];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderRadius: 12,
        background: isSelected
          ? `linear-gradient(135deg, ${color}15, ${color}08)`
          : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${isSelected ? `${color}40` : 'rgba(255, 255, 255, 0.04)'}`,
        cursor: 'pointer',
        transition: 'all 0.25s',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        background: `linear-gradient(135deg, ${color}12, ${color}06)`,
        borderColor: `${color}30`,
      }}
    >
      {/* Glow accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 2,
        background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
        opacity: isSelected ? 1 : 0,
        transition: 'opacity 0.3s',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            display: 'inline-block',
            boxShadow: `0 0 8px ${color}40`,
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
            {skill.label}
          </span>
        </div>
        <span style={{
          fontSize: 9,
          color: color,
          padding: '2px 8px',
          borderRadius: 6,
          background: `${color}10`,
          border: `1px solid ${color}20`,
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: 0.5,
        }}>
          {groupLabels[skill.group]}
        </span>
      </div>

      <ProficiencyBar level={skill.proficiency} />

      {/* Expandable description */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: '1px solid rgba(255, 255, 255, 0.04)',
              fontSize: 11,
              color: '#94a3b8',
              lineHeight: 1.6,
            }}>
              {skill.description}
            </div>
            {/* Show connected skills */}
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {skillLinks
                .filter(l => l.source === skill.id || l.target === skill.id)
                .map(l => {
                  const connId = l.source === skill.id ? l.target : l.source;
                  const conn = skillNodes.find(n => n.id === connId);
                  if (!conn) return null;
                  return (
                    <span key={connId} style={{
                      fontSize: 9,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: '#64748b',
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>
                      ↔ {conn.label}
                    </span>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ────── Constellation Graph (original d3-force view) ────── */
function ConstellationView() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [links, setLinks] = useState<SimLink[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [size, setSize] = useState({ w: 400, h: 300 });

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      setSize({ w: rect.width, h: rect.height });
    }
  }, []);

  useEffect(() => {
    const simNodes: SimNode[] = skillNodes.map((n) => ({
      ...n,
      x: size.w / 2 + (Math.random() - 0.5) * 100,
      y: size.h / 2 + (Math.random() - 0.5) * 100,
    }));
    const simLinks: SimLink[] = skillLinks.map((l) => ({ ...l }));

    const sim = forceSimulation<SimNode>(simNodes)
      .force('link', forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(60))
      .force('charge', forceManyBody().strength(-120))
      .force('center', forceCenter(size.w / 2, size.h / 2))
      .force('collide', forceCollide<SimNode>().radius((d) => d.proficiency * 5 + 12))
      .on('tick', () => {
        setNodes([...simNodes]);
        setLinks([...simLinks]);
      });

    sim.alpha(1).restart();
    return () => { sim.stop(); };
  }, [size]);

  const isConnected = (nodeId: string) => {
    if (!hovered) return true;
    if (nodeId === hovered) return true;
    return skillLinks.some(
      (l) =>
        (l.source === hovered && l.target === nodeId) ||
        (l.target === hovered && l.source === nodeId)
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', gap: 12, flexWrap: 'wrap', zIndex: 1 }}>
        {Object.entries(groupColors).map(([group, color]) => (
          <span key={group} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {group}
          </span>
        ))}
      </div>

      <svg ref={svgRef} viewBox={`0 0 ${size.w} ${size.h}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        {links.map((link, i) => {
          const s = link.source as SimNode;
          const t = link.target as SimNode;
          if (!s.x || !t.x) return null;
          return (
            <line
              key={i}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke="rgba(130, 140, 248, 0.15)"
              strokeWidth={1}
              opacity={hovered ? (isConnected(s.id) && isConnected(t.id) ? 0.4 : 0.05) : 0.2}
            />
          );
        })}
        {nodes.map((node) => {
          const r = node.proficiency * 4 + 6;
          const color = groupColors[node.group];
          const active = isConnected(node.id);
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              opacity={active ? 1 : 0.15}
            >
              <circle r={r + 4} fill={color} opacity={hovered === node.id ? 0.2 : 0} />
              <circle r={r} fill={color} opacity={0.7} stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
              <text y={r + 14} textAnchor="middle" fill={active ? '#cbd5e1' : '#334155'} fontSize={10} fontFamily="'Inter', sans-serif">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ────── Main SkillsPanel component ────── */
export default function SkillsPanel() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filter, setFilter] = useState<GroupFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filteredSkills = useMemo(() => {
    let result = [...skillNodes];
    if (filter !== 'all') {
      result = result.filter(s => s.group === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.label.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q)
      );
    }
    // Sort by proficiency (highest first), then alphabetically
    result.sort((a, b) => b.proficiency - a.proficiency || a.label.localeCompare(b.label));
    return result;
  }, [filter, search]);

  const groups: { key: GroupFilter; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: '✦' },
    { key: 'ai', label: 'AI', icon: '🧠' },
    { key: 'frontend', label: 'Frontend', icon: '🎨' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'devops', label: 'Cloud', icon: '☁️' },
    { key: 'tools', label: 'Tools', icon: '🔧' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* ── Top toolbar ── */}
      <div style={{ padding: '0 4px 8px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        {/* View mode toggle + title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            ⚡ Skills
            <span style={{
              fontSize: 10,
              color: '#475569',
              fontWeight: 400,
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              {skillNodes.length}
            </span>
          </h3>

          {/* View toggle */}
          <div style={{
            display: 'flex',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: '4px 10px',
                border: 'none',
                background: viewMode === 'cards' ? 'rgba(130, 140, 248, 0.2)' : 'transparent',
                color: viewMode === 'cards' ? '#a5b4fc' : '#475569',
                cursor: 'pointer',
                fontSize: 12,
                transition: 'all 0.2s',
              }}
              title="Card View"
            >
              ☰
            </button>
            <button
              onClick={() => setViewMode('constellation')}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                background: viewMode === 'constellation' ? 'rgba(130, 140, 248, 0.2)' : 'transparent',
                color: viewMode === 'constellation' ? '#a5b4fc' : '#475569',
                cursor: 'pointer',
                fontSize: 12,
                transition: 'all 0.2s',
              }}
              title="Constellation View"
            >
              ✧
            </button>
          </div>
        </div>

        {/* Search + filter (only for cards view) */}
        {viewMode === 'cards' && (
          <>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 12,
                color: '#475569',
                pointerEvents: 'none',
              }}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#e2e8f0',
                  fontSize: 12,
                  fontFamily: '"Inter", sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(130, 140, 248, 0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)'; }}
              />
            </div>

            {/* Category filter chips */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {groups.map(g => {
                const isActive = filter === g.key;
                const count = g.key === 'all' ? skillNodes.length : skillNodes.filter(s => s.group === g.key).length;
                return (
                  <button
                    key={g.key}
                    onClick={() => { setFilter(g.key); setSelected(null); }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: `1px solid ${isActive ? 'rgba(130, 140, 248, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
                      background: isActive ? 'rgba(130, 140, 248, 0.12)' : 'transparent',
                      color: isActive ? '#a5b4fc' : '#64748b',
                      cursor: 'pointer',
                      fontSize: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.2s',
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    <span>{g.icon}</span>
                    <span>{g.label}</span>
                    <span style={{
                      fontSize: 9,
                      opacity: 0.6,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Content area ── */}
      <div style={{ flex: 1, overflow: 'auto', paddingRight: 4 }}>
        {viewMode === 'constellation' ? (
          <ConstellationView />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 8 }}>
            <AnimatePresence mode="popLayout">
              {filteredSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isSelected={selected === skill.id}
                  onClick={() => setSelected(selected === skill.id ? null : skill.id)}
                />
              ))}
            </AnimatePresence>
            {filteredSkills.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 32,
                color: '#475569',
                fontSize: 12,
              }}>
                No skills match your search
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

