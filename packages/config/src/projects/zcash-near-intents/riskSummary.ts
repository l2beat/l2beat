import { definePrivacyRisks } from '../../common/privacyRisks'

export const zcashNearIntentsRiskSummary = definePrivacyRisks({
  stolen: [
    "the custodial bridge operator's mint key or its Ethereum treasury key is compromised.",
    'the NEAR Intents multisig deploys a malicious [upgrade](#upgrades-and-governance) of the Verifier, with no delay.',
    'the Rainbow Bridge multisig deploys a malicious [upgrade](#upgrades-and-governance) of the Zcash connector, its token or the light client, with no delay.',
    'a threshold of the NEAR MPC nodes colludes to sign Zcash transactions from bridge addresses.',
  ],
  frozen: [
    "the NEAR Intents multisig or the single-key account locker freezes the user's account in the Verifier.",
    'the custodial bridge operator holds a deposit or withdrawal for a compliance review.',
    'the relayers stop and the Rainbow Bridge multisig rejects anyone who stakes to replace them.',
  ],
  privacy: [
    {
      text: 'the operator, which custodies both legs, makes the release of either depend on who the user is.',
      see: ['privilegedInsider'],
    },
    {
      text: "Valar's PIR server ties the payout and the exit to one wallet through the block ranges its private queries reveal.",
      see: ['networkObserver'],
    },
    {
      text: "elliptic-curve cryptography is broken, which recovers each account's viewing key from its payout addresses on NEAR.",
      see: ['futureAdversary'],
    },
  ],
})
