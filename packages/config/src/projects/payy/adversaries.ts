import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

const REPO = 'https://github.com/polybase/payy/blob/main'
const ROLLUP =
  'https://etherscan.io/address/0x367C1eAF14AA06b78ce76bd0243297de79d85270'

// Verdicts backed by the verified RollupV1 / HonkVerifier sources,
// discovered.json, the public payy repository (Noir circuits, node, guild and
// registry crates) and the operator's public block API. Measurements as of
// 2026-09-08, block 25,933,805.
export const payyAdversaries = definePrivacyAdversaries({
  promise: {
    protects: 'amount',
    text: 'Hides the amount and owner of notes in flight. Who paid whom, and every deposit and withdrawal, is public.',
  },
  cells: {
    publicObserver: {
      sentiment: 'bad',
      condition: 'no nullifiers, spend graph public',
      exposure:
        'Every transaction shows which notes it spent and created, and the operator serves all blocks openly, so who paid whom is public and most withdrawals trace back to a deposit. Only the amount and owner of a note in flight are hidden.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: {
          verdict: 'exposed',
          note: 'The L2 graph connects deposit and withdrawal nodes; a merge on the path widens the candidate set, a linear path does not.',
        },
        identity: 'private',
      },
      interior: {
        sender: {
          verdict: 'private',
          note: 'The owner key is hidden, but the consumed note is a public graph node.',
        },
        recipient: {
          verdict: 'private',
          note: 'Recipient output and change output are indistinguishable.',
        },
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'private',
      },
      sources: [
        { contract: 'RollupV1' },
        {
          title: 'UTXO circuit (no nullifier)',
          url: 'https://github.com/polybase/payy/blob/main/noir/utxo/src/main.nr',
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      condition: 'linear paths, single-use deposit addresses',
      exposure:
        'Deposit addresses are single-use accounts one hop from your funding wallet, and most payment chains have no merges, so an analyst follows them end to end.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'Single-use deposit addresses are funded from a wallet or exchange one hop upstream; card top-ups identify a cardholder.',
        },
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Owner keys stay hidden, but nodes are labelled by their terminal deposit and withdrawal addresses.',
        },
        recipient: 'atRisk',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Public block API',
          url: 'https://validators.mainnet.payy.network/v0/blocks',
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      condition: 'operator-only endpoints, closed app',
      exposure:
        "The only app is closed source and talks solely to Payy's servers, which log your proofs with your IP, deliver your notes and know which notes are yours.",
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'exposed',
          note: 'Every request carries a wallet-bound token, the IP and, for deposits, the deposit address.',
        },
      },
      interior: {
        sender: {
          verdict: 'exposed',
          note: 'The registry records which wallet sent to which recipient key in which block.',
        },
        recipient: 'exposed',
        amount: {
          verdict: 'private',
          note: 'Encrypted to the recipient; the operator sees ciphertext only.',
        },
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'exposed',
      },
      sources: [
        {
          title: 'Node logs submitted proofs',
          url: 'https://github.com/polybase/payy/blob/main/pkg/node/src/rpc/routes/txn.rs',
        },
        {
          title: 'Registry interface',
          url: 'https://github.com/polybase/payy/blob/main/pkg/guild-interface/src/registry.rs',
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'one operator runs node, registry and KYC',
      exposure:
        'One company runs the only node, the note registry, the deposit relayers and the KYC checks, and stores spending keys for payment links. It sees the full picture and can freeze withdrawals.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'exposed',
          note: 'KYC records, IP data and deposit addresses live in the same operator database.',
        },
      },
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Hidden for ordinary transfers; the backend holds spending keys, and thus contents, for link and ramp notes.',
        },
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'exposed',
      },
      sources: [
        { contract: 'RollupV1' },
        { section: 'permissions', title: 'Payy multisig and roles' },
        {
          title: 'Database schema',
          url: 'https://github.com/polybase/payy/blob/main/pkg/database/src/schema.rs',
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      condition: 'graph public forever, X25519 registry',
      exposure:
        'The payment graph is already public forever. A quantum computer additionally opens every note ever delivered through the registry, revealing amounts and owners.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'atRisk',
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Leaked if the registry is retained; the ciphertexts are not on Ethereum.',
        },
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Leaked if the registry is retained, or if witness extraction from UltraHonk proofs under a discrete-log break proves feasible.',
        },
        asset: 'exposed',
        linkage: 'exposed',
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Registry encryption (X25519)',
          url: 'https://github.com/polybase/payy/blob/main/pkg/encrypt/src/asymmetric.rs',
        },
        { contract: 'HonkVerifier' },
      ],
    },
  },
})
