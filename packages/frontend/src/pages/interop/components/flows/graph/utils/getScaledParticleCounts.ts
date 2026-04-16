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
 * Given base particle counts (computed at DOLLARS_PER_PARTICLE), finds the
 * lowest dollars-per-particle value (in DOLLARS_PER_PARTICLE_STEP increments)
 * where both constraints are satisfied:
 *   - no single flow exceeds MAX_PARTICLES_PER_FLOW
 *   - total across all flows does not exceed MAX_TOTAL_PARTICLES
 */
export function getScaledParticleCounts(
  baseExactCounts: number[],
): ScaledParticleResult {
  if (baseExactCounts.length === 0)
    return { counts: [], dollarsPerParticle: DOLLARS_PER_PARTICLE }

  let dollarsPerParticle = DOLLARS_PER_PARTICLE

  while (true) {
    const scale = DOLLARS_PER_PARTICLE / dollarsPerParticle
    const counts = baseExactCounts.map((c) => c * scale)

    const maxCount = Math.max(...counts)
    const totalCount = counts.reduce((sum, c) => sum + c, 0)

    if (maxCount <= MAX_PARTICLES_PER_FLOW && totalCount <= MAX_TOTAL_PARTICLES)
      return { counts, dollarsPerParticle }

    dollarsPerParticle += DOLLARS_PER_PARTICLE_STEP
  }
}
