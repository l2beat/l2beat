import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { prepareCanvas, type ThemeTokens, useAnimationFrame } from '../../hooks'
import type { LabData } from '../../model'
import { drawScene, type FrameState, SandImage } from './draw'
import { GrainColors, grainKeys } from './grainColors'
import { HOUR_SECONDS } from './pour'
import { Sand } from './sand'
import { formatTimeOfDay, type Scene } from './scene'

export type Phase = 'waiting' | 'pouring' | 'done'

export type Hit =
  | { kind: 'grain'; grain: number }
  | { kind: 'hour'; hour: number }

/**
 * Pours the day into the vessel once it is first on screen, and draws every
 * frame of it. Nothing here goes through React state per frame: the sand
 * lives in typed arrays and the clock is written straight into its element.
 */
export function usePour({
  data,
  scene,
  canvasRef,
  clockRef,
  tokens,
  onScreen,
  reducedMotion,
  highlightedPoster,
  hoveredHit,
}: {
  data: LabData
  scene: Scene | undefined
  canvasRef: RefObject<HTMLCanvasElement | null>
  clockRef: RefObject<HTMLElement | null>
  tokens: ThemeTokens
  onScreen: boolean
  reducedMotion: boolean
  /** Index into `data.posters`, -1 for none */
  highlightedPoster: number
  hoveredHit: Hit | undefined
}) {
  const [phase, setPhase] = useState<Phase>('waiting')
  // keeps the loop going after the pour, while colors fade
  const [fading, setFading] = useState(false)
  const pour = useRef<PourState | undefined>(undefined)
  const frame = useRef<FrameState>({
    focus: {
      version: 0,
      posterMuted: new Float32Array(data.posters.length),
      posterPicked: new Float32Array(data.posters.length),
      hourMuted: new Float32Array(24),
    },
    pickedPoster: -1,
    hoveredGrain: -1,
    hoveredHour: -1,
    ending: 0,
    sandOpacity: 1,
  })

  // a new layout pours anew, caught up with where the last one was
  useEffect(() => {
    if (!scene) return
    const before = pour.current
    const sand = new Sand(scene.vessel, scene.plan)
    if (before?.phase === 'done') sand.pourAll()
    else if (before) sand.pourUntil(before.sand.time)
    const { focus } = frame.current
    if (focus.hourMuted.length !== scene.plan.hours) {
      focus.hourMuted = new Float32Array(scene.plan.hours)
      focus.version++
    }
    pour.current = {
      scene,
      sand,
      image: new SandImage(scene.vessel.columns, scene.vessel.rows),
      keys: grainKeys(scene.plan),
      colors: undefined,
      phase: before?.phase ?? 'waiting',
      draining: false,
    }
    setFading(true)
  }, [scene])

  const draw = useCallback(() => {
    const state = pour.current
    const canvas = canvasRef.current
    if (!state || !canvas) return
    const { scene, sand, image, keys } = state
    if (!state.colors || state.colors.tokens !== tokens) {
      state.colors = {
        tokens,
        grains: new GrainColors(data.posters, scene.plan.hours, tokens),
      }
    }
    const { grains } = state.colors
    grains.update(frame.current.focus)
    const ctx = prepareCanvas(canvas, scene.width, scene.height)
    if (!ctx) return
    ctx.clearRect(0, 0, scene.width, scene.height)
    image.paint(sand, keys, grains.table)
    drawScene(ctx, scene, sand, image, tokens, frame.current)
    const clock = clockRef.current
    if (clock) {
      const time = state.draining ? 0 : sand.time
      const hours = Math.min(time / HOUR_SECONDS, scene.plan.hours)
      const text = formatTimeOfDay(data.range[0], hours)
      if (clock.textContent !== text) clock.textContent = text
    }
  }, [canvasRef, clockRef, data, tokens])

  // the pour starts when the vessel is first seen. Without motion, the day
  // shows poured at once, even if motion was turned off halfway
  useEffect(() => {
    const state = pour.current
    if (!scene || state?.scene !== scene || !onScreen) return
    if (reducedMotion) {
      if (state.phase === 'done' && !state.draining) return
      state.draining = false
      state.sand.pourAll()
      state.phase = 'done'
      frame.current.sandOpacity = 1
      frame.current.ending = 1
      setPhase('done')
      draw()
    } else if (state.phase === 'waiting') {
      state.phase = 'pouring'
      setPhase('pouring')
    }
  }, [onScreen, reducedMotion, draw, scene])

  useEffect(() => {
    frame.current.pickedPoster = highlightedPoster
    frame.current.hoveredGrain =
      hoveredHit?.kind === 'grain' ? hoveredHit.grain : -1
    frame.current.hoveredHour =
      hoveredHit?.kind === 'hour' ? hoveredHit.hour : -1
    setFading(true)
    draw()
  }, [highlightedPoster, hoveredHit, draw])

  // while the sand is still, the loop is off, so changes are drawn here
  useEffect(() => {
    if (phase !== 'pouring') draw()
  }, [draw, phase])

  useAnimationFrame(
    (dt) => {
      const state = pour.current
      if (!state) return
      if (state.draining) {
        frame.current.sandOpacity = glide(frame.current.sandOpacity, 0, dt / 2)
        if (frame.current.sandOpacity === 0) {
          state.sand.reset()
          state.draining = false
          frame.current.sandOpacity = 1
        }
      } else if (state.phase === 'pouring') {
        state.sand.advance(dt)
        if (state.sand.isFinished) {
          state.phase = 'done'
          setPhase('done')
          setFading(true)
        }
      }
      const faded = fadeFocus(frame.current, dt)
      const ending = state.phase === 'done' ? 1 : 0
      frame.current.ending = glide(frame.current.ending, ending, dt / 3)
      draw()
      if (
        state.phase !== 'pouring' &&
        faded &&
        frame.current.ending === ending
      ) {
        setFading(false)
      }
    },
    onScreen && (phase === 'pouring' || fading),
  )

  // the last pile fades out first, rather than vanish in a frame
  const pourAgain = useCallback(() => {
    const state = pour.current
    if (!state) return
    state.draining = true
    state.phase = 'pouring'
    setPhase('pouring')
  }, [])

  const hitTest = useCallback((x: number, y: number): Hit | undefined => {
    const state = pour.current
    if (!state) return undefined
    return hitHour(state, x, y) ?? hitGrain(state, x, y)
  }, [])

  return { phase, pourAgain, hitTest }
}

interface PourState {
  scene: Scene
  sand: Sand
  image: SandImage
  keys: Uint32Array
  colors: { tokens: ThemeTokens; grains: GrainColors } | undefined
  phase: Phase
  draining: boolean
}

/**
 * Fades every poster and hour towards what is looked at: the rest to gray,
 * the picked poster to its own color. True once all are there
 */
function fadeFocus(frame: FrameState, dt: number): boolean {
  const { focus, pickedPoster, hoveredHour } = frame
  let settled = true
  let changed = false
  const fade = (values: Float32Array, goalOf: (i: number) => number) => {
    values.forEach((value, i) => {
      const goal = goalOf(i)
      const next = glide(value, goal, dt)
      if (next !== value) {
        values[i] = next
        changed = true
      }
      if (next !== goal) settled = false
    })
  }
  fade(focus.posterMuted, (i) =>
    pickedPoster >= 0 && i !== pickedPoster ? 1 : 0,
  )
  fade(focus.posterPicked, (i) => (i === pickedPoster ? 1 : 0))
  fade(focus.hourMuted, (i) => (hoveredHour >= 0 && i !== hoveredHour ? 1 : 0))
  if (changed) focus.version++
  return settled
}

/** Closes most of the gap quickly and the rest gently, then snaps */
function glide(value: number, target: number, dt: number): number {
  const next = value + (target - value) * (1 - Math.exp(-dt * 14))
  return Math.abs(target - next) < 0.01 ? target : next
}

/** The hour of the ruler under the pointer, the times beside it included */
function hitHour(state: PourState, x: number, y: number): Hit | undefined {
  const { scene, sand } = state
  const { ruler, hourLevels, plan } = scene
  if (x < ruler.x - 10 || x > ruler.labelX + 40) return undefined
  for (let hour = 0; hour < plan.hours; hour++) {
    if (sand.poured <= (plan.pouredBefore[hour] ?? 0)) break
    const bottom = hourLevels[hour] ?? 0
    const top = hourLevels[hour + 1] ?? 0
    if (y <= bottom + (hour === 0 ? 6 : 0) && y >= top) {
      return { kind: 'hour', hour }
    }
  }
  return undefined
}

/** The grain under the pointer, or the nearest one within reach of a finger */
function hitGrain(state: PourState, x: number, y: number): Hit | undefined {
  const { vessel } = state.scene
  const { cells } = state.sand
  const column = (x - vessel.gridX) / vessel.cell
  const row = (y - vessel.gridY) / vessel.cell
  const reach = Math.ceil(5 / vessel.cell)
  let best = -1
  let bestDistance = Number.POSITIVE_INFINITY
  for (let dy = -reach; dy <= reach; dy++) {
    for (let dx = -reach; dx <= reach; dx++) {
      const c = Math.floor(column) + dx
      const r = Math.floor(row) + dy
      if (c < 0 || r < 0 || c >= vessel.columns || r >= vessel.rows) continue
      const grain = cells[r * vessel.columns + c] ?? -1
      if (grain < 0) continue
      const distance = (c + 0.5 - column) ** 2 + (r + 0.5 - row) ** 2
      if (distance < bestDistance) {
        best = grain
        bestDistance = distance
      }
    }
  }
  return best >= 0 ? { kind: 'grain', grain: best } : undefined
}
