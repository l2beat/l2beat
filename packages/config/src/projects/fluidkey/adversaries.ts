import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const KIT =
  'https://github.com/fluidkey/fluidkey-stealth-account-kit/blob/2a4ccfafef127165c11ba16fc16235c919698ec2/src/'
const EARN =
  'https://github.com/fluidkey/fluidkey-earn-module/blob/122cde19940d06b94c0027f4cd2e22e7fa19129a/src/FluidkeyEarnModule.sol'
const SARA =
  'https://github.com/fluidkey/sara/blob/e6e4fcd9e718722948b82fa0e819e0c4fca46e0d'
const DOCS = 'https://docs.fluidkey.com/'
const WALKTHROUGH = DOCS + 'technical-documentation/technical-walkthrough/'
const PRIVACY = 'https://www.fluidkey.com/privacy'

export function fluidkeyAdversaries(accounts: number) {
  return definePrivacyAdversaries({
    promise: {
      protects: 'recipient',
      text: `Hides which account a receiving Safe belongs to. ${S.stealthPromiseTail}`,
    },
    cells: {
      publicObserver: {
        sentiment: 'good',
        exposureShort:
          'Each payment reaches a fresh Safe, and nothing onchain names the account behind it.',
        exposureContinued:
          'A send that draws from several of your Safes shows onchain that they belong together.',
        advice: S.freshReceive(
          'label payments by payer and send from one label at a time',
        ),
        sources: [
          {
            title: 'Counterfactual receiving Safe and one-time stealth signer',
            url: WALKTHROUGH + '#3-stealth-accounts',
          },
          {
            title: 'Safe owner and initialization data determine the address',
            url: KIT + 'predictStealthSafeAddress.ts#L32-L104',
          },
          {
            title: 'Labels limit which Safes fund a send',
            url: DOCS + 'readme/labels/',
          },
        ],
      },
      chainAnalyst: {
        sentiment: 'good',
        exposureShort: `At least ${accounts.toLocaleString('en-US')} accounts have claimed Fluidkey's 'score' token, giving a lower bound of the anonymity set.`,
        exposureContinued:
          "A Safe looks like any new address until Fluidkey's relayer spends from it or deposits its funds for auto-earn. A claimed score sits on its own stealth address that holds nothing else, and its amount grows partly with the account's balance.",
        advice:
          'Ask for a new address for each payment, also when it arrives on another chain.',
        sources: [
          {
            contract: 'FluidkeyScore',
            title: 'Score holders, one address per claiming account',
          },
          {
            title: 'Score claimed in the app, based partly on total balance',
            url: DOCS + 'readme/score/',
          },
          {
            title:
              'The score accrues on a stealth address that holds nothing else',
            url: 'https://www.fluidkey.com/blog/fluidkey-score',
          },
          {
            contract: 'SmartAccountRelayer',
            title:
              "Fluidkey's relayer contract submits every send and auto-earn deposit",
          },
          {
            title: 'Auto-earn setup records the Safe that installs it',
            url: EARN + '#L243-L260',
          },
          {
            title:
              'Shared derivation path permits the same address on several chains',
            url: WALKTHROUGH + '#3a-stealth-signer-derivation',
          },
        ],
      },
      networkObserver: {
        sentiment: 'warning',
        exposureShort:
          'The app is closed source, so what it sends to third parties is up to Fluidkey and can change at any time.',
        exposureContinued:
          "Today, the web app reads the chain only through Fluidkey's servers and gives outside services just your login and username. A payer who looks up your name through a third-party RPC shows it your name and the new address.",
        advice:
          'Create addresses with the open kit and give them to payers yourself. Find and spend your funds with the open recovery app on your own node, paying gas from a new wallet, because the app deploys Safes from the wallet you connect.',
        sources: [
          {
            title:
              "The app's content security policy lists every endpoint it contacts",
            url: 'https://app.fluidkey.com',
          },
          {
            title: 'Local address prediction needs no RPC',
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
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort: S.operatorViewingKey('Fluidkey'),
        exposureContinued:
          "It also runs the closed-source app that handles your keys. With Google or Apple login on the web, Privy's code creates the signature your keys come from. Bank transfers add your verified identity, and Hide Trail shows your route to Houdini and two exchanges.",
        sources: [
          {
            title: 'Private viewing key shared with the service',
            url: KIT + 'extractViewingPrivateKeyNode.ts#L14-L30',
          },
          {
            title: 'Web keys are generated through a Privy embedded wallet',
            url: DOCS + 'readme/account-set-up/',
          },
          {
            title: 'Verification results and identity attributes',
            url: PRIVACY,
          },
          {
            title: 'Hide Trail and its exchange intermediaries',
            url: DOCS + 'readme/advanced-privacy/',
          },
        ],
      },
      futureAdversary: {
        sentiment: 'warning',
        exposureShort: S.noAnnouncement,
        exposureContinued: `${S.operatorViewingKeyRegardless('Fluidkey')} ${S.walletSignatureAccounts('plus a four-digit PIN')}`,
        advice: `Create your account in the mobile app, with Google or Apple login, or with a new wallet that has never sent a transaction. ${S.permanentlyDisclosed('the viewing key shared with Fluidkey')}`,
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
            title:
              'Wallet address and PIN determine the key-generation message',
            url: KIT + 'utils/generateFluidkeyMessage.ts#L10-L32',
          },
          {
            title: 'Recovery supports a four-digit PIN, defaulting to 0000',
            url: SARA + '/src/components/GenerateKeysJourneyStep.tsx#L28-L90',
          },
        ],
      },
    },
  })
}
