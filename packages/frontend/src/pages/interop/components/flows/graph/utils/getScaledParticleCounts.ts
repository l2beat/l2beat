import {
  DOLLARS_PER_PARTICLE,
  DOLLARS_PER_PARTICLE_EXTENSION_STEP,
  DOLLARS_PER_PARTICLE_OPTIONS,
  MAX_PARTICLES_PER_FLOW,
  MAX_TOTAL_PARTICLES,
} from '../../consts'

interface ScaledParticleResult {
  counts: number[]
  dollarsPerParticle: number
}

/**
 * Given base particle counts (computed at baseDollarsPerParticle), finds the
 * lowest allowed dollars-per-particle value (one of
 * DOLLARS_PER_PARTICLE_OPTIONS, or beyond the last option a multiple of
 * DOLLARS_PER_PARTICLE_EXTENSION_STEP) where both constraints are satisfied:
 *   - no single flow exceeds MAX_PARTICLES_PER_FLOW
 *   - total across all flows does not exceed MAX_TOTAL_PARTICLES
 */
export function getScaledParticleCounts(
  baseExactCounts: number[],
  baseDollarsPerParticle: number = DOLLARS_PER_PARTICLE,
): ScaledParticleResult {
  if (baseExactCounts.length === 0)
    return { counts: [], dollarsPerParticle: baseDollarsPerParticle }

  const maxBaseCount = Math.max(...baseExactCounts)
  const totalBaseCount = baseExactCounts.reduce((sum, c) => sum + c, 0)

  const minDppForPerFlowCap =
    (maxBaseCount * baseDollarsPerParticle) / MAX_PARTICLES_PER_FLOW
  const minDppForTotalCap =
    (totalBaseCount * baseDollarsPerParticle) / MAX_TOTAL_PARTICLES
  const minRequiredDpp = Math.max(minDppForPerFlowCap, minDppForTotalCap)

  let dollarsPerParticle = Math.max(
    baseDollarsPerParticle,
    nextAllowedDpp(minRequiredDpp),
  )

  let scale = baseDollarsPerParticle / dollarsPerParticle
  let counts = baseExactCounts.map((c) => c * scale)

  // Closed-form math can land a hair above the caps due to floating-point
  // rounding (e.g. total = 700.0000000003). Re-verify and bump one value if so.
  const maxCount = Math.max(...counts)
  const totalCount = counts.reduce((sum, c) => sum + c, 0)
  if (maxCount > MAX_PARTICLES_PER_FLOW || totalCount > MAX_TOTAL_PARTICLES) {
    dollarsPerParticle = nextAllowedDppAbove(dollarsPerParticle)
    scale = baseDollarsPerParticle / dollarsPerParticle
    counts = baseExactCounts.map((c) => c * scale)
  }

  return { counts, dollarsPerParticle }
}

/** The smallest allowed dollars-per-particle value that is >= min */
function nextAllowedDpp(min: number): number {
  const option = DOLLARS_PER_PARTICLE_OPTIONS.find((o) => o >= min)
  if (option !== undefined) return option
  return (
    Math.ceil(min / DOLLARS_PER_PARTICLE_EXTENSION_STEP) *
    DOLLARS_PER_PARTICLE_EXTENSION_STEP
  )
}

/** The smallest allowed dollars-per-particle value that is strictly > value */
function nextAllowedDppAbove(value: number): number {
  const option = DOLLARS_PER_PARTICLE_OPTIONS.find((o) => o > value)
  if (option !== undefined) return option
  return (
    (Math.floor(value / DOLLARS_PER_PARTICLE_EXTENSION_STEP) + 1) *
    DOLLARS_PER_PARTICLE_EXTENSION_STEP
  )
}
