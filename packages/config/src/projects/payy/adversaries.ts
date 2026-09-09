import { definePrivacyAdversaries } from '../../common/privacyAdversaries'

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
      sentiment: 'good',
      condition: 'only notes in flight are private',
      exposure:
        'Who paid whom is public: every transaction shows which notes it spent and created, the operator serves all blocks openly, and deposits and withdrawals show address and amount. What stays private is the amount and owner of a note while it is in flight.',
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
      sentiment: 'warning',
      condition: 'amounts bounded along linear paths',
      exposure:
        'Deposit and withdrawal amounts are public and every transaction shows which notes it spent and created. Along a path without merges an analyst bounds or recovers the amounts and follows who paid whom end to end; the app creates a single-use deposit address per user, so the funding wallet behind it is one hop away.',
      advice:
        'Keep funds in the network across many transfers; a note that is split or merged along the way is what stops the amounts from being inferred.',
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'The single-use deposit address is funded from a wallet or exchange one hop upstream; card top-ups identify a cardholder.',
        },
      },
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Owner keys stay hidden, but nodes are labelled by their terminal deposit and withdrawal addresses.',
        },
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Inferable along a linear path from a public deposit to a public withdrawal.',
        },
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
      sentiment: 'good',
      condition: "only Payy's own servers see your traffic",
      exposure:
        "The app talks only to Payy's own servers, which are the operator and are covered under privileged insider. On the wire, an ISP sees encrypted traffic to Payy and nothing more.",
      boundary: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: 'exposed',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'An ISP sees that you use Payy.',
        },
      },
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
        identity: {
          verdict: 'atRisk',
          note: 'An ISP sees that you use Payy.',
        },
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
      sentiment: 'warning',
      condition: 'operator sees all but ordinary amounts',
      exposure:
        'One company runs the only node, the note registry, the deposit relayers and the KYC checks. Its node logs your proofs with your IP, its registry delivers your notes and records who paid whom, and it holds the spending keys of notes created for payment links and fiat ramps. Amounts of ordinary transfers stay encrypted to the recipient. It can freeze withdrawals.',
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
      sentiment: 'warning',
      condition: 'registry decrypts if retained',
      exposure:
        "The payment graph is public forever. Amounts stay private unless the operator's note registry is retained: a quantum computer opens every note delivered through it, revealing amounts and owners.",
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
