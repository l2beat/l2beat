import { type ReactNode, useEffect, useRef, useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { Activity } from '~/pages/blobs/components/live-blobs/Activity'
import { cn } from '~/utils/cn'

/** Steps shown, as in the table: eleven finished and the one under way */
const STEPS = 12
/** Slots in a step, as on the server */
const SLOTS_PER_STEP = 25

interface Row {
  name: string
  color: string
  buckets: number[]
}

/**
 * Rows chosen to show what can go wrong: the busiest step about to fall off
 * the left (the scale changes as the row slides), a row with gaps, and one
 * that never posted.
 */
const START_ROWS: Row[] = [
  {
    name: 'Steady (Base-like)',
    color: '#0052FF',
    buckets: [38, 41, 36, 44, 40, 39, 42, 37, 43, 40, 41, 12],
  },
  {
    name: 'Busiest step leaving next',
    color: '#E5484D',
    buckets: [60, 9, 12, 8, 11, 10, 7, 12, 9, 11, 10, 4],
  },
  {
    name: 'Bursty with gaps',
    color: '#30A46C',
    buckets: [0, 14, 0, 0, 6, 0, 22, 0, 3, 0, 0, 5],
  },
  {
    name: 'Never posted',
    color: '#8A8F9C',
    buckets: Array(STEPS).fill(0),
  },
]

const SPEEDS = [
  { label: 'Real time (12 s a block)', msPerSlot: 12_000 },
  { label: '10× (1.2 s a block)', msPerSlot: 1_200 },
  { label: '50× (0.24 s a block)', msPerSlot: 240 },
]

const SLOW_MOTION = [1, 0.25, 0.1]

/**
 * The Activity bars of the live Blobs table, alone, with every way their data
 * changes on a button: a batch landing in the step under way, a new step
 * starting, several starting at once, and a played-back stream of blocks.
 * Slow motion stretches every animation on the page, so a slide can be
 * watched frame by frame.
 */
export function ActivityPlaygroundPage(props: AppLayoutProps) {
  const [firstBucket, setFirstBucket] = useState(1000)
  const [rows, setRows] = useState(START_ROWS)
  const [log, setLog] = useState<string[]>([])
  const [speed, setSpeed] = useState<number>()
  const [slot, setSlot] = useState(0)
  const slotRef = useRef(0)
  const [slowMotion, setSlowMotion] = useState(1)
  const [tickEverySecond, setTickEverySecond] = useState(true)
  const [, setTick] = useState(0)

  const note = (entry: string) =>
    setLog((current) =>
      [`${new Date().toISOString().slice(11, 23)}  ${entry}`, ...current].slice(
        0,
        12,
      ),
    )

  const addBlobs = (blobs: number, only?: number) => {
    setRows((current) =>
      current.map((row, i) =>
        only !== undefined && i !== only
          ? row
          : { ...row, buckets: withLast(row.buckets, blobs) },
      ),
    )
    note(
      `+${blobs} blobs to the step under way${only === undefined ? '' : ` of row ${only + 1}`}`,
    )
  }

  const nextSteps = (steps: number, landing = 0) => {
    setFirstBucket((current) => current + steps)
    setRows((current) =>
      current.map((row) => ({
        ...row,
        buckets: withLast(shift(row.buckets, steps), landing),
      })),
    )
    note(
      `${steps} new step${steps > 1 ? 's' : ''}${landing ? `, arriving with +${landing}` : ''}`,
    )
  }

  // A played-back chain: a block a tick, a batch now and then, a new step
  // every 25 blocks, the way the live table sees them
  // biome-ignore lint/correctness/useExhaustiveDependencies: the helpers only set state
  useEffect(() => {
    if (speed === undefined) return
    const timer = setInterval(() => {
      slotRef.current++
      setSlot(slotRef.current)
      const landing =
        Math.random() < 0.4 ? 1 + Math.floor(Math.random() * 6) : 0
      if (slotRef.current % SLOTS_PER_STEP === 0) nextSteps(1, landing)
      else if (landing) addBlobs(landing, Math.floor(Math.random() * 3))
    }, speed)
    return () => clearInterval(timer)
  }, [speed])

  // The live table renders every second for its "Last batch" clock; so can this
  useEffect(() => {
    if (!tickEverySecond) return
    const timer = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(timer)
  }, [tickEverySecond])

  // Slows every animation and transition on the page, those of the bars too
  useEffect(() => {
    if (slowMotion === 1) {
      for (const animation of document.getAnimations())
        animation.playbackRate = 1
      return
    }
    let frame = requestAnimationFrame(function slow() {
      for (const animation of document.getAnimations()) {
        if (animation.playbackRate !== slowMotion)
          animation.playbackRate = slowMotion
      }
      frame = requestAnimationFrame(slow)
    })
    return () => cancelAnimationFrame(frame)
  }, [slowMotion])

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Activity Playground</MainPageHeader>
        <PrimaryCard className="mt-6 space-y-6">
          <Controls title="Step under way">
            {[1, 3, 6].map((blobs) => (
              <Button key={blobs} onClick={() => addBlobs(blobs)}>
                +{blobs} to every row
              </Button>
            ))}
            <Button onClick={() => addBlobs(4, 0)}>+4 to the first row</Button>
          </Controls>
          <Controls title="Time">
            <Button onClick={() => nextSteps(1)}>New step</Button>
            <Button onClick={() => nextSteps(1, 3)}>
              New step, arriving with +3
            </Button>
            <Button onClick={() => nextSteps(3)}>Jump 3 steps</Button>
            <Button
              onClick={() => {
                setFirstBucket(1000)
                setRows(START_ROWS)
                note('reset')
              }}
            >
              Reset
            </Button>
          </Controls>
          <Controls title="Play back blocks">
            {SPEEDS.map((s) => (
              <Button
                key={s.msPerSlot}
                active={speed === s.msPerSlot}
                onClick={() =>
                  setSpeed((current) =>
                    current === s.msPerSlot ? undefined : s.msPerSlot,
                  )
                }
              >
                {s.label}
              </Button>
            ))}
            <span className="text-label-value-14 text-secondary tabular-nums">
              slot {slot}, {SLOTS_PER_STEP - (slot % SLOTS_PER_STEP)} to the
              next step
            </span>
          </Controls>
          <Controls title="Watch">
            {SLOW_MOTION.map((rate) => (
              <Button
                key={rate}
                active={slowMotion === rate}
                onClick={() => setSlowMotion(rate)}
              >
                {rate === 1 ? 'Normal speed' : `${rate}× slow motion`}
              </Button>
            ))}
            <Button
              active={tickEverySecond}
              onClick={() => setTickEverySecond((on) => !on)}
            >
              Render every second, as the table does
            </Button>
          </Controls>

          <div className="space-y-5">
            {rows.map((row) => (
              <div
                key={row.name}
                className="grid items-center gap-x-6 gap-y-2 md:grid-cols-[12rem_auto_1fr]"
              >
                <span className="font-bold text-label-value-14">
                  {row.name}
                </span>
                <div className="flex items-end gap-8">
                  <Activity
                    buckets={row.buckets}
                    firstBucket={firstBucket}
                    color={row.color}
                  />
                  {/* the same bars, four times larger, for following one bar */}
                  <div className="flex h-20 w-[284px] items-end">
                    <div className="origin-bottom-left scale-[4]">
                      <Activity
                        buckets={row.buckets}
                        firstBucket={firstBucket}
                        color={row.color}
                      />
                    </div>
                  </div>
                </div>
                <code className="text-label-value-12 text-secondary">
                  steps {firstBucket}–{firstBucket + STEPS - 1}: [
                  {row.buckets.join(', ')}]
                </code>
              </div>
            ))}
          </div>

          <div>
            <div className="font-bold text-label-value-14">What happened</div>
            <pre className="mt-1 min-h-24 text-label-value-12 text-secondary">
              {log.join('\n') || 'Nothing yet'}
            </pre>
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}

function shift(buckets: number[], steps: number) {
  return [...buckets.slice(steps), ...Array(Math.min(steps, STEPS)).fill(0)]
}

function withLast(buckets: number[], blobs: number) {
  return buckets.map((value, i) =>
    i === buckets.length - 1 ? value + blobs : value,
  )
}

function Controls({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-40 font-bold text-label-value-14">{title}</span>
      {children}
    </div>
  )
}

function Button({
  active,
  onClick,
  children,
}: {
  active?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 font-bold text-label-value-14 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        active
          ? 'bg-primary text-primary-invert'
          : 'bg-surface-secondary text-primary hover:bg-surface-tertiary',
      )}
    >
      {children}
    </button>
  )
}
