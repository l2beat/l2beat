import {
  EIP_8025_URL,
  EIP_8142_URL,
  ETHREX_POC_URL,
  FOUNDING_POST_URL,
  L2_FOCIL_RESEARCH_URL,
  L2_FOCIL_URL,
  NATIVE_PROOF_VERIFICATION_URL,
  NATIVE_ROLLUPS_BOOK_URL,
  NATIVE_ROLLUPS_EIP_URL,
  NATIVE_ROLLUPS_REPO_URL,
} from './links'

interface BaseMaterialItem {
  label: string
  source: string
  description: string
}

export type MaterialItem =
  | (BaseMaterialItem & {
      kind: 'document' | 'code'
      href: string
    })
  | (BaseMaterialItem & {
      kind: 'youtube'
      videoId: string
    })

export type MaterialKind = MaterialItem['kind']

export const MATERIALS: MaterialItem[] = [
  {
    kind: 'document',
    label: 'Native proof verification',
    source: 'ethresear.ch',
    description:
      'The program-agnostic proposal for proof-carrying transactions, multi-proofs, and consensus-layer verification.',
    href: NATIVE_PROOF_VERIFICATION_URL,
  },
  {
    kind: 'document',
    label: 'FOCIL as an L2 forced transaction mechanism',
    source: 'ethresear.ch',
    description:
      'How an L1 inbox can give EVM rollups forced transactions without changing their execution rules or introducing a custom transaction type.',
    href: L2_FOCIL_RESEARCH_URL,
  },
  {
    kind: 'code',
    label: 'L2 forced transaction implementation',
    source: 'github.com/l2beat',
    description:
      'The working forced-inbox implementation, including transaction validation, queueing, pruning, settlement, and gas tests.',
    href: L2_FOCIL_URL,
  },
  {
    kind: 'document',
    label: 'The Native Rollups Book',
    source: 'l2beat.com',
    description:
      'The open technical notebook covering native execution, settlement contracts, messaging, fees, and proof design.',
    href: NATIVE_ROLLUPS_BOOK_URL,
  },
  {
    kind: 'code',
    label: 'Native rollups research repo',
    source: 'github.com/l2beat',
    description:
      'The living specification, design notes, proof examples, and forced-inclusion prototypes behind this page.',
    href: NATIVE_ROLLUPS_REPO_URL,
  },
  {
    kind: 'document',
    label: 'Native rollups — superpowers from L1 execution',
    source: 'ethresear.ch',
    description:
      'The January 2025 founding post that introduced native rollups through the EXECUTE precompile.',
    href: FOUNDING_POST_URL,
  },
  {
    kind: 'document',
    label: 'EIP-8079: Native rollups',
    source: 'eips.ethereum.org',
    description:
      'The original draft EIP for native rollups, centered on the re-execution precompile design.',
    href: NATIVE_ROLLUPS_EIP_URL,
  },
  {
    kind: 'document',
    label: 'EIP-8025: Optional Execution Proofs',
    source: 'eips.ethereum.org',
    description:
      'The experimental consensus-layer proof infrastructure that native proof verification proposes to generalize.',
    href: EIP_8025_URL,
  },
  {
    kind: 'document',
    label: 'EIP-8142: Block-in-Blobs',
    source: 'eips.ethereum.org',
    description:
      'The draft mechanism for keeping execution payload data available when validity is checked with ZK proofs.',
    href: EIP_8142_URL,
  },
  {
    kind: 'code',
    label: 'ethrex native rollups PoC',
    source: 'github.com/lambdaclass/ethrex',
    description:
      'The Phase-1 proof-of-concept implementing EIP-8079 via re-execution behind a feature flag.',
    href: ETHREX_POC_URL,
  },
  {
    kind: 'youtube',
    label: 'Execution Sharding Through Native Rollups',
    source: 'Luca Donno · L2BEAT',
    description: "L2BEAT's talk on scaling Ethereum through native rollups.",
    videoId: '69NKLnejppk',
  },
  {
    kind: 'youtube',
    label: 'Lightning Talk: Native Rollups',
    source: 'Luca Donno · L2BEAT',
    description:
      'A short introduction to the original native rollups and EXECUTE proposal.',
    videoId: 'y8Rq_VESOac',
  },
  {
    kind: 'youtube',
    label: "Ethereum's Roadmap to 10M TPS",
    source: 'Luca Donno · TOKEN2049 2025',
    description:
      "L2BEAT's Luca Donno on scaling Ethereum — including native rollups (TOKEN2049 Singapore 2025).",
    videoId: '0O3JyJpMQLQ',
  },
  {
    kind: 'youtube',
    label: 'Native Proof Verification',
    source: 'Futura Camp',
    description:
      'A session on the broader primitive that lets L1 verify proofs for native rollups and arbitrary guest programs.',
    videoId: 'lbzXH2x2PJ4',
  },
]
