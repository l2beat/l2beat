import type React from 'react'
import { CodeIcon } from '~/icons/Code'
import { DocumentIcon } from '~/icons/Document'
import { GlobeIcon } from '~/icons/Globe'
import { HistoryClockIcon } from '~/icons/HistoryClock'
import { GithubIcon } from '~/icons/products/Github'
import { YouTubeIcon } from '~/icons/products/Youtube'
import { ShieldIcon } from '~/icons/Shield'
import { SwapIcon } from '~/icons/Swap'
import { UserIcon } from '~/icons/User'

export const NATIVE_ROLLUPS_BOOK_URL = 'https://native-rollups.l2beat.com'
export const NATIVE_ROLLUPS_EIP_URL = 'https://eips.ethereum.org/EIPS/eip-8079'
export const NATIVE_PROOF_VERIFICATION_URL =
  'https://ethresear.ch/t/native-proof-verification/24798'
export const NATIVE_ROLLUPS_REPO_URL =
  'https://github.com/l2beat/native-rollups'
export const FOUNDING_POST_URL =
  'https://ethresear.ch/t/native-rollups-superpowers-from-l1-execution/21517'
export const ETHREX_POC_URL = 'https://github.com/lambdaclass/ethrex/pull/6418'
export const L2_FOCIL_URL = 'https://github.com/l2beat/native-rollups/pull/4'
export const L2_FOCIL_RESEARCH_URL =
  'https://ethresear.ch/t/repurposing-focil-as-an-l2-forced-transaction-mechanism/25233'
export const EIP_8025_URL = 'https://eips.ethereum.org/EIPS/eip-8025'
export const EIP_8142_URL = 'https://eips.ethereum.org/EIPS/eip-8142'

export interface FeatureItem {
  title: string
  description: string
  icon: (props: { className?: string }) => React.ReactNode
}

/** The two headline value propositions ("Why native"). */
export const WHY_NATIVE: FeatureItem[] = [
  {
    title: 'Designed to upgrade with Ethereum',
    description:
      'A native rollup proves the same EVM state transition program that Ethereum accepts for itself. Instead of being pinned to one EVM version, it follows the version recognized by L1, so upgrades can propagate without a separate rollup upgrade or governance vote.',
    icon: HistoryClockIcon,
  },
  {
    title: 'No bespoke onchain verifier stack',
    description:
      "Operators still generate proofs, but Ethereum's consensus-layer proof infrastructure verifies them. Rollups no longer need to independently deploy and govern verifier contracts, adapters, proof routers, and circuit upgrades for EVM execution.",
    icon: ShieldIcon,
  },
]

export interface HowItWorksStep {
  number: string
  title: string
  description: string
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Build and prove an L2 block',
    description:
      "The operator executes an L2 block and proves Ethereum's stateless payload-validation program with one or more supported zkVM backends.",
  },
  {
    number: '02',
    title: 'Submit a proof-carrying transaction',
    description:
      'A new L1 transaction type commits to the L2 data in blobs, the proof backends and program identity, and a hash of the proof’s public values.',
  },
  {
    number: '03',
    title: 'Ethereum verifies the proofs',
    description:
      'Raw proofs travel in ephemeral sidecars. Ethereum clients validate them through a program-agnostic proof engine, while recursive aggregation keeps verification efficient at scale.',
  },
  {
    number: '04',
    title: 'The rollup advances its state',
    description:
      'The rollup contract confirms that Ethereum verified the right program and block data, then accepts the new L2 state root.',
  },
]

/** The four programmable-customization features. */
export const FEATURES: FeatureItem[] = [
  {
    title: 'Custom sequencing',
    description:
      'Define sequencing policy in the rollup contract - centralized sequencing with fast preconfirmations, based sequencing, or a staked network.',
    icon: SwapIcon,
  },
  {
    title: 'Custom governance',
    description:
      "The programmable settlement contract lets a rollup keep its own configuration, such as a DAO-controlled fee recipient or opinionated gas limits, around L1's shared execution rules.",
    icon: UserIcon,
  },
  {
    title: 'Custom gas tokens',
    description:
      'Choose a token other than ETH for transaction fees. Ethereum-native messaging can bridge it from L1 and make it available as the gas token on L2.',
    icon: GlobeIcon,
  },
  {
    title: 'Custom fee collection',
    description:
      'Instead of automatically burning the base fee, direct it to a rollup treasury, sequencer, or another funding mechanism.',
    icon: CodeIcon,
  },
]

export interface RoadmapItem {
  status: 'done' | 'research' | 'inProgress' | 'planned'
  date: string
  title: string
  description: string
  /** Optional external link for the milestone ("Learn more"). */
  url?: string
}

/**
 * Roadmap timeline. Future dates are research targets, not fork commitments.
 */
export const ROADMAP: RoadmapItem[] = [
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
  {
    status: 'done',
    date: 'March 2026',
    title: 'ethrex proof-of-concept',
    description:
      'The ethrex / LambdaClass team demonstrates EIP-8079 via L1 re-execution. It validates the contract and messaging model, but is a prototype rather than the target ZK architecture.',
    url: ETHREX_POC_URL,
  },
  {
    status: 'done',
    date: 'May 2026',
    title: 'Native proof verification',
    description:
      'A program-agnostic design replaces EXECUTE in the ZK path with proof-carrying transactions and consensus-layer verification reusable by any ZK application.',
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
    status: 'inProgress',
    date: 'Target: September 2026',
    title: 'Rebase on Hegotá',
    description:
      'Align the specification and a client implementation with the latest execution and consensus work, including ePBS, block-level access lists, FOCIL, and stateless validation.',
  },
  {
    status: 'planned',
    date: 'Target: December 2026',
    title: 'Native proof verification',
    description:
      'Turn the research proposal into an EIP and run a CL+EL devnet with proof-carrying transactions and the ZK version of the native-rollup specification.',
  },
  {
    status: 'planned',
    date: 'Target: March 2027',
    title: 'Blocks-in-Blobs study',
    description:
      'Specify how proof-carrying transactions bind L2 transactions and block access lists to data made available through EIP-8142.',
  },
  {
    status: 'planned',
    date: 'Target: June 2027',
    title: 'Proof aggregation',
    description:
      'Define recursive aggregation, proof propagation, pricing, and resource limits so L1 can efficiently cover many proof-carrying transactions.',
  },
]

/** Bullet list: what the Ethereum core protocol still needs. */
export const CORE_PROTOCOL_NEEDS: { title: string; description: string }[] = [
  {
    title: 'Proof-carrying transactions',
    description:
      'A new L1 transaction type that carries program and backend identities plus a public-values commitment, exposed through dedicated EVM opcodes.',
  },
  {
    title: 'A program-agnostic proof engine',
    description:
      'Generalize the EIP-8025-style consensus infrastructure so clients can verify arbitrary guest programs, not only L1 execution proofs.',
  },
  {
    title: 'L1 proof recursion and aggregation',
    description:
      'Recursive aggregation folds proof sidecars into an L1 block proof, avoiding one additional validator-side verification for every rollup update.',
  },
  {
    title: 'Block data availability',
    description:
      'EIP-8142-style Blocks-in-Blobs must bind L2 transactions and block access lists to data that Ethereum makes available.',
  },
  {
    title: 'Proof economics and resource limits',
    description:
      'Proof propagation needs pricing, size bounds, backend diversity rules, and protection against excessive builder and client workloads.',
  },
  {
    title: 'Stable program identity',
    description:
      'Custom guest programs need identifiers that survive zkVM patches. Native EVM rollups avoid this issue by always referring to the execution program recognized by Ethereum.',
  },
]

export type MaterialKind = 'eip' | 'article' | 'book' | 'code' | 'video'

export interface MaterialItem {
  kind: MaterialKind
  label: string
  source: string
  description: string
  href: string
  /** For `video` materials - used to fetch the YouTube thumbnail. */
  videoId?: string
}

/** YouTube thumbnail URL for a video id (`hqdefault` is always available). */
export function getYouTubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

const MATERIAL_ICONS: Record<
  MaterialKind,
  (props: { className?: string }) => React.ReactNode
> = {
  eip: DocumentIcon,
  article: DocumentIcon,
  book: DocumentIcon,
  code: GithubIcon,
  video: YouTubeIcon,
}

export function getMaterialIcon(kind: MaterialKind) {
  return MATERIAL_ICONS[kind]
}

export const MATERIALS: MaterialItem[] = [
  {
    kind: 'article',
    label: 'Native proof verification',
    source: 'ethresear.ch',
    description:
      'The program-agnostic proposal for proof-carrying transactions, multi-proofs, and consensus-layer verification.',
    href: NATIVE_PROOF_VERIFICATION_URL,
  },
  {
    kind: 'article',
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
    kind: 'book',
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
    kind: 'article',
    label: 'Native rollups - superpowers from L1 execution',
    source: 'ethresear.ch',
    description:
      'The January 2025 founding post that introduced native rollups through the EXECUTE precompile.',
    href: FOUNDING_POST_URL,
  },
  {
    kind: 'eip',
    label: 'EIP-8079: Native rollups',
    source: 'eips.ethereum.org',
    description:
      'The original draft EIP for native rollups, centered on the re-execution precompile design.',
    href: NATIVE_ROLLUPS_EIP_URL,
  },
  {
    kind: 'eip',
    label: 'EIP-8025: Optional Execution Proofs',
    source: 'eips.ethereum.org',
    description:
      'The experimental consensus-layer proof infrastructure that native proof verification proposes to generalize.',
    href: EIP_8025_URL,
  },
  {
    kind: 'eip',
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
    kind: 'video',
    label: 'Execution Sharding Through Native Rollups',
    source: 'Luca Donno · L2BEAT',
    description: "L2BEAT's talk on scaling Ethereum through native rollups.",
    href: 'https://www.youtube.com/watch?v=69NKLnejppk',
    videoId: '69NKLnejppk',
  },
  {
    kind: 'video',
    label: 'Lightning Talk: Native Rollups',
    source: 'Luca Donno · L2BEAT',
    description:
      'A short introduction to the original native rollups and EXECUTE proposal.',
    href: 'https://www.youtube.com/watch?v=y8Rq_VESOac',
    videoId: 'y8Rq_VESOac',
  },
  {
    kind: 'video',
    label: "Ethereum's Roadmap to 10M TPS",
    source: 'Luca Donno · TOKEN2049 2025',
    description:
      "L2BEAT's Luca Donno on scaling Ethereum - including native rollups (TOKEN2049 Singapore 2025).",
    href: 'https://www.youtube.com/watch?v=0O3JyJpMQLQ',
    videoId: '0O3JyJpMQLQ',
  },
  {
    kind: 'video',
    label: 'Native Proof Verification',
    source: 'Futura Camp',
    description:
      'A session on the broader primitive that lets L1 verify proofs for native rollups and arbitrary guest programs.',
    href: 'https://www.youtube.com/watch?v=lbzXH2x2PJ4',
    videoId: 'lbzXH2x2PJ4',
  },
]

export interface Contributor {
  name: string
  org: string
  image: string
  href: string
}

export const CONTRIBUTORS: Contributor[] = [
  {
    name: 'Luca Donno',
    org: 'L2BEAT',
    image: '/images/native-rollups/luca-donno.jpg',
    href: 'https://x.com/donnoh_eth',
  },
  {
    name: 'Justin Drake',
    org: 'Ethereum Foundation',
    image: '/images/native-rollups/justin-drake.jpg',
    href: 'https://x.com/drakefjustin',
  },
]
