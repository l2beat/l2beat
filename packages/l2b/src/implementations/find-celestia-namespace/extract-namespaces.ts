import type { CelestiaTransactionResult } from './client'

export function extractNamespaces(txs: CelestiaTransactionResult[]) {
  const extractedNamespaces = txs.flatMap((tx) =>
    extractNamespacesFromLog(tx.log),
  )

  // Might contain many submissions to the same namespace
  return Array.from(new Set(extractedNamespaces))
}

function extractNamespacesFromLog(log: string) {
  // We only care about pay for blobs, .includes pre-serialization
  if (!log.includes('celestia.blob.v1.EventPayForBlobs')) {
    return []
  }

  // Log is a raw string, not a JSON object
  const json = JSON.parse(log) as MsgEventArray

  // Log itself has sub-events, now we need to find the proper ones
  const payForBlobEvents = json
    .flatMap((msgEvent) => msgEvent.events)
    .filter((event) => event.type === 'celestia.blob.v1.EventPayForBlobs')

  // Once again, attributes' values are strings, not JSON objects
  const namespaceArrayStrings = payForBlobEvents
    .map(
      (event) =>
        event.attributes.find((attr) => attr.key === 'namespaces')?.value,
    )
    .filter((namespace) => namespace !== undefined)

  const namespaces: string[][] = namespaceArrayStrings.map((namespace) =>
    JSON.parse(namespace),
  )

  return namespaces.flat()
}

type MsgEventArray = {
  msg_index: number
  events: {
    type: string
    attributes: {
      key: string
      value: string
    }[]
  }[]
}[]
