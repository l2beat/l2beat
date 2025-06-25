import { v } from '@l2beat/validate'

export const celestiaTools = {
  decodeCommitment,
  extractNamespacesFromLogs,
  isOpStackCelestiaCommitment,
}

const OP_COMMITMENT_BYTE_COUNT = 40
const opDecoders = [
  { prefix: 'ce', decoder: decodeOPCommitment },
  { prefix: '01010c', decoder: decodeOPCommitment },
]

const arbDecoders = [{ prefix: '63', decoder: decodeArbCommitment }]

const decoders = opDecoders.concat(arbDecoders)

function isOpStackCelestiaCommitment(commitment: string) {
  const bytes = commitment.startsWith('0x') ? commitment.slice(2) : commitment

  for (const { prefix } of opDecoders) {
    if (
      bytes.startsWith(prefix) &&
      bytes.length - prefix.length === OP_COMMITMENT_BYTE_COUNT * 2
    ) {
      return true
    }
  }

  return false
}

type CelestiaCommitmentData = {
  byteDerivationVersion: string
  blockHeight: number
  blobCommitment: string
}

// Handle both OP and ARB commitments
function decodeCommitment(commitment: string): CelestiaCommitmentData {
  const hexBody = commitment.startsWith('0x') ? commitment.slice(2) : commitment

  for (const decoder of decoders) {
    if (hexBody.startsWith(decoder.prefix)) {
      return decoder.decoder(hexBody.slice(decoder.prefix.length))
    }
  }

  throw new Error(`Unknown byteDerivationVersion: ${hexBody.slice(0, 8)}`)
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

const MsgEventArray = v.array(
  v.object({
    msg_index: v.number(),
    events: v.array(
      v.object({
        type: v.string(),
        attributes: v.array(
          v.object({
            key: v.string(),
            value: v.string(),
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
function decodeOPCommitment(hex: string): CelestiaCommitmentData {
  const heightHex = hex.slice(0, 16)
  const heightBuffer = Buffer.from(heightHex, 'hex')
  const blockHeightDecimal = heightBuffer.readUInt32LE(0)

  const blobCommitment = Buffer.from(hex.slice(16), 'hex').toString('base64')

  return {
    byteDerivationVersion: 'ce',
    blockHeight: blockHeightDecimal,
    blobCommitment,
  }
}

// Arb
function decodeArbCommitment(hex: string): CelestiaCommitmentData {
  if (hex.length !== 176) {
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
  const blockHeightHex = hex.slice(0, 16)
  const txCommitmentHex = hex.slice(48, 112)

  // Decoding
  const blockHeight = Number(BigInt('0x' + blockHeightHex).toString())
  const blobCommitment = Buffer.from(txCommitmentHex, 'hex').toString('base64')

  return {
    byteDerivationVersion: '63',
    blockHeight,
    blobCommitment,
  }
}
