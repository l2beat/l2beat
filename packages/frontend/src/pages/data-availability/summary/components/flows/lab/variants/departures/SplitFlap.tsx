import {
  createContext,
  Fragment,
  memo,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { cn } from '~/utils/cn'
import { Flap, type FlapTone, type TileFaces } from './flap'

/**
 * Whether the board moves: tiles turn leaf by leaf and rows slide. With
 * reduced motion, values swap at once and rows jump to their places.
 */
export const BoardMotion = createContext(true)

/** Between one changed tile starting to turn and the next one, left to right */
const STAGGER_MS = 24
const BLINK: Keyframe[] = [{ opacity: 1 }, { opacity: 0.18 }, { opacity: 1 }]
const NO_COLONS: number[] = []

interface FlapTextProps {
  /** In the capitals the board has. Padded or cut to `length` */
  value: string
  length: number
  tone?: FlapTone
  align?: 'left' | 'right'
  /** Tiles after which a colon is printed on the board, as in 11:53:07 */
  colonsAfter?: number[]
  /** Wait before the first value turns in, so a board fills row by row */
  delay?: number
  /** Blinks the characters a few times, as a board flags what just happened */
  blink?: boolean
  className?: string
}

/**
 * A value on split-flap tiles. When it changes, only the tiles whose
 * character changed turn, one after another from the left.
 */
export const FlapText = memo(function FlapText({
  value,
  length,
  tone = 'plain',
  align = 'left',
  colonsAfter = NO_COLONS,
  delay = 0,
  blink = false,
  className,
}: FlapTextProps) {
  const animate = useContext(BoardMotion)
  const tiles = useRef<(HTMLSpanElement | null)[]>([])
  const flaps = useRef<(Flap | undefined)[]>([])
  const hasShown = useRef(false)
  const text =
    align === 'right'
      ? value.slice(0, length).padStart(length)
      : value.slice(0, length).padEnd(length)

  useLayoutEffect(() => {
    flaps.current = tiles.current
      .slice(0, length)
      .map((tile, i) => (tile ? new Flap(facesOf(tile), i) : undefined))
    return () => {
      for (const flap of flaps.current) flap?.stop()
      flaps.current = []
    }
  }, [length])

  useLayoutEffect(() => {
    const start = hasShown.current ? 0 : delay
    hasShown.current = true
    let turned = 0
    flaps.current.forEach((flap, i) => {
      const face = { char: text[i] ?? ' ', tone }
      if (!flap?.differsFrom(face)) return
      flap.turnTo(face, animate ? start + turned++ * STAGGER_MS : undefined)
    })
  }, [text, tone, delay, animate])

  useEffect(() => {
    if (!blink || !animate) return
    const blinks = tiles.current.map((tile) =>
      tile?.firstElementChild?.animate(BLINK, {
        duration: 520,
        // once the tiles have turned to what it says
        delay: 360,
        iterations: 3,
        easing: 'ease-in-out',
      }),
    )
    return () => {
      for (const animation of blinks) animation?.cancel()
    }
  }, [blink, animate])

  return (
    <span
      aria-hidden
      className={cn('flex items-center gap-(--tile-gap)', className)}
    >
      {Array.from({ length }, (_, i) => (
        <Fragment key={i}>
          <FlapTile
            tileRef={(tile) => {
              tiles.current[i] = tile
            }}
          />
          {colonsAfter.includes(i) && <FlapColon />}
        </Fragment>
      ))}
    </span>
  )
})

// The tile is a shade lighter above its hinge, as a light from above would
// have it, and every leaf carries the half of the gradient it covers
const TOP_HALF = 'linear-gradient(180deg, #2b2e36, #23262d)'
const BOTTOM_HALF = 'linear-gradient(180deg, #1e2127, #17191e)'
const TILE =
  'linear-gradient(180deg, #2b2e36 0%, #23262d 50%, #1e2127 50%, #17191e 100%)'

const GLYPH =
  'before:absolute before:inset-x-0 before:h-(--tile-h) before:text-center before:leading-(--tile-h) before:content-[attr(data-char)] data-[tone=amber]:text-[#f5b301]'
const LEAF = 'absolute inset-x-0 h-1/2 overflow-hidden backface-hidden'
const TOP = 'top-0 rounded-t-[3px] before:top-0'
const BOTTOM = 'bottom-0 rounded-b-[3px] before:bottom-0'
const HIDDEN = { visibility: 'hidden' } as const

function FlapTile({
  tileRef,
}: {
  tileRef: (tile: HTMLSpanElement | null) => void
}) {
  return (
    <span
      ref={tileRef}
      className="relative block h-(--tile-h) w-(--tile-w) shrink-0 rounded-[3px] shadow-[0_1px_0_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.07)]"
      style={{ background: TILE }}
    >
      <span
        className={cn(GLYPH, 'absolute inset-0 before:top-0')}
        data-char=" "
        data-tone="plain"
      />
      <span
        className={cn(GLYPH, LEAF, BOTTOM)}
        style={{ ...HIDDEN, background: BOTTOM_HALF }}
      />
      <span
        className={cn(GLYPH, LEAF, TOP, 'origin-bottom')}
        style={{ ...HIDDEN, background: TOP_HALF }}
      />
      <span
        className={cn(GLYPH, LEAF, BOTTOM, 'origin-top')}
        style={{ ...HIDDEN, background: BOTTOM_HALF }}
      />
      {/* the gap between the two leaves, over the character as on the real thing */}
      <span className="absolute inset-x-0 top-[calc(50%-1px)] h-0.5 bg-[linear-gradient(180deg,#08090b_50%,rgba(255,255,255,0.05)_50%)]" />
    </span>
  )
}

function FlapColon() {
  return (
    <span className="flex h-(--tile-h) w-(--colon-w) shrink-0 flex-col items-center justify-center gap-[calc(var(--tile-h)*0.2)]">
      <span className="size-[calc(var(--tile-w)*0.2)] rounded-full bg-[#f3f1ea]/80" />
      <span className="size-[calc(var(--tile-w)*0.2)] rounded-full bg-[#f3f1ea]/80" />
    </span>
  )
}

function facesOf(tile: HTMLElement): TileFaces {
  const [back, under, falling, landing] = Array.from(
    tile.children,
  ) as HTMLElement[]
  if (!back || !under || !falling || !landing) {
    throw new Error('A flap tile has four faces')
  }
  return { back, under, falling, landing }
}
