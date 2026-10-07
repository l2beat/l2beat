import {
  EIP_8288_URL,
  EIP_8357_URL,
  ETHREX_POC_URL,
  FOUNDING_POST_URL,
  L2_FOCIL_RESEARCH_URL,
  NATIVE_PROOF_VERIFICATION_URL,
  NATIVE_ROLLUPS_BOOK_URL,
  NATIVE_ROLLUPS_DEMO_URL,
  NATIVE_ROLLUPS_EIP_URL,
} from './links'

export interface RoadmapItem {
  status: 'done' | 'inProgress' | 'planned'
  /** Omitted for what comes next, which depends on L1. */
  date?: string
  title: string
  description: string
  url?: string
}

interface RoadmapGroup {
  year: number | 'Next'
  items: RoadmapItem[]
}

export const ROADMAP_YEARS: RoadmapGroup[] = [
  {
    year: 2025,
    items: [
      {
        status: 'done',
        date: 'January 2025',
        title: 'Founding research',
        description:
          "Justin Drake publishes “Native rollups - superpowers from L1 execution” on ethresear.ch, introducing the EXECUTE precompile that lets a rollup reuse Ethereum's own execution for verification.",
        url: FOUNDING_POST_URL,
      },
      {
        status: 'done',
        date: '2025',
        title: 'The Native Rollups Book',
        description:
          'L2BEAT publishes an open research book covering governance risk, bug risk, native execution, messaging, fees, and the evolving proof design.',
        url: NATIVE_ROLLUPS_BOOK_URL,
      },
      {
        status: 'done',
        date: 'November 2025',
        title: 'EIP-8079 (Draft)',
        description:
          'The original re-execution path is formalized around the EXECUTE precompile, together with fee accounting and an anchoring mechanism for L1→L2 messaging.',
        url: NATIVE_ROLLUPS_EIP_URL,
      },
    ],
  },
  {
    year: 2026,
    items: [
      {
        status: 'done',
        date: 'May 2026',
        title: 'Native proof verification',
        description:
          'Proof-carrying transactions: a program-agnostic design that replaces EXECUTE in the ZK path with a new transaction type and consensus-layer proof verification. It is now the main alternative to EIP-8288.',
        url: NATIVE_PROOF_VERIFICATION_URL,
      },
      {
        status: 'done',
        date: 'June 2026',
        title: 'FOCIL-based forced transactions',
        description:
          'An L1 inbox lets users bypass the sequencer by submitting signed L2 transactions that the rollup enforces through FOCIL-style inclusion lists.',
        url: L2_FOCIL_RESEARCH_URL,
      },
      {
        status: 'done',
        date: 'July 2026',
        title: 'EIP-8357: EVM verification key registry',
        description:
          'Proposed: an L1 contract that records the verification key of Ethereum’s EVM program at each fork, so native rollups follow L1 upgrades without their own governance.',
        url: EIP_8357_URL,
      },
      {
        status: 'done',
        date: 'August 2026',
        title: 'ethrex proof-of-concept',
        description:
          'The ethrex / LambdaClass team merges a proof of concept of EIP-8079 via L1 re-execution. It validates the contract and messaging model, but is a prototype rather than the target ZK architecture.',
        url: ETHREX_POC_URL,
      },
      {
        status: 'done',
        date: 'September 2026',
        title: 'EIP-8288 (zkzkframes)',
        description:
          'Proofs that EIP-8141 frame transactions declare as dependencies, aggregated recursively in the mempool and by the builder, are merged as a Draft EIP. The book adopts them as the proof path for native rollups.',
        url: EIP_8288_URL,
      },
      {
        status: 'done',
        date: 'September 2026',
        title: 'Specification rebased on Glamsterdam and Hegotá',
        description:
          "The specification follows Glamsterdam's block-level access lists and stateless validation program, and posts blocks with Hegotá's EIP-8141 frame transactions.",
        url: NATIVE_ROLLUPS_BOOK_URL,
      },
      {
        status: 'done',
        date: 'October 2026',
        title: 'Native rollup contract on a live devnet',
        description:
          'The specification’s rollup contract runs end to end on a local EIP-8141 devnet, with mock proofs signed by a trusted key, and a public explorer that rebuilds every L2 block from L1.',
        url: NATIVE_ROLLUPS_DEMO_URL,
      },
      {
        status: 'inProgress',
        date: 'Ongoing',
        title: 'Removing the devnet’s mocks',
        description:
          'Each L1 feature the devnet stands in for replaces its mock as it lands upstream. The EIP-8357 registry is already in its genesis; real proofs, EIP-8288, and Blocks-in-Blobs come next.',
      },
    ],
  },
  {
    year: 'Next',
    items: [
      {
        status: 'planned',
        title: 'Real proofs on the devnet',
        description:
          'Replace the signed mock proofs with zkVM proofs of the same program, once the execution and consensus specifications agree on what the proof commits to.',
      },
      {
        status: 'planned',
        title: 'The block proof covers EIP-8288',
        description:
          'Specify how Ethereum’s mandatory block proof binds and absorbs the EIP-8288 aggregate, so validators verify a single proof.',
      },
      {
        status: 'planned',
        title: 'Proof aggregation',
        description:
          'Make the recursive aggregation design concrete: proof propagation, pricing, and resource limits.',
      },
      {
        status: 'planned',
        title: 'ethrex on EIP-8288',
        description:
          'Move the ethrex proof of concept from the EXECUTE precompile to EIP-8288 and the EIP-8357 registry.',
      },
    ],
  },
]
