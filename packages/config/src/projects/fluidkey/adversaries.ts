import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

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
    text: `Hides which account a receiving Safe belongs to. ${S.stealthPromiseTail}`,
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'A payment reaches a predicted Safe before it is deployed, with no onchain announcement linking it to the recipient account. Deployment later exposes the individual stealth owner and enabled modules, not the parent account.',
      advice: S.freshReceive('keep unrelated funds separate with labels'),
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
      sentiment: 'warning',
      exposure:
        'Safe deployment and auto-earn events make service use recognizable, which narrows the anonymity set to Fluidkey users. Nothing onchain maps Safes to accounts, but timing, amounts, common destinations and reuse across chains can identify or cluster recipients, and a send draws from several Safes by default, which links them. The optional Hide Trail routes through Houdini and two exchanges, a separate service with its own trust assumptions.',
      advice:
        'Label payments so a send draws from one Safe. Check related activity across chains and space out distinctive payments.',
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
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposure:
        "The hosted client is closed source, so which RPC and analytics providers see your Safe list cannot be verified. Paying to your fkey.id name hands the name and the fresh address to whoever resolves ENS for the payer, often the payer's RPC provider. Only the open kit and the recovery app can be pointed at your own node.",
      advice:
        'Derive addresses with the kit and hand them to payers directly instead of the ENS name. Read balances with the recovery app on your own RPC, and deploy and spend from a fresh gas wallet, since the recovery app deploys Safes from the connected wallet.',
      sources: [
        { contract: 'OffchainResolver', title: 'Offchain ENS gateway' },
        {
          title: 'Local CREATE2 prediction needs no RPC',
          url: KIT + 'predictStealthSafeAddress.ts#L120-L180',
        },
        {
          title: 'Recovery app accepts a custom RPC',
          url: SARA + '/src/components/RecoverAddressesJourneyStep.tsx#L468',
        },
        {
          title: 'Recovery app deploys the Safe from the connected wallet',
          url: SARA + '/src/hooks/useDeployStealthSafe.ts#L63-L99',
        },
        {
          title: 'Disclosed service providers and transport encryption',
          url: PRIVACY,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure: `${S.operatorViewingKey('Fluidkey')} Optional identity-verified services add identity attributes, and Hide Trail adds route knowledge at Houdini and each exchange.`,
      advice: S.localClientSpendingKeys('Fluidkey'),
      sources: [
        {
          title: 'Private viewing key shared with the service',
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
      exposure: `${S.noAnnouncementQuantum('Fluidkey')} ${S.walletSignatureAccounts('plus a four-digit PIN')}`,
      advice: `${S.notWalletSignature('with independently generated keys')} ${S.permanentlyDisclosed('the viewing key shared with Fluidkey')}`,
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
