import type { PrivacyField } from '@l2beat/config'
import { type ReactNode, useEffect, useRef } from 'react'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { PrivacyMethodologyFigureData } from '../getPrivacyMethodologyFigureData'
import { MethodologyFigure } from './MethodologyFigure'
import { OWNER_COLORS } from './poolLensScene'

type CategoryId = PrivacyMethodologyFigureData['categories'][number]['id']

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
  /** A ballot is not one of the fields a transfer has. */
  hides: PrivacyField | 'vote'
  scene: ReactNode
  /** The frame shown under reduced motion, in seconds into the loop. */
  still: number
}[] = [
  // Three identical sealed envelopes
  { category: 'pool', hides: 'linkage', scene: <PoolMachine />, still: 2.7 },
  // Mid transfer, after the split
  {
    category: 'shieldedLedger',
    hides: 'linkage',
    scene: <LedgerMachine />,
    still: 3.2,
  },
  // The service has accepted "one of 4"
  {
    category: 'anonymousAccess',
    hides: 'linkage',
    scene: <AccessMachine />,
    still: 3.6,
  },
  // Every payment on its own fresh address
  {
    category: 'stealthAddress',
    hides: 'recipient',
    scene: <StealthMachine />,
    still: 6.3,
  },
  // The amount on its way, scrambled
  {
    category: 'confidentialAmounts',
    hides: 'amount',
    scene: <ConfidentialMachine />,
    still: 1.8,
  },
  // Only the tally is out
  {
    category: 'secretBallot',
    hides: 'vote',
    scene: <BallotMachine />,
    still: 3.6,
  },
]

export function CategoryMachinesFigure({
  data,
}: {
  data: PrivacyMethodologyFigureData
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(ref)
  const reducedMotion = usePrefersReducedMotion()
  const running = onScreen && !reducedMotion
  return (
    <MethodologyFigure>
      <div ref={ref} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MACHINES.map(({ category, hides, scene, still }) => {
          const { label, description } = byId(data.categories, category)
          return (
            <div
              key={category}
              className="flex flex-col rounded-lg border border-divider bg-surface-primary p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <span className="font-bold text-label-value-14">{label}</span>
                <span className="whitespace-nowrap rounded-full bg-brand/10 px-2 py-0.5 font-semibold text-brand text-label-value-12">
                  hides the{' '}
                  {hides === 'vote'
                    ? 'vote'
                    : byId(data.fields, hides).label.toLowerCase()}
                </span>
              </div>
              <LiveSvg
                running={running}
                still={reducedMotion ? still : undefined}
              >
                {scene}
              </LiveSvg>
              <p className="text-paragraph-12 text-secondary">{description}</p>
            </div>
          )
        })}
      </div>
    </MethodologyFigure>
  )
}

function byId<T extends { id: string }>(items: T[], id: T['id']): T {
  const item = items.find((i) => i.id === id)
  if (!item) throw new Error('Unknown figure item', { cause: { id } })
  return item
}

/**
 * SMIL keeps the loops off the main thread; paused off screen. Under reduced
 * motion it holds the `still` frame, as the start of most loops is empty.
 */
function LiveSvg({
  running,
  still,
  children,
}: {
  running: boolean
  still?: number
  children: ReactNode
}) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current
    if (running) svg?.unpauseAnimations()
    else svg?.pauseAnimations()
    if (still !== undefined) svg?.setCurrentTime(still)
  }, [running, still])
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

/**
 * Each deposit is sealed in an identical envelope; the sealed envelopes swap
 * places; each withdrawal opens one and leaves to someone else.
 */
function PoolMachine() {
  const dur = 7
  // Four slots in the pool, two by two.
  const a = { x: 86, y: 40 }
  const b = { x: 114, y: 40 }
  const c = { x: 86, y: 72 }
  const d = { x: 114, y: 72 }
  const deposits = [
    { color: BLUE, row: 0, slot: a, arrive: 0.16 },
    { color: PINK, row: 1, slot: b, arrive: 0.24 },
    { color: ORANGE, row: 2, slot: c, arrive: 0.32 },
  ]
  const withdrawals = [
    { from: b, row: 1, at: 0.7 },
    { from: d, row: 2, at: 0.74 },
    { from: c, row: 0, at: 0.82 },
  ]
  return (
    <>
      <Box x={64} width={72} />
      <Ends senders={[BLUE, PINK, ORANGE]} />
      {deposits.map(({ color, row, slot, arrive }) => (
        <Coin
          key={color}
          color={color}
          dur={dur}
          stops={[
            { x: 12, y: ROWS[row] ?? 55, at: arrive - 0.14 },
            { ...slot, at: arrive },
          ]}
        />
      ))}
      <Envelope
        dur={dur}
        shown={[0.04, 0.84]}
        sealed={[0.17, 0.72]}
        stops={[
          { ...a, at: 0.4 },
          { x: 100, y: 48, at: 0.45 },
          { ...d, at: 0.5 },
        ]}
      />
      <Envelope
        dur={dur}
        shown={[0.12, 0.92]}
        sealed={[0.25, 0.8]}
        stops={[
          { ...b, at: 0.55 },
          { x: 100, y: 48, at: 0.6 },
          { ...c, at: 0.65 },
        ]}
      />
      <Envelope
        dur={dur}
        shown={[0.2, 0.8]}
        sealed={[0.33, 0.68]}
        stops={[
          { ...c, at: 0.55 },
          { x: 100, y: 64, at: 0.6 },
          { ...b, at: 0.65 },
        ]}
      />
      {withdrawals.map(({ from, row, at }) => (
        <Coin
          key={row}
          color={GREY}
          dur={dur}
          stops={[
            { ...from, at },
            { x: 188, y: ROWS[row] ?? 55, at: at + 0.12 },
            { x: 188, y: ROWS[row] ?? 55, at: at + 0.16 },
          ]}
        />
      ))}
    </>
  )
}

/**
 * An envelope that moves through `stops`, shows between `shown` and is sealed
 * between `sealed`, all 0..1 of the loop.
 */
function Envelope({
  stops,
  shown,
  sealed,
  dur,
}: {
  stops: Stop[]
  shown: [number, number]
  sealed: [number, number]
  dur: number
}) {
  const first = stops[0]
  const last = stops[stops.length - 1]
  if (!first || !last) return null
  const frames = [{ ...first, at: 0 }, ...stops, { ...last, at: 1 }]
  const timing = { dur: `${dur}s`, repeatCount: 'indefinite' }
  const [sealAt, openAt] = sealed
  // Closed, flipping open around the top edge while unsealed.
  const flap: [number, string][] = [
    [0, '1 -1'],
    [sealAt, '1 -1'],
    [sealAt + 0.03, '1 1'],
    [openAt, '1 1'],
    [openAt + 0.03, '1 -1'],
    [1, '1 -1'],
  ]
  return (
    <g opacity={0}>
      <Shown from={shown[0]} to={shown[1]} dur={timing.dur} />
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values={frames.map((f) => `${f.x} ${f.y}`).join(';')}
          keyTimes={frames.map((f) => f.at).join(';')}
          calcMode="spline"
          keySplines={frames
            .slice(1)
            .map(() => '0.45 0 0.55 1')
            .join(';')}
          {...timing}
        />
        {/* A line icon, in one even stroke like the site's icons */}
        <rect
          x={-9}
          y={-6}
          width={18}
          height={12}
          rx={2}
          fill="var(--surface-primary)"
          stroke={GREY}
          strokeWidth={1.2}
        />
        <g transform="translate(0 -6)">
          <g>
            <animateTransform
              attributeName="transform"
              type="scale"
              values={flap.map((f) => f[1]).join(';')}
              keyTimes={flap.map((f) => f[0]).join(';')}
              {...timing}
            />
            <path
              d="M -8.4 0.6 L 0 6.6 L 8.4 0.6"
              fill="none"
              stroke={GREY}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        {/* The stamp: the envelope's metadata, always on it */}
        <rect
          x={3.5}
          y={1}
          width={3.4}
          height={3.4}
          rx={0.7}
          fill={GREY}
          opacity={0.35}
        />
      </g>
    </g>
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
        stroke="var(--positive)"
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
      {/* Fades out at the recipient and back in at the sender, so the loop
          never jumps back across the line. */}
      <g opacity={0}>
        <Shown from={0.02} to={0.94} dur={`${DUR * 0.8}s`} />
        <animateMotion
          path="M 34 62 L 166 62"
          dur={`${DUR * 0.8}s`}
          repeatCount="indefinite"
          keyPoints="0;0;1;1"
          keyTimes="0;0.06;0.86;1"
          calcMode="spline"
          keySplines="0 0 1 1;0.45 0 0.55 1;0 0 1 1"
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
            values="1;0.5;1"
            dur="1.4s"
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

/**
 * Voters stay public; each ballot travels sealed into the box, and only the
 * tally comes out.
 */
function BallotMachine() {
  const voters = [BLUE, PINK, ORANGE]
  return (
    <>
      <Box x={78} width={64} />
      {voters.map((color, i) => (
        <circle key={color} cx={12} cy={ROWS[i]} r={5} fill={color} />
      ))}
      {voters.map((color, i) => {
        const begin = i * 0.12
        const y = ROWS[i] ?? 55
        return (
          <g key={color} opacity={0}>
            <animateMotion
              path={`M 20 ${y} L 110 55`}
              keyPoints="0;0;1;1"
              keyTimes={`0;${begin};${begin + 0.3};1`}
              calcMode="spline"
              keySplines="0 0 1 1;0.45 0 0.55 1;0 0 1 1"
              dur={`${DUR}s`}
              repeatCount="indefinite"
            />
            <Shown from={begin} to={begin + 0.32} dur={`${DUR}s`} />
            <rect
              x={-9}
              y={-6}
              width={18}
              height={12}
              rx={2}
              fill="var(--brand)"
              opacity={0.85}
            />
            <text
              y={3}
              textAnchor="middle"
              fontSize={7}
              fontWeight={700}
              fill="var(--primary-invert)"
            >
              ▒▒
            </text>
          </g>
        )
      })}
      <g opacity={0}>
        <Shown from={0.6} to={0.95} dur={`${DUR}s`} />
        <text
          x={180}
          y={48}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          fill="var(--brand)"
        >
          Yes 2
        </text>
        <text
          x={180}
          y={66}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          fill="var(--brand)"
        >
          No 1
        </text>
      </g>
      <Label x={4} y={104} anchor="start">
        voters
      </Label>
      <Label x={110} y={104}>
        sealed ballots
      </Label>
      <Label x={196} y={104} anchor="end">
        tally
      </Label>
    </>
  )
}
