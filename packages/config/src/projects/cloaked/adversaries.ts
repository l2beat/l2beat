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
      exposure:
        'Nothing of the scheme is onchain: a payment is a plain transfer to a fresh address that Cloaked generated for you. Everyone sees sender and amount; nobody can tell who owns the address.',
      advice:
        'Spend one address at a time; every address you bundle into one exit is publicly marked as yours.',
      boundary: {
        sender: 'exposed',
        recipient: 'private',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'atRisk',
          note: 'Bundling several stealth addresses in one exit links them as one owner; a change output to a fresh Cloaked address links the pair.',
        },
        identity: 'private',
      },
      sources: [
        {
          contract: 'OffchainResolver',
          title: 'ENS resolver (only onchain component)',
        },
        {
          title: 'Stealth derivation (clkd-stealth)',
          url: 'https://github.com/cloakedxyz/clkd-stealth',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      condition: 'no consolidation, delayed spends',
      exposure:
        'Each address receives once and is spent within minutes, and change goes to another Cloaked address, so an analyst rebuilds address clusters without any key. All exits are visibly relayed by Cloaked.',
      advice:
        'Wait before spending, and send to destinations that have no link to you.',
      boundary: {
        sender: 'exposed',
        recipient: {
          verdict: 'atRisk',
          note: 'Hidden unless the exit destination is reused or KYC-linked, or the address is bundled with others.',
        },
        amount: 'exposed',
        asset: 'exposed',
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
      exposure:
        "Address generation, balances, quotes and broadcasts all go through Cloaked's servers with your IP and a fixed account identifier. Even a payer looking up your name hits Cloaked's server.",
      boundary: {
        sender: 'exposed',
        recipient: {
          verdict: 'exposed',
          note: 'The server generates the address for a known account and indexes it.',
        },
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'exposed',
          note: 'IP and account identifier on every request; payer IP on ENS lookups.',
        },
      },
      sources: [
        {
          title: 'Server-bound keys (clkd-stealth)',
          url: 'https://github.com/cloakedxyz/clkd-stealth',
        },
        {
          title: 'Recovery tool (exit path)',
          url: 'https://github.com/cloakedxyz/clkd-recovery',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'Cloaked knows every address',
      exposure:
        'Cloaked generates every address for your account and stores the keys needed to regenerate them all, past and future, so it knows all your addresses. It cannot spend your funds. For the pool option it also records which deposit became which withdrawal.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'exposed',
          note: 'Including deposit-to-withdrawal links of the Privacy Pools hop, which the server records.',
        },
        identity: {
          verdict: 'exposed',
          note: 'Same operator as the network observer; a database leak hands the same to anyone.',
        },
      },
      sources: [
        {
          title: 'Account creation stores keys (OpenAPI)',
          url: 'https://api.clkd.xyz/openapi.json',
        },
        {
          title: 'Server-bound keys (clkd-stealth)',
          url: 'https://github.com/cloakedxyz/clkd-stealth',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      condition: 'passkey account, not wallet plus PIN',
      exposure:
        "No key material is published onchain, so a quantum computer cannot link your addresses, unless your account was created from a wallet signature plus PIN, which reduces to that wallet's key.",
      advice:
        'Create your account with a passkey, not with a wallet signature.',
      boundary: {
        sender: 'exposed',
        recipient: {
          verdict: 'atRisk',
          note: "Hidden for passkey accounts; wallet-plus-PIN accounts reduce to the wallet's secp256k1 key.",
        },
        amount: 'exposed',
        asset: 'exposed',
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
        {
          title: 'Key derivation (clkd-stealth)',
          url: 'https://github.com/cloakedxyz/clkd-stealth',
        },
      ],
    },
  },
})
