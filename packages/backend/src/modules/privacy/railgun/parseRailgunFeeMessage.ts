import { Bytes } from '@l2beat/shared-pure'
import { bech32m } from '@scure/base'
import { createPublicKey, verify } from 'crypto'

export interface RailgunFeeAd {
  railgunAddress: string
  /** Unix millisecond timestamp. */
  feeExpiration: number
  availableWallets: number
  feeTokenCount: number
}

const RAILGUN_ADDRESS_PREFIX = '0zk'
const RAILGUN_ADDRESS_BYTE_LENGTH = 73
const VIEWING_KEY_OFFSET = 41
// ASN.1 SPKI header for a raw ed25519 public key, see RFC 8410.
const ED25519_SPKI_PREFIX = Buffer.from('302a300506032b6570032100', 'hex')

export function parseRailgunFeeAd(
  payload: Uint8Array,
): RailgunFeeAd | undefined {
  try {
    const envelope = JSON.parse(Buffer.from(payload).toString('utf8'))
    if (
      typeof envelope?.data !== 'string' ||
      typeof envelope.signature !== 'string'
    ) {
      return undefined
    }

    const data = Bytes.fromHex(envelope.data).toBuffer()
    const signature = Bytes.fromHex(envelope.signature).toBuffer()

    const feeData = JSON.parse(data.toString('utf8'))
    if (
      typeof feeData?.railgunAddress !== 'string' ||
      typeof feeData.feeExpiration !== 'number' ||
      typeof feeData.availableWallets !== 'number' ||
      typeof feeData.fees !== 'object' ||
      feeData.fees === null
    ) {
      return undefined
    }

    // The address is self-certifying: the signature over the hex-decoded data
    // bytes verifies against the viewing key embedded in the address itself.
    const viewingPublicKey = extractViewingPublicKey(feeData.railgunAddress)
    if (!viewingPublicKey) return undefined
    if (!verifyEd25519(data, signature, viewingPublicKey)) return undefined

    return {
      railgunAddress: feeData.railgunAddress,
      feeExpiration: feeData.feeExpiration,
      availableWallets: feeData.availableWallets,
      feeTokenCount: Object.values(feeData.fees).filter(
        (fee) => typeof fee === 'string' && fee.length > 0,
      ).length,
    }
  } catch {
    return undefined
  }
}

/**
 * Counts network presence and capacity only. Canonical-client gates
 * deliberately not applied: version range (drifts with their releases and
 * would silently zero the metric), 40s minimum fee validity (client UX
 * rule), timestamp staleness (guards Store backfill we don't use) and
 * requiredPOIListKeys (client configuration).
 */
export function isEligibleFeeAd(ad: RailgunFeeAd, nowMs: number): boolean {
  return (
    ad.feeTokenCount > 0 && ad.availableWallets > 0 && ad.feeExpiration > nowMs
  )
}

// The decoded 0zk payload is 73 bytes: version (1), master public key (32),
// network id (8), viewing public key (32).
function extractViewingPublicKey(
  railgunAddress: string,
): Uint8Array | undefined {
  const decoded = bech32m.decode(railgunAddress as `${string}1${string}`, 1024)
  if (decoded.prefix !== RAILGUN_ADDRESS_PREFIX) return undefined
  const bytes = bech32m.fromWords(decoded.words)
  if (bytes.length !== RAILGUN_ADDRESS_BYTE_LENGTH) return undefined
  return bytes.slice(VIEWING_KEY_OFFSET, VIEWING_KEY_OFFSET + 32)
}

function verifyEd25519(
  message: Uint8Array,
  signature: Uint8Array,
  publicKey: Uint8Array,
): boolean {
  const key = createPublicKey({
    key: Buffer.concat([ED25519_SPKI_PREFIX, Buffer.from(publicKey)]),
    format: 'der',
    type: 'spki',
  })
  return verify(null, message, key, signature)
}
