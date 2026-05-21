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
  const dollarsPerParticle =
    baseDollarsPerParticle + stepsNeeded * DOLLARS_PER_PARTICLE_STEP

  const scale = baseDollarsPerParticle / dollarsPerParticle
  const counts = baseExactCounts.map((c) => c * scale)

  return { counts, dollarsPerParticle }
}
