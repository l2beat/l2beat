import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const STEALTH =
  'https://github.com/cloakedxyz/clkd-stealth/blob/9eb359efdd4ea31f5504bf81e57dcfe6f966dc14/src/'
const DOCS = 'https://clkd.xyz/docs/'
const HOW_IT_WORKS = DOCS + 'how-it-works'
const PRIVACY = DOCS + 'privacy'

export const cloakedAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'recipient',
    text: `Hides which account a receiving address belongs to. ${S.stealthPromiseTail}`,
  },
  cells: {
    publicObserver: {
      sentiment: 'good',
      exposureShort:
        'Each payment reaches a fresh address, and nothing onchain names the account behind it.',
      exposureContinued:
        'A send draws from several addresses in one transaction unless you pick one with Advanced Control. Its change goes to a fresh address in the same transaction, which links the two.',
      advice: S.freshReceive(
        'spend one address at a time with Advanced Control',
      ),
      sources: [
        {
          title: 'Address derivation from server-held ephemeral material',
          url: STEALTH + 'shared/genStealthAddress.ts#L17-L58',
        },
        {
          title: 'Input selection, Advanced Control and change',
          url: HOW_IT_WORKS + '#sending-funds',
        },
        {
          title: 'A multi-address send links those addresses',
          url: HOW_IT_WORKS + '#what-is-visible-onchain',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        "Cloaked's relayers and fee Safe mark every spend, so an address hides only among Cloaked's users, a small set by onchain activity.",
      exposureContinued:
        'Timing, distinctive amounts, recurring counterparties and change outputs cluster recipients further. Incognito withdrawals from Privacy Pools carry the same relayer and fee marks.',
      advice:
        'Space out related payments, avoid distinctive amounts and follow your own change outputs to see what a counterparty can trace.',
      sources: [
        {
          title: 'Documented links and change handling',
          url: HOW_IT_WORKS + '#what-is-visible-onchain',
        },
        {
          title: 'Deterministic ephemeral keys stay offchain',
          url: STEALTH + 'shared/deriveDeterministicEphemeralKey.ts#L35-L68',
        },
        {
          title: 'Relay fee receiver for Privacy Pools withdrawals',
          url: 'https://api.clkd.xyz/relayer/details?chainId=1&assetAddress=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      exposureShort:
        'The app is closed source with no open alternative, so what it sends to third parties is up to Cloaked and can change at any time.',
      exposureContinued:
        "Today's app sends spends, quotes and balance reads to Cloaked's own API. Linking your own ENS name reads it through Alchemy under Cloaked's key, and wallet logins go through WalletConnect. A payer who looks up your name through a third-party RPC shows it your name and the new address.",
      sources: [
        {
          title: 'Service providers: RPC, hosting and wallet connection',
          url: PRIVACY,
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
      exposureShort: S.operatorViewingKey('Cloaked'),
      exposureContinued:
        'It also serves the closed-source app that handles your keys. Its relay submits both sides of every Incognito round trip through Privacy Pools and keeps the association.',
      sources: [
        {
          title: 'Viewing key and public spending key shared with the server',
          url: STEALTH + 'client/deriveServerBoundKeys.ts#L16-L53',
        },
        {
          title: 'Privacy policy: retained pool associations and account data',
          url: PRIVACY,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'warning',
      exposureShort: S.noAnnouncement,
      exposureContinued: `${S.operatorViewingKeyRegardless('Cloaked')} ${S.walletSignatureAccounts('plus a four-digit PIN')} Passkey secrets do not follow from breaking the passkey.`,
      advice: `${S.notWalletSignature('with a passkey')} ${S.permanentlyDisclosed('the address history shared with Cloaked')}`,
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
          title: 'Independent secrets, including two WebAuthn PRF outputs',
          url: STEALTH + 'client/genKeys.ts#L7-L67',
        },
        { title: 'Operator data and retention', url: PRIVACY },
      ],
    },
  },
})
