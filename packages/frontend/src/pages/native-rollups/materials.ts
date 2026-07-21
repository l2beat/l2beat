import type { ImageParams } from '~/utils/project/getImageParams'
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

interface MaterialBase {
  label: string
  source: string
  description: string
  href: string
}

export interface Article extends MaterialBase {
  kind: 'document' | 'code'
}

export interface Talk extends MaterialBase {
  kind: 'talk'
  thumbnail: ImageParams
}

export type Material = Article | Talk

export const ARTICLES: Article[] = [
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
]
