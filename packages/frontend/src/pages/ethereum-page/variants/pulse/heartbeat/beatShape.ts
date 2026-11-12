import type { BlockLimits, HeadBlock } from '../../../live/types'

/**
 * One block as one heartbeat. The spike is how much gas the block used and
 * the wave after it how many blobs it carried, both scaled so their targets
 * sit on the same line: anything above the line pushes the next block's fee
 * up, for transactions and blobs alike.
 */
export interface TraceGeometry {
  /** Pixels per slot */
  slotWidth: number
  height: number
  baseline: number
  /** Height of the target line above the baseline */
  targetRise: number
}

export function toGeometry(width: number, height: number): TraceGeometry {
  return {
    slotWidth: Math.min(64, Math.max(40, width / 18)),
    height,
    baseline: height * 0.76,
    targetRise: height * 0.29,
  }
}

/** Where in its slot the beat ends: the rest of the slot is flat line */
export const BEAT_END = 0.44
/** How far into its slot the pen is when a block arrives, just past the beat */
export const PEN_LEAD = 0.46

export interface BeatPaths {
  line: string
  wave: string | undefined
  /** The wave's own outline, drawn over the line in the blob colour */
  waveLine: string | undefined
  peakY: number
  waveY: number
}

export function beatPaths(
  block: HeadBlock,
  limits: BlockLimits,
  g: TraceGeometry,
): BeatPaths {
  const w = g.slotWidth
  const b = g.baseline
  const x = (fraction: number) => round(fraction * w)
  if (block.status === 'missed') {
    return {
      line: `M0 ${b}H${w}`,
      wave: undefined,
      waveLine: undefined,
      peakY: b,
      waveY: b,
    }
  }
  const gasRise =
    Math.max(0.12, Math.min(block.gasUsed, block.gasLimit) / limits.gasTarget) *
    g.targetRise
  const blobRise = (block.blobCount / limits.targetBlobs) * g.targetRise
  const peakY = round(b - gasRise)
  const waveY = round(b - blobRise)
  // a cubic peaks at three quarters of the way to its control points
  const waveControl = round(b - blobRise / 0.75)
  const p = round(b - g.height * 0.035)
  const q = round(b + g.height * 0.035)
  const s = round(b + g.height * 0.1)
  const waveStart = `M${x(0.24)} ${b}`
  const waveCurve = `C${x(0.27)} ${waveControl} ${x(0.39)} ${waveControl} ${x(BEAT_END - 0.02)} ${b}`
  const line = [
    `M0 ${b}`,
    `H${x(0.03)}`,
    `Q${x(0.06)} ${p} ${x(0.09)} ${b}`,
    `H${x(0.115)}`,
    `L${x(0.13)} ${q}`,
    `L${x(0.15)} ${peakY}`,
    `L${x(0.172)} ${s}`,
    `L${x(0.195)} ${b}`,
    `H${x(0.24)}`,
    waveCurve,
    `H${w}`,
  ].join('')
  if (block.blobCount === 0) {
    return { line, wave: undefined, waveLine: undefined, peakY, waveY }
  }
  return {
    line,
    wave: `${waveStart}${waveCurve}Z`,
    waveLine: `${waveStart}${waveCurve}`,
    peakY,
    waveY,
  }
}

function round(value: number) {
  return Math.round(value * 10) / 10
}
