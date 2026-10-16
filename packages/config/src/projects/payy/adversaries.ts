import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const PAYY =
  'https://github.com/polybase/payy/blob/2f95947f12981a838f6f0c9dddace825bf835502/'
const HONK_README =
  'https://github.com/AztecProtocol/aztec-packages/blob/58bf73a289f7da78c8920c9c73604a8e5d105025/barretenberg/cpp/src/barretenberg/ultra_honk/README.md'

export const payyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'linkage',
    text: 'Hides note amounts and owners. Which notes fund which, and every deposit and withdrawal, are public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'bad',
      exposureShort:
        'Every transaction names the notes it spends and creates, so which notes fund which is public.',
      exposureContinued:
        'Empty padding notes have a zero commitment, so single-input and single-output transactions are recognizable. Each deposit or withdrawal shows address and amount and points at one node of that graph. The per-transaction proofs use a flavor its authors document as not zero-knowledge, and how much of a note it leaks is not established.',
      interior: {
        sender: {
          verdict: 'private',
          note: 'The owner key is hidden, but the spent note is a public graph node.',
        },
        recipient: {
          verdict: 'private',
          note: 'Recipient and change outputs are indistinguishable.',
        },
        amount: {
          verdict: 'atRisk',
          note: 'Protected by a proof flavor documented to leak witness data.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Spend graph explorer built from Payy blocks (by L2BEAT)',
          url: 'https://sekuba.github.io/payy-graph/',
        },
        {
          title:
            'UTXO circuit: spent and created commitments are public, no nullifier',
          url: PAYY + 'noir/utxo/src/main.nr#L9-L15',
        },
        {
          title: 'Client proofs use the non-ZK Honk flavor',
          url: PAYY + 'pkg/barretenberg-rs/src/binding.rs#L109-L118',
        },
        {
          title: 'Honk docs: the base flavor leaks witness information',
          url: HONK_README + '#zero-knowledge',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      exposureShort:
        'Along a path without splits or merges, the deposit and withdrawal amounts fix every amount in between.',
      exposureContinued:
        'Each wallet has one fixed deposit address, so all its deposits link to each other and to whoever funded them.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Nodes are labelled by their terminal deposit and withdrawal addresses.',
        },
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Inferable along a linear path from a deposit to a withdrawal.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Public block API',
          url: 'https://validators.mainnet.payy.network/v0/blocks',
        },
        {
          title: 'One deposit address stored per wallet',
          url: PAYY + 'pkg/database/src/schema.rs#L464-L481',
        },
        {
          title:
            'Deposit relayed from the deposit address with a signed USDC authorization',
          url: PAYY + 'pkg/guild-interface/src/mint.rs#L56-L90',
        },
        {
          title: 'Wallet FAQ: the deposit address forwards to the bridge',
          url: 'https://docs.payy.network/payy-wallet/payy-wallet-faq',
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      exposureShort:
        'The Payy app is closed source and no open client works on mainnet, so what it sends to third parties is up to Payy and can change at any time.',
      exposureContinued:
        "The payment-link website loads a third-party analytics script that records the page URL, which holds the link's redeem secret.",
      interior: {
        sender: 'unverifiable',
        recipient: 'unverifiable',
        amount: {
          verdict: 'atRisk',
          note: 'A link opened in a browser hands its redeem secret to the analytics provider.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'The repository publishes only type bindings of the app',
          url: PAYY + 'app/packages/payy/src',
        },
        {
          title: 'The open TypeScript client knows only dev and testnet',
          url: PAYY + 'app/packages/payy-client/src/network.ts#L6-L17',
        },
        {
          title: 'Analytics with default settings on the link website',
          url: PAYY + 'app/packages/link/src/config/posthog.ts#L10-L18',
        },
        {
          title: 'Send links carry the secret in the URL fragment',
          url: PAYY + 'pkg/parse-link/src/lib.rs#L50-L56',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposureShort:
        'One company runs the only validator and prover, the node, the note registry, the deposit relayer and the KYC checks.',
      exposureContinued:
        "Its backend ties each session to a wallet address and keeps, per wallet, the deposit address, KYC record, country, IP country and the commitment and owner of every note the app reports. For payment links and fiat ramps it holds the notes' private keys and can read and spend them. Its registry sees which wallet delivers a note to which recipient key, and in which block.",
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'The backend holds the keys of link and ramp notes.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          contract: 'RollupV1',
          title: 'setRoot, provers, validators, burn substitutors',
        },
        {
          title: 'Session bound to a wallet address by signature',
          url: PAYY + 'pkg/guild-interface/src/auth.rs#L1-L16',
        },
        {
          title:
            'Link and ramp notes are created with their private key on the backend',
          url: PAYY + 'pkg/guild-interface/src/notes/create.rs#L36-L45',
        },
        {
          title: 'Wallet table: deposit address, KYC, country, IP country',
          url: PAYY + 'pkg/database/src/schema.rs#L464-L481',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposureShort:
        'The per-transaction proofs are public and not zero-knowledge, and the commitments inside them rest on elliptic curves.',
      exposureContinued:
        'How much more whoever breaks elliptic-curve cryptography extracts from those proofs is not established.',
      interior: {
        sender: 'atRisk',
        recipient: 'atRisk',
        amount: 'atRisk',
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Client proofs use the non-ZK Honk flavor',
          url: PAYY + 'pkg/barretenberg-rs/src/binding.rs#L109-L118',
        },
        {
          title: 'Honk docs: ZK flavors add masking the base flavor lacks',
          url: HONK_README + '#zero-knowledge',
        },
        { contract: 'HonkVerifier', title: 'Onchain verifier (ZK flavor)' },
      ],
    },
  },
})
