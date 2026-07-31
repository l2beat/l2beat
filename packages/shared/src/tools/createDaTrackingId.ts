import { createHash } from 'crypto'

export type DaTrackingIdInput =
  | {
      type: 'ethereum'
      daLayer: string
      inbox: string
      sequencers?: string[]
      event?: {
        topics: string[]
        emitters: string[] | null
      }
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
      if (config.event) {
        input.push(
          ...[...config.event.topics].sort((a, b) => a.localeCompare(b)),
        )
        if (config.event.emitters !== null) {
          // Marker keeps {topics: [A, B], emitters: null} and
          // {topics: [A], emitters: [B]} from hashing identically. It sits
          // inside the null check so topic-only configs keep their pre-event
          // hash input and are not re-keyed.
          input.push('emitters')
          input.push(
            ...[...config.event.emitters].sort((a, b) => a.localeCompare(b)),
          )
        }
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
