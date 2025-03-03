import { z } from 'zod'

export const celestiaTools = {
  decodeCommitment,
  extractNamespacesFromLogs,
  isOpStackCelestiaCommitment,
}

function isOpStackCelestiaCommitment(commitment: string) {
  const bytes = commitment.startsWith('0x') ? commitment.slice(2) : commitment

  const hasLengthMatch = bytes.length === 41 * 2
  const hasPrefixMatch = bytes.startsWith('ce')

  return hasLengthMatch && hasPrefixMatch
}

/**
 * @see https://github.com/celestiaorg/optimism/blob/9931de7ebf78564062383d5d680458e750a0cb52/op-celestia/da.go#L10
 */
function decodeCommitment(commitment: string) {
  const byteDerivationVersion = commitment.slice(2, 4)
  const heightHex = commitment.slice(4, 20)
  const heightBuffer = Buffer.from(heightHex, 'hex')
  const blockHeightDecimal = heightBuffer.readUInt32LE(0)

  const blobCommitment = Buffer.from(commitment.slice(20), 'hex').toString(
    'base64',
  )

  return {
    byteDerivationVersion,
    blockHeight: blockHeightDecimal,
    blobCommitment,
  }
}

function extractNamespacesFromLogs(logs: string[]) {
  const extractedNamespaces = logs.flatMap((log) =>
    extractNamespacesFromLog(log),
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
