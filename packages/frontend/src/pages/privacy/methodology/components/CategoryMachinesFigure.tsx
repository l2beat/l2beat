import type { PrivacyField } from '@l2beat/config'
import { type ReactNode, useEffect, useRef } from 'react'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
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
      <div ref={ref} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MACHINES.map(({ category, hides, scene }) => {
          const { label, description } = byId(data.categories, category)
          return (
            <div
              key={category}
              className="flex flex-col rounded-lg border border-divider bg-surface-primary p-3"
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
    <svg ref={ref} viewBox="0 0 200 110" className="my-2 w-full" aria-hidden>
      {children}
    </svg>
  )
}

/** A coin that follows `path`, in `color` until `hideAt` (0..1), grey after. */
function Coin({
  path,
  color,
  hideAt,
  begin = 0,
  dur = DUR,
  r = 5,
}: {
  path: string
  color: string
  hideAt: number
  begin?: number
  dur?: number
  r?: number
}) {
  const times = `0;${hideAt};${Math.min(hideAt + 0.04, 1)};1`
  const fade = (values: string) => (
    <animate
      attributeName="opacity"
      values={values}
      keyTimes={times}
      dur={`${dur}s`}
      begin={`${begin}s`}
      repeatCount="indefinite"
    />
  )
  return (
    <g>
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.45 0 0.55 1"
        keyTimes="0;1"
      />
      <circle r={r} fill={color} opacity={0}>
        {fade('1;1;0;0')}
      </circle>
      <circle r={r} fill={GREY} opacity={0}>
        {fade('0;0;1;1')}
      </circle>
    </g>
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

function PoolMachine() {
  const loop = 'A 14 14 0 1 1 114 55 A 14 14 0 1 1 86 55'
  return (
    <>
      <Box x={66} width={68} />
      <Coin
        path={`M 8 28 L 86 55 ${loop} L 192 82`}
        color={BLUE}
        hideAt={0.3}
      />
      <Coin
        path={`M 8 55 L 86 55 ${loop} L 192 28`}
        color={PINK}
        hideAt={0.3}
        begin={-1.5}
      />
      <Coin
        path={`M 8 82 L 86 55 ${loop} L 192 55`}
        color={ORANGE}
        hideAt={0.3}
        begin={-3}
      />
    </>
  )
}

function LedgerMachine() {
  const nodes = [
    { x: 82, y: 36 },
    { x: 118, y: 36 },
    { x: 100, y: 76 },
  ]
  return (
    <>
      <Box x={58} width={84} />
      {nodes.map((n) => (
        <circle
          key={`${n.x}-${n.y}`}
          cx={n.x}
          cy={n.y}
          r={9}
          fill="none"
          stroke="var(--divider)"
          strokeWidth={2}
        />
      ))}
      <Coin
        path="M 8 30 L 82 36 L 100 76 L 118 36 L 192 70"
        color={TEAL}
        hideAt={0.25}
        dur={5}
      />
      <Coin
        path="M 8 80 L 100 76 L 82 36 L 118 36 L 192 30"
        color={VIOLET}
        hideAt={0.25}
        dur={5}
        begin={-2.5}
      />
    </>
  )
}

function AccessMachine() {
  const members = [
    { x: 22, y: 34, color: BLUE },
    { x: 46, y: 34, color: PINK },
    { x: 22, y: 76, color: TEAL },
    { x: 46, y: 76, color: ORANGE },
  ]
  return (
    <>
      <rect
        x={8}
        y={18}
        width={52}
        height={74}
        rx={12}
        fill="none"
        stroke="var(--divider)"
        strokeDasharray="4 3"
      />
      {members.map((m) => (
        <circle key={m.color} cx={m.x} cy={m.y} r={7} fill={m.color}>
          <animate
            attributeName="r"
            values="7;8.5;7"
            dur={`${DUR}s`}
            keyTimes="0;0.15;0.3"
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <rect x={124} y={14} width={5} height={30} rx={2} fill="var(--divider)">
        <animate
          attributeName="fill"
          values="var(--divider);var(--divider);#22c55e;var(--divider)"
          keyTimes="0;0.5;0.6;1"
          dur={`${DUR}s`}
          repeatCount="indefinite"
        />
      </rect>
      <rect x={124} y={66} width={5} height={30} rx={2} fill="var(--divider)">
        <animate
          attributeName="fill"
          values="var(--divider);var(--divider);#22c55e;var(--divider)"
          keyTimes="0;0.5;0.6;1"
          dur={`${DUR}s`}
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x={158}
        y={34}
        width={36}
        height={42}
        rx={8}
        fill="var(--surface-secondary)"
        stroke="var(--divider)"
      />
      <g>
        <animateMotion
          path="M 62 55 L 176 55"
          dur={`${DUR}s`}
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1"
          keyTimes="0;1"
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
      </g>
    </>
  )
}

function StealthMachine() {
  const slots = [26, 55, 84]
  const dur = DUR * 1.5
  return (
    <>
      <circle cx={16} cy={55} r={8} fill={VIOLET} />
      <rect
        x={150}
        y={10}
        width={44}
        height={90}
        rx={10}
        fill="none"
        stroke="var(--divider)"
        strokeDasharray="4 3"
      />
      <text x={172} y={106} textAnchor="middle" fontSize={8} fill={GREY}>
        whose?
      </text>
      {slots.map((y, i) => {
        const start = i / 3
        const land = start + 0.18
        return (
          <g key={y}>
            <rect
              x={162}
              y={y - 8}
              width={20}
              height={16}
              rx={4}
              fill="var(--surface-secondary)"
              stroke={GREY}
              opacity={0}
            >
              <animate
                attributeName="opacity"
                values="0;0;1;1;0"
                keyTimes={`0;${land};${land + 0.02};0.97;1`}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
            </rect>
            <g opacity={0}>
              <animate
                attributeName="opacity"
                values="0;1;1;0;0"
                keyTimes={`0;${start + 0.001};${land};${land + 0.001};1`}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
              <animateMotion
                path={`M 24 55 L 172 ${y}`}
                dur={`${dur}s`}
                repeatCount="indefinite"
                keyPoints="0;0;1;1"
                keyTimes={`0;${start};${land};1`}
                calcMode="linear"
              />
              <circle r={5} fill={VIOLET} />
            </g>
          </g>
        )
      })}
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
    </>
  )
}
