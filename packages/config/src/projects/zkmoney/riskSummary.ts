import { definePrivacyRisks } from '../../common/privacyRisks'

export const zkMoneyRiskSummary = definePrivacyRisks({
  stolen: [
    "Aztec's private execution or refund proof is unsound and the enclave layer also fails.",
    'malicious wallet code obtains a harmful signature, or substituted unsigned contract lists redirect future deposits and payments.',
    'the NameRegistry owner or owner of zk.money in ENS redirects future payments to names.',
    'a malicious sUSDS token upgrade confiscates escrowed shares (see [upgrades and governance](#upgrades-and-governance)).',
  ],
  lost: [
    'a user loses their passkey.',
    "all registered signers stop serving and users cannot obtain or run the portal's approved enclave image, which for sUSDS is unpublished.",
    'resolver screening blocks an external payment and the recipient lacks the tooling to re-derive its deposit address.',
  ],
  privacy: [
    {
      text: 'a user pays a new contact, whose handshake reveals the recipient.',
      see: ['publicObserver'],
    },
    {
      text: "a user's payments hide only among zk.money's users on Aztec.",
      see: ['chainAnalyst'],
    },
    {
      text: 'the resolver operator links deposits paid through a name to their recipients, or an enclave or AWS Nitro is compromised.',
      see: ['privilegedInsider'],
    },
    {
      text: 'the unpublished sUSDS enclave image is malicious.',
      see: ['privilegedInsider'],
    },
    {
      text: "the default endpoints, Alchemy and Aztec Labs' Aztec node, see deposit addresses and withdrawals in one session.",
      see: ['networkObserver', 'privilegedInsider'],
    },
    'a user refunds, the only exit after the freeze, and the refund publishes its amount on Ethereum.',
    {
      text: 'elliptic-curve cryptography is broken, which decrypts data published to Ethereum.',
      see: ['futureAdversary'],
    },
  ],
})
