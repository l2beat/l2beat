interface Sample {
  t: number
  v: number
}

class RollingWindow {
  private samples: Sample[] = []
  constructor(private windowMs: number) {}

  add(v: number, t = performance.now()) {
    this.samples.push({ t, v })
    this.trim(t)
  }

  trim(now = performance.now()) {
    const cutoff = now - this.windowMs
    let i = 0
    while (i < this.samples.length) {
      const sample = this.samples[i]
      if (!sample || sample.t >= cutoff) {
        break
      }
      i++
    }
    if (i > 0) this.samples.splice(0, i)
  }

  values() {
    return this.samples.map((s) => s.v)
  }

  last() {
    const sample = this.samples[this.samples.length - 1]
    return sample ? sample.v : 0
  }

  count() {
    return this.samples.length
  }

  reset() {
    this.samples = []
  }
}

function percentile(sorted: number[], p: number) {
  if (!sorted.length) return 0
  const idx = Math.max(
    0,
    Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1),
  )
  return sorted[idx] ?? 0
}

function avg(values: number[]) {
  if (!values.length) return 0
  let sum = 0
  for (const v of values) sum += v
  return sum / values.length
}

export interface ActionStats {
  count: number
  lastMs: number
  maxMs: number
  avgMs: number
  p95Ms: number
  recent: number
}

export interface SceneStats {
  nodes: number
  visibleNodes: number
  hiddenNodes: number
  connections: number
  fields: number
}

export interface PerfSnapshot {
  fps: number
  avgFps: number
  minFps: number
  frameLastMs: number
  frameP50Ms: number
  frameP95Ms: number
  frameMaxMs: number
  longTasks5s: number
  renderLastMs: number
  renderAvgMs: number
  renderP95Ms: number
  renderCount: number
  actions: Array<{ name: string } & ActionStats>
  scene: SceneStats
  memoryMB?: number
  uptimeSec: number
}

const frameTimes = new RollingWindow(2000)
const fpsWindow = new RollingWindow(5000)
const longTaskWindow = new RollingWindow(5000)
const renderTimes = new RollingWindow(5000)

interface ActionBucket {
  window: RollingWindow
  count: number
  last: number
  max: number
}

const actionBuckets = new Map<string, ActionBucket>()

let scene: SceneStats = {
  nodes: 0,
  visibleNodes: 0,
  hiddenNodes: 0,
  connections: 0,
  fields: 0,
}

let version = 0
const listeners = new Set<() => void>()
function notify() {
  version++
  for (const l of listeners) l()
}

const startedAt = performance.now()

export const perfStats = {
  subscribe(fn: () => void) {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
  getVersion: () => version,

  recordFrame(durationMs: number) {
    const now = performance.now()
    frameTimes.add(durationMs, now)
    if (durationMs > 0) fpsWindow.add(1000 / durationMs, now)
    if (durationMs > 50) longTaskWindow.add(1, now)
  },

  recordAction(name: string, durationMs: number) {
    let bucket = actionBuckets.get(name)
    if (!bucket) {
      bucket = { window: new RollingWindow(5000), count: 0, last: 0, max: 0 }
      actionBuckets.set(name, bucket)
    }
    bucket.window.add(durationMs)
    bucket.count++
    bucket.last = durationMs
    if (durationMs > bucket.max) bucket.max = durationMs
  },

  recordRender(durationMs: number) {
    renderTimes.add(durationMs)
  },

  setScene(next: SceneStats) {
    scene = next
  },

  reset() {
    frameTimes.reset()
    fpsWindow.reset()
    longTaskWindow.reset()
    renderTimes.reset()
    actionBuckets.clear()
    notify()
  },

  snapshot(): PerfSnapshot {
    const now = performance.now()
    frameTimes.trim(now)
    fpsWindow.trim(now)
    longTaskWindow.trim(now)
    renderTimes.trim(now)

    const frames = frameTimes.values()
    const framesSorted = [...frames].sort((a, b) => a - b)
    const frameLastMs = frameTimes.last()
    const fpsValues = fpsWindow.values()

    const renders = renderTimes.values()
    const rendersSorted = [...renders].sort((a, b) => a - b)

    const actions: Array<{ name: string } & ActionStats> = []
    for (const [name, bucket] of actionBuckets) {
      bucket.window.trim(now)
      const recent = bucket.window.values()
      const recentSorted = [...recent].sort((a, b) => a - b)
      actions.push({
        name,
        count: bucket.count,
        lastMs: bucket.last,
        maxMs: bucket.max,
        avgMs: avg(recent),
        p95Ms: percentile(recentSorted, 0.95),
        recent: recent.length,
      })
    }
    actions.sort((a, b) => b.p95Ms - a.p95Ms)

    let memoryMB: number | undefined
    const mem = (
      performance as Performance & {
        memory?: { usedJSHeapSize: number }
      }
    ).memory
    if (mem?.usedJSHeapSize) {
      memoryMB = mem.usedJSHeapSize / 1024 / 1024
    }

    return {
      fps: frameLastMs > 0 ? 1000 / frameLastMs : 0,
      avgFps: avg(fpsValues),
      minFps: fpsValues.length ? Math.min(...fpsValues) : 0,
      frameLastMs,
      frameP50Ms: percentile(framesSorted, 0.5),
      frameP95Ms: percentile(framesSorted, 0.95),
      frameMaxMs: framesSorted.at(-1) ?? 0,
      longTasks5s: longTaskWindow.count(),
      renderLastMs: renderTimes.last(),
      renderAvgMs: avg(renders),
      renderP95Ms: percentile(rendersSorted, 0.95),
      renderCount: renders.length,
      actions,
      scene,
      memoryMB,
      uptimeSec: (now - startedAt) / 1000,
    }
  },

  /**
   * Manual timing helper. Wrap any sync block to contribute to action stats.
   * Use this when you want finer granularity than the store-action timings.
   */
  time<T>(name: string, fn: () => T): T {
    const t0 = performance.now()
    try {
      return fn()
    } finally {
      perfStats.recordAction(name, performance.now() - t0)
    }
  },
}

let tickerStarted = false
let lastFrameT = 0
let lastNotifyT = 0

export function startPerfTicker() {
  if (tickerStarted || typeof window === 'undefined') return
  tickerStarted = true
  lastFrameT = performance.now()
  lastNotifyT = lastFrameT

  const tick = (t: number) => {
    const dt = t - lastFrameT
    lastFrameT = t
    perfStats.recordFrame(dt)
    if (t - lastNotifyT > 250) {
      lastNotifyT = t
      notify()
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
