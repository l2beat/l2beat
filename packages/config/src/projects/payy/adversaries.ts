import type { ProjectPrivacyAdversaries } from '../../types'

const REPO = 'https://github.com/polybase/payy/blob/main'
const ROLLUP =
  'https://etherscan.io/address/0x367C1eAF14AA06b78ce76bd0243297de79d85270'

// Verdicts backed by the verified RollupV1 / HonkVerifier sources,
// discovered.json, the public payy repository (Noir circuits, node, guild and
// registry crates) and the operator's public block API. Measurements as of
// 2026-09-08, block 25,933,805.
export const payyAdversaries: ProjectPrivacyAdversaries = {
  protects: 'amount',
  cells: {
    publicObserver: {
      sentiment: 'bad',
      condition: 'no nullifiers, spend graph public',
      description:
        'Payy has no nullifiers: every L2 transaction publishes exactly which one or two notes it consumed and which one or two it created, and the operator serves all blocks without authentication. Deposits pin a graph node to the depositing EOA and its amount, withdrawals pin one to the recipient and its amount, which is in the settlement calldata even though the Burned event omits it. What stays hidden is the content of a note in flight: its amount and owner key. With mostly linear one-in two-out chains, many withdrawals trace to a single deposit by following the graph.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: {
          verdict: 'leaked',
          note: 'The L2 graph connects deposit and withdrawal nodes; a merge on the path widens the candidate set, a linear path does not.',
        },
        identity: 'hidden',
      },
      interior: {
        sender: {
          verdict: 'hidden',
          note: 'The owner key is hidden, but the consumed note is a public graph node.',
        },
        recipient: {
          verdict: 'hidden',
          note: 'Recipient output and change output are indistinguishable.',
        },
        amount: 'hidden',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'hidden',
      },
      sources: [
        { title: 'RollupV1 verifyRollup / verifyBurn', url: `${ROLLUP}#code` },
        {
          title: 'UTXO circuit (no nullifier)',
          url: `${REPO}/noir/utxo/src/main.nr`,
        },
      ],
    },
    chainAnalyst: {
      sentiment: 'bad',
      condition: 'linear paths, single-use deposit addresses',
      description:
        'Nothing has to be guessed: the spend graph is a protocol output. In a two-day sample more than half of the withdrawals that reached a deposit inside the window did so along a path with no merge, giving a unique deposit address for the withdrawal address. Deposit addresses are single-purpose accounts the app creates, so the funding transaction one hop upstream identifies the user, and one in nine withdrawals goes to the KYC-gated card collateral contract. Interior amounts stay hidden, but the analyst can label every node by its terminal deposit and withdrawal address.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
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
        amount: 'hidden',
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Public block API',
          url: 'https://validators.mainnet.payy.network/v0/blocks',
        },
        {
          title: 'Aggregation removes spent leaves',
          url: `${REPO}/noir/agg_utxo/src/main.nr`,
        },
      ],
    },
    networkObserver: {
      sentiment: 'bad',
      condition: 'operator-only endpoints, closed app',
      description:
        'The only client is a closed-source app that routes everything through Payy servers under a token bound to the wallet address: proofs are posted to the single node, which logs them verbatim with the IP; Merkle paths are requested for the exact notes a wallet owns before it spends; notes are delivered through an operator registry that records sender wallet, recipient key and block; deposits are relayed by operator EOAs. No self-hosted or peer-to-peer path exists in the published code. Note contents are encrypted to the recipient, so the servers see the annotated graph and identities, not amounts.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'leaked',
          note: 'Every request carries a wallet-bound token, the IP and, for deposits, the deposit address.',
        },
      },
      interior: {
        sender: {
          verdict: 'leaked',
          note: 'The registry records which wallet sent to which recipient key in which block.',
        },
        recipient: 'leaked',
        amount: {
          verdict: 'hidden',
          note: 'Encrypted to the recipient; the operator sees ciphertext only.',
        },
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'leaked',
      },
      sources: [
        {
          title: 'Node logs submitted proofs',
          url: `${REPO}/pkg/node/src/rpc/routes/txn.rs`,
        },
        {
          title: 'Registry interface',
          url: `${REPO}/pkg/guild-interface/src/registry.rs`,
        },
        {
          title: 'Wallet-bound auth',
          url: `${REPO}/pkg/guild-client-http/src/auth.rs`,
        },
      ],
    },
    privilegedInsider: {
      sentiment: 'bad',
      condition: 'one operator runs node, registry and KYC',
      description:
        'One organisation runs the only validator, the only prover, the note registry, the deposit relayers and the KYC backend for the card and fiat ramps. It therefore holds the fully labelled graph: which commitments belong to which wallet, who sent to whom, which deposit address belongs to whom, and real identities where KYC applies. For payment links and ramp flows the backend stores note spending keys, which is custody. The validator can refuse any transaction and the prover can stop settlement, freezing withdrawals. A 2-of-4 multisig can upgrade the rollup, swap verifiers and overwrite the state root with no delay. No cryptographic view key exists; the power is structural.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
        identity: {
          verdict: 'leaked',
          note: 'KYC records, IP data and deposit addresses live in the same operator database.',
        },
      },
      interior: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: {
          verdict: 'atRisk',
          note: 'Hidden for ordinary transfers; the backend holds spending keys, and thus contents, for link and ramp notes.',
        },
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'leaked',
      },
      sources: [
        {
          title: 'Owner functions (setRoot, verifiers, provers)',
          url: `${ROLLUP}#code`,
        },
        {
          title: 'Database schema (wallet_notes, notes.private_key)',
          url: `${REPO}/pkg/database/src/schema.rs`,
        },
      ],
    },
    futureAdversary: {
      sentiment: 'bad',
      condition: 'graph public forever, X25519 registry',
      description:
        'The graph is already public and will remain so; nothing on Ethereum needs decrypting, since commitments are Poseidon hashes and amounts and addresses are cleartext. Two things a quantum adversary adds: every note ever delivered through the operator registry is encrypted with X25519 to a recipient key stored in clear next to it, so a retained registry decrypts completely, including amounts, owner addresses and note spending keys. And the UltraHonk proofs are zero-knowledge only under the discrete-log assumption, so their formal guarantee lapses; whether witnesses can actually be extracted is unverified.',
      boundary: {
        sender: 'leaked',
        recipient: 'leaked',
        amount: 'leaked',
        asset: 'leaked',
        linkage: 'leaked',
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
        asset: 'leaked',
        linkage: 'leaked',
        identity: 'atRisk',
      },
      sources: [
        {
          title: 'Registry encryption (X25519 + XSalsa20)',
          url: `${REPO}/pkg/encrypt/src/asymmetric.rs`,
        },
        {
          title: 'HonkVerifier (ZK flavour)',
          url: 'https://etherscan.io/address/0x14DACD534ddc676601B27f41Eb541a7951524a2F#code',
        },
      ],
    },
  },
}
