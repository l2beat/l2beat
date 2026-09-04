import type { TableReadyValue } from '../types'

function NoRealtimeCensorshipResistance(description?: string): TableReadyValue {
  return {
    value: 'No',
    sentiment: 'bad',
    description:
      description ??
      'The centralized sequencer can censor transactions submitted through the normal L2 path.',
  }
}

function OpenBlockProduction(description?: string): TableReadyValue {
  return {
    value: 'Open',
    sentiment: 'good',
    ...(description !== undefined ? { description } : {}),
  }
}

function NoDeterministicCrGadget(description?: string): TableReadyValue {
  return {
    value: 'No',
    sentiment: 'warning',
    ...(description !== undefined ? { description } : {}),
  }
}

export const SEQUENCING_SPEC = {
  // centralized
  NO_REALTIME_CENSORSHIP_RESISTANCE: NoRealtimeCensorshipResistance,
  // sequencer-set
  OPEN_BLOCK_PRODUCTION: OpenBlockProduction,
  NO_DETERMINISTIC_CR_GADGET: NoDeterministicCrGadget,
}
