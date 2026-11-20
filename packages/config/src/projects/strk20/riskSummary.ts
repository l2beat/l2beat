import { definePrivacyRisks } from '../../common/privacyRisks'

export const strk20RiskSummary = definePrivacyRisks({
  stolen: [
    'the proof system or virtual Starknet execution model is broken, allowing invalid actions.',
    'the Starknet sequencer includes a transaction with fabricated proof facts.',
    'the governance multisig deploys a malicious [upgrade](#upgrades-and-governance) of the pool or of the anonymizer, which owns every shadow account, with no delay.',
    'the app multisig deploys a malicious [upgrade](#upgrades-and-governance) of the pool or of the anonymizer, with a one-day delay.',
    'an external DeFi helper or target protocol invoked by the user mishandles assets.',
  ],
  lost: [
    'a user loses the Starknet account key or viewing key required to spend their notes.',
    'the pool is paused or upgraded so that valid actions fail.',
  ],
  privacy: [
    {
      text: "the holder of the auditor key decrypts users' viewing keys, which exposes their whole history.",
      see: ['privilegedInsider'],
    },
    {
      text: "the wallet's prover or note discovery service, which receives the viewing key, leaks or keeps it.",
      see: ['privilegedInsider'],
    },
    {
      text: "an app driving a shadow account or a swap through the pool links it to the user's main address.",
      see: ['privilegedInsider'],
    },
    {
      text: 'a first payment to a new contact, a channel opened beside a deposit or a unique amount links activity.',
      see: ['publicObserver', 'chainAnalyst'],
    },
    {
      text: 'Bramble sends CoinGecko every privately held token at each balance check, which can single out holders of rare tokens.',
      see: ['networkObserver'],
    },
    {
      text: "elliptic-curve cryptography is broken, which opens the auditor key and with it every user's history.",
      see: ['futureAdversary'],
    },
  ],
})
