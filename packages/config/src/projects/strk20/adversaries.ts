import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

// PRIVACY-0.14.3-RC.8. The deployed pool and shadow account anonymizer rebuild from it.
const SNP =
  'https://github.com/starkware-libs/starknet-privacy/blob/fcc7c90f544ceb08621c32616bde29f1fdcbeb54/'
// SDK release PRIVACY-0.14.3-RC.8.
const SDK =
  'https://github.com/starkware-libs/starknet-privacy/blob/fcc7c90f544ceb08621c32616bde29f1fdcbeb54/sdk/src/'
// Bramble v0.10.7, whose store build matches a rebuild of this commit.
const BRAMBLE =
  'https://github.com/starknet-innovation/bramble/blob/d90222a2653c997a5cf8d8c6433df5ea10c16112/'
const WALLET_API =
  'https://github.com/starknet-io/types-js/blob/0b483f51f4bc33c7253b209a25136d9d6ec1bc41/src/wallet-api/methods.ts'
const POOL =
  'https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a'

export const strk20Adversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides amounts, senders and the link between deposit and withdrawal inside the pool. The first payment to each new contact is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      exposureShort:
        "Transfers inside the pool are encrypted, but the first payment to each new contact writes the recipient's address in cleartext.",
      exposureContinued: `${S.entryExitPublic()} The fee payment names the token the user pays it in. DeFi actions name their target contract, and a shadow account shows its funding, calls and positions. A new account must be funded publicly before it can receive privately.`,
      advice:
        'Submit every pool action through a paymaster. Treat the first payment to a new contact, and any DeFi action, as public.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'exposed',
          note: 'Opening a channel writes the recipient address in cleartext; later transfers do not.',
        },
        amount: 'private',
        asset: {
          verdict: 'atRisk',
          note: 'Bramble pays the relay fee in the token sent when it can price it, so the fee names that token. DeFi actions name the target contract.',
        },
        linkage: 'private',
      },
      sources: [
        { title: 'PrivacyPool contract on Voyager', url: POOL },
        {
          title: 'Channel opening carries the recipient address',
          url: SNP + 'packages/privacy/src/actions.cairo#L329-L334',
        },
        {
          title:
            'Deposit and withdrawal events carry address, token and amount',
          url: SNP + 'packages/privacy/src/events.cairo#L17-L40',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposureShort:
        'The set of active users is small and split further by token and by fee token.',
      exposureContinued: `A channel opened in the same transaction as a deposit ties the two together, and most withdrawal addresses have also deposited. ${S.walletFingerprint('paymaster')}`,
      advice: `Open channels in a transaction without a deposit, and withdraw uneven amounts that match no deposit. ${S.freshExit}`,
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'A channel opened in the same transaction as a deposit names the depositor.',
        },
        recipient: 'exposed',
        amount: 'private',
        asset: 'atRisk',
        linkage: {
          verdict: 'atRisk',
          note: 'Most withdrawal addresses have also deposited, which pairs the two ends.',
        },
      },
      sources: [
        { title: 'PrivacyPool contract on Voyager', url: POOL },
        {
          title:
            'Deposit and withdrawal events carry address, token and amount',
          url: SNP + 'packages/privacy/src/events.cairo#L17-L40',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposureShort:
        "Every pool request goes through Starknet Holdings' gateway, so AVNU and StarkWare's discovery service see only the gateway.",
      exposureContinued:
        'The gateway answers over Tor, and Bramble runs only in Chromium, not in Tor Browser.',
      advice: 'Run Bramble with all traffic through Tor or NymVPN.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'exposed',
          note: 'Opening a channel writes the recipient address in cleartext; later transfers do not.',
        },
        amount: 'private',
        asset: {
          verdict: 'atRisk',
          note: 'Each private balance check sends CoinGecko every privately held token except STRK.',
        },
        linkage: {
          verdict: 'atRisk',
          note: "Private only over Tor or NymVPN and for common tokens, since CoinGecko's requests single out holders of rare ones.",
        },
      },
      sources: [
        {
          title: "Default routes go through the operator's gateway",
          url: BRAMBLE + 'packages/features/privacy/src/config.ts#L17-L19',
        },
        {
          title: 'Token prices come from CoinGecko',
          url:
            BRAMBLE +
            'packages/features/portfolio/src/tokens/prices-feed.ts#L22',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        "Every user's viewing key is escrowed onchain, encrypted to one auditor key that a role holder can replace at any time with no delay.",
      exposureContinued:
        "Starknet Holdings' gateway gets the account and viewing key at every unlock, and each proof carries the viewing key. Apps that drive a shadow account or a swap through the pool get the user's main address from the wallet connection. The holder of the screener key can block any screened depositor.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Viewing key escrowed to the auditor key onchain',
          url: SNP + 'packages/privacy/src/events.cairo#L5-L13',
        },
        {
          title: "Default routes go through the operator's gateway",
          url: BRAMBLE + 'packages/features/privacy/src/config.ts#L96-L104',
        },
        {
          title: 'Proving request carries the viewing key',
          url: SDK + 'internal/proof-invocation-factory.ts#L132-L136',
        },
        {
          title: 'Deposits require a screening attestation',
          url: SNP + 'packages/privacy/src/interface.cairo#L530-L545',
        },
        {
          title: 'The wallet API hands the connected account to the app',
          url: WALLET_API + '#L42-L51',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'The proofs rest only on hashes, the encryption on elliptic curves.',
      exposureContinued: `Channel keys, note contents and the auditor escrow all use this encryption. Whoever breaks elliptic-curve cryptography recovers the auditor key from its onchain public key, and with it every escrowed viewing key and the whole history. ${S.walletSignatureAccounts()}`,
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Stark-curve ECDH encryption of channel and note data',
          url: SDK + 'utils/encryptions.ts',
        },
        {
          title: 'Viewing key escrowed under the onchain auditor public key',
          url: SNP + 'packages/privacy/src/events.cairo#L5-L13',
        },
        { title: 'Auditor public key in pool storage', url: POOL },
      ],
    },
  },
})
