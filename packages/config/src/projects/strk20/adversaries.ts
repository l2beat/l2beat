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
        'Submit every pool action through a paymaster and pay its fee in the most common token. Treat the first payment to a new contact, and any DeFi action, as public.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'exposed',
          note: 'Opening a channel writes the recipient address in cleartext; later transfers do not.',
        },
        amount: 'private',
        asset: {
          verdict: 'atRisk',
          note: 'The fee payment names the token; DeFi actions name the target contract.',
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
      advice: `Open channels in a transaction without a deposit, pay fees in the most common token, and withdraw uneven amounts that match no deposit. ${S.freshExit}`,
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
      sentiment: 'warning',
      exposureShort:
        'Ready and Xverse are closed source, so what they send to third parties is up to their makers and can change at any time.',
      exposureContinued:
        'Today both wallets send each action to their own servers for proving and note discovery. The paymaster receives the finished transaction before broadcast.',
      advice:
        "Use a client built on the open SDK with the user's own prover and note discovery, and turn on its oblivious relay.",
      interior: {
        sender: 'unverifiable',
        recipient: 'unverifiable',
        amount: 'unverifiable',
        asset: 'atRisk',
        linkage: 'unverifiable',
      },
      sources: [
        {
          title: 'Ready extension (proving and discovery on Ready servers)',
          url: 'https://chromewebstore.google.com/detail/dlcobpjiigpikoobohmabehhmhfoodbb',
        },
        {
          title: 'Xverse extension (proving and discovery on Xverse servers)',
          url: 'https://chromewebstore.google.com/detail/idnnbdplmphpflfnlkomgpfbpcgelopg',
        },
        {
          title: 'The SDK takes prover and discovery endpoints from the client',
          url: SDK + 'factory.ts#L45-L62',
        },
        {
          title: 'Oblivious relay is an option of the proving client',
          url: SDK + 'internal/proving-service-provider.ts#L73-L80',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        "Every user's viewing key is escrowed onchain, encrypted to one auditor key that a role holder can replace at any time with no delay.",
      exposureContinued:
        "The wallet's prover receives the user's viewing key with every action, and for most Ready accounts Ready's servers create that key. Apps that drive a shadow account or a swap through the pool get the user's main address from the wallet connection. The holder of the screener key can block any screened depositor.",
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
      exposureContinued:
        'Channel keys, note contents and the auditor escrow all use this encryption. Whoever breaks elliptic-curve cryptography recovers the auditor key from its onchain public key, and with it every escrowed viewing key and the whole history.',
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
