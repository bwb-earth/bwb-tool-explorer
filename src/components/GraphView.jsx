import { useState, useRef } from 'react'

const LEFT_X = 220
const RIGHT_X = 680
const NODE_R = 22
const TARGET_R = 16
const PAD_V = 60

export default function GraphView({ tools }) {
  const [hovered, setHovered] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const svgRef = useRef(null)

  const targetSet = new Set()
  tools.forEach(t => {
    t.current.forEach(c => targetSet.add(c.target))
    t.suggested.forEach(s => targetSet.add(s.target))
  })
  const targets = Array.from(targetSet)

  const leftCount = tools.length
  const rightCount = targets.length
  const leftSpacing = 62
  const rightSpacing = Math.max(50, Math.round((leftCount * leftSpacing) / rightCount))

  const leftH = (leftCount - 1) * leftSpacing
  const rightH = (rightCount - 1) * rightSpacing
  const svgH = Math.max(leftH, rightH) + PAD_V * 2
  const svgW = 900

  const leftNodes = tools.map((t, i) => ({
    ...t,
    x: LEFT_X,
    y: PAD_V + (svgH - PAD_V * 2 - leftH) / 2 + i * leftSpacing,
  }))

  const rightNodes = targets.map((name, i) => ({
    id: name,
    name,
    x: RIGHT_X,
    y: PAD_V + (svgH - PAD_V * 2 - rightH) / 2 + i * rightSpacing,
  }))

  const rightMap = Object.fromEntries(rightNodes.map(n => [n.name, n]))
  const leftMap = Object.fromEntries(leftNodes.map(n => [n.id, n]))

  const edges = []
  tools.forEach(tool => {
    const src = leftMap[tool.id]
    tool.current.forEach(c => {
      const tgt = rightMap[c.target]
      if (src && tgt) edges.push({ src, tgt, type: 'current', detail: c.detail, toolId: tool.id })
    })
    tool.suggested.forEach(s => {
      const tgt = rightMap[s.target]
      if (src && tgt) edges.push({ src, tgt, type: 'suggested', detail: s.detail, toolId: tool.id })
    })
  })

  const midX = (LEFT_X + RIGHT_X) / 2

  return (
    <div>
      <div className="flex items-center gap-6 mb-5 text-sm">
        <span className="flex items-center gap-2 text-gray-500">
          <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke="#22c55e" strokeWidth="2.5" /></svg>
          Active connection
        </span>
        <span className="flex items-center gap-2 text-gray-500">
          <svg width="28" height="10"><line x1="0" y1="5" x2="28" y2="5" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,3" /></svg>
          Suggested integration
        </span>
        <span className="text-gray-400 text-xs italic">Hover a tool to highlight its connections</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <svg
          ref={svgRef}
          width="100%"
          viewBox={`0 0 ${svgW} ${svgH}`}
          style={{ fontFamily: 'inherit', minWidth: 520, display: 'block' }}
        >
          <text x={LEFT_X} y={PAD_V - 28} textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="600" letterSpacing="1">TOOLS</text>
          <text x={RIGHT_X} y={PAD_V - 28} textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="600" letterSpacing="1">CONNECTIONS</text>

          {edges.map((e, i) => {
            const dim = hovered && hovered !== e.toolId
            const active = hovered === e.toolId
            return (
              <path
                key={i}
                d={`M${e.src.x + NODE_R},${e.src.y} C${midX},${e.src.y} ${midX},${e.tgt.y} ${e.tgt.x - TARGET_R},${e.tgt.y}`}
                fill="none"
                stroke={dim ? '#e5e7eb' : e.type === 'current' ? '#22c55e' : '#a855f7'}
                strokeWidth={active ? 2.5 : 1.5}
                strokeDasharray={e.type === 'suggested' ? '6,3' : undefined}
                opacity={dim ? 0.2 : active ? 1 : hovered ? 0.5 : 0.55}
                style={{ transition: 'all 0.15s', cursor: 'default' }}
                onMouseEnter={ev => {
                  const rect = svgRef.current?.getBoundingClientRect()
                  if (!rect) return
                  setTooltip({ edge: e, mouseX: ev.clientX - rect.left, mouseY: ev.clientY - rect.top })
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            )
          })}

          {leftNodes.map(node => {
            const isActive = hovered === node.id
            const hasEdges = edges.some(e => e.toolId === node.id)
            return (
              <g key={node.id} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                <circle cx={node.x} cy={node.y} r={NODE_R}
                  fill={isActive ? '#4f46e5' : '#eef2ff'}
                  stroke={isActive ? '#3730a3' : hasEdges ? '#a5b4fc' : '#e5e7eb'}
                  strokeWidth="2"
                  style={{ transition: 'all 0.15s' }}
                />
                <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle"
                  fontSize="9" fontWeight="700" fill={isActive ? 'white' : '#6366f1'}
                  style={{ pointerEvents: 'none' }}>
                  {node.name.substring(0, 3).toUpperCase()}
                </text>
                <text x={node.x - NODE_R - 12} y={node.y} textAnchor="end" dominantBaseline="middle"
                  fontSize="13.5" fill={isActive ? '#1e1b4b' : '#374151'}
                  fontWeight={isActive ? '600' : '400'}
                  style={{ pointerEvents: 'none', transition: 'all 0.15s' }}>
                  {node.name}
                </text>
              </g>
            )
          })}

          {rightNodes.map(node => {
            const matchEdge = hovered ? edges.find(e => e.toolId === hovered && e.tgt.name === node.name) : null
            const isHighlighted = !!matchEdge
            const edgeColor = matchEdge?.type === 'current'
              ? { fill: '#dcfce7', stroke: '#22c55e', text: '#15803d' }
              : matchEdge?.type === 'suggested'
              ? { fill: '#f3e8ff', stroke: '#a855f7', text: '#7e22ce' }
              : { fill: '#f9fafb', stroke: '#d1d5db', text: '#9ca3af' }
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={TARGET_R}
                  fill={edgeColor.fill} stroke={edgeColor.stroke} strokeWidth="1.5"
                  style={{ transition: 'all 0.15s' }}
                />
                <text x={node.x + TARGET_R + 12} y={node.y} textAnchor="start" dominantBaseline="middle"
                  fontSize="13" fill={isHighlighted ? '#111827' : edgeColor.text}
                  fontWeight={isHighlighted ? '600' : '400'}
                  style={{ transition: 'all 0.15s' }}>
                  {node.name}
                </text>
              </g>
            )
          })}

          {tooltip && (() => {
            const { edge, mouseX, mouseY } = tooltip
            const scale = svgW / (svgRef.current?.clientWidth || svgW)
            const tx = mouseX * scale
            const ty = mouseY * scale
            const lines = []
            const words = edge.detail.split(' ')
            let line = ''
            words.forEach(w => {
              if ((line + w).length > 38) { lines.push(line.trim()); line = w + ' ' }
              else line += w + ' '
            })
            if (line.trim()) lines.push(line.trim())
            const bw = 220, bh = lines.length * 18 + 20
            const bx = Math.min(Math.max(tx - bw / 2, 10), svgW - bw - 10)
            const by = Math.max(ty - bh - 14, 10)
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect x={bx} y={by} width={bw} height={bh} rx="7"
                  fill="white" stroke="#e5e7eb" strokeWidth="1"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }} />
                <rect x={bx} y={by} width={bw} height="4" rx="7"
                  fill={edge.type === 'current' ? '#22c55e' : '#a855f7'} />
                {lines.map((l, i) => (
                  <text key={i} x={bx + bw / 2} y={by + 14 + i * 18}
                    textAnchor="middle" fontSize="11.5" fill="#374151" dominantBaseline="middle">
                    {l}
                  </text>
                ))}
              </g>
            )
          })()}
        </svg>
      </div>
    </div>
  )
}
