import { type RefObject, useEffect, useMemo, useRef } from 'react'
import { readableColor } from '../../color'
import { type ThemeTokens, useAnimationFrame } from '../../hooks'
import { getPlaybackStart, type LabBatch } from '../../schedule'
import type { Faucet, FaucetSet } from './faucets'
import {
  BallBuffer,
  dissolveInto,
  type GooRenderer,
  type GooTheme,
  toGooColor,
} from './goo'
import { createGooRenderer } from './gooRenderer'
import {
  type DripColors,
  type DripHighlight,
  type DripLayout,
  DripScene,
} from './scene'

/**
 * Runs the drip and draws it: the goo into `goo`, a canvas of its own, and
 * Ethereum's icon riding the pool in `buoy`. Moves with every frame while on
 * screen; without motion, draws a still frame whenever what it shows changes.
 * The scene is handed back for the pointer to poke and stir.
 */
export function useDripScene({
  goo,
  buoy,
  faucetSet,
  batches,
  layout,
  tokens,
  highlight,
  onScreen,
  reduced,
}: {
  goo: RefObject<HTMLDivElement | null>
  buoy: RefObject<HTMLDivElement | null>
  faucetSet: FaucetSet
  batches: LabBatch[]
  layout: DripLayout | undefined
  tokens: ThemeTokens
  highlight: DripHighlight | undefined
  onScreen: boolean
  reduced: boolean
}): RefObject<DripScene | undefined> {
  const palette = useMemo(
    () => getPalette(faucetSet.faucets, tokens),
    [faucetSet, tokens],
  )
  const rendererRef = useRef<GooRenderer>(undefined)
  const sceneRef = useRef<DripScene>(undefined)
  const ballsRef = useRef(new BallBuffer(256))
  const highlightRef = useRef(highlight)
  highlightRef.current = highlight

  useEffect(() => {
    const container = goo.current
    if (!container) return
    const renderer = createGooRenderer(container)
    rendererRef.current = renderer
    return () => {
      renderer.dispose()
      rendererRef.current = undefined
    }
  }, [goo])

  useEffect(() => {
    if (layout) rendererRef.current?.resize(layout.width, layout.height)
  }, [layout])

  useEffect(() => {
    if (!layout) return
    // a resize keeps the clock, so the drip goes on where it was
    const clock = sceneRef.current?.clock ?? getPlaybackStart()
    const scene = new DripScene(faucetSet, batches, layout, clock)
    scene.setHighlight(highlightRef.current)
    scene.settleEmphasis()
    if (reduced) scene.freeze()
    else scene.warmUp()
    sceneRef.current = scene
  }, [faucetSet, batches, layout, reduced])

  useEffect(() => {
    sceneRef.current?.setHighlight(highlight)
  }, [highlight])

  const draw = () => {
    const scene = sceneRef.current
    const renderer = rendererRef.current
    if (!scene || !renderer) return
    const balls = ballsRef.current
    scene.collectBalls(balls, palette.colors)
    renderer.render({
      balls,
      wave: scene.wave,
      poolTop: scene.layout.poolTop,
      poolReach: scene.layout.poolReach,
      poolLip: scene.layout.poolLip,
      poolCorner: POOL_CORNER,
      theme: withPoolEmphasis(palette.theme, scene.poolEmphasis),
    })
    placeBuoy(buoy.current, scene)
  }

  const running = onScreen && !reduced && layout !== undefined
  // the first frames compile the shader and decode icons, so they don't count
  const pace = useRef({ frames: -PACE_FRAMES, seconds: 0 })
  useAnimationFrame((dt) => {
    const scene = sceneRef.current
    if (!scene) return
    scene.advance(dt)
    draw()
    // a slow GPU draws fewer pixels rather than dropping frames
    const p = pace.current
    p.frames++
    if (p.frames <= 0) return
    p.seconds += dt
    if (p.frames < PACE_FRAMES) return
    if (p.seconds / p.frames > SLOW_FRAME) rendererRef.current?.lowerDensity()
    p.frames = 0
    p.seconds = 0
  }, running)

  // biome-ignore lint/correctness/useExhaustiveDependencies: draw reads the latest of these
  useEffect(() => {
    if (running) return
    const scene = sceneRef.current
    if (!scene) return
    scene.setHighlight(highlight)
    scene.settleEmphasis()
    draw()
  }, [running, highlight, palette, layout, faucetSet, reduced])

  return sceneRef
}

const PACE_FRAMES = 90
// slower than this on average, and the goo is drawn at a lower density
const SLOW_FRAME = 1 / 40
// the card's own rounding, so the pool sits in it like a vessel
const POOL_CORNER = 12

interface Palette {
  colors: DripColors
  theme: GooTheme
}

function getPalette(faucets: Faucet[], tokens: ThemeTokens): Palette {
  const theme = tokens.isDark ? DARK_GOO : LIGHT_GOO
  const goo = faucets.map((f) =>
    toGooColor(readableColor(f.poster.color, tokens.surface)),
  )
  const bleed = goo.map((color) => dissolveInto(color, theme.poolTop))
  const pearl = tokens.isDark ? DARK_PEARL : LIGHT_PEARL
  return { colors: { goo, bleed, pearl }, theme }
}

const LIGHT_PEARL = toGooColor('#FFFFFF')
const DARK_PEARL = toGooColor('#E6E8F2')

const LIGHT_GOO: GooTheme = {
  light: normalize(-0.45, -0.62, 0.64),
  shade: 0.13,
  rim: -0.07,
  specular: 0.6,
  sheen: 0,
  halo: 0.12,
  bulge: 11,
  poolTop: toGooColor('#6C85EF'),
  poolDeep: toGooColor('#4454C4'),
  poolOpacity: 1,
  poolSaturation: 1,
}

// a deeper pool and a brighter shine, so the goo glows on the dark card
const DARK_GOO: GooTheme = {
  light: normalize(-0.45, -0.62, 0.64),
  shade: 0.12,
  rim: 0.03,
  specular: 0.8,
  sheen: 0.05,
  halo: 0.22,
  bulge: 11,
  poolTop: toGooColor('#4C5FD0'),
  poolDeep: toGooColor('#232C80'),
  poolOpacity: 1,
  poolSaturation: 1,
}

/** The pool steps back a little too while a poster is highlighted */
function withPoolEmphasis(theme: GooTheme, emphasis: number): GooTheme {
  if (emphasis >= 1) return theme
  return {
    ...theme,
    poolOpacity: 0.85 + 0.15 * emphasis,
    poolSaturation: 0.6 + 0.4 * emphasis,
  }
}

function placeBuoy(element: HTMLElement | null, scene: DripScene) {
  if (!element) return
  const { x, y, tilt } = scene.buoyCenter()
  element.style.transform = `translate(${x}px, ${y}px) rotate(${tilt}rad)`
}

function normalize(x: number, y: number, z: number): [number, number, number] {
  const length = Math.hypot(x, y, z)
  return [x / length, y / length, z / length]
}
