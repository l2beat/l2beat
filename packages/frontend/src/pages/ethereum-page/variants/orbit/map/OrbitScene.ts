import { prepareCanvas } from '~/utils/prepareCanvas'
import { stableFraction } from '../model'
import { type Geometry, getGeometry, type MapMode } from './geometry'

export interface SceneBody {
  id: string
  name: string
  color: string
  iconUrl: string | undefined
  share: number
  tier: 0 | 1 | 2
  /** Labeled on the map, the rest wait for a hover */
  labeled: boolean
  unattributed: boolean
}

export interface SceneBlock {
  slot: number
  posters: { posterId: string; color: string; blobs: number }[]
  gasFraction: number
  missed: boolean
}

export interface ScenePalette {
  primary: string
  secondary: string
  surface: string
  track: string
  divider: string
  brand: string
  gas: string
  font: string
}

interface BodyState extends SceneBody {
  ring: number
  targetRing: number
  angle: number
  targetAngle: number
  alpha: number
  targetAlpha: number
  radius: number
  targetRadius: number
  /** 1 when a pulse leaves or lands, decays to 0 */
  flash: number
  x: number
  y: number
  /** -1 at the back of the orbit, 1 at the front */
  depth: number
  drawnRadius: number
}

interface Pulse {
  posterId: string
  color: string
  blobs: number
  start: number
  duration: number
  inward: boolean
  /** Where a system without a body of its own comes from */
  fallbackAngle: number
  landed: boolean
}

interface Segment {
  posterId: string
  color: string
  blobs: number
  grow: number
  targetGrow: number
}

interface Ripple {
  start: number
  color: string
}

const TWO_PI = Math.PI * 2
/** Inner orbit period; outer ones are slower, as Kepler has it */
const INNER_PERIOD_MS = 150_000
const PULSE_MS = 1050
const PULSE_STAGGER_MS = 85
const RIPPLE_MS = 750
/** How long the orbit spins back before the replacement block comes in */
const REWIND_MS = 1500
const REWIND_TURN = -1.1
const ARC_REWIND_SWING = -0.32
const SEGMENT_GAP = 0.022
const TAIL = 7

/**
 * The orbit map: draws Ethereum's core and the systems around it, and
 * animates what each block brings in. Plain canvas, outside React: a frame
 * touches a few dozen shapes and React never re-renders for it.
 */
export class OrbitScene {
  private context: CanvasRenderingContext2D | null = null
  private geometry: Geometry = getGeometry(1, 1, 'orbit')
  private palette: ScenePalette | undefined
  private images = new Map<string, HTMLImageElement>()
  private bodies = new Map<string, BodyState>()
  private phase = [0, 0, 0]
  private pulses: Pulse[] = []
  private segments: Segment[] = []
  private ripples: Ripple[] = []
  private timeline: { at: number; run: () => void }[] = []
  private busyUntil = 0
  private gasShown = 0
  private gasTarget = 0
  private clock: { start: number; end: number } | undefined
  private rewind: { start: number; last: number } | undefined
  private hovered: string | undefined
  private maxBlobs = 21
  private targetBlobs = 14
  private gasTargetFraction = 0.5
  private reducedMotion = false
  private active = false
  private frame = 0
  private stillTimer: ReturnType<typeof setInterval> | undefined
  private lastTime = 0

  constructor(private readonly canvas: HTMLCanvasElement) {}

  // Pass 1: what the React side feeds in

  resize(width: number, height: number, mode: MapMode, sideReserve: number) {
    this.geometry = getGeometry(width, height, mode, sideReserve)
    this.context = prepareCanvas(this.canvas, width, height)
    this.placeBodies(true)
    this.requestDraw()
  }

  setPalette(palette: ScenePalette) {
    this.palette = palette
    this.requestDraw()
  }

  setImages(images: Map<string, HTMLImageElement>) {
    this.images = images
    this.requestDraw()
  }

  setLimits(targetBlobs: number, maxBlobs: number, gasTargetFraction: number) {
    this.targetBlobs = targetBlobs
    this.maxBlobs = maxBlobs
    this.gasTargetFraction = gasTargetFraction
  }

  setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced
    this.updateLoop()
  }

  /** Off screen or in a hidden tab nothing animates */
  setActive(active: boolean) {
    this.active = active
    this.updateLoop()
  }

  setHovered(id: string | undefined) {
    this.hovered = id
    this.requestDraw()
  }

  setClock(startMs: number, endMs: number) {
    const offset = performance.now() - Date.now()
    this.clock = { start: startMs + offset, end: endMs + offset }
  }

  setBodies(next: SceneBody[]) {
    const seen = new Set<string>()
    for (const body of next) {
      seen.add(body.id)
      const current = this.bodies.get(body.id)
      if (current) {
        if (current.targetRing !== body.tier) {
          // keeps its place on screen while it moves to the new orbit
          current.angle += this.phaseOf(current.ring) - this.phaseOf(body.tier)
        }
        Object.assign(current, body, {
          targetRing: body.tier,
          targetAlpha: 1,
        })
      } else {
        this.bodies.set(body.id, {
          ...body,
          ring: body.tier,
          targetRing: body.tier,
          angle: 0,
          targetAngle: 0,
          alpha: 0,
          targetAlpha: 1,
          radius: 0,
          targetRadius: 0,
          flash: 0,
          x: 0,
          y: 0,
          depth: 0,
          drawnRadius: 0,
        })
      }
    }
    for (const [id, body] of this.bodies) {
      if (!seen.has(id)) body.targetAlpha = 0
    }
    this.placeBodies(false)
    this.requestDraw()
  }

  /** A new head: its blobs fly in from the systems that posted them */
  showBlock(block: SceneBlock, animate: boolean) {
    const now = performance.now()
    const at = Math.max(now, this.busyUntil)
    this.schedule(at, () => {
      for (const segment of this.segments) segment.targetGrow = 0
      this.gasTarget = block.gasFraction
      if (!animate || this.reducedMotion) {
        this.segments = block.posters.map((p) => ({
          ...p,
          grow: 1,
          targetGrow: 1,
        }))
        if (this.reducedMotion) this.gasShown = block.gasFraction
        return
      }
      block.posters.forEach((p, index) => {
        this.pulses.push({
          ...p,
          start: at + index * PULSE_STAGGER_MS,
          duration: pulseDuration(p.blobs),
          inward: true,
          fallbackAngle: stableFraction(p.posterId) * TWO_PI,
          landed: false,
        })
      })
    })
    if (animate && !this.reducedMotion) {
      // a block right behind this one (a reorg's replacement and the next
      // head) waits for these to land, so each block reads on its own
      const last = block.posters.reduce(
        (end, p, index) =>
          Math.max(end, index * PULSE_STAGGER_MS + pulseDuration(p.blobs)),
        0,
      )
      this.busyUntil = at + last
    }
  }

  /**
   * The replaced block's blobs fly back out to their systems while the orbit
   * spins backwards, then the replacement's come in
   */
  rewindBlock(replaced: SceneBlock, by: SceneBlock) {
    if (this.reducedMotion) {
      this.showBlock(by, false)
      return
    }
    const now = performance.now()
    const at = Math.max(now, this.busyUntil)
    this.schedule(at, () => {
      // what was still on its way in belongs to the block being undone
      this.pulses = this.pulses.filter((p) => !p.inward || p.landed)
      this.rewind = { start: at, last: at }
      this.gasTarget = 0
      const outgoing = [...replaced.posters].reverse()
      outgoing.forEach((p, index) => {
        const start = at + index * PULSE_STAGGER_MS
        this.schedule(start, () => {
          const segment = this.segments.find(
            (s) => s.posterId === p.posterId && s.targetGrow > 0,
          )
          if (segment) segment.targetGrow = 0
          const body = this.bodies.get(p.posterId)
          if (body) body.flash = 1
        })
        this.pulses.push({
          ...p,
          start,
          duration: PULSE_MS,
          inward: false,
          fallbackAngle: stableFraction(p.posterId) * TWO_PI,
          landed: false,
        })
      })
    })
    this.busyUntil = at + REWIND_MS
    this.showBlock(by, true)
  }

  hitTest(x: number, y: number): string | undefined {
    const ordered = [...this.bodies.values()]
      .filter((b) => b.alpha > 0.5)
      .sort((a, b) => b.depth - a.depth)
    for (const body of ordered) {
      const reach = Math.max(body.drawnRadius + 4, 12)
      if ((body.x - x) ** 2 + (body.y - y) ** 2 <= reach ** 2) return body.id
    }
    return undefined
  }

  bodyPosition(id: string) {
    const body = this.bodies.get(id)
    if (!body) return undefined
    return { x: body.x, y: body.y, radius: body.drawnRadius }
  }

  destroy() {
    this.active = false
    cancelAnimationFrame(this.frame)
    clearInterval(this.stillTimer)
  }

  // Pass 2: the frame loop

  private updateLoop() {
    cancelAnimationFrame(this.frame)
    clearInterval(this.stillTimer)
    this.lastTime = performance.now()
    if (this.active && !this.reducedMotion) {
      this.frame = requestAnimationFrame(this.loop)
      return
    }
    this.requestDraw()
    if (this.active) {
      // a still map moves its slot countdown once a second, as a clock would
      this.stillTimer = setInterval(() => this.requestDraw(), 1000)
    }
  }

  private loop = (time: number) => {
    this.step(time)
    this.draw(time)
    if (this.active && !this.reducedMotion) {
      this.frame = requestAnimationFrame(this.loop)
    }
  }

  /** One frame now, for a still map: reduced motion, or a change while paused */
  requestDraw() {
    if (this.active && !this.reducedMotion) return
    cancelAnimationFrame(this.frame)
    this.frame = requestAnimationFrame((time) => {
      this.step(time)
      this.draw(time)
    })
  }

  private schedule(at: number, run: () => void) {
    if (at <= performance.now()) {
      run()
      return
    }
    this.timeline.push({ at, run })
  }

  private step(time: number) {
    // a paused tab comes back to a map that settles, not one that jumps
    const dt = Math.min(64, Math.max(0, time - this.lastTime))
    this.lastTime = time

    const due = this.timeline.filter((e) => e.at <= time)
    if (due.length > 0) {
      this.timeline = this.timeline.filter((e) => e.at > time)
      for (const event of due) event.run()
    }

    const still = this.reducedMotion
    const g = this.geometry
    // a system under the pointer holds still, so it can be read and clicked
    if (g.mode === 'orbit' && !still && !this.hovered) {
      for (let ring = 0; ring < 3; ring++) {
        const speed =
          (TWO_PI / INNER_PERIOD_MS) * (g.rx[0] / (g.rx[ring] ?? 1)) ** 1.5
        this.phase[ring] = (this.phase[ring] ?? 0) + speed * dt
      }
    }
    if (this.rewind) {
      const t = (time - this.rewind.start) / REWIND_MS
      if (t >= 1) {
        this.rewind = undefined
      } else if (g.mode === 'orbit') {
        const turn =
          REWIND_TURN *
          (easeInOut(clamp01(t)) -
            easeInOut(
              clamp01((this.rewind.last - this.rewind.start) / REWIND_MS),
            ))
        for (let ring = 0; ring < 3; ring++) {
          this.phase[ring] = (this.phase[ring] ?? 0) + turn
        }
        this.rewind.last = time
      }
    }

    const smoothing = still ? 1 : 1 - Math.exp(-dt / 380)
    for (const [id, body] of this.bodies) {
      body.ring += (body.targetRing - body.ring) * smoothing
      body.angle += shortestDelta(body.angle, body.targetAngle) * smoothing
      body.alpha += (body.targetAlpha - body.alpha) * smoothing
      body.radius += (body.targetRadius - body.radius) * smoothing
      body.flash = still ? 0 : Math.max(0, body.flash - dt / 900)
      if (body.targetAlpha === 0 && body.alpha < 0.02) this.bodies.delete(id)
    }

    const grow = still ? 1 : 1 - Math.exp(-dt / 140)
    for (const segment of this.segments) {
      segment.grow += (segment.targetGrow - segment.grow) * grow
    }
    this.segments = this.segments.filter(
      (s) => s.targetGrow > 0 || s.grow > 0.01,
    )
    this.gasShown += (this.gasTarget - this.gasShown) * (still ? 1 : grow / 2)

    for (const pulse of this.pulses) {
      if (pulse.landed || time < pulse.start + pulse.duration) continue
      pulse.landed = true
      if (!pulse.inward) continue
      this.segments.push({
        posterId: pulse.posterId,
        color: pulse.color,
        blobs: pulse.blobs,
        grow: 0,
        targetGrow: 1,
      })
      this.ripples.push({ start: time, color: pulse.color })
      const body = this.bodies.get(pulse.posterId)
      if (body) body.flash = 1
    }
    this.pulses = this.pulses.filter((p) => !p.landed)
    this.ripples = this.ripples.filter((r) => time - r.start < RIPPLE_MS)

    for (const body of this.bodies.values()) this.locate(body, time)
  }

  // Pass 3: placing and drawing

  private placeBodies(snap: boolean) {
    const g = this.geometry
    const byRing: BodyState[][] = [[], [], []]
    for (const body of this.bodies.values()) {
      if (body.targetAlpha > 0) byRing[body.targetRing]?.push(body)
    }
    byRing.forEach((members, ring) => {
      members.sort((a, b) => stableFraction(a.id) - stableFraction(b.id))
      members.forEach((body, index) => {
        body.targetAngle =
          g.mode === 'arc'
            ? g.arcFrom +
              ((index + 0.5) / members.length) * (g.arcTo - g.arcFrom)
            : (index / members.length) * TWO_PI + ring * 0.9
        body.targetRadius = bodyRadius(body.share) * g.bodyScale
        if (snap || body.alpha === 0) {
          body.angle = body.targetAngle
          body.ring = body.targetRing
          body.radius = body.targetRadius
        }
      })
    })
  }

  private phaseOf(ring: number) {
    const low = Math.floor(clamp(ring, 0, 2))
    const high = Math.min(2, low + 1)
    const from = this.phase[low] ?? 0
    const to = this.phase[high] ?? 0
    return from + shortestDelta(from, to) * (ring - low)
  }

  private locate(body: BodyState, time: number) {
    const g = this.geometry
    const low = Math.floor(clamp(body.ring, 0, 2))
    const high = Math.min(2, low + 1)
    const f = body.ring - low
    const rx = lerp(g.rx[low] ?? 0, g.rx[high] ?? 0, f)
    const ry = lerp(g.ry[low] ?? 0, g.ry[high] ?? 0, f)
    let angle = body.angle + (g.mode === 'orbit' ? this.phaseOf(body.ring) : 0)
    if (g.mode === 'arc' && this.rewind) {
      angle +=
        ARC_REWIND_SWING *
        Math.sin(Math.PI * clamp01((time - this.rewind.start) / REWIND_MS))
    }
    body.x = g.cx + rx * Math.cos(angle)
    body.y = g.cy + ry * Math.sin(angle)
    body.depth = g.mode === 'orbit' ? Math.sin(angle) : 1
    const perspective = g.mode === 'orbit' ? 0.86 + 0.14 * body.depth : 1
    body.drawnRadius = body.radius * perspective
  }

  private pulseEnds(pulse: Pulse) {
    const g = this.geometry
    const body = this.bodies.get(pulse.posterId)
    const outer =
      body && body.alpha > 0.1
        ? { x: body.x, y: body.y }
        : {
            x: g.cx + g.rx[2] * 1.06 * Math.cos(this.fallbackAngle(pulse)),
            y: g.cy + g.ry[2] * 1.06 * Math.sin(this.fallbackAngle(pulse)),
          }
    const dx = outer.x - g.cx
    const dy = outer.y - g.cy
    const distance = Math.hypot(dx, dy) || 1
    const rim = g.blobRing + g.blobWidth / 2
    const inner = {
      x: g.cx + (dx / distance) * rim,
      y: g.cy + (dy / distance) * rim,
    }
    return { outer, inner }
  }

  private fallbackAngle(pulse: Pulse) {
    const g = this.geometry
    if (g.mode === 'arc') {
      return g.arcFrom + (pulse.fallbackAngle / TWO_PI) * (g.arcTo - g.arcFrom)
    }
    return pulse.fallbackAngle
  }

  private draw(time: number) {
    const ctx = this.context
    const palette = this.palette
    if (!ctx || !palette) return
    const g = this.geometry
    ctx.clearRect(0, 0, g.width, g.height)

    this.drawOrbits(ctx, palette)
    const bodies = [...this.bodies.values()].sort((a, b) => a.depth - b.depth)
    for (const body of bodies) {
      if (body.depth < 0) this.drawBody(ctx, palette, body, time)
    }
    this.drawCore(ctx, palette, time)
    for (const pulse of this.pulses) this.drawPulse(ctx, pulse, time)
    for (const body of bodies) {
      if (body.depth >= 0) this.drawBody(ctx, palette, body, time)
    }
    for (const body of bodies) {
      if (body.labeled || body.id === this.hovered) {
        this.drawLabel(ctx, palette, body)
      }
    }
  }

  private drawOrbits(ctx: CanvasRenderingContext2D, palette: ScenePalette) {
    const g = this.geometry
    ctx.save()
    ctx.strokeStyle = palette.divider
    ctx.lineWidth = 1
    for (let ring = 0; ring < 3; ring++) {
      ctx.beginPath()
      ctx.setLineDash(ring === 2 ? [2, 5] : [])
      if (g.mode === 'arc') {
        ctx.ellipse(
          g.cx,
          g.cy,
          g.rx[ring] ?? 0,
          g.ry[ring] ?? 0,
          0,
          Math.PI,
          TWO_PI,
        )
      } else {
        ctx.ellipse(g.cx, g.cy, g.rx[ring] ?? 0, g.ry[ring] ?? 0, 0, 0, TWO_PI)
      }
      ctx.stroke()
    }
    if (g.mode === 'arc') {
      // the horizon the half-orbit sits on
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(g.cx - g.rx[2] - 8, g.cy)
      ctx.lineTo(g.cx - g.blobRing - 10, g.cy)
      ctx.moveTo(g.cx + g.blobRing + 10, g.cy)
      ctx.lineTo(g.cx + g.rx[2] + 8, g.cy)
      ctx.stroke()
    }
    ctx.restore()
  }

  private drawCore(
    ctx: CanvasRenderingContext2D,
    palette: ScenePalette,
    time: number,
  ) {
    const g = this.geometry
    const top = -Math.PI / 2

    ctx.save()
    ctx.beginPath()
    ctx.arc(g.cx, g.cy, g.blobRing + g.blobWidth / 2 + 3, 0, TWO_PI)
    ctx.fillStyle = palette.surface
    ctx.fill()

    // the time left in the slot
    const progress = this.clock
      ? clamp01((time - this.clock.start) / (this.clock.end - this.clock.start))
      : 0
    ctx.lineWidth = 1.5
    ctx.strokeStyle = palette.divider
    ctx.beginPath()
    ctx.arc(g.cx, g.cy, g.countdownRing, 0, TWO_PI)
    ctx.stroke()
    if (this.clock) {
      ctx.strokeStyle = palette.secondary
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(g.cx, g.cy, g.countdownRing, top, top + progress * TWO_PI)
      ctx.stroke()
      ctx.lineCap = 'butt'
    }

    // gas used against the limit, its target ticked
    ctx.lineWidth = g.gasWidth
    ctx.strokeStyle = palette.track
    ctx.beginPath()
    ctx.arc(g.cx, g.cy, g.gasRing, 0, TWO_PI)
    ctx.stroke()
    if (this.gasShown > 0.002) {
      ctx.strokeStyle = palette.gas
      ctx.beginPath()
      ctx.arc(g.cx, g.cy, g.gasRing, top, top + this.gasShown * TWO_PI)
      ctx.stroke()
    }

    // blobs against the max, one colored arc per system, as they landed
    ctx.lineWidth = g.blobWidth
    ctx.strokeStyle = palette.track
    ctx.beginPath()
    ctx.arc(g.cx, g.cy, g.blobRing, 0, TWO_PI)
    ctx.stroke()
    const perBlob = TWO_PI / this.maxBlobs
    let at = top
    for (const segment of this.segments) {
      const sweep = segment.blobs * perBlob * segment.grow
      if (sweep > SEGMENT_GAP * 1.5) {
        ctx.strokeStyle = segment.color
        ctx.globalAlpha = Math.min(1, segment.grow * 1.4)
        ctx.beginPath()
        ctx.arc(
          g.cx,
          g.cy,
          g.blobRing,
          at + SEGMENT_GAP / 2,
          at + sweep - SEGMENT_GAP / 2,
        )
        ctx.stroke()
      }
      at += sweep
    }
    ctx.globalAlpha = 1

    this.drawTick(ctx, palette, g.gasRing, g.gasWidth, this.gasTargetFraction)
    this.drawTick(
      ctx,
      palette,
      g.blobRing,
      g.blobWidth,
      this.targetBlobs / this.maxBlobs,
    )

    for (const ripple of this.ripples) {
      const t = (time - ripple.start) / RIPPLE_MS
      ctx.globalAlpha = 0.45 * (1 - t)
      ctx.strokeStyle = ripple.color
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(
        g.cx,
        g.cy,
        g.blobRing + g.blobWidth / 2 + 2 + easeOut(t) * 16,
        0,
        TWO_PI,
      )
      ctx.stroke()
    }
    ctx.restore()
  }

  private drawTick(
    ctx: CanvasRenderingContext2D,
    palette: ScenePalette,
    radius: number,
    width: number,
    fraction: number,
  ) {
    const g = this.geometry
    const angle = -Math.PI / 2 + fraction * TWO_PI
    const inner = radius - width / 2 - 2
    const outer = radius + width / 2 + 2
    ctx.strokeStyle = palette.primary
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(g.cx + inner * Math.cos(angle), g.cy + inner * Math.sin(angle))
    ctx.lineTo(g.cx + outer * Math.cos(angle), g.cy + outer * Math.sin(angle))
    ctx.stroke()
  }

  private drawPulse(ctx: CanvasRenderingContext2D, pulse: Pulse, time: number) {
    if (time < pulse.start) return
    const t = clamp01((time - pulse.start) / pulse.duration)
    const { outer, inner } = this.pulseEnds(pulse)
    const from = pulse.inward ? outer : inner
    const to = pulse.inward ? inner : outer
    // a curve, not a straight line: things fall into orbit, not into the sun
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2
    const bend = pulse.inward ? 0.22 : -0.22
    const control = {
      x: mx - (to.y - from.y) * bend,
      y: my + (to.x - from.x) * bend,
    }
    const ease = pulse.inward ? easeIn : easeOut
    const size = (2.2 + Math.sqrt(pulse.blobs) * 1.5) * this.geometry.bodyScale
    ctx.save()
    ctx.fillStyle = pulse.color
    for (let i = TAIL; i >= 0; i--) {
      const p = ease(clamp01(t - i * 0.028))
      if (p <= 0 && i > 0) continue
      const point = quadratic(from, control, to, p)
      ctx.globalAlpha = i === 0 ? 1 : 0.32 * (1 - i / (TAIL + 1))
      ctx.beginPath()
      ctx.arc(point.x, point.y, size * (1 - i * 0.08), 0, TWO_PI)
      ctx.fill()
    }
    ctx.restore()
  }

  private drawBody(
    ctx: CanvasRenderingContext2D,
    palette: ScenePalette,
    body: BodyState,
    time: number,
  ) {
    const r = body.drawnRadius
    if (r < 0.5 || body.alpha < 0.01) return
    const fade =
      this.geometry.mode === 'orbit' ? 0.72 + (0.28 * (body.depth + 1)) / 2 : 1
    ctx.save()

    if (this.rewind && this.geometry.mode === 'orbit') {
      // echoes trailing the reverse spin: the visible "rewind"
      const t = (time - this.rewind.start) / REWIND_MS
      const strength = Math.sin(Math.PI * clamp01(t))
      const g = this.geometry
      for (let i = 1; i <= 4; i++) {
        const back = this.phaseOf(body.ring) + body.angle + i * 0.045 * strength
        const rx = lerp(
          g.rx[Math.floor(body.ring)] ?? 0,
          g.rx[Math.ceil(body.ring)] ?? 0,
          body.ring % 1,
        )
        const ry = lerp(
          g.ry[Math.floor(body.ring)] ?? 0,
          g.ry[Math.ceil(body.ring)] ?? 0,
          body.ring % 1,
        )
        ctx.globalAlpha = body.alpha * 0.18 * (1 - i / 5) * strength
        ctx.fillStyle = body.color
        ctx.beginPath()
        ctx.arc(
          g.cx + rx * Math.cos(back),
          g.cy + ry * Math.sin(back),
          r,
          0,
          TWO_PI,
        )
        ctx.fill()
      }
    }

    ctx.globalAlpha = body.alpha * fade
    if (body.flash > 0) {
      ctx.strokeStyle = body.color
      ctx.lineWidth = 2
      ctx.globalAlpha = body.alpha * body.flash * 0.7
      ctx.beginPath()
      ctx.arc(body.x, body.y, r + 3 + (1 - body.flash) * 10, 0, TWO_PI)
      ctx.stroke()
      ctx.globalAlpha = body.alpha * fade
    }

    // a ring of the surface keeps overlapping bodies apart
    ctx.fillStyle = palette.surface
    ctx.beginPath()
    ctx.arc(body.x, body.y, r + 2, 0, TWO_PI)
    ctx.fill()

    if (body.unattributed) {
      ctx.fillStyle = palette.track
      ctx.beginPath()
      ctx.arc(body.x, body.y, r, 0, TWO_PI)
      ctx.fill()
      ctx.setLineDash([2, 2])
      ctx.strokeStyle = palette.secondary
      ctx.lineWidth = 1.25
      ctx.stroke()
      ctx.setLineDash([])
    } else {
      ctx.fillStyle = body.color
      ctx.beginPath()
      ctx.arc(body.x, body.y, r, 0, TWO_PI)
      ctx.fill()
      const image = body.iconUrl ? this.images.get(body.iconUrl) : undefined
      if (image && r >= 6) {
        const inset = r >= 12 ? 2 : 1.25
        ctx.save()
        ctx.beginPath()
        ctx.arc(body.x, body.y, r - inset, 0, TWO_PI)
        ctx.clip()
        ctx.fillStyle = palette.surface
        ctx.fill()
        const size = (r - inset) * 2
        ctx.drawImage(image, body.x - size / 2, body.y - size / 2, size, size)
        ctx.restore()
      }
    }

    if (body.id === this.hovered) {
      ctx.globalAlpha = 1
      ctx.strokeStyle = palette.primary
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(body.x, body.y, r + 4.5, 0, TWO_PI)
      ctx.stroke()
    }
    ctx.restore()
  }

  private drawLabel(
    ctx: CanvasRenderingContext2D,
    palette: ScenePalette,
    body: BodyState,
  ) {
    if (body.alpha < 0.3) return
    const g = this.geometry
    const small = g.mode === 'arc'
    const share = `${(body.share * 100).toFixed(body.share < 0.1 ? 1 : 0)}%`
    ctx.save()
    ctx.globalAlpha = body.alpha
    ctx.textBaseline = 'middle'
    const nameFont = `600 ${small ? 11 : 12}px ${palette.font}`
    const shareFont = `400 ${small ? 11 : 12}px ${palette.font}`
    ctx.font = nameFont
    const nameWidth = ctx.measureText(body.name).width
    ctx.font = shareFont
    const shareWidth = ctx.measureText(share).width
    const total = nameWidth + 4 + shareWidth
    const r = body.drawnRadius
    let x: number
    let y = body.y
    if (small) {
      x = body.x - total / 2
      y = body.y - r - 9
    } else if (body.x >= g.cx) {
      x = body.x + r + 7
    } else {
      x = body.x - r - 7 - total
    }
    x = clamp(x, 2, g.width - total - 2)
    // a halo of the surface keeps the text readable over the orbit lines
    ctx.lineJoin = 'round'
    ctx.lineWidth = 4
    ctx.strokeStyle = palette.surface
    ctx.font = nameFont
    ctx.strokeText(body.name, x, y)
    ctx.fillStyle = palette.primary
    ctx.fillText(body.name, x, y)
    ctx.font = shareFont
    ctx.strokeText(share, x + nameWidth + 4, y)
    ctx.fillStyle = palette.secondary
    ctx.fillText(share, x + nameWidth + 4, y)
    ctx.restore()
  }
}

/** Bigger batches are heavier and fall a little longer */
function pulseDuration(blobs: number) {
  return PULSE_MS + Math.min(400, blobs * 25)
}

/** Area follows the share, so a system with twice the blobs looks twice as big */
function bodyRadius(share: number) {
  return clamp(5 + Math.sqrt(share) * 40, 5, 27)
}

function quadratic(
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) {
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  }
}

function shortestDelta(from: number, to: number) {
  return ((((to - from) % TWO_PI) + 3 * Math.PI) % TWO_PI) - Math.PI
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clamp01(value: number) {
  return clamp(value, 0, 1)
}

/** Falling inward speeds up, as under gravity */
function easeIn(t: number) {
  return t ** 2.3
}

function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2
}
