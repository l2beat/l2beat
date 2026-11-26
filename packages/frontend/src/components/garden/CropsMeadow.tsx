import { useLayoutEffect, useRef, useState } from 'react'
import { getStableFraction } from '~/utils/getStableFraction'
import { CropPlant } from './CropPlant'

// The CROPS guide's meadow behind the table row of a project the garden
// lists: two hills, a sun and a few flowers, laid out from a seed (the
// project id), so each project keeps its own meadow.
// The row must be `relative isolate` (the `crops` row background): the meadow
// fills it from behind the cells, and the pinned cells cover its left end.

/** Pixels between two flowers, so they read as a few, not a border. */
const FLOWER_SPACING = 110
/** One flower per this many pixels of row, at least two. */
const PIXELS_PER_FLOWER = 240
/** Space kept clear around the text and icons of the row. */
const CONTENT_MARGIN = 2

interface Box {
  left: number
  right: number
  top: number
  bottom: number
}

interface Meadow {
  width: number
  height: number
  /** Where the unpinned cells start; the hills rise from here. */
  start: number
  flowers: { x: number; size: number; delay: number }[]
  sun: { x: number; y: number } | undefined
}

export function CropsMeadow({ seed }: { seed: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [meadow, setMeadow] = useState<Meadow>()

  // Where the flowers fit depends on the rendered cells, so the meadow is
  // laid out in the browser and grows in after the page loads.
  useLayoutEffect(() => {
    const row = ref.current?.closest('tr')
    if (!row) return
    const update = () => setMeadow(layOutMeadow(row, seed))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(row)
    return () => observer.disconnect()
  }, [seed])

  return (
    <span
      ref={ref}
      aria-hidden
      data-crops-meadow
      className="-z-10 pointer-events-none absolute inset-0 overflow-hidden"
    >
      {meadow && <MeadowScene meadow={meadow} seed={seed} />}
    </span>
  )
}

function MeadowScene({ meadow, seed }: { meadow: Meadow; seed: string }) {
  const { width, height, start, flowers, sun } = meadow
  const random = (salt: string) => getStableFraction(`${salt}:${seed}`)
  return (
    <>
      {sun && (
        <svg
          width={30}
          height={30}
          viewBox="-15 -15 30 30"
          className="absolute text-garden-sun"
          style={{ left: sun.x - 15, top: sun.y - 15 }}
        >
          <circle r="14" className="fill-garden-sun/25" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              y1="-10.5"
              y2="-13.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r="7.5" fill="currentColor" />
        </svg>
      )}
      <svg
        width={width}
        height={height}
        className="absolute inset-0"
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          d={getRidge(start, width, height, 15, 11, random('far'))}
          className="fill-(--garden-hill-far)"
        />
        <path
          d={getRidge(start, width, height, 6, 7, random('near'))}
          className="fill-(--garden-hill-near)"
        />
      </svg>
      {flowers.map((flower) => (
        <span
          key={flower.x}
          className="absolute"
          style={{ left: flower.x - flower.size / 2, bottom: 5 }}
        >
          <CropPlant
            status="reviewed"
            sentiment="good"
            delay={flower.delay}
            width={flower.size}
            soil={false}
            motion="grow"
            jitterKey={`${seed}:${flower.x}`}
          />
        </span>
      ))}
    </>
  )
}

/**
 * A ridge `base` px tall that swells by up to `swell` px in two seeded waves,
 * rising out of the ground where the unpinned cells start.
 */
function getRidge(
  start: number,
  width: number,
  height: number,
  base: number,
  swell: number,
  random: number,
) {
  const span = width - start
  const points = Array.from({ length: 5 }, (_, i) => {
    const t = i / 4
    const wave = Math.sin((t * 2 + random) * Math.PI * 1.5)
    const rise = Math.min(1, t * 6)
    return {
      x: start + span * t,
      y: height - rise * (base + swell * (0.5 + wave / 2)),
    }
  })
  let d = `M${start} ${height} L${points[0]?.x} ${points[0]?.y}`
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (!a || !b) continue
    const mid = (a.x + b.x) / 2
    d += ` C${mid} ${a.y} ${mid} ${b.y} ${b.x} ${b.y}`
  }
  return `${d} L${width} ${height} Z`
}

function layOutMeadow(row: HTMLTableRowElement, seed: string): Meadow {
  const rowBox = row.getBoundingClientRect()
  const toRow = (rect: DOMRect): Box => ({
    left: rect.left - rowBox.left,
    right: rect.right - rowBox.left,
    top: rect.top - rowBox.top,
    bottom: rect.bottom - rowBox.top,
  })
  const cells = [...row.cells]
  const firstUnpinned = cells.find(
    (cell) => getComputedStyle(cell).position !== 'sticky',
  )
  const start = firstUnpinned
    ? firstUnpinned.getBoundingClientRect().left - rowBox.left
    : 0
  const content = getContentBoxes(row).map(toRow)
  const isClear = (box: Box) =>
    content.every(
      (other) =>
        box.right < other.left - CONTENT_MARGIN ||
        box.left > other.right + CONTENT_MARGIN ||
        box.bottom < other.top - CONTENT_MARGIN ||
        box.top > other.bottom + CONTENT_MARGIN,
    )

  const width = rowBox.width
  const height = rowBox.height
  const random = (salt: string) => getStableFraction(`${salt}:${seed}`)

  // Candidate spots in a seeded order: the same project always gets the
  // same flowers, and a different one gets different flowers.
  const candidates = range(start + 16, width - 16, 6).sort(
    (a, b) => random(`x${a}`) - random(`x${b}`),
  )
  const target = Math.max(2, Math.round((width - start) / PIXELS_PER_FLOWER))
  const flowers: Meadow['flowers'] = []
  for (const x of candidates) {
    if (flowers.length === target) break
    const size = 16 + Math.round(random(`size${x}`) * 6)
    const tooClose = flowers.some((f) => Math.abs(f.x - x) < FLOWER_SPACING)
    const box = {
      left: x - size / 2,
      right: x + size / 2,
      top: height - 5 - size,
      bottom: height,
    }
    if (!tooClose && isClear(box)) {
      flowers.push({ x, size, delay: 0.2 + flowers.length * 0.12 })
    }
  }

  // Toward the right end where it fits, else wherever it does.
  const sun = range(start + 20, width - 20, 8)
    .sort(
      (a, b) => random(`sun${a}`) - a / width - (random(`sun${b}`) - b / width),
    )
    .map((x) => ({ x, y: 20 }))
    .find(({ x, y }) =>
      isClear({ left: x - 15, right: x + 15, top: y - 15, bottom: y + 15 }),
    )

  return { width, height, start, flowers, sun }
}

/** The text, images and icons the meadow keeps clear of. */
function getContentBoxes(row: HTMLTableRowElement): DOMRect[] {
  const boxes: DOMRect[] = []
  const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.textContent?.trim() || !isShown(node.parentElement)) continue
    const text = document.createRange()
    text.selectNodeContents(node)
    boxes.push(...text.getClientRects())
  }
  for (const element of row.querySelectorAll('img, svg')) {
    if (element.closest('[data-crops-meadow]') || !isShown(element)) continue
    boxes.push(element.getBoundingClientRect())
  }
  return boxes.filter((box) => box.width > 0 && box.height > 0)
}

/** Seen on screen: screen-reader copies (tooltip text) take no room. */
function isShown(element: Element | null) {
  return (
    !!element &&
    !element.closest('.sr-only') &&
    element.checkVisibility({ opacityProperty: true, visibilityProperty: true })
  )
}

function range(from: number, to: number, step: number) {
  const values: number[] = []
  for (let value = from; value <= to; value += step) values.push(value)
  return values
}
