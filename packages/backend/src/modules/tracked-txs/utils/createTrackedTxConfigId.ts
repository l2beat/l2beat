import { createHash } from 'crypto'
import { TrackedTxConfigEntry } from '../types/TrackedTxsConfig'

export type TrackedTxConfigId = string

export function createTrackedTxConfigId(
  trackedTxConfig: TrackedTxConfigEntry,
): TrackedTxConfigId {
  const input = []

  input.push(trackedTxConfig.projectId)
  input.push(trackedTxConfig.sinceTimestampInclusive)
  input.push(trackedTxConfig.type)
  input.push(trackedTxConfig.subtype)
  // untilTimestamp is not used in the ID calculation.

  switch (trackedTxConfig.params.formula) {
    case 'functionCall':
      input.push(trackedTxConfig.params.address)
      input.push(trackedTxConfig.params.selector)
      break
    case 'sharpSubmission':
      input.push(trackedTxConfig.params.address)
      input.push(trackedTxConfig.params.selector)
      input.push(trackedTxConfig.params.programHashes)
      break
    case 'transfer':
      input.push(trackedTxConfig.params.from)
      input.push(trackedTxConfig.params.to)
      break
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
