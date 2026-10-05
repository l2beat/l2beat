import type { LabData, LabPoster } from '../../model'
import { SLOTS_PER_DAY } from '../../model'
import {
  type HourSummary,
  type PourPlan,
  planPour,
  summarizeHours,
} from './pour'
import {
  buildVessel,
  depthOfShare,
  estimateHeight,
  halfWidth,
  levelOf,
  VESSEL_ASPECT,
  type Vessel,
} from './vessel'

/** Everything laid out for a box of a given size, ready to pour and draw */
export interface Scene {
  width: number
  height: number
  posters: LabPoster[]
  vessel: Vessel
  plan: PourPlan
  hourSummaries: HourSummary[]
  /** Where the sand stands, leveled, when each hour starts, and after the last */
  hourLevels: number[]
  ticks: Tick[]
  /**
   * Blobs per block, each where the vessel holds a day of them: the most it
   * can, the target, and what the day came to, leveled
   */
  labels: { maximum: Label; target: Label; day: Label }
  /** The hours, beside the sand: its spine, and where its times start */
  ruler: { x: number; labelX: number }
}

export interface Label {
  /** Right end of the text */
  x: number
  /** Middle of the text, or of both its lines */
  y: number
  name: string
  value: string
  /** The value under the name, where one line has no room */
  stacked: boolean
  /** Where the line from the label to the vessel starts */
  lineFrom: number
}

export interface Tick {
  hour: number
  y: number
  /** Left out where it would run into the one above */
  label: string | undefined
}

/** Blobs a grain may stand for: round numbers, smallest first */
const BLOBS_PER_GRAIN = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 25, 30, 40, 50]

export const TICK_EVERY_HOURS = 6
/** Between a label's end and the vessel, where its line runs */
const LABEL_OFFSET = 18
const RULER_GAP = 16
const TICK_LABEL_GAP = 10
const LINE_HEIGHT = 15

/**
 * Lays the vessel out as large as the box allows with its labels beside it:
 * blobs per block on its left, at the height they fill it to, and the hours
 * on its right. The largest vessel decides how many blobs a grain is, from a
 * list of round numbers, so that cells × blobs per grain is exactly a day of
 * blocks at the maximum.
 */
export function buildScene({
  data,
  width,
  height,
  density,
  measure,
}: {
  data: LabData
  width: number
  height: number
  density: number
  /** Width of a text in the labels' fonts */
  measure: (text: string, bold: boolean) => number
}): Scene | undefined {
  const capacity = data.maxBlobsPerBlock * SLOTS_PER_DAY
  if (capacity <= 0 || width < 120 || height < 120) return undefined

  // whole device pixels a cell, so every grain is a sharp square
  const cell = Math.round((width < 640 ? 1.5 : 2) * density) / density
  const texts = labelTexts(data)
  const [inline, stacked] = [false, true].map((stack) =>
    measureRoom({ data, texts, width, height, stacked: stack, measure }),
  )
  if (!inline || !stacked) return undefined
  // one line reads easier; stacking is worth it only for a clearly larger vessel
  const room = inline.maxHeight >= stacked.maxHeight * 0.92 ? inline : stacked

  for (const blobsPerGrain of BLOBS_PER_GRAIN) {
    const cellCount = Math.round(capacity / blobsPerGrain)
    const estimate = estimateHeight(cellCount, cell)
    if (estimate + 2 * cell > room.maxHeight) continue

    const leftmost = Math.max(...room.left.map((b) => b.at + b.per * estimate))
    const rightmost = Math.min(
      ...room.right.map((b) => b.at - b.per * estimate),
    )
    const apexX = Math.min(Math.max(width / 2, leftmost), rightmost)
    const free = height - room.padTop - room.padBottom - estimate
    const apexY = room.padTop + Math.max(0, free / 2)
    const vessel = buildVessel({ cellCount, cell, apexX, apexY, density })
    if (vessel.height > room.maxHeight + cell) continue

    const plan = planPour(data, blobsPerGrain)
    const isStacked = room === stacked
    return layOut({
      data,
      width,
      height,
      vessel,
      plan,
      stacked: isStacked,
      texts,
    })
  }
  return undefined
}

/**
 * Where the top vertex may be, along x, for a vessel of a given height:
 * `at + per × height`. Labels hang beside the vessel's wall, so the wider
 * the vessel, the further out they go.
 */
interface Bound {
  at: number
  per: number
}

/**
 * How tall the vessel can be with every label around it: blobs per block on
 * its left, the ruler of hours on its right. Each pair of a left and a right
 * bound caps the height where they would meet.
 */
function measureRoom({
  data,
  texts,
  width,
  height,
  stacked,
  measure,
}: {
  data: LabData
  texts: ReturnType<typeof labelTexts>
  width: number
  height: number
  stacked: boolean
  measure: (text: string, bold: boolean) => number
}) {
  const widthOf = (text: { name: string; value: string }) =>
    stacked
      ? Math.max(measure(text.name, true), measure(text.value, false))
      : measure(`${text.name}, `, true) + measure(text.value, false)
  const capacity = data.maxBlobsPerBlock * SLOTS_PER_DAY
  const atTarget = halfWidth(
    1,
    depthOfShare(data.targetBlobsPerBlock / data.maxBlobsPerBlock),
  )
  const atDay = halfWidth(1, depthOfShare(data.totalBlobs / capacity))
  const waist = VESSEL_ASPECT / 2

  const left: Bound[] = [
    { at: widthOf(texts.maximum) + LABEL_OFFSET, per: 0 },
    { at: widthOf(texts.target) + LABEL_OFFSET, per: atTarget },
    { at: widthOf(texts.day) + LABEL_OFFSET, per: atDay },
    { at: 2, per: waist },
  ]
  const rulerRoom = RULER_GAP + TICK_LABEL_GAP + measure('24:00', false)
  const right: Bound[] = [
    { at: width - rulerRoom - 2, per: atDay },
    { at: width - 2, per: waist },
  ]
  const padTop = stacked ? LINE_HEIGHT + 2 : 9
  const padBottom = 9
  let maxHeight = height - padTop - padBottom
  for (const l of left) {
    for (const r of right) {
      maxHeight = Math.min(maxHeight, (r.at - l.at) / (l.per + r.per))
    }
  }
  return { maxHeight, padTop, padBottom, left, right }
}

function layOut({
  data,
  width,
  height,
  vessel,
  plan,
  stacked,
  texts,
}: {
  data: LabData
  width: number
  height: number
  vessel: Vessel
  plan: PourPlan
  stacked: boolean
  texts: ReturnType<typeof labelTexts>
}): Scene {
  const targetCells =
    (data.targetBlobsPerBlock * SLOTS_PER_DAY) / plan.blobsPerGrain
  const targetY = levelOf(vessel, targetCells)
  const dayY = levelOf(vessel, plan.grainCount)
  const hourLevels = Array.from(plan.pouredBefore, (grains) =>
    levelOf(vessel, grains),
  )

  const halfAt = (y: number) =>
    Math.max(0, halfWidth(vessel.height, y - vessel.apexY))
  const label = (
    text: { name: string; value: string },
    y: number,
    edge: number,
  ): Label => ({
    ...text,
    x: edge - LABEL_OFFSET,
    y,
    stacked,
    lineFrom: edge - LABEL_OFFSET + 6,
  })

  const rulerX = vessel.apexX + halfAt(dayY) + RULER_GAP
  return {
    width,
    height,
    posters: data.posters,
    vessel,
    plan,
    hourSummaries: summarizeHours(data, plan.hours),
    hourLevels,
    ticks: placeTicks(data, plan, hourLevels),
    labels: {
      maximum: label(texts.maximum, vessel.apexY, vessel.apexX),
      target: label(texts.target, targetY, vessel.apexX - halfAt(targetY)),
      day: label(texts.day, dayY, vessel.apexX - halfAt(dayY)),
    },
    ruler: { x: rulerX, labelX: rulerX + TICK_LABEL_GAP },
  }
}

function labelTexts(data: LabData) {
  const perBlock = data.totalBlobs / SLOTS_PER_DAY
  return {
    maximum: {
      name: 'Maximum',
      value: `${data.maxBlobsPerBlock} blobs per block`,
    },
    target: {
      name: 'Target',
      value: `${data.targetBlobsPerBlock} blobs per block`,
    },
    day: {
      name: 'Yesterday',
      value: `${formatPerBlock(perBlock)} blobs per block`,
    },
  }
}

/** Every six hours, without labels running into each other */
function placeTicks(
  data: LabData,
  plan: PourPlan,
  hourLevels: number[],
): Tick[] {
  const ticks: Tick[] = []
  for (let hour = 0; hour <= plan.hours; hour += TICK_EVERY_HOURS) {
    ticks.push({
      hour,
      y: hourLevels[hour] ?? 0,
      label: formatTimeOfDay(data.range[0], hour),
    })
  }
  // the latest keeps its label: it is where the day ended
  let above = Number.NEGATIVE_INFINITY
  for (let i = ticks.length - 1; i >= 0; i--) {
    const tick = ticks[i]
    if (!tick) continue
    if (tick.y - above < LINE_HEIGHT - 1) tick.label = undefined
    else above = tick.y
  }
  return ticks
}

/**
 * The time of day `hours` into the day, to the minute: "14:20", and "24:00"
 * for the end of a day starting at midnight
 */
export function formatTimeOfDay(dayStart: number, hours: number): string {
  const date = new Date((dayStart + Math.floor(hours * 60) * 60) * 1000)
  const minutes = date.getUTCMinutes()
  const isMidnightAfter = hours >= 24 && date.getUTCHours() === 0
  const hour = isMidnightAfter && minutes === 0 ? 24 : date.getUTCHours()
  return `${pad(hour)}:${pad(minutes)}`
}

export function formatPerBlock(blobs: number): string {
  return blobs >= 10 ? blobs.toFixed(1) : blobs.toFixed(2)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
