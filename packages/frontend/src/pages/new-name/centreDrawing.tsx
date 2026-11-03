import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'

/**
 * The two rings of "A new centre", drawn once at module load. The drawing
 * lives in a 520-unit square: a ring of equal sectors around a centre disc.
 * Fills are the site's tokens, so the rings follow light and dark.
 */
export type CentreKind = 'l2beat' | 'ethbeat'

const INK = '#0d0c0c'
const PINK = 'var(--brand)'
const SECTOR = 'var(--surface-tertiary)'
const OPEN_SECTOR = 'var(--surface-secondary)'
const HUB = 'var(--primary)'
const ON_HUB = 'var(--surface-primary)'
const ON_SECTOR = 'var(--primary)'

const OPEN = 'And more'
const C = 260
const R_OUT = 236
const GAP = 10
const ROUND = 6
const L2BEAT_R_IN = 128
const ETHBEAT_R_IN = 154

export function CentreDrawing({
  kind,
  label,
  className,
}: {
  kind: CentreKind
  label: string
  className?: string
}) {
  return (
    <svg
      viewBox="22 22 476 476"
      role="img"
      aria-label={label}
      className={cn('block h-auto w-full font-bold font-inter', className)}
    >
      {DRAWINGS[kind]}
    </svg>
  )
}

const DRAWINGS: Record<CentreKind, ReactNode> = {
  l2beat: (
    <>
      {ring(['Data\navailability', 'ZK', 'Bridges'], {
        start: 120,
        rIn: L2BEAT_R_IN,
        size: 26,
      })}
      <circle cx={C} cy={C} r={L2BEAT_R_IN - GAP} style={{ fill: PINK }} />
      <Label x={C} y={C} size={36} fill={INK}>
        Layer 2s
      </Label>
    </>
  ),
  ethbeat: (
    <>
      {ring(
        [
          'Layer 2s',
          'Privacy',
          'ZK',
          'Interop',
          OPEN,
          'Staking',
          'DeFi',
          'Tokens',
        ],
        { start: -22.5, rIn: ETHBEAT_R_IN, size: 22, highlight: 'Layer 2s' },
      )}
      <circle cx={C} cy={C} r={ETHBEAT_R_IN - GAP} style={{ fill: HUB }} />
      <Diamond cx={C} cy={C - 24} h={150} />
      <Label x={C} y={C + 86} size={30} fill={ON_HUB}>
        Ethereum
      </Label>
    </>
  ),
}

/**
 * One sector between two angles, inset by half the gap on each side. The path
 * is inset a further ROUND and stroked 2×ROUND wide in its own colour with
 * round joins, which rounds its corners.
 */
function sectorPath(a0: number, a1: number, rIn: number) {
  const ro = R_OUT - ROUND
  const ri = rIn + ROUND
  const d = GAP / 2 + ROUND
  const off = (r: number) => (Math.asin(d / r) * 180) / Math.PI
  const [x0, y0] = point(ro, a0 + off(ro))
  const [x1, y1] = point(ro, a1 - off(ro))
  const [x2, y2] = point(ri, a1 - off(ri))
  const [x3, y3] = point(ri, a0 + off(ri))
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${round(x0)} ${round(y0)}A${ro} ${ro} 0 ${large} 1 ${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}A${ri} ${ri} 0 ${large} 0 ${round(x3)} ${round(y3)}Z`
}

function Label(props: {
  x: number
  y: number
  size: number
  fill: string
  children: string
}) {
  return (
    <text
      x={round(props.x)}
      y={round(props.y + props.size * 0.35)}
      textAnchor="middle"
      fontSize={props.size}
      letterSpacing="-0.02em"
      style={{ fill: props.fill }}
    >
      {props.children}
    </text>
  )
}

/** A ring of equal sectors: one pink highlight, one lighter open slot. */
function ring(
  areas: string[],
  opts: { start: number; rIn: number; size: number; highlight?: string },
): ReactNode[] {
  const step = 360 / areas.length
  return areas.flatMap((area, i) => {
    const a0 = opts.start + i * step
    const mid = a0 + step / 2
    const fill =
      area === opts.highlight ? PINK : area === OPEN ? OPEN_SECTOR : SECTOR
    // Wide labels near 3 and 9 o'clock sit a little inward, clear of the edge.
    const [x, y] = point(
      (R_OUT + opts.rIn) / 2 - 6 * Math.abs(Math.cos(rad(mid))),
      mid,
    )
    const lines = area.split('\n')
    return [
      <path
        key={`s${i}`}
        d={sectorPath(a0, a0 + step, opts.rIn)}
        strokeWidth={ROUND * 2}
        strokeLinejoin="round"
        style={{ fill, stroke: fill }}
      />,
      ...lines.map((line, k) => (
        <Label
          key={`l${i}-${k}`}
          x={x}
          y={y + (k - (lines.length - 1) / 2) * opts.size * 1.2}
          size={opts.size}
          fill={area === opts.highlight ? INK : ON_SECTOR}
        >
          {line}
        </Label>
      )),
    ]
  })
}

/** The Ethereum diamond in one tone, one path per half. */
function Diamond({ cx, cy, h }: { cx: number; cy: number; h: number }) {
  const s = h / 417
  return (
    <g
      transform={`translate(${round(cx - 128 * s)} ${round(cy - 208 * s)}) scale(${round(s * 1000) / 1000})`}
      style={{ fill: ON_HUB }}
    >
      <path d="M127.962 0L0 212.32l127.962 75.639 127.96-75.639z" />
      <path d="M127.962 312.187L0 236.585l127.962 180.32 127.96-180.32z" />
    </g>
  )
}

function rad(deg: number) {
  return ((deg - 90) * Math.PI) / 180
}

function point(r: number, deg: number) {
  return [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const
}

function round(v: number) {
  return Math.round(v * 100) / 100
}
