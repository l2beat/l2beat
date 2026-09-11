import { assert } from '@l2beat/shared-pure'
import {
  type ProjectInclusionDelayChartStakeDistribution,
  ProjectStakeDistributionSchema,
} from '../types'

/**
 * Parses a committed stake-distribution.json at config load so a malformed
 * file fails the build instead of rendering wrong data. Charts that model
 * per-validator censorship need `validatorCount`, which the generator only
 * emits for some sources, so callers that depend on it ask for it here.
 */
export function readStakeDistribution(
  json: unknown,
  options: { requireValidatorCount: true },
): ProjectInclusionDelayChartStakeDistribution & { validatorCount: number }
export function readStakeDistribution(
  json: unknown,
): ProjectInclusionDelayChartStakeDistribution
export function readStakeDistribution(
  json: unknown,
  options?: { requireValidatorCount: boolean },
): ProjectInclusionDelayChartStakeDistribution {
  const parsed = ProjectStakeDistributionSchema.parse(json)
  if (options?.requireValidatorCount) {
    assert(
      parsed.validatorCount !== undefined,
      'Stake distribution must include validatorCount',
    )
  }
  return parsed
}
