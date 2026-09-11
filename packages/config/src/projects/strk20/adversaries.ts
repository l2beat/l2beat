import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const SNP =
  'https://github.com/starkware-libs/starknet-privacy/blob/cc0dc408dee41f5658cd528ae59ab0794be2e298/'
const STWO =
  'https://github.com/starkware-libs/stwo-cairo/blob/2b1fb4ded5496fb2db4e8261cd5ee5ef6b710839/README.md#security-model'
const POOL =
  'https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a'

export const strk20Adversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides amounts and senders inside the pool, and the link between deposit and withdrawal. Deposits, withdrawals and first contacts are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      exposure:
        'Transfers inside are encrypted and the client proof is not published, but the public part of every transaction lists the recipient address whenever you open a channel to someone new, the token and amount of the fee you pay, and the target contract and calldata of any DeFi action. Deposits and withdrawals show address, token and amount. Transactions reach the chain through a shared relayer, so the address that submits them does not name you.',
      advice:
        'Pay fees in the most common token and treat the first payment to a new recipient, and any DeFi action, as public.',
      interior: {
        sender: 'private',
        recipient: {
          verdict: 'exposed',
          note: 'Opening a channel to a new counterparty writes the recipient address in cleartext, later transfers in the channel do not.',
        },
        amount: 'private',
        asset: {
          verdict: 'atRisk',
          note: 'The fee payment names the token you pay in, and DeFi actions name the target contract.',
        },
        linkage: 'private',
      },
      sources: [
        { title: 'PrivacyPool contract on Voyager', url: POOL },
        {
          title:
            'Channel opening carries the recipient address in the public action',
          url: SNP + 'packages/privacy/src/actions.cairo#L329-L334',
        },
        {
          title: 'DeFi actions carry the target contract and calldata',
          url: SNP + 'packages/privacy/src/actions.cairo#L360-L365',
        },
        {
          title:
            'Deposit and withdrawal events carry address, token and amount',
          url: SNP + 'packages/privacy/src/events.cairo#L17-L41',
        },
        {
          title:
            'Fee paid through the relayer, which fixes the visible fee token',
          url: SNP + 'sdk/src/interfaces.ts#L160-L172',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'warning',
      exposure:
        'The set of registered users is small and split further by token and by the token each user pays fees in. A channel opened in the same transaction as a deposit ties the two together.',
      advice:
        'Hold funds in the pool for a long time, withdraw uneven amounts that match no deposit, pay fees in the most common token, make your first payment to a new contact in a transaction without a deposit, and never withdraw to an address you have deposited from.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Channel opening in the same transaction as a deposit names the depositor as sender.',
        },
        recipient: 'exposed',
        amount: 'private',
        asset: 'atRisk',
        linkage: {
          verdict: 'atRisk',
          note: 'Most withdrawal addresses have also deposited, which pairs the two ends directly.',
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
          title:
            'Fee is charged per action, so every action is paid for in a visible token',
          url: SNP + 'packages/privacy/src/privacy.cairo#L845-L856',
        },
      ],
    },
    networkObserver: {
      sentiment: 'good',
      exposure:
        'Traffic to the proving and note-discovery services is encrypted. Both support an oblivious relay that hides your address from the service, but it is off unless the client turns it on. The relayer that submits for you, and the sequencer, see the transaction before anyone else, and the sequencer verifies the client proof.', // TODO: client proof not zero zero-knowledge?
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
          title: 'Stwo Cairo is not zero-knowledge by default',
          url: STWO,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "Every user's private viewing key is escrowed onchain, encrypted to a single auditor key that a role holder can replace at any time with no delay. That key decrypts everything that the protocol aims to keep private. The default proving service is handed your address, your viewing key and all your actions in the clear, and the note-discovery service receives the viewing key on every sync. Deposits are rejected without a fresh signed attestation from a screening provider, which therefore sees and can block every depositor.",
      advice:
        'Run the prover and note discovery yourself, or read the pool directly from chain, so only the admin view key remains. Nothing you do removes that global view key.',
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
        'The proofs are post-quantum, but the encryption is not. Channel keys, note contents and the auditor escrow all use elliptic-curve key exchange on the Stark curve, and the auditor public key sits onchain. A quantum computer recovers that one key and with it every escrowed viewing key, and so every transfer, amount and recipient ever made.',
      advice:
        'Assume everything you do in the pool today becomes readable once the curve is broken.',
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
