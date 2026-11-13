import {
  ADVICE_SNIPPETS as A,
  adviceLink,
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
          "A send that draws from several of the user's Safes shows onchain that they belong together.",
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
          "Alchemy, behind Fluidkey's proxy, receives the Safes the app shows and can group those of one account.",
        exposureContinued: `Without ${adviceLink('Tor', 'routes')}, the proxy can also pass it the user's IP. A payer who looks up the user's name gives their RPC the name and the new Safe. A Google, Apple, email or Farcaster login hands the identity to Privy, whose code then creates the signature the user's keys come from.`,
        sources: [
          {
            title: 'Served app, build entrypoint-4e96d22b (checked 2026-11-11)',
            url: 'https://app.fluidkey.com',
          },
          {
            title: 'Web keys are generated through a Privy embedded wallet',
            url: DOCS + 'readme/account-set-up/',
          },
          {
            contract: 'OffchainResolver',
            title:
              "Name lookups return the signed answer through the payer's RPC",
          },
        ],
      },
      privilegedInsider: {
        sentiment: 'bad',
        exposureShort: S.operatorViewingKey('Fluidkey'),
        exposureContinued:
          "Its closed-source app handles the user's keys. Bank transfers add the user's verified identity, and Hide Trail shows the user's route to Houdini and two exchanges.",
        sources: [
          {
            title: 'Private viewing key shared with the service',
            url: KIT + 'extractViewingPrivateKeyNode.ts#L14-L30',
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
        sentiment: 'good',
        exposureShort: S.noAnnouncement,
        exposureContinued: S.walletSignatureAccounts('plus a four-digit PIN'),
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
    advice: [
      {
        name: 'Sign in',
        text: `${A.torBrowser} Connect a new wallet that has never sent a transaction, not a Google, Apple, email or Farcaster login.`,
        against: ['networkObserver', 'futureAdversary'],
        outside: true,
      },
      {
        name: 'Receive',
        text: 'Share a fresh Safe address for each payment instead of your name. Use a new one for each chain as well. Label payments by payer.',
        against: ['publicObserver', 'chainAnalyst', 'networkObserver'],
      },
      {
        name: 'Spend',
        text: 'Send from one label at a time, to destinations with no public link to you.',
        against: ['publicObserver'],
      },
    ],
  })
}
