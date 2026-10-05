import { forEachBatchBetween, type LabBatch, mulberry32 } from '../../schedule'
import {
  batchAfter,
  batchAtOrBefore,
  type FaucetBatch,
  type FaucetSet,
} from './faucets'
import type { BallBuffer, GooColor } from './goo'
import { Wave } from './wave'

/** Seconds of the day played back in one second */
export const TIME_SCALE = 20

export interface DripLayout {
  width: number
  height: number
  /** Where the icons sit */
  railY: number
  /** Rest level of the pool's surface */
  poolTop: number
  /** How far above its surface the pool reaches out to a drop */
  poolReach: number
  /** How deep the rounded lip of its surface is */
  poolLip: number
  faucetXs: number[]
  iconRadius: number
  /** A drop of one blob. Area grows with blobs, so radius with their root */
  blobRadius: number
  /** What hangs from a faucet right after a drop has left */
  nubRadius: number
  buoyX: number
  buoyRadius: number
}

/** Each faucet's goo, and its color once it has dripped into the pool */
export interface DripColors {
  goo: GooColor[]
  bleed: GooColor[]
  /** The buoy floating in the pool, under Ethereum's icon */
  pearl: GooColor
}

/** A poster picked in the list or on the drawing; the rest step back */
export interface DripHighlight {
  faucet: number
  /** Set when the poster shares its faucet, so only its drops stay vivid */
  posterIndex?: number
}

/**
 * The drip of the day: every faucet swells towards its next batch and lets
 * it go as a drop when the batch is sent, the drop falls into the pool and
 * splashes. Times are in seconds of the day, on a clock that loops.
 */
export class DripScene {
  readonly wave: Wave
  readonly buoy = { offset: 0, velocity: 0, tilt: 0 }
  /** 1 while nothing is highlighted; the pool steps back a little otherwise */
  poolEmphasis = 1
  private readonly faucets: FaucetState[]
  private drops: Drop[] = []
  private droplets: Droplet[] = []
  private highlight: DripHighlight | undefined
  private readonly random = mulberry32(4844)
  private frozenSwell: number | undefined
  /** Real seconds since the scene began */
  private seconds = 0

  constructor(
    private readonly set: FaucetSet,
    private readonly batches: LabBatch[],
    readonly layout: DripLayout,
    public clock: number,
  ) {
    this.wave = new Wave(
      layout.width,
      Math.round(Math.min(Math.max(layout.width / 7, 48), 160)),
    )
    this.faucets = set.faucets.map((faucet, i) => {
      const previous = batchAtOrBefore(faucet.timeline, clock)
      return {
        x: layout.faucetXs[i] ?? 0,
        timeline: faucet.timeline,
        previous: previous?.time ?? clock,
        next: batchAfter(faucet.timeline, previous?.time ?? clock),
        wobble: 0,
        wobbleVelocity: 0,
        lastRelease: Number.NEGATIVE_INFINITY,
        emphasis: 1,
      }
    })
  }

  /** Moves everything on by `dt` seconds of real time */
  advance(dt: number) {
    // springs this stiff only stay stable in short steps, and a slow frame
    // can be a long one
    const steps = Math.ceil(dt / MAX_STEP)
    for (let i = 0; i < steps; i++) this.step(dt / steps)
  }

  private step(dt: number) {
    this.seconds += dt
    const from = this.clock
    this.clock += dt * TIME_SCALE
    forEachBatchBetween(this.batches, from, this.clock, (batch, time) =>
      this.release(batch, time),
    )
    const ease = 1 - Math.exp(-dt * 10)
    for (const [i, faucet] of this.faucets.entries()) {
      stepSpring(faucet, 'wobble', 'wobbleVelocity', 0, WOBBLE, dt)
      faucet.emphasis += (this.emphasisTarget(i) - faucet.emphasis) * ease
    }
    this.poolEmphasis += (this.poolEmphasisTarget() - this.poolEmphasis) * ease
    this.moveDrops(dt)
    this.moveDroplets(dt)
    this.wave.step(dt)
    this.floatBuoy(dt)
  }

  setHighlight(highlight: DripHighlight | undefined) {
    this.highlight = highlight
  }

  /** Emphasis jumps to where it is heading, for frames drawn without motion */
  settleEmphasis() {
    for (const [i, faucet] of this.faucets.entries()) {
      faucet.emphasis = this.emphasisTarget(i)
    }
    this.poolEmphasis = this.poolEmphasisTarget()
  }

  /** Runs the first moments unseen, so the drawing opens mid-drip */
  warmUp() {
    for (let t = 0; t < WARM_UP_SECONDS; t += 1 / 60) this.advance(1 / 60)
  }

  /**
   * A still frame for reduced motion: drops in the air where they would be,
   * every faucet half way to its next batch, the pool calm.
   */
  freeze() {
    this.warmUp()
    this.frozenSwell = 0.5
    this.drops = this.drops.filter((drop) => drop.age === undefined)
    this.droplets = []
    this.wave.calm()
    this.buoy.offset = 0
    this.buoy.tilt = 0
    for (const faucet of this.faucets) faucet.wobble = 0
  }

  /** A gentle nudge to a faucet's blob, as when the pointer reaches it */
  poke(faucet: number, strength: number) {
    const state = this.faucets[faucet]
    if (state) state.wobbleVelocity += strength
  }

  /** The surface follows a pointer dragged through it */
  stir(x: number, velocity: number) {
    this.wave.push(x, velocity, 10)
  }

  /** Where Ethereum's icon floats, riding the pool's surface */
  buoyCenter() {
    const { buoyX, buoyRadius, poolTop } = this.layout
    return {
      x: buoyX,
      y: poolTop + this.buoy.offset - buoyRadius * 0.2,
      tilt: this.buoy.tilt,
    }
  }

  collectBalls(out: BallBuffer, colors: DripColors) {
    out.clear()
    const { railY, iconRadius, nubRadius, height, buoyRadius } = this.layout
    const terminal = height * TERMINAL_PER_HEIGHT
    // a pearl of goo the pool closes around, so the buoy floats in it
    const buoy = this.buoyCenter()
    out.push(buoy.x, buoy.y, buoyRadius, 1, 1, colors.pearl, 1)
    for (const [i, faucet] of this.faucets.entries()) {
      const color = colors.goo[i]
      if (!color) continue
      const shape = this.hangingShape(faucet)
      const e = faucet.emphasis
      // the goo the icon sits in, so the icon reads as the spout
      out.push(faucet.x, railY + 1, iconRadius + 1.5, 1, 1, color, e)
      out.push(faucet.x, shape.nubY, nubRadius, shape.nubStretch, 1, color, e)
      if (shape.grown > 0.5) {
        out.push(
          faucet.x,
          shape.dropY,
          shape.grown,
          shape.dropStretch,
          1,
          color,
          e,
        )
      }
    }
    for (const drop of this.drops) {
      const color = colors.goo[drop.faucet]
      const bleed = colors.bleed[drop.faucet]
      if (!color || !bleed || drop.wait > 0) continue
      const e = this.dropEmphasis(drop)
      if (drop.age === undefined) {
        out.push(drop.x, drop.y, drop.radius, drop.stretch, 1, color, e)
        // a tail tapering above it: the thread left from the neck at first,
        // then longer the faster it falls
        const speed = Math.min(drop.vy / terminal, 1)
        const length = drop.radius * (0.45 + 0.9 * speed)
        const top = drop.y - drop.radius * drop.stretch * 0.55
        for (const [along, size] of TAIL) {
          const y = top - length * along
          const stretch = 1 + 0.6 * speed
          out.push(drop.x, y, drop.radius * size, stretch, 1, color, e)
        }
        continue
      }
      // the body melts in at once, riding down into its own crater, already
      // in the pool's light, or dark goo would show as a stain
      const surface = this.layout.poolTop + this.wave.heightAt(drop.x)
      const body = Math.exp(-drop.age / MERGE_SECONDS)
      const sunk = surface + drop.radius * (0.2 + 3 * drop.age)
      out.push(drop.x, sunk, drop.radius, drop.stretch, body, bleed, e)
      // while its color lingers, spreading as it fades
      const depth = drop.radius * (0.4 + Math.min(drop.age * 2, 1))
      const spread = 1 + BLEED_SPREAD * Math.sqrt(drop.age)
      const strength = BLEED_STRENGTH * Math.exp(-drop.age / BLEED_SECONDS)
      out.push(
        drop.x,
        surface + depth,
        drop.radius * spread,
        0.6,
        strength,
        bleed,
        e,
        0,
      )
    }
    for (const droplet of this.droplets) {
      const color = colors.goo[droplet.faucet]
      if (!color || droplet.delay > 0) continue
      const stretch = 1 + Math.min(Math.abs(droplet.vy) / 900, 0.35)
      out.push(
        droplet.x,
        droplet.y,
        droplet.radius,
        stretch,
        1,
        color,
        this.dropEmphasis(droplet),
      )
    }
  }

  /**
   * What hangs from a faucet now: a nub of goo under the icon and the next
   * drop growing below it, round and heavy at the bottom. Just before it is
   * let go the drop pulls away and the neck between them thins.
   */
  private hangingShape(faucet: FaucetState) {
    const { railY, iconRadius, nubRadius, blobRadius } = this.layout
    const next = faucet.next
    const span = next ? Math.max(next.time - faucet.previous, 1e-3) : 1
    const swell =
      this.frozenSwell ??
      (next ? clamp01((this.clock - faucet.previous) / span) : 0)
    const untilRelease =
      next && this.frozenSwell === undefined
        ? (next.time - this.clock) / TIME_SCALE
        : Number.POSITIVE_INFINITY
    const neck = clamp01(1 - untilRelease / NECK_SECONDS)
    const dropRadius = next ? blobRadius * Math.sqrt(next.blobs) : 0
    const grown = dropRadius * Math.sqrt(swell)
    const sag = faucet.wobble
    const nubY = railY + iconRadius + nubRadius * (0.2 + 0.6 * sag)
    const neckPull = (nubRadius + dropRadius) * NECK_PULL * neck * neck
    return {
      nubY,
      nubStretch: 1 + 0.5 * sag,
      dropY: nubY + nubRadius * 0.6 + grown * (1 + 0.3 * sag) + neckPull + 1.5,
      // a full drop sags, and the neck pulls it long
      dropStretch: 1 + 0.1 * swell + 0.18 * neck,
      grown,
      /** px per second the drop moves down at the moment it is let go */
      releaseSpeed:
        ((nubRadius + dropRadius) * NECK_PULL * 2 * neck) / NECK_SECONDS,
    }
  }

  private release(batch: LabBatch, time: number) {
    const index = this.set.faucetOfPoster[batch.posterIndex] ?? -1
    const faucet = this.faucets[index]
    if (!faucet) return
    const shape = this.hangingShape(faucet)
    const radius = this.layout.blobRadius * Math.sqrt(batch.blobs)
    // two batches in one block leave one after the other, drip-drip, rather
    // than as one drop with a waist
    const wait = Math.max(faucet.lastRelease + RELEASE_GAP - this.seconds, 0)
    faucet.lastRelease = this.seconds + wait
    this.drops.push({
      faucet: index,
      posterIndex: batch.posterIndex,
      x: faucet.x,
      // a batch it did not swell for, as a second one in the same block,
      // still leaves whole, from just under the nub
      y: Math.max(shape.dropY, shape.nubY + radius * 0.6),
      vy: Math.max(shape.releaseSpeed, 40),
      radius,
      blobs: batch.blobs,
      stretch: shape.dropStretch + 0.1,
      stretchVelocity: 0,
      wait,
      age: undefined,
    })
    faucet.previous = time
    faucet.next = batchAfter(faucet.timeline, time)
    // the blob left behind springs back up
    faucet.wobbleVelocity -= 6 + radius * 0.25
  }

  private moveDrops(dt: number) {
    const { poolTop, height } = this.layout
    const gravity = height * GRAVITY_PER_HEIGHT
    const terminal = height * TERMINAL_PER_HEIGHT
    for (const drop of this.drops) {
      if (drop.wait > 0) {
        drop.wait -= dt
      } else if (drop.age === undefined) {
        drop.vy = Math.min(drop.vy + gravity * dt, terminal)
        drop.y += drop.vy * dt
        const elongation = 1 + (0.2 * drop.vy) / terminal
        stepSpring(drop, 'stretch', 'stretchVelocity', elongation, DROP, dt)
        const surface = poolTop + this.wave.heightAt(drop.x)
        if (drop.y + drop.radius * drop.stretch * 0.9 >= surface) {
          this.splash(drop, terminal)
        }
      } else {
        drop.age += dt
        stepSpring(drop, 'stretch', 'stretchVelocity', 1, DROP, dt)
      }
    }
    this.drops = this.drops.filter(
      (drop) => drop.age === undefined || drop.age < BLEED_SECONDS * 3.5,
    )
  }

  /** The drop meets the pool: a dip that ripples out and a few droplets thrown up */
  private splash(drop: Drop, terminal: number) {
    drop.age = 0
    const speed = drop.vy / terminal
    this.wave.push(
      drop.x,
      SPLASH_PUSH * drop.radius ** 1.4 * (0.5 + speed),
      drop.radius * 0.9,
    )
    // thrown up by the crater's rebound a beat later, from its middle
    const count = drop.blobs >= 5 ? 4 : drop.blobs >= 3 ? 3 : 2
    const lift = Math.sqrt(drop.radius / this.layout.blobRadius)
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1
      const spread = i === 0 && count > 2 ? 0.25 : 1
      this.droplets.push({
        faucet: drop.faucet,
        posterIndex: drop.posterIndex,
        x: drop.x,
        y: 0,
        vx: side * spread * (30 + 70 * this.random()) * (0.6 + 0.4 * lift),
        vy: -(150 + 90 * this.random()) * (0.75 + 0.25 * lift),
        radius: Math.max(drop.radius * (0.24 + 0.12 * this.random()), 2.2),
        delay: REBOUND_SECONDS * (0.8 + 0.4 * this.random()),
      })
    }
  }

  private moveDroplets(dt: number) {
    const { poolTop, height, width } = this.layout
    const gravity = height * GRAVITY_PER_HEIGHT
    for (const droplet of this.droplets) {
      if (droplet.delay > 0) {
        droplet.delay -= dt
        if (droplet.delay <= 0) {
          droplet.y =
            poolTop + this.wave.heightAt(droplet.x) - droplet.radius * 0.5
        }
        continue
      }
      droplet.vy += gravity * dt
      droplet.x += droplet.vx * dt
      droplet.y += droplet.vy * dt
    }
    this.droplets = this.droplets.filter((droplet) => {
      if (droplet.delay > 0) return true
      const surface = poolTop + this.wave.heightAt(droplet.x)
      const under = droplet.vy > 0 && droplet.y > surface + droplet.radius * 2
      if (under) this.wave.push(droplet.x, droplet.radius * 9, droplet.radius)
      return !under && droplet.x > -20 && droplet.x < width + 20
    })
  }

  private floatBuoy(dt: number) {
    const { buoyX } = this.layout
    const target = this.wave.heightAt(buoyX)
    const b = this.buoy
    b.velocity += (-(b.offset - target) * 70 - b.velocity * 9) * dt
    b.offset += b.velocity * dt
    const tilt = Math.atan(this.wave.slopeAt(buoyX)) * 0.9
    b.tilt += (tilt - b.tilt) * (1 - Math.exp(-dt * 9))
  }

  private emphasisTarget(faucet: number) {
    return this.highlight === undefined || this.highlight.faucet === faucet
      ? 1
      : 0
  }

  private poolEmphasisTarget() {
    return this.highlight === undefined ? 1 : 0
  }

  private dropEmphasis(drop: { faucet: number; posterIndex: number }) {
    const emphasis = this.faucets[drop.faucet]?.emphasis ?? 1
    const picked = this.highlight?.posterIndex
    return picked !== undefined && picked !== drop.posterIndex ? 0 : emphasis
  }
}

interface FaucetState {
  x: number
  timeline: FaucetBatch[]
  /** Playback time the last drop left */
  previous: number
  next: FaucetBatch | undefined
  /** The hanging blob's spring: above 0 stretched down, below squashed up */
  wobble: number
  wobbleVelocity: number
  /** Real seconds into the scene its last drop left, held back or not */
  lastRelease: number
  /** 1 vivid, 0 stepped back behind a highlighted poster */
  emphasis: number
}

interface Drop {
  faucet: number
  posterIndex: number
  x: number
  y: number
  vy: number
  /** Visible radius when alone */
  radius: number
  blobs: number
  /** Taller than wide above 1. Falling drops wobble between the two */
  stretch: number
  stretchVelocity: number
  /** Seconds it is held back before it falls */
  wait: number
  /** Seconds since it landed; undefined while it falls */
  age: number | undefined
}

interface Droplet {
  faucet: number
  posterIndex: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  /** Seconds until it is thrown up */
  delay: number
}

interface Spring {
  stiffness: number
  damping: number
}

// Real seconds the neck takes to stretch and pinch, so the drop leaves on time
const NECK_SECONDS = 0.34
const NECK_PULL = 0.6
// In card heights per second², so a drop takes as long to fall on a phone
const GRAVITY_PER_HEIGHT = 1.5
const TERMINAL_PER_HEIGHT = 0.95
const MERGE_SECONDS = 0.07
const BLEED_SECONDS = 0.55
const BLEED_SPREAD = 2.6
const BLEED_STRENGTH = 0.7
const SPLASH_PUSH = 9
const MAX_STEP = 1 / 120
const WARM_UP_SECONDS = 1.5
const RELEASE_GAP = 0.18
const REBOUND_SECONDS = 0.09
// Balls of a falling drop's tail: how far up it, and how big, as parts of the drop
const TAIL = [
  [0.15, 0.62],
  [0.55, 0.4],
  [1, 0.22],
] as const
const WOBBLE: Spring = { stiffness: 260, damping: 7 }
const DROP: Spring = { stiffness: 1300, damping: 16 }

function stepSpring<K extends string, V extends string>(
  body: Record<K | V, number>,
  key: K,
  velocityKey: V,
  target: number,
  spring: Spring,
  dt: number,
) {
  const force =
    -spring.stiffness * (body[key] - target) -
    spring.damping * body[velocityKey]
  body[velocityKey] += force * dt
  body[key] += body[velocityKey] * dt
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}
