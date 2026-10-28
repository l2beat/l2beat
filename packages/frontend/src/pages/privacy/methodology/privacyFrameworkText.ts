import type { PrivacyAdversaryId } from '@l2beat/config'

/** Adversary definitions from the privacy adversaries framework forum post. */
export const FRAMEWORK_ADVERSARY_TEXT: Record<PrivacyAdversaryId, string> = {
  publicObserver: 'reads public transactions and follows explicit links.',
  chainAnalyst:
    'combines public data to correlate timing, amounts, gas payments and addresses.',
  networkObserver:
    "sees traffic on the user's network path and at third parties, such as ISPs, VPNs, public RPCs and relayers. Services the operator runs count as the insider, a service under the operator's account counts for both.",
  privilegedInsider:
    'controls or serves part of the system, holds keys or plaintext, custodies funds, or delivers the app.',
  futureAdversary:
    'archives public data, then runs the known quantum attacks and uses every key they recover. Other schemes stand until an attack on them is known, and the cell names the assumption that remains. Retained logs, insider keys and recorded traffic are outside this scenario.',
}
