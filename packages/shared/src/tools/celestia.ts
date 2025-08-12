import { assert } from '@l2beat/shared-pure'
import type { CelestiaEvent } from '../clients/api-celestia/types'

export const celestiaTools = {
  decodeCommitment,
  extractNamespacesFromEvents,
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

function extractNamespacesFromEvents(events: CelestiaEvent[]) {
  const extractedNamespaces = events.map((event) => {
    if (event.type === 'celestia.blob.v1.EventPayForBlobs') {
      return getEventAttributeValue<string[]>(event, 'namespaces')
    }

    return []
  })

  // Might contain many submissions to the same namespace
  return Array.from(new Set(extractedNamespaces.flat()))
}

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

function getEventAttributeValue<T>(event: CelestiaEvent, key: string): T {
  const attribute = event.attributes.find((a) => a.key === key)
  assert(attribute && attribute.value, `${key} should be defined`)
  return JSON.parse(attribute.value) as T
}
