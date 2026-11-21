import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

/**
 * The ENS Universal Resolver on Ethereum mainnet: an EIP-1967 proxy whose
 * admin is the ENS DAO (`ens.eth`, 0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7).
 * It finds the resolver of a name, including ENSIP-10 wildcards, and calls it.
 */
export const ENS_UNIVERSAL_RESOLVER =
  '0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe'

export const ensUniversalResolverInterface = new utils.Interface([
  'function resolve(bytes name, bytes data) view returns (bytes result, address resolver)',
  'error ResolverNotFound(bytes name)',
  'error ResolverNotContract(bytes name, address resolver)',
  'error UnsupportedResolverProfile(bytes4 selector)',
  'error ResolverError(bytes errorData)',
  // EIP-3668: the name is served by a gateway the resolver picks.
  'error OffchainLookup(address sender, string[] urls, bytes callData, bytes4 callbackFunction, bytes extraData)',
])
const addrResolverInterface = new utils.Interface([
  'function addr(bytes32 node) view returns (address)',
])

// Reverts meaning the name has no address we can read onchain. Following an
// `OffchainLookup` would make the caller fetch a URL any name owner chooses.
const NOT_RESOLVED_SELECTORS = new Set(
  [
    'ResolverNotFound',
    'ResolverNotContract',
    'UnsupportedResolverProfile',
    'ResolverError',
    'OffchainLookup',
  ].map((error) => ensUniversalResolverInterface.getSighash(error)),
)

const SELECTOR_HEX_LENGTH = 2 + 8
const WORD_BYTES = 32
const ADDRESS_BYTES = 20
const ZERO_ADDRESS = `0x${'00'.repeat(ADDRESS_BYTES)}`

export interface EnsName {
  /** Normalized, e.g. `Nick.ETH` becomes `nick.eth`. */
  name: string
  /** DNS wire format, as the Universal Resolver takes it. */
  dnsEncoded: string
  namehash: string
}

/**
 * Undefined for a name that is not valid ENS.
 *
 * Normalization is ethers 5.7's, an early ens-normalize that predates
 * ENSIP-15. It agrees on ASCII, emoji and most Unicode names, but it accepts
 * mixed-script and confusable names that ENSIP-15 rejects (e.g. `vitalіk.eth`
 * with a Cyrillic `і`), and rejects labels longer than 63 bytes.
 */
export function parseEnsName(input: string): EnsName | undefined {
  let dnsEncoded: Uint8Array
  try {
    dnsEncoded = utils.arrayify(utils.dnsEncode(input))
  } catch {
    // ethers signals an invalid name only by throwing.
    return undefined
  }
  const labels = splitDnsEncodedLabels(dnsEncoded)
  if (labels.length === 0) return undefined

  const name = labels.map((label) => utils.toUtf8String(label)).join('.')
  return {
    name,
    dnsEncoded: utils.hexlify(dnsEncoded),
    namehash: namehashOfLabels(labels),
  }
}

/** Calldata for the Universal Resolver: the `addr(bytes32)` of the name. */
export function encodeEnsAddrCall(ensName: EnsName): string {
  const addrCall = addrResolverInterface.encodeFunctionData('addr', [
    ensName.namehash,
  ])
  return ensUniversalResolverInterface.encodeFunctionData('resolve', [
    ensName.dnsEncoded,
    addrCall,
  ])
}

/**
 * Lowercase address from what `resolve` returned, or undefined when the
 * resolver has no address for the name.
 */
export function decodeEnsAddrResult(returnData: string): string | undefined {
  let result: string
  try {
    result = ensUniversalResolverInterface.decodeFunctionResult(
      'resolve',
      returnData,
    ).result
  } catch (error) {
    throw new Error('Invalid ENS resolve result', { cause: error })
  }
  const resultBytes = utils.arrayify(result)
  if (resultBytes.length === 0) return undefined
  if (resultBytes.length !== WORD_BYTES) {
    throw new Error('Invalid ENS addr result', { cause: { result } })
  }
  const padding = resultBytes.subarray(0, WORD_BYTES - ADDRESS_BYTES)
  if (padding.some((byte) => byte !== 0)) {
    throw new Error('Invalid ENS addr result', { cause: { result } })
  }

  const address = utils.hexlify(
    resultBytes.subarray(WORD_BYTES - ADDRESS_BYTES),
  )
  assert(/^0x[0-9a-f]{40}$/.test(address), 'Address must be lowercase hex')
  if (address === ZERO_ADDRESS) return undefined
  return address
}

/** Whether a revert of `resolve` means the name has no onchain address. */
export function isEnsNotResolvedRevert(revertData: string): boolean {
  assert(utils.isHexString(revertData), 'Revert data must be hex')
  if (revertData.length < SELECTOR_HEX_LENGTH) return false
  const selector = revertData.slice(0, SELECTOR_HEX_LENGTH).toLowerCase()
  return NOT_RESOLVED_SELECTORS.has(selector)
}

function splitDnsEncodedLabels(dnsEncoded: Uint8Array): Uint8Array[] {
  const labels: Uint8Array[] = []
  let offset = 0
  while (true) {
    const labelLength = dnsEncoded[offset]
    assert(labelLength !== undefined, 'DNS name must end with a zero byte')
    if (labelLength === 0) break
    labels.push(dnsEncoded.subarray(offset + 1, offset + 1 + labelLength))
    offset += 1 + labelLength
  }
  assert(offset === dnsEncoded.length - 1, 'DNS name must end at zero byte')
  return labels
}

function namehashOfLabels(labels: Uint8Array[]): string {
  let node = utils.hexlify(new Uint8Array(WORD_BYTES))
  for (let index = labels.length - 1; index >= 0; index--) {
    const label = labels[index]
    assert(label !== undefined, 'Label index out of range')
    assert(label.length > 0, 'Label must not be empty')
    node = utils.keccak256(utils.concat([node, utils.keccak256(label)]))
  }
  return node
}
