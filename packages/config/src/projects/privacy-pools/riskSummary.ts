import {
  definePrivacyRisks,
  PRIVACY_RISK_SNIPPETS as R,
} from '../../common/privacyRisks'

export const privacyPoolsRiskSummary = definePrivacyRisks({
  stolen: [
    R.proofSystem('withdrawals'),
    R.trustedSetup,
    'the Entrypoint owner deploys a malicious [upgrade](#upgrades-and-governance) that steals new deposits or withdrawals relayed after it.',
  ],
  lost: ['a user loses the recovery phrase that their notes derive from.'],
  privacy: [
    {
      text: 'the ASP leaves deposits out of its latest list, which blocks their private exit, up to halting all private withdrawals.',
      see: ['privilegedInsider'],
    },
    {
      text: 'the ASP keeps only a few deposits in its latest list, so withdrawals proven against it point to one of them.',
      see: ['privilegedInsider'],
    },
    {
      text: '0xbow pairs the IP of a deposit session with the session waiting for a withdrawal across its website, ASP feeds and relayer.',
      see: ['privilegedInsider'],
    },
    {
      text: 'both relayers the website lists refuse a withdrawal, so the user must self-relay or find a relayer elsewhere.',
      see: ['chainAnalyst'],
    },
    {
      text: 'a user withdraws signed in with a wallet on the default RPC, so Alchemy ties the wallet to the withdrawal by timing.',
      see: ['networkObserver'],
    },
  ],
})
