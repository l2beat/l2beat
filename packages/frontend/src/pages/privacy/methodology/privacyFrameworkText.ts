import type { PrivacyAdversaryId } from '@l2beat/config'

/** Adversary definitions from the privacy adversaries framework forum post. */
export const FRAMEWORK_ADVERSARY_TEXT: Record<PrivacyAdversaryId, string> = {
  publicObserver: 'reads public transactions and follows explicit links.',
  chainAnalyst:
    'combines public data to correlate timing, amounts, gas payments and addresses.',
  networkObserver:
    "sees traffic to third parties, including public RPCs and relayers. An operator's own services count as the insider.",
  privilegedInsider:
    'controls or serves part of the system, holds keys or plaintext, custodies funds, or delivers the client.',
  futureAdversary:
    'archives public data, then runs the known quantum attacks and uses every key they recover. Other schemes stand until an attack on them is known, and the cell names the assumption that remains. Retained logs, insider keys and recorded traffic are outside this scenario.',
}
