import {
  definePrivacyAdversaries,
  PRIVACY_ADVERSARY_SNIPPETS as S,
} from '../../common/privacyAdversaries'

const SNP =
  'https://github.com/starkware-libs/starknet-privacy/blob/cc0dc408dee41f5658cd528ae59ab0794be2e298/'
const STWO =
  'https://github.com/starkware-libs/stwo-cairo/blob/2b1fb4ded5496fb2db4e8261cd5ee5ef6b710839/README.md#security-model'
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
      exposure: `Transfers inside are encrypted, but the public part of every transaction lists the recipient address when you open a channel to a new contact, the token and amount of the fee you pay, and the target and calldata of any DeFi action. ${S.entryExitPublic()} Submitting from your own wallet names you; a paymaster hides the submitter but shows the fee token and amount.`,
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
          title: 'DeFi actions carry target contract and calldata',
          url: SNP + 'packages/privacy/src/actions.cairo#L360-L365',
        },
        {
          title:
            'Deposit and withdrawal events carry address, token and amount',
          url: SNP + 'packages/privacy/src/events.cairo#L17-L41',
        },
        {
          title: 'Paymaster fee fixes the visible fee token',
          url: SNP + 'sdk/src/interfaces.ts#L160-L172',
        },
        {
          title: 'Protocol fee is pulled in STRK from the submitter',
          url: SNP + 'packages/privacy/src/privacy.cairo#L845-L856',
        },
        {
          title: 'Without a paymaster the client submits from the user wallet',
          url: SNP + 'demo/src/hooks/useTransactionBuilder.ts#L247-L256',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure: `The set of registered users is small and split further by token and by fee token. A channel opened in the same transaction as a deposit ties the two together, and most withdrawal addresses have also deposited. ${S.walletFingerprint('paymaster')}`,
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
          url: SNP + 'packages/privacy/src/events.cairo#L17-L41',
        },
        {
          title: 'Fee is charged per action in a visible token',
          url: SNP + 'packages/privacy/src/privacy.cairo#L845-L856',
        },
      ],
    },
    networkObserver: {
      sentiment: 'warning',
      exposure:
        'The paymaster and the sequencer receive the client proof with every action. Stwo proofs are not zero-knowledge by default, and how much of the private execution they reveal is not established. Traffic to the proving and note-discovery services is encrypted, and both support an oblivious relay that hides your address, but it is off unless the client turns it on.',
      advice:
        'Turn on the oblivious relay for the proving and discovery services, or run both yourself.',
      interior: {
        sender: 'unverifiable',
        recipient: 'unverifiable',
        amount: 'unverifiable',
        asset: 'atRisk',
        linkage: 'unverifiable',
      },
      sources: [
        {
          title: 'Oblivious relay support is opt-in',
          url: SNP + 'sdk/src/internal/ohttp-client.ts#L24-L32',
        },
        {
          title: 'Discovery service: per-request keys and oblivious relay',
          url: SNP + 'crates/discovery-service/README.md#L14-L32',
        },
        {
          title: 'Proof and proof facts travel in the submitted transaction',
          url: SNP + 'demo/src/hooks/useTransactions.ts#L140-L160',
        },
        { title: 'Stwo Cairo is not zero-knowledge by default', url: STWO },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "Every user's viewing key is escrowed onchain, encrypted to one auditor key that a role holder can replace at any time with no delay; that key decrypts everything the protocol hides. The default proving service receives your address, viewing key and actions in the clear, the note-discovery service receives the viewing key on every sync, and deposits need a fresh attestation from a screening provider that sees and can block every depositor.",
      advice:
        'Run the prover and note discovery yourself, or read the pool directly from chain. Nothing you do removes the auditor key.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        { title: 'Auditor and screener keys in pool storage', url: POOL },
        {
          title: 'Viewing key escrowed to the auditor key onchain',
          url: SNP + 'packages/privacy/src/events.cairo#L5-L13',
        },
        {
          title: 'Auditor and screener keys are settable roles',
          url: SNP + 'packages/privacy/src/events.cairo#L43-L52',
        },
        {
          title: 'Withdrawals carry the auditor-decryptable withdrawer address',
          url: SNP + 'packages/privacy/src/events.cairo#L17-L29',
        },
        {
          title: 'Proving request carries the user address and viewing key',
          url: SNP + 'sdk/src/internal/proof-invocation-factory.ts#L128-L136',
        },
        {
          title: 'Discovery request carries the viewing key',
          url: SNP + 'sdk/src/internal/indexer-discovery.ts#L158-L165',
        },
        {
          title: 'Deposits require a signed screening attestation',
          url: SNP + 'packages/privacy/src/privacy.cairo#L784-L800',
        },
        {
          title:
            'Screening sidecar forwards the depositor to an external provider',
          url: SNP + 'proof-interceptor/README.md#L37',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'The proofs are post-quantum, the encryption is not. Channel keys, note contents and the auditor escrow use elliptic-curve key exchange, and the auditor public key sits onchain. A quantum computer recovers that one key and with it every escrowed viewing key, and so the whole history.',
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
          url: SNP + 'sdk/src/utils/encryptions.ts#L120-L136',
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
