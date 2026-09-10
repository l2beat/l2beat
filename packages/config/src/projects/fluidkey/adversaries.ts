import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

// Verdicts backed by the verified OffchainResolver and FluidkeyEarnModule
// sources, discovered.json, the published fluidkey-stealth-account-kit and the
// Fluidkey docs. The web app, API, gateway, indexer and relay are closed
// source. First pass from published sources as of 2026-09-10; onchain
// population and clustering not yet measured.
export const fluidkeyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides which account owns a receiving address. Sender, amount and the address itself are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'Nobody can tell who owns the Safe: nothing of the scheme is onchain, a payment is a plain transfer to a fresh Safe that Fluidkey derived for you. Everyone sees sender and amount.',
      advice:
        'Spend one Safe at a time; every Safe you empty in one action is publicly marked as yours.',
      sources: [
        {
          contract: 'OffchainResolver',
          title: 'ENS resolver (only onchain component besides Safes)',
        },
        {
          title: 'Stealth derivation (fluidkey-stealth-account-kit)',
          url: 'https://github.com/fluidkey/fluidkey-stealth-account-kit',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure:
        'Every receiving address is a 1/1 Safe deployed and relayed by Fluidkey, so the analyst knows the whole population of Fluidkey Safes and clusters those emptied together or sent to one destination. Hide Trail moves funds through two exchanges, which breaks the public trail but hands it to them.',
      advice:
        'Wait before spending, and send to destinations that have no link to you.',
      sources: [
        {
          title: 'Technical walkthrough',
          url: 'https://docs.fluidkey.com/technical-documentation/technical-walkthrough/',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        "Every action goes to Fluidkey's servers; on the wire there is nothing but encrypted traffic to Fluidkey.",
      sources: [
        {
          title: 'Technical walkthrough',
          url: 'https://docs.fluidkey.com/technical-documentation/technical-walkthrough/',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        'Fluidkey holds your private viewing node and public spending key, derives every receiving Safe from them and indexes their balances, so it knows all your addresses, past and future. It picks the Safes you spend from and prepares each transaction, and every payer who resolves your name hits its gateway. It cannot spend your funds. Hide Trail hands the link between source and destination to Houdini Swap and two exchanges.',
      sources: [
        {
          title: 'Key sharing with the service (stealth-account-kit)',
          url: 'https://github.com/fluidkey/fluidkey-stealth-account-kit',
        },
        { contract: 'OffchainResolver', title: 'Gateway URL and signers' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'good',
      exposure:
        "No key material is published onchain: Fluidkey derives addresses from your viewing node and never announces them, so a quantum computer alone cannot link your Safes. Accounts created from the signature of a wallet that has transacted onchain reduce to that wallet's key plus a short PIN.",
      advice:
        'Create the account with an embedded or device key, or with a wallet that never transacts onchain.',
      sources: [
        {
          title: 'Keys from a signature (stealth-account-kit)',
          url: 'https://github.com/fluidkey/fluidkey-stealth-account-kit/blob/main/src/generateKeysFromSignature.ts',
        },
      ],
    },
  },
})
