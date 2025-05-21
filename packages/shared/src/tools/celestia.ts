import { z } from 'zod/v4'

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

type CelestiaCommitmentData = {
  byteDerivationVersion: string
  blockHeight: number
  blobCommitment: string
}

// Handle both OP's ce and Arb's 63
function decodeCommitment(commitment: string): CelestiaCommitmentData {
  const hexBody = commitment.startsWith('0x') ? commitment.slice(2) : commitment
  const byteDerivationVersion = hexBody.slice(0, 2)

  if (byteDerivationVersion === 'ce') {
    return decodeCe(hexBody)
  }

  if (byteDerivationVersion === '63') {
    return decode63(hexBody)
  }

  throw new Error(`Unknown byteDerivationVersion: ${byteDerivationVersion}`)
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

/**
 * OP
 * @see https://github.com/celestiaorg/optimism/blob/9931de7ebf78564062383d5d680458e750a0cb52/op-celestia/da.go#L10
 */
function decodeCe(hex: string): CelestiaCommitmentData {
  const heightHex = hex.slice(2, 18)
  const heightBuffer = Buffer.from(heightHex, 'hex')
  const blockHeightDecimal = heightBuffer.readUInt32LE(0)

  const blobCommitment = Buffer.from(hex.slice(18), 'hex').toString('base64')

  return {
    byteDerivationVersion: 'ce',
    blockHeight: blockHeightDecimal,
    blobCommitment,
  }
}

// Arb
function decode63(hex: string): CelestiaCommitmentData {
  if (hex.length !== 178) {
    throw new Error(
      'Could not decode 63-derivation-version: Invalid commitment length.',
    )
  }

  // Field sizes in hex chars:
  // headerFlag: 1 byte (2 hex chars)
  // blockHeight: 8 bytes (16 hex chars)
  // startIndex: 8 bytes (16 hex chars)
  // lengthInShares: 8 bytes (16 hex chars)
  // txCommitment: 32 bytes (64 hex chars)
  // dataRoot: 32 bytes (64 hex chars)
  const blockHeightHex = hex.slice(2, 18)
  const txCommitmentHex = hex.slice(50, 114)

  // Decoding
  const blockHeight = Number(BigInt('0x' + blockHeightHex).toString())
  const blobCommitment = Buffer.from(txCommitmentHex, 'hex').toString('base64')

  return {
    byteDerivationVersion: '63',
    blockHeight,
    blobCommitment,
  }
}
