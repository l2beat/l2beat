import { useEffect, useRef, useState } from 'react'
import { useAnimationFrame } from '~/hooks/useAnimationFrame'
import { useElementSize } from '~/hooks/useElementSize'
import { useInterval } from '~/hooks/useInterval'
import { useThemeTokens } from '~/hooks/useThemeTokens'
import { cn } from '~/utils/cn'
import { prepareCanvas } from '~/utils/prepareCanvas'
import {
  addDeposit,
  type CrowdScene,
  createCrowdScene,
  drawCrowdScene,
  hasDeposit,
  latestSetSize,
  stepCrowdScene,
  withdrawMine,
} from './crowdScene'
import { MethodologyFigure } from './MethodologyFigure'
import { useFigureAutoplay } from './useFigureAutoplay'

/** Deposits per second, from a quiet pool to a busy one. */
function toRate(traffic: number) {
  return 0.08 + traffic * 4.6
}

export function CrowdFigure() {
  const { pick, playing, animate, containerProps } = useFigureAutoplay(1, 1000)
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<CrowdScene>(undefined)
  const size = useElementSize(boxRef)
  const tokens = useThemeTokens()

  const [traffic, setTraffic] = useState(0.5)
  const trafficRef = useRef(traffic)
  trafficRef.current = traffic
  const [setSize, setSetSize] = useState<number>()
  const [mine, setMine] = useState<number>()
  const [result, setResult] = useState<number>()

  const scene = () => {
    sceneRef.current ??= createCrowdScene(toRate(trafficRef.current))
    return sceneRef.current
  }

  // Until the reader takes over, traffic swells and fades by itself.
  const clock = useRef(0)
  useInterval(
    () => {
      clock.current += 0.1
      setTraffic(0.5 - 0.5 * Math.cos(clock.current / 4))
    },
    playing ? 100 : null,
  )

  useInterval(
    () => {
      setSetSize(latestSetSize(scene()))
      if (mine !== undefined && !hasDeposit(scene(), mine)) setMine(undefined)
    },
    animate ? 250 : null,
  )

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    const ctx = prepareCanvas(canvas, size.width, size.height)
    if (ctx) drawCrowdScene(ctx, scene(), { ...size, tokens })
  }
  useAnimationFrame((dt) => {
    stepCrowdScene(scene(), dt, toRate(trafficRef.current))
    draw()
  }, animate)
  // biome-ignore lint/correctness/useExhaustiveDependencies: redraw on any input change
  useEffect(() => {
    if (!animate) draw()
  }, [animate, size, tokens])

  const shown = result ?? setSize
  const linked = shown !== undefined && shown <= 1

  return (
    <MethodologyFigure caption="A live pool. Every withdrawal could have come from any deposit before it, so it fans out to all of them. Turn the traffic down and see how quickly a withdrawal stands alone; make a deposit and withdraw it to see your own crowd.">
      <div {...containerProps}>
        <div ref={boxRef} className="relative h-[240px] w-full">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 size-full"
            role="img"
            aria-label="Deposits scrolling past, with withdrawals fanning out to every deposit before them."
          />
        </div>
        <div className="mt-4 grid items-end gap-4 sm:grid-cols-[auto_1fr_auto]">
          <div className="min-w-40">
            <p className="font-medium text-label-value-13 text-secondary">
              {result !== undefined
                ? 'Your withdrawal hides among'
                : 'Latest withdrawal hides among'}
            </p>
            <p
              className={cn(
                'mt-1 font-bold text-[40px] tabular-nums leading-none transition-colors',
                linked ? 'text-negative' : 'text-brand',
              )}
            >
              {shown ?? '–'}
              <span className="ml-2 font-medium text-label-value-14 text-secondary">
                {shown === 1 ? 'deposit' : 'deposits'}
              </span>
            </p>
          </div>
          <label className="block">
            <span className="flex justify-between font-medium text-label-value-12 text-secondary">
              <span>Quiet pool</span>
              <span>Busy pool</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={traffic}
              onChange={(e) => {
                pick(0)
                setTraffic(Number(e.target.value))
              }}
              className="mt-1 w-full accent-brand"
              aria-label="Pool traffic"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (mine === undefined) {
                setResult(undefined)
                setMine(addDeposit(scene(), true))
              } else {
                setResult(withdrawMine(scene(), mine))
                setMine(undefined)
              }
            }}
            className="rounded-full bg-brand px-4 py-2 font-bold text-label-value-14 text-white transition-transform hover:scale-[1.03] active:scale-95"
          >
            {mine === undefined ? 'Make a deposit' : 'Withdraw it'}
          </button>
        </div>
      </div>
    </MethodologyFigure>
  )
}
