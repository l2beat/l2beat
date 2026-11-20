import { definePrivacyRisks } from '../../common/privacyRisks'

export const zkMoneyV6RiskSummary = definePrivacyRisks({
  stolen: [
    "Aztec's private execution or refund proof is unsound and the enclave layer also fails.",
    'malicious wallet code obtains a harmful signature, or substituted unsigned contract lists redirect future deposits and payments.',
    "Aztec Labs' deployer EOA blesses malicious code for future deposit addresses or redirects future payments to names (see [upgrades and governance](#upgrades-and-governance)).",
    'a malicious sUSDS token upgrade confiscates escrowed shares (see [upgrades and governance](#upgrades-and-governance)).',
  ],
  lost: [
    'a user loses their passkey.',
    'all registered signers stop serving and nobody hosts and registers a new enclave on AWS Nitro.',
    'resolver screening blocks an external payment and the recipient lacks the tooling to re-derive its deposit address.',
  ],
  privacy: [
    {
      text: 'a user pays a new contact, whose handshake reveals the recipient.',
      see: ['publicObserver'],
    },
    {
      text: "a user relies on today's anonymity set, which is still small.",
      see: ['chainAnalyst'],
    },
    {
      text: 'a registered enclave or AWS Nitro is compromised, exposing what the enclave reads.',
      see: ['privilegedInsider'],
    },
    {
      text: 'the resolver operator links deposits paid through a name to their recipients.',
      see: ['privilegedInsider'],
    },
    {
      text: "the default endpoints, Alchemy and Aztec Labs' Aztec nodes, see deposit addresses and withdrawals in one session.",
      see: ['networkObserver', 'privilegedInsider'],
    },
    'a portal freezes, and refunds publish note or deposit amounts on Ethereum.',
    {
      text: 'elliptic-curve cryptography is broken, which decrypts notes and events and ties withdrawals to their accounts.',
      see: ['futureAdversary'],
    },
  ],
})
