import type { Address, Hex } from 'viem'
import { ATTESTATION_SAFE, type AttestationNetworkConfig } from './easConfig'

/**
 * One call for the Safe to make. Everything crop attestation needs is a
 * non-payable call to EAS or to the schema registry, so `value` is always 0
 * and there is no delegatecall anywhere in here.
 */
export interface SafeCall {
  /** Shown in the plan and used as the heading in the written file. */
  label: string
  to: Address
  data: Hex
  /**
   * The calldata in words, `field: value` per line. Carried rather than
   * decoded again at the point of display, so the terminal and the written
   * file cannot describe the same bytes differently.
   */
  details: string[]
}

/**
 * The Safe cannot make this call - EAS would revert - but somebody has to.
 * The only case today is revoking an attestation made by a different attester,
 * which EAS allows nobody but that attester.
 */
export interface ForeignCall extends SafeCall {
  /** Who must send it. */
  from: Address
  reason: string
}

/** The Safe UI's own deep link, so the file need not hardcode one per chain. */
export function getSafeUrl(
  network: AttestationNetworkConfig,
  safe: Address,
): string {
  const prefix = network.name === 'sepolia' ? 'sep' : 'eth'
  return `https://app.safe.global/transactions/queue?safe=${prefix}:${safe}`
}

/**
 * The flag wins over crops.config.json so a new Safe can be tried before it is
 * written down. Neither is an error rather than a guess: attesting from the
 * wrong address is not something a rerun undoes.
 */
export function resolveSafe(
  network: AttestationNetworkConfig,
  flag: Address | undefined,
): Address {
  const safe = flag ?? ATTESTATION_SAFE
  if (!safe) {
    throw new Error(
      `No Safe configured. Pass --safe, set L2B_CROPS_SAFE, or set "safe" in crops.config.json (attesting on ${network.name}).`,
    )
  }
  return safe
}
