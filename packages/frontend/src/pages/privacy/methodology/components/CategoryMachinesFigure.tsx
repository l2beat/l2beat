import type { PrivacyField } from '@l2beat/config'
import { type ReactNode, useEffect, useRef } from 'react'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { cn } from '~/utils/cn'
import { byId, type FigureData, MethodologyFigure } from './MethodologyFigure'
import { OWNER_COLORS } from './poolLensScene'

type CategoryId = FigureData['categories'][number]['id']

const [BLUE, TEAL, VIOLET, PINK, ORANGE] = OWNER_COLORS as [
  string,
  string,
  string,
  string,
  string,
]
const GREY = 'var(--secondary)'
const DUR = 4.5

const MACHINES: {
  category: CategoryId
  hides: PrivacyField
  scene: ReactNode
}[] = [
  { category: 'pool', hides: 'linkage', scene: <PoolMachine /> },
  { category: 'shieldedLedger', hides: 'linkage', scene: <LedgerMachine /> },
  { category: 'anonymousAccess', hides: 'linkage', scene: <AccessMachine /> },
  { category: 'stealthAddress', hides: 'recipient', scene: <StealthMachine /> },
  {
    category: 'confidentialAmounts',
    hides: 'amount',
    scene: <ConfidentialMachine />,
  },
]

export function CategoryMachinesFigure({ data }: { data: FigureData }) {
  const ref = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(ref)
  const reducedMotion = usePrefersReducedMotion()
  const running = onScreen && !reducedMotion
  return (
    <MethodologyFigure caption="Five mechanisms, each running on made-up payments. A coin keeps its owner's colour where the chain shows who it belongs to, and turns grey where the mechanism hides it.">
      {/* Equal cards; a short last row sits centred. */}
      <div ref={ref} className="grid gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {MACHINES.map(({ category, hides, scene }, i) => {
          const { label, description } = byId(data.categories, category)
          return (
            <div
              key={category}
              className={cn(
                'flex flex-col rounded-lg border border-divider bg-surface-primary p-3',
                'sm:col-span-2',
                i === 3 && 'lg:col-start-2',
                i === 4 && 'sm:col-start-2 lg:col-start-auto',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-label-value-14">{label}</span>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 font-semibold text-brand text-label-value-12">
                  hides the {byId(data.fields, hides).label.toLowerCase()}
                </span>
              </div>
              <LiveSvg running={running}>{scene}</LiveSvg>
              <p className="text-paragraph-12 text-secondary">{description}</p>
            </div>
          )
        })}
      </div>
    </MethodologyFigure>
  )
}

/** SMIL keeps the loops off the main thread; paused off screen. */
function LiveSvg({
  running,
  children,
}: {
  running: boolean
  children: ReactNode
}) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    if (running) ref.current?.unpauseAnimations()
    else ref.current?.pauseAnimations()
  }, [running])
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 110"
      className="my-2 h-36 w-full"
      aria-hidden
    >
      {children}
    </svg>
  )
}

interface Stop {
  x: number
  y: number
  /** When it is here, 0..1 of the loop; strictly increasing. */
  at: number
}

/**
 * A coin that travels through `stops`, shown from the first stop to the
 * last. It is in `color` until `greyAt` and dissolves into grey after.
 * The motion is timed by `keyPoints`, which works in every browser; plain
 * `keyTimes` on a path with several segments does not. Each segment starts
 * and ends at its neighbours' speeds, so the coin glides through stops and
 * eases into and out of rests.
 */
function Coin({
  stops,
  color,
  greyAt,
  dur,
  begin = 0,
  r = 5,
}: {
  stops: Stop[]
  color: string
  greyAt?: number
  dur: number
  begin?: number
  r?: number
}) {
  const first = stops[0]
  const last = stops[stops.length - 1]
  if (!first || !last) return null
  const frames = [
    ...(first.at > 0 ? [{ ...first, at: 0 }] : []),
    ...stops,
    ...(last.at < 1 ? [{ ...last, at: 1 }] : []),
  ]
  const lengths = frames.map((f, i) => {
    const prev = frames[i - 1]
    return prev ? Math.hypot(f.x - prev.x, f.y - prev.y) : 0
  })
  const speeds = frames.map((f, i) => {
    const prev = frames[i - 1]
    return prev && f.at > prev.at ? (lengths[i] ?? 0) / (f.at - prev.at) : 0
  })
  const total = lengths.reduce((a, b) => a + b, 0) || 1
  let travelled = 0
  const keyPoints = lengths.map((length) => {
    travelled += length
    return (travelled / total).toFixed(4)
  })
  const timing = { dur: `${dur}s`, begin: `${begin}s` }
  return (
    <g>
      <animateMotion
        path={`M ${frames.map((f) => `${f.x} ${f.y}`).join(' L ')}`}
        keyPoints={keyPoints.join(';')}
        keyTimes={frames.map((f) => f.at).join(';')}
        calcMode="spline"
        keySplines={speeds
          .slice(1)
          .map((speed, i) => {
            if (!speed) return '0 0 1 1'
            // With control points a third in, an offset of slope / 3 sets
            // the speed at each end, relative to this segment's average.
            const start = (speeds[i] ?? 0) / speed / 3
            const end = (speeds[i + 2] ?? 0) / speed / 3
            return [1 / 3, Math.min(1, start), 2 / 3, Math.max(0, 1 - end)]
              .map((n) => n.toFixed(3))
              .join(' ')
          })
          .join(';')}
        repeatCount="indefinite"
        {...timing}
      />
      <circle r={r} fill={color} opacity={0}>
        <Shown from={first.at} to={greyAt ?? last.at} {...timing} />
      </circle>
      {greyAt !== undefined && (
        <circle r={r} fill={GREY} opacity={0}>
          <Shown from={greyAt - 0.06} to={last.at} {...timing} />
        </circle>
      )}
    </g>
  )
}

/** Fades its parent in at `from` and out at `to`, 0..1 of the loop. */
function Shown({
  from,
  to,
  dur,
  begin = '0s',
}: {
  from: number
  to: number
  dur: string
  begin?: string
}) {
  const ramp = 0.04
  const frames: [number, number][] =
    from > 0
      ? [
          [0, 0],
          [from, 0],
          [from + ramp, 1],
        ]
      : [[0, 1]]
  if (to < 1) frames.push([to - ramp, 1], [to, 0], [1, 0])
  else frames.push([1, 1])
  return (
    <animate
      attributeName="opacity"
      values={frames.map((f) => f[1]).join(';')}
      keyTimes={frames.map((f) => f[0]).join(';')}
      dur={dur}
      begin={begin}
      repeatCount="indefinite"
    />
  )
}

function Box({ x, width }: { x: number; width: number }) {
  return (
    <rect
      x={x}
      y={14}
      width={width}
      height={82}
      rx={12}
      fill="var(--surface-secondary)"
      stroke="var(--divider)"
    />
  )
}

function Label({
  x,
  y,
  children,
  anchor = 'middle',
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={7} fill={GREY}>
      {children}
    </text>
  )
}

const ROWS = [28, 55, 82]

/** Senders on the left in their colours, fresh addresses on the right. */
function Ends({ senders }: { senders: (string | undefined)[] }) {
  return (
    <>
      {senders.map(
        (color, i) =>
          color && (
            <circle key={color} cx={12} cy={ROWS[i]} r={5} fill={color} />
          ),
      )}
      {ROWS.map((y) => (
        <circle
          key={y}
          cx={188}
          cy={y}
          r={5}
          fill="none"
          stroke="var(--divider)"
          strokeWidth={1.5}
        />
      ))}
      <Label x={4} y={104} anchor="start">
        senders
      </Label>
      <Label x={196} y={104} anchor="end">
        recipients
      </Label>
    </>
  )
}

/** Points on a circle around (100, 55), from `start` through `turn` radians. */
function orbit(
  radius: number,
  start: number,
  turn: number,
  from: number,
  to: number,
): Stop[] {
  const steps = 36
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = start + (turn * i) / steps
    return {
      x: 100 + Math.cos(a) * radius,
      y: 55 + Math.sin(a) * radius,
      at: from + ((to - from) * i) / steps,
    }
  })
}

/** Faint arms that turn with the coins, so the pool reads as a mixer. */
function Swirl({ dur }: { dur: number }) {
  const arms = [0, 1, 2].map((arm) => {
    const points = Array.from({ length: 16 }, (_, i) => {
      const s = i / 15
      const a = (arm * Math.PI * 2) / 3 - s * 2.6
      const r = 4 + s * 26
      return `${(100 + Math.cos(a) * r).toFixed(1)} ${(55 + Math.sin(a) * r).toFixed(1)}`
    })
    return `M ${points.join(' L ')}`
  })
  return (
    <g opacity={0.5}>
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 100 55"
        to="360 100 55"
        dur={`${dur}s`}
        repeatCount="indefinite"
      />
      {arms.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="var(--divider)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
    </g>
  )
}

function PoolMachine() {
  const dur = 6
  const coins = [
    { color: BLUE, from: 0, to: 2, radius: 20, begin: 0 },
    { color: PINK, from: 1, to: 0, radius: 13, begin: -2 },
    { color: ORANGE, from: 2, to: 1, radius: 25, begin: -4 },
  ]
  return (
    <>
      <Box x={64} width={72} />
      <Swirl dur={dur} />
      <Ends senders={[BLUE, PINK, ORANGE]} />
      {coins.map(({ color, from, to, radius, begin }) => (
        <Coin
          key={color}
          color={color}
          greyAt={0.22}
          dur={dur}
          begin={begin}
          stops={[
            { x: 12, y: ROWS[from] ?? 55, at: 0.02 },
            ...orbit(radius, Math.PI, Math.PI * 3, 0.18, 0.66),
            { x: 188, y: ROWS[to] ?? 55, at: 0.84 },
            { x: 188, y: ROWS[to] ?? 55, at: 0.92 },
          ]}
        />
      ))}
    </>
  )
}

/** A deposit splits; one part pays someone inside, both leave separately. */
function LedgerMachine() {
  const dur = 7
  const timing = { dur: `${dur}s` }
  return (
    <>
      <Box x={50} width={100} />
      <Ends senders={[undefined, TEAL, undefined]} />
      <Coin
        color={TEAL}
        greyAt={0.14}
        dur={dur}
        r={6}
        stops={[
          { x: 12, y: 55, at: 0.02 },
          { x: 72, y: 55, at: 0.14 },
          { x: 72, y: 55, at: 0.26 },
        ]}
      />
      <Coin
        color={GREY}
        dur={dur}
        r={4.5}
        stops={[
          { x: 72, y: 55, at: 0.24 },
          { x: 76, y: 36, at: 0.32 },
          { x: 76, y: 36, at: 0.56 },
          { x: 188, y: 28, at: 0.7 },
          { x: 188, y: 28, at: 0.78 },
        ]}
      />
      <Coin
        color={GREY}
        dur={dur}
        r={4.5}
        stops={[
          { x: 72, y: 55, at: 0.24 },
          { x: 76, y: 74, at: 0.32 },
          { x: 76, y: 74, at: 0.36 },
          { x: 126, y: 74, at: 0.48 },
          { x: 126, y: 74, at: 0.74 },
          { x: 188, y: 82, at: 0.88 },
          { x: 188, y: 82, at: 0.96 },
        ]}
      />
      <g opacity={0}>
        <Shown from={0.24} to={0.4} {...timing} />
        <Label x={94} y={57}>
          split
        </Label>
      </g>
      <g opacity={0}>
        <Shown from={0.36} to={0.56} {...timing} />
        <Label x={101} y={88}>
          transfer
        </Label>
      </g>
      <g opacity={0}>
        <Shown from={0.56} to={0.72} {...timing} />
        <Label x={100} y={23}>
          partial withdrawal
        </Label>
      </g>
    </>
  )
}

/** A proof from one of the members gets in; the service cannot tell whose. */
function AccessMachine() {
  const dur = DUR
  const timing = { dur: `${dur}s` }
  const members = [
    { x: 22, y: 38, color: BLUE },
    { x: 46, y: 38, color: PINK },
    { x: 22, y: 72, color: TEAL },
    { x: 46, y: 72, color: ORANGE },
  ]
  return (
    <>
      <rect
        x={8}
        y={20}
        width={52}
        height={70}
        rx={12}
        fill="none"
        stroke="var(--divider)"
        strokeDasharray="4 3"
      />
      {members.map((m) => (
        <circle key={m.color} cx={m.x} cy={m.y} r={7} fill={m.color}>
          <animate
            attributeName="r"
            values="7;8.5;7;7"
            keyTimes="0;0.08;0.16;1"
            repeatCount="indefinite"
            {...timing}
          />
        </circle>
      ))}
      <Label x={34} y={104}>
        members
      </Label>
      <rect
        x={150}
        y={34}
        width={42}
        height={42}
        rx={8}
        fill="var(--surface-secondary)"
        stroke="var(--divider)"
      />
      <rect
        x={150}
        y={34}
        width={42}
        height={42}
        rx={8}
        fill="none"
        stroke="#22c55e"
        strokeWidth={2}
        opacity={0}
      >
        <Shown from={0.7} to={0.98} {...timing} />
      </rect>
      <Label x={171} y={104}>
        service
      </Label>
      <g opacity={0}>
        <Shown from={0.72} to={0.98} {...timing} />
        <Label x={171} y={26}>
          one of 4 ✓
        </Label>
      </g>
      <g opacity={0}>
        <Shown from={0.12} to={0.72} {...timing} />
        <animateMotion
          path="M 62 55 L 171 55"
          keyPoints="0;0;1;1"
          keyTimes="0;0.16;0.7;1"
          calcMode="spline"
          keySplines="0 0 1 1;0.45 0 0.55 1;0 0 1 1"
          repeatCount="indefinite"
          {...timing}
        />
        <circle r={8} fill="var(--brand)" />
        <path
          d="M -3.5 0 L -1 2.5 L 3.5 -2.5"
          fill="none"
          stroke="white"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text y={-13} textAnchor="middle" fontSize={7} fill={GREY}>
          proof
        </text>
      </g>
    </>
  )
}

/** Each payment lands on a fresh address; none points to the recipient. */
function StealthMachine() {
  const dur = DUR * 1.5
  const timing = { dur: `${dur}s` }
  const payments = [
    { color: BLUE, y: 28, address: '0x7a…', start: 0 },
    { color: PINK, y: 55, address: '0x3f…', start: 1 / 3 },
    { color: ORANGE, y: 82, address: '0xc1…', start: 2 / 3 },
  ]
  return (
    <>
      {payments.map(({ color, y, address, start }) => {
        const land = start + 0.18
        return (
          <g key={address}>
            <circle cx={12} cy={y} r={5} fill={color} />
            <g opacity={0}>
              <Shown from={land} to={0.98} {...timing} />
              <rect
                x={106}
                y={y - 8}
                width={36}
                height={16}
                rx={4}
                fill="var(--surface-secondary)"
                stroke="var(--divider)"
              />
              <text x={124} y={y + 3} textAnchor="middle" fontSize={7}>
                <tspan fill={GREY}>{address}</tspan>
              </text>
              <line
                x1={144}
                y1={y}
                x2={174}
                y2={55}
                stroke="var(--divider)"
                strokeDasharray="2 3"
              />
            </g>
            <Coin
              color={color}
              dur={dur}
              stops={[
                { x: 12, y, at: start + 0.001 },
                { x: 100, y, at: land },
              ]}
            />
          </g>
        )
      })}
      <circle cx={184} cy={55} r={9} fill={VIOLET} />
      <text
        x={184}
        y={58}
        textAnchor="middle"
        fontSize={9}
        fontWeight={700}
        fill="white"
      >
        ?
      </text>
      <Label x={4} y={104} anchor="start">
        payers
      </Label>
      <Label x={124} y={104}>
        fresh addresses
      </Label>
      <Label x={196} y={104} anchor="end">
        whose?
      </Label>
    </>
  )
}

function ConfidentialMachine() {
  return (
    <>
      <circle cx={22} cy={62} r={9} fill={BLUE} />
      <circle cx={178} cy={62} r={9} fill={ORANGE} />
      <text x={22} y={86} textAnchor="middle" fontSize={8} fill={GREY}>
        ••• ETH
      </text>
      <text x={178} y={86} textAnchor="middle" fontSize={8} fill={GREY}>
        ••• ETH
      </text>
      <line
        x1={34}
        y1={62}
        x2={166}
        y2={62}
        stroke="var(--divider)"
        strokeDasharray="3 4"
      />
      <g>
        <animateMotion
          path="M 34 62 L 166 62"
          dur={`${DUR * 0.8}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1"
          keyTimes="0;1"
        />
        <circle r={5} fill={BLUE} />
        <rect
          x={-22}
          y={-26}
          width={44}
          height={14}
          rx={7}
          fill="var(--brand)"
          opacity={0.15}
        />
        <text
          y={-16}
          textAnchor="middle"
          fontSize={8}
          fontWeight={700}
          fill="var(--brand)"
        >
          <animate
            attributeName="opacity"
            values="1;0.35;1"
            dur="0.6s"
            repeatCount="indefinite"
          />
          ▒▒▒ ETH
        </text>
      </g>
      <Label x={22} y={104}>
        sender
      </Label>
      <Label x={178} y={104}>
        recipient
      </Label>
    </>
  )
}
