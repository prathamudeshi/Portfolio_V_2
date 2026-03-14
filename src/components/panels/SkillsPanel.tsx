'use client';
/**
 * SkillsPanel.tsx — Force-directed constellation graph of skills.
 */

import { useEffect, useRef, useState } from 'react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type SimulationNodeDatum, type SimulationLinkDatum } from 'd3-force';
import { skillNodes, skillLinks, groupColors, type SkillNode } from '@/data/skills';

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

export default function SkillsPanel() {
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
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#818cf8', margin: '0 0 8px', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        ⚡ Skills Constellation
      </h3>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, display: 'flex', gap: 12, flexWrap: 'wrap', zIndex: 1 }}>
        {Object.entries(groupColors).map(([group, color]) => (
          <span key={group} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
            {group}
          </span>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${size.w} ${size.h}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        {/* Links */}
        {links.map((link, i) => {
          const s = link.source as SimNode;
          const t = link.target as SimNode;
          if (!s.x || !t.x) return null;
          return (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={t.x}
              y2={t.y}
              stroke="rgba(130, 140, 248, 0.15)"
              strokeWidth={1}
              opacity={hovered ? (isConnected(s.id) && isConnected(t.id) ? 0.4 : 0.05) : 0.2}
            />
          );
        })}

        {/* Nodes */}
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
              {/* Glow */}
              <circle r={r + 4} fill={color} opacity={hovered === node.id ? 0.2 : 0} />
              {/* Node circle */}
              <circle r={r} fill={color} opacity={0.7} stroke={color} strokeWidth={1.5} strokeOpacity={0.5} />
              {/* Label */}
              <text
                y={r + 14}
                textAnchor="middle"
                fill={active ? '#cbd5e1' : '#334155'}
                fontSize={10}
                fontFamily="'Inter', sans-serif"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
