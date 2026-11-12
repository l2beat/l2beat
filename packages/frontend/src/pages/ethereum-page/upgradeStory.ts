import type { DailyPoint, Upgrade } from './live/simulatedHistory'
import { median, TRANSFER_GAS } from './metrics'

const DAY = 86_400
/** Long enough to smooth out a busy day, short enough to stay near the upgrade */
export const WINDOW_DAYS = 30

/**
 * EIPs each upgrade shipped that bear on what this section measures: blob
 * space and fees. Real numbers only, linked so readers can check them.
 */
export const UPGRADE_EIPS: Record<string, { number: number; title: string }[]> =
  {
    Dencun: [
      { number: 4844, title: 'Shard blob transactions' },
      { number: 7516, title: 'BLOBBASEFEE opcode' },
    ],
    Pectra: [
      { number: 7691, title: 'Blob throughput increase' },
      { number: 7623, title: 'Increase calldata cost' },
    ],
    Fusaka: [
      { number: 7594, title: 'PeerDAS' },
      { number: 7892, title: 'Blob parameter only hardforks' },
    ],
    BPO2: [{ number: 7892, title: 'Blob parameter only hardforks' }],
  }

export function eipUrl(number: number) {
  return `https://eips.ethereum.org/EIPS/eip-${number}`
}

export interface Measure {
  /** Medians of the complete days before and after, undefined when too few */
  before: number | undefined
  after: number | undefined
  /** Every day of the two windows, for the sparkline */
  days: { t: number; v: number }[]
  /** Index of the upgrade's first day in `days` */
  forkIndex: number
}

export interface Stop {
  upgrade: Upgrade
  /** What sending ETH costs at the median base fee, in ETH: the upgrade's effect without ETH's price moving it */
  transferEth: Measure
  /** The same in USD at each day's price, as a secondary figure */
  transferUsd: Measure
  blobs: Measure
  headline: string
  /** The next upgrade is close enough that their windows share days */
  overlapsWith: string | undefined
}

export function upgradeStops(
  history: DailyPoint[],
  upgrades: Upgrade[],
): Stop[] {
  return upgrades.map((upgrade, i) => {
    const at = upgrade.timestamp
    const transferEth = measure(
      history,
      at,
      (p) => (p.medianBaseFeeGwei * TRANSFER_GAS) / 1e9,
    )
    const blobs = measure(history, at, (p) => p.avgBlobsPerBlock)
    const next = upgrades[i + 1]
    return {
      upgrade,
      transferEth,
      transferUsd: measure(history, at, (p) => p.transferCostUsd),
      blobs,
      headline: headline(transferEth, blobs),
      // this one's days after and the next one's days before share dates
      overlapsWith:
        next && next.timestamp - WINDOW_DAYS * DAY < at + WINDOW_DAYS * DAY
          ? next.name
          : undefined,
    }
  })
}

function measure(
  history: DailyPoint[],
  at: number,
  pick: (p: DailyPoint) => number,
): Measure {
  const before = history.filter(
    (p) => p.timestamp < at && p.timestamp >= at - WINDOW_DAYS * DAY,
  )
  const after = history.filter(
    (p) => p.timestamp >= at && p.timestamp < at + WINDOW_DAYS * DAY,
  )
  // a window still filling up (an upgrade under 30 days old) makes no claim
  const enough = (days: DailyPoint[]) => days.length >= WINDOW_DAYS * 0.8
  return {
    before: enough(before) ? median(before.map(pick)) : undefined,
    after: enough(after) ? median(after.map(pick)) : undefined,
    days: [...before, ...after].map((p) => ({ t: p.timestamp, v: pick(p) })),
    forkIndex: before.length,
  }
}

export type Change =
  | { kind: 'opened'; after: number }
  | { kind: 'up' | 'down'; ratio: number }
  | { kind: 'flat' }
  | { kind: 'unknown' }

/** Under 10% either way is noise in a 30-day median, not an effect */
const FLAT = 0.1

export function change(m: Pick<Measure, 'before' | 'after'>): Change {
  const { before, after } = m
  if (before === undefined || after === undefined) return { kind: 'unknown' }
  if (before < 0.05 && after >= 0.05) return { kind: 'opened', after }
  if (before <= 0) return { kind: 'flat' }
  const ratio = after / before
  if (Math.abs(ratio - 1) < FLAT) return { kind: 'flat' }
  return { kind: ratio > 1 ? 'up' : 'down', ratio }
}

/** "7× cheaper" past a doubling, "35% cheaper" below it */
export function size(ratio: number, more: string, less: string) {
  const factor = ratio >= 1 ? ratio : 1 / ratio
  if (factor >= 2) return `${trim(factor)}× ${ratio >= 1 ? more : less}`
  return `${Math.round(Math.abs(ratio - 1) * 100)}% ${ratio >= 1 ? more : less}`
}

/**
 * The stop's claim, written from the medians: whichever effect was larger
 * leads, and a flat or rising fee is said plainly, never left out
 */
export function headline(
  transfer: Pick<Measure, 'before' | 'after'>,
  blobs: Pick<Measure, 'before' | 'after'>,
): string {
  const fee = change(transfer)
  const blob = change(blobs)
  if (fee.kind === 'unknown' || blob.kind === 'unknown') {
    return 'Too recent to tell: the 30 days after are not complete yet'
  }
  const feeText =
    fee.kind === 'flat' || fee.kind === 'opened'
      ? 'fees barely moved'
      : `sending ETH got ${size(fee.ratio, 'dearer', 'cheaper')}`
  if (blob.kind === 'opened') {
    return capitalize(
      `blob space opened: from none to ${blob.after.toFixed(1)} blobs a block, and ${feeText}`,
    )
  }
  const blobText = blobPhrase(blob)
  if (fee.kind === 'flat' && blob.kind === 'flat') {
    return 'Little changed in the 30 days either side: fees and blob use held level'
  }
  if (fee.kind === 'flat') {
    return blob.kind === 'up'
      ? `Fees barely moved; the gain was blob room: ${blobText}`
      : capitalize(`fees barely moved, and ${blobText}`)
  }
  const feeFirst = strength(fee) >= strength(blob)
  return capitalize(
    feeFirst ? `${feeText}, and ${blobText}` : `${blobText}, and ${feeText}`,
  )
}

function blobPhrase(c: Change) {
  if (c.kind !== 'up' && c.kind !== 'down') return 'blob use barely moved'
  if (c.kind === 'up' && c.ratio >= 2) {
    return `blocks carried ${trim(c.ratio)}× the blobs`
  }
  return `blocks carried ${size(c.ratio, 'more', 'fewer')} blobs`
}

function strength(c: Change) {
  return c.kind === 'up' || c.kind === 'down' ? Math.abs(Math.log(c.ratio)) : 0
}

function trim(n: number) {
  return n >= 10 ? Math.round(n).toString() : n.toFixed(1).replace(/\.0$/, '')
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
