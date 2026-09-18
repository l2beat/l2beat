import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const STEALTH_REPO =
  'https://github.com/cloakedxyz/clkd-stealth/blob/9eb359efdd4ea31f5504bf81e57dcfe6f966dc14/'
const STEALTH = STEALTH_REPO + 'src/'
const RECOVERY =
  'https://github.com/cloakedxyz/clkd-recovery/blob/b432a33873e2cfa4769807f8c95ed20a67234eed/src/'
const HOW_IT_WORKS = 'https://clkd.xyz/docs/how-it-works'
const API = 'https://clkd.xyz/openapi.json'
const PRIVACY = 'https://clkd.xyz/docs/privacy'

export const cloakedAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: `Hides which account a receiving address belongs to. ${S.stealthPromiseTail}`,
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposure:
        'A fresh receiving address has no public derivation linking it to the recipient account, but its funds can be followed through later sends and change outputs. Combining addresses exposes their joint use, and EIP-7702 delegation reveals the account implementation without proving who owns the address.',
      advice: S.freshReceive(
        'spend address-held balances separately with Advanced Control',
      ),
      sources: [
        {
          title: 'Address derivation from server-held ephemeral material',
          url: STEALTH + 'shared/genStealthAddress.ts#L17-L58',
        },
        {
          title: 'Input selection, visible change and EIP-7702 execution',
          url: HOW_IT_WORKS + '#sending-funds',
        },
        {
          title:
            'Quote API: spendableAddresses and reusable singleAddress mode',
          url: API,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'Spending through shared execution infrastructure makes service use recognizable, which narrows the anonymity set to Cloaked users. No registry or announcement maps accounts to addresses, but timing, distinctive amounts, recurring counterparties and consolidation can identify or cluster recipients. A send draws from several addresses by default and leaves a change output that links them.',
      advice:
        'Space out related payments and check whether amounts or recurring patterns identify you. Follow your own change outputs to see what a counterparty can trace.',
      sources: [
        {
          title: 'Documented transaction links and change handling',
          url: HOW_IT_WORKS + '#what-is-visible-onchain',
        },
        {
          title: 'Deterministic ephemeral keys stay offchain',
          url: STEALTH + 'shared/deriveDeterministicEphemeralKey.ts#L35-L68',
        },
        {
          title:
            'API permits repeated use; receive-once/spend-once is not enforced',
          url: API,
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposure:
        'Every spend from the hosted client goes to a third-party relay, Porto, with the stealth address, destination and amount, which clusters your addresses per session even over Tor. The client is closed source, so what else reaches the RPC, hosting and analytics providers named in the privacy policy cannot be verified. Only the recovery tool runs without any server.',
      advice:
        'Derive your address keys with the recovery tool, which makes no network calls, and spend them from a wallet on your own node over Tor. Fund gas for token transfers from a fresh wallet, since sponsored execution is only available through the hosted client.',
      sources: [
        {
          title:
            'Client sends prepareCalls with address, recipient and amount to Porto RPC',
          url: STEALTH_REPO + 'README.md#architecture',
        },
        {
          contract: 'OffchainResolver',
          title:
            'CCIP-Read forwards the ENS query and verifies the returned answer',
        },
        {
          title:
            'Disclosed metadata, relay data and external service providers',
          url: PRIVACY,
        },
        {
          title: 'Recovery derives address keys locally without API calls',
          url: RECOVERY + 'lib/deriveKeys.ts#L31-L68',
        },
        {
          title:
            'Recovered keys are spent from any wallet; token sends need gas',
          url: RECOVERY + 'components/PostRecoveryGuide.tsx#L81-L106',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure: `${S.operatorViewingKey('Cloaked')} Its Incognito relay states that it retains deposit-to-withdrawal associations, and the hosted wallet code handles your spending secrets.`,
      advice: S.localClientSpendingKeys('Cloaked'),
      sources: [
        {
          title: 'Viewing key and public spending key shared with the server',
          url: STEALTH + 'client/deriveServerBoundKeys.ts#L16-L53',
        },
        {
          title: 'Account-scoped addresses, quotes, submissions and pool state',
          url: API,
        },
        {
          title: 'Privacy policy: retained pool associations and account data',
          url: PRIVACY,
        },
        {
          contract: 'OffchainResolver',
          title: 'Signature and expiry checks do not prove recipient control',
        },
        {
          section: 'permissions',
          title: 'Owner can replace gateway and signer',
        },
        {
          section: 'upgrades-and-governance',
          title: 'Hosted-client trust boundary',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposure: `${S.noAnnouncementQuantum('Cloaked')} ${S.walletSignatureAccounts('plus a four-digit PIN')} Passkey PRF secrets do not follow from breaking the passkey.`,
      advice: `${S.notWalletSignature('with the passkey PRF setup')} ${S.permanentlyDisclosed('the address history shared with Cloaked')}`,
      sources: [
        {
          title:
            'Stealth signing keys mix the spending key with a hashed secret',
          url: STEALTH + 'client/genStealthPrivateKey.ts#L17-L34',
        },
        {
          title:
            'Four-digit PIN and wallet address determine the signed message',
          url: STEALTH + 'client/genCloakedMessage.ts#L15-L48',
        },
        {
          title: 'Signature components are hashed into the account keys',
          url: STEALTH + 'client/genKeysFromSignature.ts#L23-L42',
        },
        {
          title: 'Independent secrets, including two WebAuthn PRF outputs',
          url: STEALTH + 'client/genKeys.ts#L7-L67',
        },
        {
          title: 'FIDO hmac-secret uses a separate random credential secret',
          url: 'https://fidoalliance.org/specs/fido-v2.1-ps-20210615/fido-client-to-authenticator-protocol-v2.1-ps-20210615.html#sctn-hmac-secret-extension',
        },
        { title: 'Operator data and retention', url: PRIVACY },
      ],
    },
  },
})
