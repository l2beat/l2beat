import type { ProjectInclusionDelayConfig } from '@l2beat/config'

export function validateInclusionDelayConfig(
  config: ProjectInclusionDelayConfig,
) {
  assertPositiveInteger(config.validatorCount, 'validatorCount')

  if (
    !Number.isFinite(config.targetPercentile) ||
    config.targetPercentile <= 0 ||
    config.targetPercentile >= 1
  ) {
    throw new Error('targetPercentile must be between 0 and 1')
  }

  if (
    !Number.isFinite(config.maxCensoringFraction) ||
    config.maxCensoringFraction < 0 ||
    config.maxCensoringFraction > 1
  ) {
    throw new Error('maxCensoringFraction must be between 0 and 1')
  }

  if (config.type === 'singleSlot') {
    assertPositiveFinite(config.slotSeconds, 'slotSeconds')
  }

  if (config.type === 'span') {
    assertPositiveInteger(config.spanBlocks, 'spanBlocks')
    assertPositiveFinite(config.blockSeconds, 'blockSeconds')
  }

  if (config.type === 'committee') {
    assertPositiveInteger(config.committeeSize, 'committeeSize')
    if (config.committeeSize > config.validatorCount) {
      throw new Error('committeeSize must be between 1 and validatorCount')
    }
    assertPositiveInteger(config.epochSlots, 'epochSlots')
    assertPositiveFinite(config.slotSeconds, 'slotSeconds')
    assertInteger(config.blockingThreshold, 'blockingThreshold')
    if (
      config.blockingThreshold < 0 ||
      config.blockingThreshold > config.committeeSize
    ) {
      throw new Error('blockingThreshold must be between 0 and committeeSize')
    }
  }
}

function assertPositiveFinite(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be greater than 0`)
  }
}

function assertInteger(value: number, name: string) {
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    throw new Error(`${name} must be an integer`)
  }
}

function assertPositiveInteger(value: number, name: string) {
  assertInteger(value, name)
  if (value <= 0) {
    throw new Error(`${name} must be greater than 0`)
  }
}
