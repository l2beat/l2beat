import type { PrivacyAdversarySentiment } from '@l2beat/config'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  type Lens,
  type PoolScene,
  stepPoolScene,
} from './poolLensScene'
import { useFigureAutoplay } from './useFigureAutoplay'

const INTERVAL_MS = 7000
/** How long a view is watched before its verdict shows. */
const REVEAL_MS = 2800

/** How this made-up pool fares against each adversary, and why. */
const VERDICTS: Record<
  Lens,
  { sentiment: PrivacyAdversarySentiment; sees: string }
> = {
  publicObserver: {
    sentiment: 'good',
    sees: 'Every deposit and every withdrawal, but nothing that ties one to the other.',
  },
  chainAnalyst: {
    sentiment: 'warning',
    sees: 'Timing. When only a coin or two is waiting in the pool, a withdrawal gives its deposit away.',
  },
  networkObserver: {
    sentiment: 'good',
    sees: 'Every request, each leaving through a different Tor exit, so none points back to a sender.',
  },
  privilegedInsider: {
    sentiment: 'bad',
    sees: 'The inside of the pool it runs: every coin keeps its owner, so every withdrawal is linked.',
  },
  futureAdversary: {
    sentiment: 'bad',
    sees: 'The archived pool, years later: once the keys protecting each note break, every link comes out.',
  },
}

export function PoolLensFigure({ data }: { data: FigureData }) {
  return (
    <MethodologyFigure caption="A made-up pool, running live. Coins enter in their sender's colour; grey means this adversary cannot tell whose a coin is. Pick an adversary to see the same pool through its eyes; its verdict shows once you have watched for a moment.">
      <RosetteTooltipContextProvider>
        <PoolLens data={data} />
      </RosetteTooltipContextProvider>
    </MethodologyFigure>
  )
}

function PoolLens({ data }: { data: FigureData }) {
  const { step, pick, playing, animate, reducedMotion, containerProps } =
    useFigureAutoplay(data.adversaries.length, INTERVAL_MS)
  const adversary = data.adversaries[step] ?? data.adversaries[0]
  const lens = adversary?.id

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

  if (!adversary) return null
  const verdict = VERDICTS[adversary.id]
  const revealed = seen.has(adversary.id)

  return (
    <div {...containerProps}>
      <div role="tablist" className="flex flex-wrap gap-1.5">
        {data.adversaries.map(({ id, label }, i) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={i === step}
            onClick={() => pick(i)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1.5 font-semibold text-label-value-13 transition-colors',
              i === step
                ? 'border-brand bg-brand text-white'
                : 'border-divider bg-surface-primary text-secondary hover:border-brand/50 hover:text-primary',
            )}
          >
            {seen.has(id) ? (
              <PrivacySentimentDot
                sentiment={VERDICTS[id].sentiment}
                className="motion-safe:zoom-in-0 size-4 motion-safe:animate-in"
              />
            ) : (
              <span
                aria-hidden
                className={cn(
                  'size-4 rounded-full border-2 border-dashed',
                  i === step ? 'border-white/70' : 'border-divider',
                )}
              />
            )}
            {label}
          </button>
        ))}
      </div>
      <FigureProgress
        steps={data.adversaries.length}
        step={step}
        playing={playing}
        intervalMs={INTERVAL_MS}
        className="mt-3"
      />
      <PoolCanvas lens={adversary.id} running={animate} />
      <div className="mt-3 flex items-center gap-4">
        <div
          key={adversary.id}
          className="motion-safe:fade-in motion-safe:slide-in-from-bottom-1 min-w-0 flex-1 motion-safe:animate-in motion-safe:duration-300"
        >
          <p className="flex flex-wrap items-baseline gap-x-2 font-bold text-label-value-16">
            {adversary.label} sees
            {revealed ? (
              <SentimentText
                sentiment={verdict.sentiment}
                vibrant
                className="motion-safe:fade-in font-bold text-label-value-14 motion-safe:animate-in"
              >
                {`→ ${PRIVACY_ADVERSARY_VERDICT[verdict.sentiment]}`}
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
              !revealed && 'opacity-0',
            )}
          >
            {verdict.sees}
          </p>
          <p className="mt-1 text-paragraph-13 text-secondary">
            {adversary.label} {adversary.text}
          </p>
        </div>
        <VerdictRosette data={data} seen={seen} selected={adversary.label} />
      </div>
    </div>
  )
}

function PoolCanvas({ lens, running }: { lens: Lens; running: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<PoolScene>(undefined)
  const lensChange = useRef({ lens, at: 0 })
  const size = useElementSize(boxRef)
  const tokens = useThemeTokens()

  if (lensChange.current.lens !== lens) {
    lensChange.current = { lens, at: sceneRef.current?.time ?? 0 }
  }

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    sceneRef.current ??= createPoolScene()
    const ctx = prepareCanvas(canvas, size.width, size.height)
    if (!ctx) return
    drawPoolScene(ctx, sceneRef.current, {
      width: size.width,
      height: size.height,
      lens,
      lensAge: running ? sceneRef.current.time - lensChange.current.at : 1,
      tokens,
    })
  }

  useAnimationFrame((dt) => {
    sceneRef.current ??= createPoolScene()
    stepPoolScene(sceneRef.current, dt)
    draw()
  }, running)

  // A still frame when paused, reduced motion or off screen.
  // biome-ignore lint/correctness/useExhaustiveDependencies: redraw on any input change
  useEffect(() => {
    if (!running) draw()
  }, [running, lens, size, tokens])

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
  seen,
  selected,
}: {
  data: FigureData
  seen: ReadonlySet<Lens>
  selected: string
}) {
  const rosette = useRosetteTooltipContext()
  const setSelected = rosette?.setSelectedRisk
  const values: RosetteValue[] = useMemo(
    () =>
      data.adversaries.map(({ id, label }) => {
        const sentiment = seen.has(id) ? VERDICTS[id].sentiment : 'neutral'
        return {
          name: label,
          value: seen.has(id)
            ? PRIVACY_ADVERSARY_VERDICT[VERDICTS[id].sentiment]
            : 'Not watched yet',
          sentiment,
        }
      }),
    [data, seen],
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
