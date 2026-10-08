import type { ImageParams } from '~/utils/project/getImageParams'
import {
  EIP_8025_URL,
  EIP_8142_URL,
  EIP_8288_URL,
  EIP_8357_URL,
  ETHREX_POC_URL,
  FOUNDING_POST_URL,
  L2_FOCIL_RESEARCH_URL,
  L2_FOCIL_URL,
  NATIVE_PROOF_VERIFICATION_URL,
  NATIVE_ROLLUPS_BOOK_URL,
  NATIVE_ROLLUPS_DEMO_URL,
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
  kind: 'document' | 'code' | 'demo'
}

export interface Talk extends MaterialBase {
  kind: 'talk'
  thumbnail: ImageParams
}

export type Material = Article | Talk

export const ARTICLES: Article[] = [
  {
    kind: 'document',
    label: 'The Native Rollups Book',
    source: 'l2beat.com',
    description:
      'The open technical notebook covering native execution, settlement contracts, messaging, fees, and proof design.',
    href: NATIVE_ROLLUPS_BOOK_URL,
  },
  {
    kind: 'demo',
    label: 'Native rollup devnet explorer',
    source: 'nativerollups.fyi',
    description:
      'A native rollup running on a local EIP-8141 devnet, with an explorer that shows what is real and what is still mocked.',
    href: NATIVE_ROLLUPS_DEMO_URL,
  },
  {
    kind: 'document',
    label: 'EIP-8288: In-mempool signature and proof aggregation',
    source: 'eips.ethereum.org',
    description:
      'The frame mode through which a transaction declares the proofs it depends on, aggregated recursively in the mempool and by the builder.',
    href: EIP_8288_URL,
  },
  {
    kind: 'document',
    label: 'EIP-8357: EVM Verification Key Registry',
    source: 'github.com/ethereum',
    description:
      'The proposed L1 registry of the EVM program’s verification keys, which lets native rollups follow L1 upgrades.',
    href: EIP_8357_URL,
  },
  {
    kind: 'code',
    label: 'Native rollups repo',
    source: 'github.com/l2beat',
    description:
      'The book’s source, the native rollup contract, the devnet and its explorer, and the forced-inclusion prototype.',
    href: NATIVE_ROLLUPS_REPO_URL,
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
    label: 'Native proof verification',
    source: 'ethresear.ch',
    description:
      'Proof-carrying transactions, the main alternative to EIP-8288: a new transaction type with consensus-layer proof verification.',
    href: NATIVE_PROOF_VERIFICATION_URL,
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
      'The consensus-layer infrastructure for execution proofs, on the way to the mandatory proofs native rollups need.',
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
      'The Phase-1 proof-of-concept implementing EIP-8079 via re-execution.',
    href: ETHREX_POC_URL,
  },
]
