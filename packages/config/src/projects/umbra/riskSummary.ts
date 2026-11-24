import { definePrivacyRisks } from '../../common/privacyRisks'

export const umbraRiskSummary = definePrivacyRisks({
  lost: [
    "an unsupported ERC-20, such as a fee-on-transfer or rebasing token, causes the Umbra contract's internal accounting to diverge from its token balance.",
  ],
  stopped: [
    'the Umbra owner raises the toll on payments through the contract, which has no cap.',
  ],
  privacy: [
    {
      text: "the operator links the user's wallet to their stealth addresses, since the hosted app sends it both in one session.",
      see: ['privilegedInsider'],
    },
    {
      text: "Alchemy, the hosted app's RPC, receives the payee's address seconds before each payment, so timing ties the payee to it.",
      see: ['networkObserver'],
    },
    {
      text: 'elliptic-curve cryptography is broken, which matches every past payment to its registered recipient.',
      see: ['futureAdversary'],
    },
  ],
})
