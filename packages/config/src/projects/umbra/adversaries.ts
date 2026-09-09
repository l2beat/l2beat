import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const REPO = 'https://github.com/ScopeLift/umbra-protocol/blob/master'

// Verdicts backed by .flat/Umbra.sol, .flat/StealthKeyRegistry.sol,
// discovered.json and the umbra-js / frontend sources. Measurements as of
// 2026-09-08, block 25,931,789.
export const umbraAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides who controls the receiving address. Sender, amount and the address itself are public.',
  },
  cells: {
    publicObserver: {
      condition: 'sender and amount public',
      sentiment: 'good',
      description:
        'Every payment is a public Announcement with sender, amount, asset and the fresh stealth address in cleartext. What is hidden is who controls the stealth address: the ephemeral public key and the one-time-pad ciphertext are unlinkable to any registered key without the recipient viewing key. There is no interior; the stealth address is a plain EOA. When it spends, the destination is public, so recipient privacy survives only if the destination is not otherwise linked to the recipient. Registering stealth keys reveals membership.',
      boundary: {
        sender: 'leaked',
        recipient: {
          verdict: 'atRisk',
          note: 'Hidden at entry. At exit the destination is public, so withdrawing to a registered, reused or ENS-labelled address reveals the recipient.',
        },
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Sender to stealth address and stealth address to destination are both public; only the identity behind the destination can stay unknown.',
        },
        identity: 'private',
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
    chainAnalyst: {
      condition: 'fresh destination and patience needed',
      sentiment: 'warning',
      description:
        'There is no anonymity set: one Announcement funds one stealth address that is spent once. In a sample of recent ETH payments the median time to first spend was under two minutes and most were full sweeps, so entry and exit pair trivially by amount and time and the question reduces to who owns the destination. The recipient stays hidden only by withdrawing to a fresh address that is never registered, reused or otherwise tied to them, ideally after a delay. Destination reuse, withdrawing to a registrant, returning funds to the sender and unique priority-fee settings answered the question for about half of all mainnet payments in a published study.',
      boundary: {
        sender: 'leaked',
        recipient: {
          verdict: 'atRisk',
          note: 'Survives only with a fresh, never-registered destination, a delay, and no collector pattern.',
        },
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the sender or on the destination.',
        },
      },
      sources: [
        {
          title:
            'Kovács & Seres, Anonymity Analysis of Umbra (arXiv:2308.01703)',
          url: 'https://arxiv.org/abs/2308.01703',
        },
      ],
    },
    networkObserver: {
      condition: 'own build and node needed',
      sentiment: 'warning',
      description:
        'The protocol itself needs nothing offchain: discovery is local ECDH over Announcement events and works against a self-hosted node with no third party. The hosted frontend does not offer that path. Its default scan first asks the Umbra indexer for the registration block of the connected wallet, so the indexer learns which wallet is an Umbra recipient and when it scans, and after matching it queries the balances of exactly the matched stealth addresses in one multicall through the wallet RPC provider. Avoiding both requires building the frontend from source with the indexer disabled and a self-hosted node. Token exits go through a closed-source relayer that learns stealth address, destination and IP; the only alternative is funding the stealth address with gas, which leaks to the public observer instead. ETH exits need no relayer.',
      boundary: {
        sender: 'leaked',
        recipient: {
          verdict: 'atRisk',
          note: 'Wallet RPC sees the wallet-to-stealth multicall unless the wallet uses a self-hosted node; the relayer sees stealth-to-destination for tokens.',
        },
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Hidden for ETH with own build and node; for tokens either the relayer or the public observer learns the link.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Hosted frontend sends the scanning wallet address and IP to the indexer on every default scan; avoidable only by building from source with the indexer disabled.',
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
          title: 'Direct log scan (fetchAllAnnouncementFromLogs)',
          url: `${REPO}/umbra-js/src/classes/Umbra.ts`,
        },
        {
          title: 'Relayer API client',
          url: `${REPO}/frontend/src/utils/umbra-api.ts`,
        },
      ],
    },
    privilegedInsider: {
      condition: 'owner can only stop new payments',
      sentiment: 'good',
      description:
        'The contracts are immutable and have no view key, decryption key, pause or upgrade path. The owner, a single EOA, can set an unbounded toll on new payments, which halts entries but cannot touch funds already at stealth addresses or block token withdrawals. Exclusion beyond that is client-side only: the frontend filters sanctioned addresses through a Chainalysis oracle and hardcoded lists, and the relayer operator can refuse to relay, leaving the user a direct withdrawal that needs gas at the stealth address.',
      boundary: {
        sender: 'leaked',
        recipient: 'atRisk',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'atRisk',
        identity: 'private',
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
      condition: 'key exchange breaks',
      sentiment: 'bad',
      description:
        'Recipient privacy rests entirely on secp256k1 ECDH: the ciphertext is the random scalar XORed with a hash of the shared secret, and the stealth key is that scalar times the spending key. A quantum adversary recovers every registered viewing key from the public registry, or the ephemeral key from the announcement itself, and can then run the recipient scan over all announcements since 2021. Every stealth payment to a recipient whose public key is known becomes linked retroactively. Nothing else is encrypted, so no other field changes.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'atRisk',
          note: 'Inherits everything the chain analyst learns.',
        },
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
  },
})
