import { createHash } from 'crypto'
import type { TrackedTxConfigEntry } from './TrackedTxsConfig'

export type TrackedTxId = string

export function createTrackedTxId(
  trackedTxConfig: Omit<TrackedTxConfigEntry, 'id'>,
): TrackedTxId {
  const input = []

  input.push(trackedTxConfig.projectId)
  input.push(trackedTxConfig.sinceTimestamp)
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
    case 'sharedBridge':
      input.push(trackedTxConfig.params.address)
      input.push(trackedTxConfig.params.selector)
      input.push(trackedTxConfig.params.chainId)
      break
    case 'transfer':
      if (trackedTxConfig.params.from) input.push(trackedTxConfig.params.from)
      input.push(trackedTxConfig.params.to)
      break
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}

createTrackedTxId.random = function random(): TrackedTxId {
  const letter = () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return Array.from({ length: 12 }).map(letter).join('')
}
