import type { PrivacyAdversaryAssessments } from '../../types'

const REPO = 'https://github.com/ScopeLift/umbra-protocol/blob/master'

// Verdicts backed by .flat/Umbra.sol, .flat/StealthKeyRegistry.sol,
// discovered.json and the umbra-js / frontend sources. Measurements as of
// 2026-09-08, block 25,931,789.
export const umbraAdversaries: PrivacyAdversaryAssessments = {
  publicObserver: {
    value: 'Only recipient identity hidden',
    sentiment: 'good',
    description:
      'Every payment is a public Announcement with sender, amount, asset and the fresh stealth address in cleartext. What is hidden is who controls the stealth address: the ephemeral public key and the one-time-pad ciphertext are unlinkable to any registered key without the recipient viewing key. There is no interior; the stealth address is a plain EOA. When it spends, the destination is public, so recipient privacy survives only if the destination is not otherwise linked to the recipient. Registering stealth keys reveals membership.',
    boundary: {
      sender: 'leaked',
      recipient: {
        verdict: 'hygiene',
        note: 'Hidden at entry. At exit the destination is public, so withdrawing to a registered, reused or ENS-labelled address reveals the recipient.',
      },
      amount: 'leaked',
      asset: 'leaked',
      linkage: {
        verdict: 'hygiene',
        note: 'Sender to stealth address and stealth address to destination are both public; only the identity behind the destination can stay unknown.',
      },
      membership: 'leaked',
    },
    sources: [
      {
        title: 'Umbra.sendEth / Announcement',
        url: 'https://etherscan.io/address/0xFb2dc580Eed955B528407b4d36FfaFe3da685401#code',
      },
      {
        title: 'Stealth derivation (umbra-js)',
        url: `${REPO}/umbra-js/src/classes/Umbra.ts`,
      },
    ],
  },
  dragnetAnalyst: {
    value: 'Most recipients exposed',
    sentiment: 'bad',
    description:
      'There is no anonymity set: one Announcement funds one stealth address that is spent once. In a sample of recent ETH payments the median time to first spend was under two minutes and most were full sweeps, so entry and exit pair trivially by amount and time and the question reduces to who owns the destination. Destination reuse, withdrawing to a registrant, returning funds to the sender and unique priority-fee settings answered that question for about half of all mainnet payments in a published study. Amounts are arbitrary and exact, which helps matching rather than hurting it.',
    boundary: {
      sender: 'leaked',
      recipient: {
        verdict: 'hygiene',
        note: 'Survives only with a fresh, never-registered destination, a delay, and no collector pattern.',
      },
      amount: 'leaked',
      asset: 'leaked',
      linkage: 'leaked',
      membership: 'leaked',
    },
    sources: [
      {
        title: 'Kovács & Seres, Anonymity Analysis of Umbra (arXiv:2308.01703)',
        url: 'https://arxiv.org/abs/2308.01703',
      },
    ],
  },
  networkObserver: {
    value: 'Indexer and wallet RPC learn recipient',
    sentiment: 'bad',
    description:
      'The default scan first asks the Umbra indexer for the registration block of the connected wallet, so the indexer learns which wallet is an Umbra recipient and when it scans. All announcements in range are then fetched, which protects the matching step, but afterwards the frontend queries the balances of exactly the matched stealth addresses in one multicall through the wallet RPC provider, linking wallet to stealth addresses for that provider. Token withdrawals go through a closed-source relayer that learns stealth address, destination and IP; two relayer keys handled all token exits in the last year. Intended destinations are also sent to the Umbra API and POAP for safety checks.',
    boundary: {
      recipient: {
        verdict: 'leaked',
        note: 'Wallet RPC sees the wallet-to-stealth multicall; relayer sees stealth-to-destination for tokens.',
      },
      linkage: 'leaked',
      membership: {
        verdict: 'leaked',
        note: 'Indexer receives the scanning wallet address on every default scan.',
      },
    },
    sources: [
      {
        title: 'Registration lookup sends wallet address',
        url: `${REPO}/umbra-js/src/utils/utils.ts`,
      },
      {
        title: 'Balance multicall of matched stealth addresses',
        url: `${REPO}/frontend/src/components/AccountReceiveTable.vue`,
      },
      {
        title: 'Relayer API client',
        url: `${REPO}/frontend/src/utils/umbra-api.ts`,
      },
    ],
  },
  privilegedInsider: {
    value: 'Owner can price out entries',
    sentiment: 'good',
    description:
      'The contracts are immutable and have no view key, decryption key, pause or upgrade path. The owner, a single EOA, can set an unbounded toll on new payments, which halts entries but cannot touch funds already at stealth addresses or block token withdrawals. Exclusion beyond that is client-side only: the frontend filters sanctioned addresses through a Chainalysis oracle and hardcoded lists, and the relayer operator can refuse to relay, leaving the user a direct withdrawal that needs gas at the stealth address.',
    boundary: {
      recipient: 'hidden',
      membership: 'leaked',
    },
    sources: [
      {
        title: 'Umbra owner / setToll',
        url: 'https://etherscan.io/address/0xFb2dc580Eed955B528407b4d36FfaFe3da685401#readContract',
      },
      {
        title: 'Client-side sanction filter',
        url: `${REPO}/umbra-js/src/utils/utils.ts`,
      },
    ],
  },
  futureAdversary: {
    value: 'Whole history linkable',
    sentiment: 'bad',
    description:
      'Recipient privacy rests entirely on secp256k1 ECDH: the ciphertext is the random scalar XORed with a hash of the shared secret, and the stealth key is that scalar times the spending key. A quantum adversary recovers every registered viewing key from the public registry, or the ephemeral key from the announcement itself, and can then run the recipient scan over all announcements since 2021. Every stealth payment to a recipient whose public key is known becomes linked retroactively. Nothing else is encrypted, so no other field changes.',
    boundary: {
      recipient: 'leaked',
      linkage: 'leaked',
    },
    sources: [
      {
        title: 'Shared secret derivation',
        url: `${REPO}/umbra-js/src/utils/sharedSecret.ts`,
      },
      {
        title: 'StealthKeyRegistry (public viewing keys)',
        url: 'https://etherscan.io/address/0x31fe56609C65Cd0C510E7125f051D440424D38f3#code',
      },
    ],
  },
}
