import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { PizzaRosetteIcon } from '~/components/rosette/pizza/PizzaRosetteIcon'
import {
  RosetteTooltipContextProvider,
  useRosetteTooltipContext,
} from '~/components/rosette/RosetteTooltipContext'
import type { RosetteValue } from '~/components/rosette/types'
import { SentimentText } from '~/components/SentimentText'
import { useAnimationFrame } from '~/hooks/useAnimationFrame'
import { useElementSize } from '~/hooks/useElementSize'
import { useThemeTokens } from '~/hooks/useThemeTokens'
import { cn } from '~/utils/cn'
import { prepareCanvas } from '~/utils/prepareCanvas'
import { PRIVACY_ADVERSARY_VERDICT } from '../../adversaries/privacyAdversaryUi'
import { PrivacySentimentDot } from '../../PrivacySentimentDot'
import { FigureProgress } from './FigureProgress'
import { type FigureData, MethodologyFigure } from './MethodologyFigure'
import {
  createPoolScene,
  drawPoolScene,
  estimateCaughtShare,
  type Lens,
  type PoolDesign,
  type PoolScene,
  stepPoolScene,
} from './poolLensScene'
import { getPoolVerdicts } from './poolVerdicts'
import { useFigureAutoplay } from './useFigureAutoplay'

const INTERVAL_MS = 9000
/** How long a view is watched before its verdict shows. */
const REVEAL_MS = 2800

const INITIAL_DESIGN: PoolDesign = {
  namesDeposit: false,
  traffic: 0.38,
  publicRpc: false,
  viewingKeys: true,
  ellipticCurves: true,
}

export function PoolLensFigure({ data }: { data: FigureData }) {
  return (
    <MethodologyFigure caption="A made-up pool, running live. Coins enter in their sender's colour; grey means this adversary cannot tell whose a coin is. Pick an adversary, then change the part of the pool's design it depends on: its verdict follows from what the pool then shows.">
      <RosetteTooltipContextProvider>
        <PoolLens data={data} />
      </RosetteTooltipContextProvider>
    </MethodologyFigure>
  )
}

const caughtShares = new Map<number, number>()

/** Same traffic, same answer: the estimate is a random run. */
function cachedCaughtShare(traffic: number) {
  const key = Math.round(traffic * 50) / 50
  let share = caughtShares.get(key)
  if (share === undefined) {
    share = estimateCaughtShare(key)
    caughtShares.set(key, share)
  }
  return share
}

function PoolLens({ data }: { data: FigureData }) {
  const { step, pick, playing, animate, reducedMotion, containerProps } =
    useFigureAutoplay(data.adversaries.length, INTERVAL_MS)
  const adversary = data.adversaries[step] ?? data.adversaries[0]
  const lens = adversary?.id

  const [design, setDesign] = useState(INITIAL_DESIGN)
  const sceneRef = useRef<PoolScene>(undefined)
  const scene = () => {
    sceneRef.current ??= createPoolScene(design)
    return sceneRef.current
  }

  const caughtShare = useMemo(
    () => cachedCaughtShare(design.traffic),
    [design.traffic],
  )
  const verdicts = getPoolVerdicts(design, caughtShare)

  // A verdict is the conclusion of watching a view, so it shows only after
  // the reader has seen the pool through those eyes for a moment.
  const [seen, setSeen] = useState<ReadonlySet<Lens>>(() => new Set())
  useEffect(() => {
    if (!lens || seen.has(lens) || (!animate && !reducedMotion)) return
    const timeout = setTimeout(
      () => setSeen((current) => new Set(current).add(lens)),
      reducedMotion ? 0 : REVEAL_MS,
    )
    return () => clearTimeout(timeout)
  }, [lens, seen, animate, reducedMotion])
  const shown = (id: Lens) =>
    seen.has(id) ? verdicts[id].sentiment : undefined

  if (!adversary) return null
  const verdict = verdicts[adversary.id]
  const sentiment = shown(adversary.id)

  const change = (next: Partial<PoolDesign>) => {
    pick(step)
    setDesign((current) => ({ ...current, ...next }))
  }

  return (
    <div {...containerProps}>
      <div role="tablist" className="flex flex-wrap gap-1.5">
        {data.adversaries.map(({ id, label }, i) => {
          const tabSentiment = shown(id)
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={i === step}
              onClick={() => pick(i)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1.5 font-semibold text-label-value-13 transition-colors',
                i === step
                  ? 'border-brand bg-brand text-primary-invert'
                  : 'border-divider bg-surface-primary text-secondary hover:border-brand/50 hover:text-primary',
              )}
            >
              {tabSentiment ? (
                <PrivacySentimentDot
                  key={tabSentiment}
                  sentiment={tabSentiment}
                  className="motion-safe:zoom-in-0 size-4 motion-safe:animate-in"
                />
              ) : (
                <span
                  aria-hidden
                  className={cn(
                    'size-4 rounded-full border-2 border-dashed',
                    i === step ? 'border-primary-invert/70' : 'border-divider',
                  )}
                />
              )}
              {label}
            </button>
          )
        })}
      </div>
      <FigureProgress
        steps={data.adversaries.length}
        step={step}
        playing={playing}
        intervalMs={INTERVAL_MS}
        className="mt-3"
      />
      <DesignControl lens={adversary.id} design={design} onChange={change}>
        {verdict.inheritedFrom && seen.has(adversary.id) && (
          <InheritedNote
            label={adversary.label}
            from={
              data.adversaries.find((a) => a.id === verdict.inheritedFrom)
                ?.label ?? ''
            }
            sentiment={verdict.sentiment}
            onGo={() =>
              pick(
                data.adversaries.findIndex(
                  (a) => a.id === verdict.inheritedFrom,
                ),
              )
            }
          />
        )}
      </DesignControl>
      <PoolCanvas
        lens={adversary.id}
        design={design}
        scene={scene}
        running={animate}
      />
      <div className="mt-3 flex items-center gap-4">
        <div
          key={adversary.id}
          className="motion-safe:fade-in motion-safe:slide-in-from-bottom-1 min-w-0 flex-1 motion-safe:animate-in motion-safe:duration-300"
        >
          <p className="flex flex-wrap items-baseline gap-x-2 font-bold text-label-value-16">
            {adversary.label} sees
            {sentiment ? (
              <SentimentText
                key={sentiment}
                sentiment={sentiment}
                vibrant
                className="motion-safe:fade-in font-bold text-label-value-14 motion-safe:animate-in"
              >
                {`→ ${PRIVACY_ADVERSARY_VERDICT[sentiment]}`}
              </SentimentText>
            ) : (
              <span className="font-medium text-label-value-14 text-secondary motion-safe:animate-pulse">
                watching…
              </span>
            )}
          </p>
          <p
            className={cn(
              'mt-1 text-paragraph-14 transition-opacity duration-500',
              !seen.has(adversary.id) && 'opacity-0',
            )}
          >
            {verdict.sees}
          </p>
          <p className="mt-1 text-paragraph-13 text-secondary">
            {adversary.label} {adversary.text}
          </p>
        </div>
        <VerdictRosette data={data} shown={shown} selected={adversary.label} />
      </div>
    </div>
  )
}

/** The one design choice the current adversary's verdict depends on. */
function DesignControl({
  lens,
  design,
  onChange,
  children,
}: {
  lens: Lens
  design: PoolDesign
  onChange: (next: Partial<PoolDesign>) => void
  children?: ReactNode
}) {
  let control: ReactNode
  switch (lens) {
    case 'publicObserver':
      control = (
        <Choice
          label="Withdrawals name their deposit"
          value={design.namesDeposit}
          options={[
            [false, 'No'],
            [true, 'Yes'],
          ]}
          onChange={(namesDeposit) => onChange({ namesDeposit })}
        />
      )
      break
    case 'chainAnalyst':
      control = (
        <label className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold text-label-value-13">
            Pool traffic
          </span>
          <span className="flex min-w-48 flex-1 items-center gap-2 text-label-value-12 text-secondary">
            Quiet
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={design.traffic}
              onChange={(e) => onChange({ traffic: Number(e.target.value) })}
              className="flex-1 accent-brand"
            />
            Busy
          </span>
        </label>
      )
      break
    case 'networkObserver':
      control = (
        <Choice
          label="The client connects through"
          value={design.publicRpc}
          options={[
            [false, 'Tor and a relayer'],
            [true, 'A public RPC, from home'],
          ]}
          onChange={(publicRpc) => onChange({ publicRpc })}
        />
      )
      break
    case 'privilegedInsider':
      control = (
        <Choice
          label="The operator holds viewing keys"
          value={design.viewingKeys}
          options={[
            [false, 'No'],
            [true, 'Yes'],
          ]}
          onChange={(viewingKeys) => onChange({ viewingKeys })}
        />
      )
      break
    case 'futureAdversary':
      control = (
        <Choice
          label="Notes are protected by"
          value={design.ellipticCurves}
          options={[
            [false, 'Post-quantum crypto'],
            [true, 'Elliptic curves'],
          ]}
          onChange={(ellipticCurves) => onChange({ ellipticCurves })}
        />
      )
      break
  }
  return (
    <div
      key={lens}
      className="motion-safe:fade-in mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-brand/40 border-dashed bg-brand/5 px-3 py-2 motion-safe:animate-in"
    >
      <span className="font-bold text-brand text-label-value-12 uppercase">
        Pool design
      </span>
      {control}
      {children}
    </div>
  )
}

/** Why a verdict is worse than its own setting would make it. */
function InheritedNote({
  label,
  from,
  sentiment,
  onGo,
}: {
  label: string
  from: string
  sentiment: PrivacyAdversarySentiment
  onGo: () => void
}) {
  return (
    <p className="basis-full text-label-value-13 text-secondary">
      <SentimentText sentiment={sentiment} vibrant className="font-bold">
        {`${PRIVACY_ADVERSARY_VERDICT[sentiment]} anyway:`}
      </SentimentText>{' '}
      the {label.toLowerCase()} sees everything the {from.toLowerCase()} sees.{' '}
      <button
        type="button"
        onClick={onGo}
        className="font-semibold text-brand underline underline-offset-2"
      >
        Look at the {from.toLowerCase()} →
      </button>
    </p>
  )
}

function Choice<T extends boolean>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: [T, string][]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="font-semibold text-label-value-13">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1">
        {options.map(([option, text]) => (
          <button
            key={text}
            type="button"
            role="radio"
            aria-checked={option === value}
            onClick={() => onChange(option)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 font-semibold text-label-value-12 transition-colors',
              option === value
                ? 'border-brand bg-brand text-primary-invert'
                : 'border-divider bg-surface-primary text-secondary hover:border-brand/50',
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

function PoolCanvas({
  lens,
  design,
  scene,
  running,
}: {
  lens: Lens
  design: PoolDesign
  scene: () => PoolScene
  running: boolean
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lensChange = useRef({ lens, at: 0 })
  const size = useElementSize(boxRef)
  const tokens = useThemeTokens()

  if (lensChange.current.lens !== lens) {
    lensChange.current = { lens, at: scene().time }
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    const ctx = prepareCanvas(canvas, size.width, size.height)
    if (!ctx) return
    drawPoolScene(ctx, scene(), {
      width: size.width,
      height: size.height,
      lens,
      lensAge: running ? scene().time - lensChange.current.at : 1,
      tokens,
      design,
    })
  }

  useAnimationFrame((dt) => {
    stepPoolScene(scene(), dt, design)
    draw()
  }, running)

  // A still frame when paused, reduced motion or off screen.
  // biome-ignore lint/correctness/useExhaustiveDependencies: redraw on any input change
  useEffect(() => {
    if (!running) draw()
  }, [running, lens, size, tokens, design])

  return (
    <div ref={boxRef} className="relative mt-3 h-[300px] w-full sm:h-[320px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full"
        role="img"
        aria-label="A live pool: senders deposit coins, which wait inside and leave to fresh addresses."
      />
    </div>
  )
}

/** The rosette of this made-up pool, filling in as the reader watches. */
function VerdictRosette({
  data,
  shown,
  selected,
}: {
  data: FigureData
  shown: (id: Lens) => PrivacyAdversarySentiment | undefined
  selected: string
}) {
  const rosette = useRosetteTooltipContext()
  const setSelected = rosette?.setSelectedRisk
  const key = data.adversaries.map(({ id }) => shown(id) ?? '-').join()
  // biome-ignore lint/correctness/useExhaustiveDependencies: `key` stands for the shown verdicts
  const values: RosetteValue[] = useMemo(
    () =>
      data.adversaries.map(({ id, label }) => {
        const sentiment = shown(id)
        return {
          name: label,
          value: sentiment
            ? PRIVACY_ADVERSARY_VERDICT[sentiment]
            : 'Not watched yet',
          sentiment: sentiment ?? 'neutral',
        }
      }),
    [data, key],
  )
  const value = values.find((v) => v.name === selected)

  // The rosette clears its selection on scroll; keep the current adversary.
  const current = rosette?.selectedRisk
  useEffect(() => {
    if (current !== value) setSelected?.(value)
  }, [current, value, setSelected])

  return (
    <PizzaRosetteIcon
      values={values}
      className="hidden size-20 shrink-0 sm:block"
      background={false}
      disableSectionLinking
    />
  )
}
