import { createHash } from 'crypto'

export type DaTrackingIdInput =
  | {
      type: 'ethereum'
      daLayer: string
      inbox: string
      sequencers?: string[]
      topics?: string[]
    }
  | {
      type: 'celestia'
      daLayer: string
      namespace: string
    }
  | {
      type: 'avail'
      daLayer: string
      appIds: string[]
    }
  | {
      type: 'eigen-da'
      daLayer: string
      customerId: string
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

  switch (config.type) {
    case 'ethereum':
      input.push(config.inbox)
      if (config.sequencers) {
        input.push(...[...config.sequencers].sort((a, b) => a.localeCompare(b)))
      }
      if (config.topics) {
        input.push(...[...config.topics].sort((a, b) => a.localeCompare(b)))
      }
      break
    case 'celestia':
      input.push(config.namespace)
      break
    case 'avail':
      input.push(...[...config.appIds].sort((a, b) => a.localeCompare(b)))
      break
    case 'eigen-da':
      input.push(config.customerId)
      break
  }

  const hash = createHash('sha1').update(input.join('')).digest('hex')
  return hash.slice(0, 12)
}
