import {
  ETHREX_POC_URL,
  FOUNDING_POST_URL,
  L2_FOCIL_RESEARCH_URL,
  NATIVE_PROOF_VERIFICATION_URL,
  NATIVE_ROLLUPS_BOOK_URL,
  NATIVE_ROLLUPS_EIP_URL,
} from './links'

export interface RoadmapItem {
  status: 'done' | 'research' | 'inProgress' | 'planned'
  year: number
  date: string
  title: string
  description: string
  url?: string
}

/** Future dates are research targets, not Ethereum fork commitments. */
export const ROADMAP: RoadmapItem[] = [
  {
    status: 'done',
    year: 2025,
    date: 'January 2025',
    title: 'Founding research',
    description:
      "Justin Drake publishes “Native rollups — superpowers from L1 execution” on ethresear.ch, introducing the EXECUTE precompile that lets a rollup reuse Ethereum's own execution for verification.",
    url: FOUNDING_POST_URL,
  },
  {
    status: 'done',
    year: 2025,
    date: '2025',
    title: 'The Native Rollups Book',
    description:
      'L2BEAT publishes an open research book covering governance risk, bug risk, native execution, messaging, fees, and the evolving proof design.',
    url: NATIVE_ROLLUPS_BOOK_URL,
  },
  {
    status: 'done',
    year: 2025,
    date: 'November 2025',
    title: 'EIP-8079 (Draft)',
    description:
      'The original re-execution path is formalized around the EXECUTE precompile, together with fee accounting and an anchoring mechanism for L1→L2 messaging.',
    url: NATIVE_ROLLUPS_EIP_URL,
  },
  {
    status: 'done',
    year: 2026,
    date: 'March 2026',
    title: 'ethrex proof-of-concept',
    description:
      'The ethrex / LambdaClass team demonstrates EIP-8079 via L1 re-execution. It validates the contract and messaging model, but is a prototype rather than the target ZK architecture.',
    url: ETHREX_POC_URL,
  },
  {
    status: 'done',
    year: 2026,
    date: 'May 2026',
    title: 'Native proof verification',
    description:
      'A program-agnostic design replaces EXECUTE in the ZK path with proof-carrying transactions and consensus-layer verification reusable by any ZK application.',
    url: NATIVE_PROOF_VERIFICATION_URL,
  },
  {
    status: 'done',
    year: 2026,
    date: 'June 2026',
    title: 'FOCIL-based forced transactions',
    description:
      'An L1 inbox lets users bypass the sequencer by submitting signed L2 transactions that the rollup enforces through FOCIL-style inclusion lists.',
    url: L2_FOCIL_RESEARCH_URL,
  },
  {
    status: 'inProgress',
    year: 2026,
    date: 'Target: September 2026',
    title: 'Rebase on Hegotá',
    description:
      'Align the specification and a client implementation with the latest execution and consensus work, including ePBS, block-level access lists, FOCIL, and stateless validation.',
  },
  {
    status: 'planned',
    year: 2026,
    date: 'Target: December 2026',
    title: 'Native proof verification',
    description:
      'Turn the research proposal into an EIP and run a CL+EL devnet with proof-carrying transactions and the ZK version of the native-rollup specification.',
  },
  {
    status: 'planned',
    year: 2027,
    date: 'Target: March 2027',
    title: 'Blocks-in-Blobs study',
    description:
      'Specify how proof-carrying transactions bind L2 transactions and block access lists to data made available through EIP-8142.',
  },
  {
    status: 'planned',
    year: 2027,
    date: 'Target: June 2027',
    title: 'Proof aggregation',
    description:
      'Define recursive aggregation, proof propagation, pricing, and resource limits so L1 can efficiently cover many proof-carrying transactions.',
  },
]
