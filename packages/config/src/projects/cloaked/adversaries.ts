import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

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
      exposure:
        'Nobody can tell who owns the address: nothing of the scheme is onchain, a payment is a plain transfer to a fresh address Cloaked generated for you. Everyone sees sender and amount.',
      advice:
        'Spend one address at a time; every address you bundle into one exit is publicly marked as yours.',
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
      sentiment: 'good',
      exposure:
        'Each address receives once and is spent once, change goes to another Cloaked address, and every exit is visibly relayed by Cloaked, so the analyst rebuilds address clusters without any key and knows the whole population of Cloaked users.',
      advice:
        'Wait before spending, and send to destinations that have no link to you.',
      sources: [
        {
          title: 'Porto Orchestrator (exit transactions)',
          url: 'https://etherscan.io/address/0x36a7cd5b1f475122a2b52580fc8e170a2cd312ef',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        "Every action goes to Cloaked's servers; on the wire there is nothing but encrypted traffic to Cloaked.",
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
      exposure:
        'Cloaked generates every address for your account and stores the keys to regenerate them all, so it knows all your addresses, past and future. Address generation, balances, quotes and broadcasts pass through its servers under a fixed account identifier, and every payer who resolves your name hits its server. It cannot spend your funds. For the pool option it records which deposit became which withdrawal.',
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
      sentiment: 'good',
      exposure:
        "No key material is published onchain, so a quantum computer cannot link your addresses, unless your account was created from a wallet signature plus PIN, which reduces to that wallet's key.",
      advice:
        'Create your account with a passkey, not with a wallet signature.',
      sources: [
        {
          title: 'Key derivation (clkd-stealth)',
          url: 'https://github.com/cloakedxyz/clkd-stealth',
        },
      ],
    },
  },
})
