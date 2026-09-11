import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const STEALTH = 'https://github.com/cloakedxyz/clkd-stealth'
const ORCHESTRATOR =
  'https://etherscan.io/address/0x36a7cd5b1f475122a2b52580fc8e170a2cd312ef'
const DELEGATE =
  'https://etherscan.io/address/0x7c27e3aecbf42879b64d76f604dc3430f4886462'

export const cloakedAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides which account owns a receiving address. Sender, amount and the address itself are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      exposure:
        'Nobody can tell who owns the address: the derivation is never published, and a payment is a plain transfer to a fresh address. What is public is that the address belongs to this service, because spending from it first points the account at one shared implementation that every user shares, and everyone sees the sender and the amount.',
      advice:
        'Spend one address at a time. Every address you bundle into one exit is publicly marked as yours.',
      sources: [
        {
          contract: 'OffchainResolver',
          title: 'ENS resolver (only onchain component)',
        },
        {
          title: 'Shared account delegation that marks a used address',
          url: DELEGATE,
        },
        { title: 'Stealth derivation (clkd-stealth)', url: STEALTH },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'Each address receives once and is spent once, change goes to another address of the same account, and every exit is relayed through one shared contract by few submitters, so the set of exits is trivially enumerable. The anonymity set is small.',
      advice:
        'Wait before spending, exit one address at a time, and send to destinations that have no link to you.',
      sources: [
        {
          title: 'Exit transactions run through one orchestrator',
          url: ORCHESTRATOR,
        },
        { title: 'Shared account delegation', url: DELEGATE },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        "Every action goes to Cloaked's servers. On the wire there is nothing but encrypted traffic to Cloaked.",
      sources: [
        { title: 'Server-bound keys (clkd-stealth)', url: STEALTH },
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
      advice:
        'Run a local client so the spending key never reaches the hosted app, and check the transactions it hands you before signing.',
      sources: [
        {
          title: 'Account creation stores keys (OpenAPI)',
          url: 'https://api.clkd.xyz/openapi.json',
        },
        { title: 'Server-bound keys (clkd-stealth)', url: STEALTH },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        "No key material is published onchain, so a quantum computer cannot link your addresses, unless your account was created from a wallet signature plus PIN, which reduces to that wallet's key. Stealth address protocols, by not breaking the link between deposit and withdrawal address, are questionably future-proof because they create obscurity rather than privacy.",
      advice:
        'Create your account with a passkey, not with a wallet signature.',
      sources: [{ title: 'Key derivation (clkd-stealth)', url: STEALTH }],
    },
  },
})
