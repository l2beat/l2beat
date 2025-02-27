import { z } from 'zod'
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
  const parsedLog = MsgEventArray.parse(JSON.parse(log))

  // Log itself has sub-events, now we need to find the proper ones
  const payForBlobEvents = parsedLog
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

const MsgEventArray = z.array(
  z.object({
    msg_index: z.number(),
    events: z.array(
      z.object({
        type: z.string(),
        attributes: z.array(
          z.object({
            key: z.string(),
            value: z.string(),
          }),
        ),
      }),
    ),
  }),
)
