import {
  EIP_8142_URL,
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
          'Each L1 feature the devnet stands in for replaces its mock as it lands upstream. The EIP-8357 registry is already in its genesis; real proofs, EIP-8288, and Block-in-Blobs come next.',
      },
    ],
  },
  {
    year: 'Next',
    items: [
      {
        status: 'planned',
        title: 'LeanSTARK dependencies in EIP-8288',
        description:
          'EIP-8288 defines its block digest only for signature dependencies, and leanVM aggregates proofs of one fixed program. Native rollups need to declare proofs of any program as LeanSTARK dependencies, more than one per mempool wrapper.',
        url: EIP_8288_URL,
      },
      {
        status: 'planned',
        title: 'EIP-8357 in clients and a fork',
        description:
          'Finish the registry’s review, tests, and system contract, and propose it together with EIP-8288, so the fork that brings proof dependencies also brings the EVM program’s keys.',
        url: EIP_8357_URL,
      },
      {
        status: 'planned',
        title: 'The block proof covers EIP-8288',
        description:
          'Specify how Ethereum’s mandatory block proof binds and absorbs the EIP-8288 aggregate, so validators verify a single proof without downloading full payloads.',
      },
      {
        status: 'planned',
        title: 'Block data without Block-in-Blobs in Hegotá',
        description:
          'The specification binds L2 data to blobs through EIP-8142, which was declined for Hegotá. Native rollups need a path: EIP-8142 in a later fork, or another way to bind the data.',
        url: EIP_8142_URL,
      },
      {
        status: 'planned',
        title: 'Real proofs on the devnet',
        description:
          'Replace the signed mock proofs with zkVM proofs of the same program, once the execution and consensus specifications agree on what the proof commits to.',
      },
      {
        status: 'planned',
        title: 'Native rollups with extensions',
        description:
          'Research an extensible native program, which Arbitrum and Optimism have shown interest in: a rollup that follows Ethereum’s EVM through the EIP-8357 registry and maintains only its own precompiles, opcodes, or transaction types.',
      },
    ],
  },
]
