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
        'Every transaction shows which notes it spent and created, all blocks are served openly, and deposits and withdrawals show address and amount. Only the amount and owner of a note in flight are hidden.',
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
        'Along a path without merges the public deposit and withdrawal amounts bound or fix every amount in between, and the graph shows who paid whom end to end. The app creates a single-use deposit address per user, so the funding wallet is one hop away.',
      advice:
        'Keep funds in the network across many transfers; only a split or merge along the way stops the amounts from being inferred.',
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'Nodes are labelled by their terminal deposit and withdrawal addresses.',
        },
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'Inferable along a linear path from a public deposit to a public withdrawal.',
        },
        asset: 'exposed',
        linkage: 'exposed',
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
      condition: 'only encrypted traffic to Payy',
      exposure:
        "The app talks only to Payy's servers; on the wire there is nothing but encrypted traffic to Payy.",
      interior: {
        sender: 'private',
        recipient: 'private',
        amount: 'private',
        asset: 'exposed',
        linkage: 'exposed',
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
        'One company runs the only node, the note registry, the deposit relayers and the KYC checks, so card top-ups and ramps tie accounts to real names. Its node logs your proofs with your IP, its registry delivers your notes and records who paid whom, and it holds the spending keys of notes created for payment links and fiat ramps. Amounts of ordinary transfers stay encrypted to the recipient. It can freeze withdrawals.',
      interior: {
        sender: 'exposed',
        recipient: 'exposed',
        amount: {
          verdict: 'atRisk',
          note: 'Hidden for ordinary transfers; the backend holds spending keys, and thus contents, for link and ramp notes.',
        },
        asset: 'exposed',
        linkage: 'exposed',
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
        "Amounts stay private unless the operator's note registry is retained: a quantum computer then opens every note delivered through it.",
      interior: {
        sender: {
          verdict: 'atRisk',
          note: 'If the registry is retained; the ciphertexts are not on Ethereum.',
        },
        recipient: 'atRisk',
        amount: {
          verdict: 'atRisk',
          note: 'If the registry is retained, or if witness extraction from UltraHonk proofs under a discrete-log break proves feasible.',
        },
        asset: 'exposed',
        linkage: 'exposed',
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
