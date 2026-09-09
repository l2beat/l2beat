import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const STEALTH = 'https://github.com/cloakedxyz/clkd-stealth'
const RESOLVER =
  'https://etherscan.io/address/0x77fEF66b77d6a44AeCcCCf911f9864c7b7ca392C'

// Verdicts backed by the verified OffchainResolver source, discovered.json,
// the published clkd-stealth, clkd-recovery and clkd-privacy-pools SDKs, the
// public OpenAPI description of api.clkd.xyz and decoded relayer transactions.
// The web app and backend are closed source. Measurements as of 2026-09-08,
// block 25,934,069.
export const cloakedAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides which account owns a receiving address. Sender, amount and the address itself are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      condition: 'spend one address at a time',
      description:
        'Nothing of the stealth scheme is onchain: no announcement, no registry, no escrow. A payment is a plain transfer to a fresh EOA that the Cloaked server generated for the recipient, so sender, amount and asset are public and the receiving address is a pseudonym nobody can tie to an account. Exits are EIP-7702 transactions submitted by two Cloaked relayer EOAs with fees paid to a Cloaked Safe, so every spend is publicly attributable to Cloaked, but not to a user. The one public leak is consolidation: about a quarter of relayer transactions bundle several stealth addresses, proving common ownership. The optional Privacy Pools hop is assessed under Privacy Pools.',
      boundary: {
        sender: 'leaked',
        recipient: 'private',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Bundling several stealth addresses in one exit links them as one owner; a change output to a fresh Cloaked address links the pair.',
        },
        identity: 'private',
      },
      sources: [
        { title: 'Stealth derivation (clkd-stealth)', url: STEALTH },
        {
          title: 'OffchainResolver (only onchain component)',
          url: `${RESOLVER}#code`,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      condition: 'no consolidation, delayed spends',
      description:
        'Each stealth address receives once and is spent minutes later, the median in a sample being seven minutes, so entry and exit pair trivially per address and the question is who owns the cluster. Consolidation bundles and change outputs to fresh Cloaked addresses let an analyst rebuild account clusters without any key, and the constant relayer and fee addresses isolate the whole Cloaked population, including its share of Privacy Pools deposits and withdrawals, which shrinks the effective anonymity set of a Cloaked pool withdrawal if same-client behaviour is assumed. Most pool withdrawals cash out to external addresses with exact public amounts.',
      boundary: {
        sender: 'leaked',
        recipient: {
          verdict: 'atRisk',
          note: 'Hidden unless the exit destination is reused or KYC-linked, or the address is bundled with others.',
        },
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Change-graph clustering and consolidation reveal which addresses belong together.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Exchange KYC on the payer or on the exit destination.',
        },
      },
      sources: [
        {
          title: 'Porto Orchestrator (exit transactions)',
          url: 'https://etherscan.io/address/0x36a7cd5b1f475122a2b52580fc8e170a2cd312ef',
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      condition: 'everything through Cloaked servers',
      description:
        "The app has no local scanning, no user RPC and no user-side broadcast. Address generation, balance indexing, quotes, signed intents and broadcasts all go through the Cloaked API with the IP and a stable per-account identifier, and the two relayers are the only submission path. A payer who resolves a Cloaked ENS name performs the offchain lookup against the same API, so the payer's IP reaches Cloaked about an hour before the payment lands. There is no supported way to use a different relayer or node; leaving requires exporting keys with the recovery tool.",
      boundary: {
        sender: 'leaked',
        recipient: {
          verdict: 'leaked',
          note: 'The server generates the address for a known account and indexes it.',
        },
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'leaked',
          note: 'IP and account identifier on every request; payer IP on ENS lookups.',
        },
      },
      sources: [
        { title: 'Server-bound keys (deriveServerBoundKeys)', url: STEALTH },
        {
          title: 'Recovery tool (exit path)',
          url: 'https://github.com/cloakedxyz/clkd-recovery',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'Cloaked knows every address',
      description:
        'The "admin view key" is architectural rather than a protocol key. The server stores the account\'s spending public key and a hardened child of the viewing key, which is exactly what it needs to generate every stealth address deterministically, past and future, on every chain, and to regenerate the set from a database dump. Keys derive from a wallet signature plus PIN or a passkey and cannot be rotated. For the Privacy Pools hop the server receives the deposit precommitment and the full withdrawal calldata, and its documentation states that it retains the association. Spending authority stays with the client, conditional on the closed web app behaving like the published SDK.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'leaked',
          note: 'Including deposit-to-withdrawal links of the Privacy Pools hop, which the server records.',
        },
        identity: {
          verdict: 'leaked',
          note: 'Same operator as the network observer; a database leak hands the same to anyone.',
        },
      },
      sources: [
        {
          title: 'Account creation stores keys (OpenAPI)',
          url: 'https://api.clkd.xyz/openapi.json',
        },
        { title: 'Server-bound keys (deriveServerBoundKeys)', url: STEALTH },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      condition: 'passkey account, not wallet plus PIN',
      description:
        "Nothing linkable is onchain. Stealth keys are derived by ECDH on secp256k1, but no public key, ephemeral point or ciphertext is ever published, so a quantum computer recovering stealth private keys from spend signatures cannot relate two addresses of one account. This is strictly better than announcement-based schemes. The exception is accounts registered with a wallet signature and a four-digit PIN: a quantum adversary recovering that wallet's key from any public signature can rederive the account keys and the Privacy Pools seed, exposing the whole history. Passkey-derived keys are symmetric and unaffected.",
      boundary: {
        sender: 'leaked',
        recipient: {
          verdict: 'atRisk',
          note: "Hidden for passkey accounts; wallet-plus-PIN accounts reduce to the wallet's secp256k1 key.",
        },
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'atRisk',
          note: 'Same condition; consolidation links remain public regardless.',
        },
        identity: {
          verdict: 'atRisk',
          note: 'Only via retained server or ISP logs.',
        },
      },
      sources: [
        { title: 'Key derivation from wallet signature or PRF', url: STEALTH },
      ],
    },
  },
})
