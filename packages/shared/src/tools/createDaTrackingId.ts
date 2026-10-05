import { createHash } from 'crypto'

export interface DaTrackingIdInput {
  type: 'ethereum'
  daLayer: string
  inbox: string
  sequencers?: string[]
  topics?: string[]
}

/**
 * Derives the backend DA indexer configuration id. The id is a content hash of
 * the config's identity fields - when it changes, the backend treats it as a
 * new configuration and WIPES all data indexed under the old id
 * (ManagedMultiIndexer). Since/until ranges are deliberately not part of the
 * id, so they can be updated in place.
 */
export function createDaTrackingId(config: DaTrackingIdInput): string {
  const input = []

  input.push(config.type)
  input.push(config.daLayer)
  // we're running two versions of DA in parallel to rollout new features
  input.push('v2')

  input.push(config.inbox)
  if (config.sequencers) {
    input.push(...[...config.sequencers].sort((a, b) => a.localeCompare(b)))
  }
  if (config.topics) {
    input.push(...[...config.topics].sort((a, b) => a.localeCompare(b)))
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
