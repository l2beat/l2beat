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
  crowdSize,
  drawCrowdScene,
  hasDeposit,
  isShowingMine,
  stepCrowdScene,
  withdrawMine,
} from './crowdScene'
import { MethodologyFigure } from './MethodologyFigure'
import { useFigureAutoplay } from './useFigureAutoplay'

/** Deposits per second, from a quiet pool to a busy one. */
function toRate(traffic: number) {
  return 0.1 + traffic * 7
}

const BUSY = 0.85
const QUIET = 0
const LOOP_S = 13
/** The autoplay loop as [seconds, traffic] keyframes; it starts busy. */
const AUTOPLAY: [number, number][] = [
  [3, BUSY],
  [4.5, QUIET],
  // Long enough for the crowd to drain out of view and a withdrawal to stand
  // alone.
  [11.5, QUIET],
  [LOOP_S, BUSY],
]

function autoTraffic(time: number) {
  const t = time % LOOP_S
  let [t0, v0] = [0, BUSY]
  for (const [t1, v1] of AUTOPLAY) {
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0)
      return v0 + (v1 - v0) * (0.5 - 0.5 * Math.cos(Math.PI * k))
    }
    t0 = t1
    v0 = v1
  }
  return BUSY
}

export function CrowdFigure() {
  const { pick, playing, animate, containerProps } = useFigureAutoplay(1, 1000)
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<CrowdScene>(undefined)
  const size = useElementSize(boxRef)
  const tokens = useThemeTokens()

  const [traffic, setTraffic] = useState(BUSY)
  const trafficRef = useRef(traffic)
  trafficRef.current = traffic
  const [crowd, setCrowd] = useState(0)
  const [lost, setLost] = useState(false)
  const [mine, setMine] = useState<number>()
  const [result, setResult] = useState<number>()

  const scene = () => {
    sceneRef.current ??= createCrowdScene(toRate(trafficRef.current))
    return sceneRef.current
  }

  const sync = () => {
    setCrowd(crowdSize(scene()))
    if (result !== undefined && !isShowingMine(scene())) setResult(undefined)
    if (mine !== undefined && !hasDeposit(scene(), mine)) {
      setMine(undefined)
      setLost(true)
    }
  }
  useInterval(sync, animate ? 250 : null)

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0) return
    const ctx = prepareCanvas(canvas, size.width, size.height)
    if (ctx) drawCrowdScene(ctx, scene(), { ...size, tokens })
  }
  // Until the reader takes over, the pool goes quiet and busy by itself.
  const clock = useRef(0)
  useAnimationFrame((dt) => {
    if (playing) {
      clock.current += dt
      trafficRef.current = autoTraffic(clock.current)
      setTraffic(trafficRef.current)
    }
    stepCrowdScene(scene(), dt, toRate(trafficRef.current))
    draw()
  }, animate)
  // Without animation the frame is still, so every input redraws it and
  // refreshes the count.
  // biome-ignore lint/correctness/useExhaustiveDependencies: redraw on any input change
  useEffect(() => {
    if (animate) return
    draw()
    sync()
  }, [animate, size, tokens, traffic, mine, result])

  const shown = result ?? crowd
  const linked = shown <= 1

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
                : shown === 0
                  ? 'No deposits to hide among'
                  : 'A withdrawal now would hide among'}
            </p>
            <p
              className={cn(
                'mt-1 font-bold text-[40px] tabular-nums leading-none transition-colors',
                linked ? 'text-negative' : 'text-brand',
              )}
            >
              {shown}
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
              step="any"
              value={traffic}
              onChange={(e) => {
                pick(0)
                const next = Number(e.target.value)
                // A still frame jumps to how the pool looks at that traffic.
                if (!animate) {
                  sceneRef.current = createCrowdScene(toRate(next))
                  setMine(undefined)
                  setResult(undefined)
                }
                setTraffic(next)
              }}
              className="mt-1 w-full accent-brand"
              aria-label="Pool traffic"
            />
          </label>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <button
              type="button"
              onClick={() => {
                if (mine === undefined) {
                  setResult(undefined)
                  setLost(false)
                  setMine(addDeposit(scene(), true))
                } else {
                  setResult(withdrawMine(scene(), mine))
                  setMine(undefined)
                }
              }}
              className="rounded-full bg-brand px-4 py-2 font-bold text-label-value-14 text-primary-invert transition-transform hover:scale-[1.03] active:scale-95"
            >
              {mine === undefined ? 'Make a deposit' : 'Withdraw it'}
            </button>
            {lost && (
              <span className="text-label-value-12 text-secondary">
                Your deposit drifted out of view. Make another.
              </span>
            )}
          </div>
        </div>
      </div>
    </MethodologyFigure>
  )
}
