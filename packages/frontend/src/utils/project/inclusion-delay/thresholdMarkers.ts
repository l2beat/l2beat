import type { ProjectInclusionDelayConfig } from '@l2beat/config'
import { calculateProjectDelaySeconds } from './calculateProjectDelay'
import { INCLUSION_DELAY_THRESHOLDS } from './constants'
import type { DelayThreshold, DelayThresholdMarker } from './types'

export function getDelayThresholdMarkers(
  config: ProjectInclusionDelayConfig,
  thresholds: readonly DelayThreshold[] = INCLUSION_DELAY_THRESHOLDS,
): DelayThresholdMarker[] {
  const maxCensorCount = Math.floor(
    config.validatorCount * config.maxCensoringFraction,
  )

  return thresholds.flatMap((threshold) => {
    const censorCount = findFirstFiniteCensorCountAtOrAboveDelay(
      config,
      threshold.seconds,
      maxCensorCount,
    )
    if (censorCount === undefined) return []

    const delaySeconds = calculateProjectDelaySeconds(config, censorCount)
    if (delaySeconds === null) return []

    return [
      {
        id: `delay-threshold-${threshold.label}`,
        label: `${threshold.label} delay`,
        censoringFraction: interpolateCensoringFractionForDelay(
          config,
          censorCount,
          delaySeconds,
          threshold.seconds,
        ),
        delaySeconds: threshold.seconds,
      },
    ]
  })
}

function findFirstFiniteCensorCountAtOrAboveDelay(
  config: ProjectInclusionDelayConfig,
  thresholdSeconds: number,
  maxCensorCount: number,
) {
  let low = 0
  let high = maxCensorCount
  let result: number | undefined

  while (low <= high) {
    const censorCount = Math.floor((low + high) / 2)
    const delaySeconds = calculateProjectDelaySeconds(config, censorCount)

    if (delaySeconds === null || delaySeconds >= thresholdSeconds) {
      result = censorCount
      high = censorCount - 1
    } else {
      low = censorCount + 1
    }
  }

  if (result === undefined) return undefined

  const delaySeconds = calculateProjectDelaySeconds(config, result)
  if (delaySeconds === null || delaySeconds < thresholdSeconds) return undefined

  return result
}

function interpolateCensoringFractionForDelay(
  config: ProjectInclusionDelayConfig,
  censorCount: number,
  delaySeconds: number,
  thresholdSeconds: number,
) {
  if (censorCount === 0) return 0

  const previousDelaySeconds = calculateProjectDelaySeconds(
    config,
    censorCount - 1,
  )
  if (
    previousDelaySeconds === null ||
    previousDelaySeconds >= thresholdSeconds
  ) {
    return censorCount / config.validatorCount
  }

  if (delaySeconds === previousDelaySeconds) {
    return censorCount / config.validatorCount
  }

  const progress =
    (thresholdSeconds - previousDelaySeconds) /
    (delaySeconds - previousDelaySeconds)

  return (censorCount - 1 + progress) / config.validatorCount
}
