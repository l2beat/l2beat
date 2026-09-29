import { MAX_PARTICLES_PER_FLOW, MAX_TOTAL_PARTICLES } from '../../consts'
import { DOLLARS_PARTICLE_SCALE, type ParticleScale } from './particleScale'

interface ScaledParticleResult {
  counts: number[]
  valuePerParticle: number
}

/**
 * Given base particle counts (computed at baseValuePerParticle), finds the
 * lowest allowed value-per-particle (one of the scale's options, or beyond
 * the last option a multiple of its extension step) where both constraints
 * are satisfied:
 *   - no single flow exceeds MAX_PARTICLES_PER_FLOW
 *   - total across all flows does not exceed MAX_TOTAL_PARTICLES
 */
export function getScaledParticleCounts(
  baseExactCounts: number[],
  baseValuePerParticle: number = DOLLARS_PARTICLE_SCALE.base,
  scale: Omit<ParticleScale, 'base'> = DOLLARS_PARTICLE_SCALE,
): ScaledParticleResult {
  if (baseExactCounts.length === 0)
    return { counts: [], valuePerParticle: baseValuePerParticle }

  const maxBaseCount = Math.max(...baseExactCounts)
  const totalBaseCount = baseExactCounts.reduce((sum, c) => sum + c, 0)

  const minVppForPerFlowCap =
    (maxBaseCount * baseValuePerParticle) / MAX_PARTICLES_PER_FLOW
  const minVppForTotalCap =
    (totalBaseCount * baseValuePerParticle) / MAX_TOTAL_PARTICLES
  const minRequiredVpp = Math.max(minVppForPerFlowCap, minVppForTotalCap)

  let valuePerParticle = Math.max(
    baseValuePerParticle,
    nextAllowedVpp(minRequiredVpp, scale),
  )

  let ratio = baseValuePerParticle / valuePerParticle
  let counts = baseExactCounts.map((c) => c * ratio)

  // Closed-form math can land a hair above the caps due to floating-point
  // rounding (e.g. total = 700.0000000003). Re-verify and bump one value if so.
  const maxCount = Math.max(...counts)
  const totalCount = counts.reduce((sum, c) => sum + c, 0)
  if (maxCount > MAX_PARTICLES_PER_FLOW || totalCount > MAX_TOTAL_PARTICLES) {
    valuePerParticle = nextAllowedVppAbove(valuePerParticle, scale)
    ratio = baseValuePerParticle / valuePerParticle
    counts = baseExactCounts.map((c) => c * ratio)
  }

  return { counts, valuePerParticle }
}

/** The smallest allowed value-per-particle that is >= min */
function nextAllowedVpp(
  min: number,
  scale: Omit<ParticleScale, 'base'>,
): number {
  const option = scale.options.find((o) => o >= min)
  if (option !== undefined) return option
  return Math.ceil(min / scale.extensionStep) * scale.extensionStep
}

/** The smallest allowed value-per-particle that is strictly > value */
function nextAllowedVppAbove(
  value: number,
  scale: Omit<ParticleScale, 'base'>,
): number {
  const option = scale.options.find((o) => o > value)
  if (option !== undefined) return option
  return (Math.floor(value / scale.extensionStep) + 1) * scale.extensionStep
}
