import {
  DOLLARS_PER_PARTICLE,
  DOLLARS_PER_PARTICLE_STEP,
  MAX_PARTICLES_PER_FLOW,
  MAX_TOTAL_PARTICLES,
} from '../../consts'

interface ScaledParticleResult {
  counts: number[]
  dollarsPerParticle: number
}

/**
 * Given base particle counts (computed at baseDollarsPerParticle), finds the
 * lowest dollars-per-particle value (in DOLLARS_PER_PARTICLE_STEP increments)
 * where both constraints are satisfied:
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
  const minRequiredDpp = Math.max(
    baseDollarsPerParticle,
    minDppForPerFlowCap,
    minDppForTotalCap,
  )

  const stepsNeeded = Math.max(
    0,
    Math.ceil(
      (minRequiredDpp - baseDollarsPerParticle) / DOLLARS_PER_PARTICLE_STEP,
    ),
  )
  let dollarsPerParticle =
    baseDollarsPerParticle + stepsNeeded * DOLLARS_PER_PARTICLE_STEP

  let scale = baseDollarsPerParticle / dollarsPerParticle
  let counts = baseExactCounts.map((c) => c * scale)

  // Closed-form math can land a hair above the caps due to floating-point
  // rounding (e.g. total = 700.0000000003). Re-verify and bump one step if so.
  const maxCount = Math.max(...counts)
  const totalCount = counts.reduce((sum, c) => sum + c, 0)
  if (maxCount > MAX_PARTICLES_PER_FLOW || totalCount > MAX_TOTAL_PARTICLES) {
    dollarsPerParticle += DOLLARS_PER_PARTICLE_STEP
    scale = baseDollarsPerParticle / dollarsPerParticle
    counts = baseExactCounts.map((c) => c * scale)
  }

  return { counts, dollarsPerParticle }
}
