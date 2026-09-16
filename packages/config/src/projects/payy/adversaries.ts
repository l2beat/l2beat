import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const PAYY =
  'https://github.com/polybase/payy/blob/2f95947f12981a838f6f0c9dddace825bf835502/'
const HONK_README =
  'https://github.com/AztecProtocol/aztec-packages/blob/58bf73a289f7da78c8920c9c73604a8e5d105025/barretenberg/cpp/src/barretenberg/ultra_honk/README.md'

export const payyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'amount',
    text: 'Hides the amount and owner of each note. Which notes fund which, and every deposit and withdrawal, is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'warning',
      exposure:
        'Only the amount and owner of a note are hidden. Every transaction names the notes it spends and creates, all blocks and proofs are served openly, and each deposit or withdrawal shows address and amount and points at one node of that graph. The per-transaction proofs use a flavor whose authors document that it is not zero-knowledge; how much of a note it leaks is not established.',
      advice:
        'Withdraw to an address that cannot be tied to you, and never an amount that matches a deposit.',
      interior: {
        sender: {
          verdict: 'private',
          note: 'The owner key is hidden; the spent note is a public graph node.',
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
        { contract: 'RollupV1' },
        {
          title:
            'UTXO circuit: spent and created commitments are public, no nullifier',
          url: PAYY + 'noir/utxo/src/main.nr#L9-L15',
        },
        {
          title: 'Burn hash is the first consumed commitment',
          url: PAYY + 'noir/utxo/src/main.nr#L66-L71',
        },
        {
          title: 'Client proofs use the non-ZK Honk flavor',
          url: PAYY + 'pkg/barretenberg-rs/src/binding.rs#L109-L118',
        },
        {
          title: 'Honk docs: the base flavor leaks witness information',
          url: HONK_README + '#zero-knowledge',
        },
        {
          title: 'Public transactions endpoint serves every proof',
          url: PAYY + 'pkg/node/src/rpc/routes/configure.rs#L19-L25',
        },
        {
          title: 'Docs describe nullifiers the deployed circuit does not have',
          url: 'https://docs.payy.network/protocol/privacy-layer/nullifiers',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      exposure:
        'Along a path without splits or merges the public deposit and withdrawal amounts fix every amount in between, and the graph shows who paid whom end to end. Each wallet has one fixed deposit address, so all its deposits link to each other and to whoever funded them.',
      advice:
        'Keep funds in the network across many transfers; only a split or merge stops amounts from being inferred. Fund the deposit address from a wallet that is not yours to keep.',
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
      exposure:
        "Proofs are built on your device and the app talks only to the operator's servers. The payment-link website is different: it loads a third-party analytics script that records the page URL, which holds the redeem secret of the link, and reports a device fingerprint to the backend.",
      advice: 'Redeem payment links in the app, not in a browser.',
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: {
          verdict: 'atRisk',
          note: 'A link opened in a browser hands its redeem secret to the analytics provider.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Analytics with default settings on the link website',
          url: PAYY + 'app/packages/link/src/config/posthog.ts#L10-L18',
        },
        {
          title: 'Send links carry the secret in the URL fragment',
          url: PAYY + 'pkg/parse-link/src/lib.rs#L50-L56',
        },
        {
          title: 'Device fingerprint and analytics id posted to the backend',
          url: PAYY + 'app/packages/link/src/hooks/useStoreRedirect.ts#L30-L58',
        },
        {
          title: 'Node logs every submitted proof',
          url: PAYY + 'pkg/node/src/rpc/routes/txn.rs#L30-L34',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      exposure:
        "One company runs the only validator and prover, the node, the note registry, the deposit relayer and the KYC checks. Its backend ties each session to a wallet address and keeps, per wallet, the deposit address, KYC record, country, IP country and the commitment and owner of every note the app reports; its diagnostics table has a field for the recovery phrase. For payment links and fiat ramps it holds the notes' private keys and can read and spend them. It can drop your withdrawals, and its owner can rewrite the state root with no delay.",
      advice:
        'Use only ordinary transfers for anything you want to keep private. Links, ramps and the card hand the operator the note keys.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Hidden for ordinary transfers; the backend holds the keys of link and ramp notes.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          contract: 'RollupV1',
          title: 'setRoot, provers, validators, burn substitutors',
        },
        { section: 'permissions' },
        {
          title: 'Session bound to a wallet address by signature',
          url: PAYY + 'pkg/guild-interface/src/auth.rs#L1-L16',
        },
        {
          title:
            'Registry entries are keyed by recipient key and posted authenticated',
          url: PAYY + 'pkg/guild-client-http/src/registry.rs#L45-L56',
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
        {
          title: 'Wallet notes table: commitment and owner per note',
          url: PAYY + 'pkg/database/src/schema.rs#L452-L462',
        },
        {
          title: 'Diagnostics table with a recovery phrase field',
          url: PAYY + 'pkg/database/src/schema.rs#L36-L48',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      exposure:
        'Every per-transaction proof is public forever and not zero-knowledge, so whatever it leaks stays available to future compute, and a discrete-log break opens the commitments inside it. Registry ciphertexts use elliptic-curve key exchange; if the operator retains them, a quantum computer opens every note delivered through it.',
      advice:
        'Receive notes in person rather than through the registry where the app allows it.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'If the registry is retained; its ciphertexts are not on Ethereum.',
        },
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Proofs are public and not zero-knowledge; registry ciphertexts open if retained.',
        },
        asset: 'exposed',
        linkage: 'exposed',
      },
      sources: [
        {
          title: 'Registry encryption (X25519-XSalsa20-Poly1305)',
          url: PAYY + 'pkg/encrypt/src/asymmetric.rs#L80-L81',
        },
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
