import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const KIT =
  'https://github.com/fluidkey/fluidkey-stealth-account-kit/blob/2a4ccfafef127165c11ba16fc16235c919698ec2/src/'
const EARN =
  'https://github.com/fluidkey/fluidkey-earn-module/blob/122cde19940d06b94c0027f4cd2e22e7fa19129a/src/FluidkeyEarnModule.sol'
const SARA =
  'https://github.com/fluidkey/sara/blob/6ab939e176cbae60a33214d292070d6a1dfe9b30'
const WALKTHROUGH =
  'https://docs.fluidkey.com/technical-documentation/technical-walkthrough/'
const HIDE_TRAIL = 'https://docs.fluidkey.com/readme/advanced-privacy/'
const PRIVACY = 'https://www.fluidkey.com/privacy'

export const fluidkeyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: 'Hides the link between a receiving Safe and the recipient account from the public. The payer knows the address it was given. Sender, asset, amount and subsequent fund movements remain public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'A payment can reach a predicted Safe before it is deployed, without an onchain announcement linking it to the recipient account. Deployment later exposes the individual stealth owner and any enabled modules, not the parent account.',
      advice:
        'Generate a fresh address for each receive, keep unrelated funds separate using labels, and send to destinations that have no public link to you.',
      sources: [
        {
          title: 'Counterfactual receiving Safe and individual stealth signer',
          url: WALKTHROUGH + '#3-stealth-accounts',
        },
        {
          title: 'Safe owner and initialization data determine the address',
          url: KIT + 'predictStealthSafeAddress.ts#L32-L104',
        },
        {
          contract: 'FluidkeyEarnModule',
          title: 'AutoEarnExecuted exposes Safe, token and deposited amount',
        },
        {
          title: 'Labels restrict which balances fund a send',
          url: 'https://docs.fluidkey.com/readme/labels/',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'good',
      exposure:
        'Service use can become recognizable at Safe deployment or during auto-earn, which can substantially narrow the anonymity set. Module events and deployment parameters help identify candidate Fluidkey activity, but cover only particular deployed configurations and do not map Safes to user accounts. Timing, amounts, common destinations and reuse across chains can still cluster them. Optional Hide Trail routes through Houdini and two exchanges, adding an offchain break in the transfer path whose resistance to correlation cannot be inferred from the stealth-address derivation.',
      advice:
        'Check related activity across chains and space out distinctive payments. Evaluate Hide Trail as a separate service with different trust assumptions.',
      sources: [
        {
          title:
            'onInstall records its caller; an event alone is not proof of a Fluidkey user',
          url: EARN + '#L243-L260',
        },
        {
          title:
            'Different auto-earn versions use different initialization data',
          url: 'https://docs.fluidkey.com/technical-documentation/stealth-account-initdata/',
        },
        {
          title:
            'Shared derivation path permits the same addresses across chains',
          url: WALKTHROUGH + '#3a-stealth-signer-derivation',
        },
        { title: 'Hide Trail integration', url: HIDE_TRAIL },
        {
          title:
            'Houdini describes separate exchange legs and an intermediary asset',
          url: 'https://docs.houdiniswap.com/overview/swaps-and-transfers/private-swaps',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposure:
        "The closed-source hosted client and backend leave privacy against outside providers unverifiable. The public kit's RPC-based Safe predictor sends the owner and initialization data to an RPC, while local prediction is also available.",
      advice:
        'Use local Safe prediction and your own RPC for recovery balance queries, with Tor for broadcasts. Audit the recovery client settings separately from the hosted app.',
      sources: [
        { contract: 'OffchainResolver', title: 'Offchain ENS gateway' },
        {
          title: 'RPC prediction sends the Safe initializer in eth_call',
          url: KIT + 'predictStealthSafeAddress.ts#L60-L101',
        },
        {
          title: 'Alternative prediction computes CREATE2 locally',
          url: KIT + 'predictStealthSafeAddress.ts#L120-L180',
        },
        {
          title: 'Recovery balance queries accept a custom RPC',
          url: SARA + '/src/utils/bulkBalances.ts#L87-L99',
        },
        {
          title: 'Disclosed service providers and transport encryption',
          url: PRIVACY,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "Fluidkey can regenerate every address within the shared viewing branch and associate its activity with your account. Optional identity-verified services also give Fluidkey identity attributes, and Hide Trail adds Houdini route knowledge and each exchange's visibility into its own leg, without evidence that each exchange alone sees the full route.",
      advice:
        "Verify receiving-address derivations and signed transactions with an inspected local client. This protects the spending-key boundary but does not remove Fluidkey's viewing access.",
      sources: [
        {
          title: 'Private viewing branch shared with the service',
          url: KIT + 'extractViewingPrivateKeyNode.ts#L14-L30',
        },
        {
          title: 'Ephemeral key plus public spending key generates each signer',
          url: KIT + 'generateStealthAddresses.ts#L14-L49',
        },
        {
          contract: 'OffchainResolver',
          title:
            'ENS signature authenticates the service, not recipient control',
        },
        {
          contract: 'FluidkeyEarnModule',
          title:
            'Relayers initiate deposits under the Safe-selected configuration',
        },
        { section: 'permissions' },
        {
          section: 'upgrades-and-governance',
          title: 'Hosted-client trust boundary',
        },
        {
          title: 'Optional verification results and identity attributes',
          url: PRIVACY,
        },
        {
          title: 'Hide Trail and its exchange intermediaries',
          url: HIDE_TRAIL,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure:
        'No ephemeral announcement is published, so recovering an individual Safe signer key does not by itself reveal the parent account, but retained viewing material or operator address mappings expose the history regardless of the login method. Where account creation uses a deterministic wallet signature, an exposed login-wallet public key can be broken to reproduce signatures and try the short PIN. Independently generated account keys avoid that specific path, while merely keeping a wallet offchain is insufficient if its public key or recoverable signatures leak elsewhere.',
      advice:
        'Prefer independently generated account keys when avoiding wallet-signature recovery risk, and treat the viewing branch shared with Fluidkey as permanently disclosed to the service.',
      sources: [
        {
          title: 'Stealth signer depends on a hashed shared secret',
          url: KIT + 'generateStealthPrivateKey.ts#L11-L21',
        },
        {
          title: 'Signature halves generate the viewing and spending keys',
          url: KIT + 'generateKeysFromSignature.ts#L11-L36',
        },
        {
          title: 'Wallet address and PIN determine the key-generation message',
          url: KIT + 'utils/generateFluidkeyMessage.ts#L10-L32',
        },
        {
          title: 'Recovery supports a four-digit PIN, defaulting to 0000',
          url: SARA + '/src/components/GenerateKeysJourneyStep.tsx#L28-L90',
        },
        {
          title: 'Distinct web embedded-wallet and mobile device-key setups',
          url: 'https://docs.fluidkey.com/readme/account-set-up/',
        },
        { title: 'Operator data retention', url: PRIVACY },
      ],
    },
  },
})
