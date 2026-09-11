import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const KIT =
  'https://github.com/fluidkey/fluidkey-stealth-account-kit/blob/2a4ccfafef127165c11ba16fc16235c919698ec2/src/'

export const fluidkeyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides which account owns a receiving address. Sender, amount and the address itself are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      exposure:
        'Nobody can tell who owns the Safe: the derivation is never published, and a payment is a plain transfer to a fresh Safe. What is public is that the Safe belongs to this service, because deploying it and switching on auto-earn both write a marker that anyone can read, and everyone sees the sender and the amount.',
      advice:
        'Spend one Safe at a time. Every Safe you empty in one action is publicly marked as yours.',
      sources: [
        {
          contract: 'OffchainResolver',
          title: 'ENS resolver (only onchain component besides Safes)',
        },
        {
          contract: 'FluidkeyEarnModule',
          title: 'Module install marks a Safe as belonging to the service',
        },
        {
          title: 'Stealth derivation (fluidkey-stealth-account-kit)',
          url: KIT + 'generateStealthAddresses.ts',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'Every receiving address is a Safe deployed and relayed by the service, and the ones using auto-earn can be listed in full from a single contract, on every chain, without any key. That gives the analyst the whole population to work from. Hide Trail moves funds through two centralized exchanges, which breaks the public trail but hands it to them.',
      advice:
        'Wait before spending, spend from one Safe at a time, and send to destinations that have no link to you.',
      sources: [
        {
          contract: 'FluidkeyEarnModule',
          title: 'Install events enumerate the Safe population',
        },
        {
          title: 'Technical walkthrough',
          url: 'https://docs.fluidkey.com/technical-documentation/technical-walkthrough/',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        "Every action goes to Fluidkey's servers. On the wire there is nothing but encrypted traffic to Fluidkey.",
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
        'Fluidkey holds your private viewing node and public spending key, derives every receiving Safe from them and indexes their balances, so it knows all your addresses, past and future. It picks the Safes you spend from and prepares each transaction, and every payer who resolves your name hits its gateway. It cannot spend your funds. Hide Trail hands the link between source and destination to a swap service and two exchanges.',
      advice:
        'Run a local client so the spending key never reaches the hosted app, and check the transactions it hands you before signing.',
      sources: [
        {
          title: 'Viewing node shared with the service (stealth-account-kit)',
          url: KIT + 'extractViewingPrivateKeyNode.ts',
        },
        { contract: 'OffchainResolver', title: 'Gateway URL and signers' },
        { section: 'permissions' },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        "No key material is published onchain: Fluidkey derives addresses from your viewing node and never announces them, so a quantum computer alone cannot link your Safes. Accounts created from the signature of a wallet that has transacted onchain reduce to that wallet's key plus a short PIN. Stealth address protocols, by not breaking the link between deposit and withdrawal address, are questionably future-proof because they create obscurity rather than privacy.",
      advice:
        'Create the account with an embedded or device key, or with a wallet that never transacts onchain.',
      sources: [
        {
          title: 'Keys from a signature (stealth-account-kit)',
          url: KIT + 'generateKeysFromSignature.ts',
        },
      ],
    },
  },
})
