import type React from 'react'
import { CodeIcon } from '~/icons/Code'
import { DocumentIcon } from '~/icons/Document'
import { GlobeIcon } from '~/icons/Globe'
import { GithubIcon } from '~/icons/products/Github'
import { YouTubeIcon } from '~/icons/products/Youtube'
import { QuantumResistanceIcon } from '~/icons/QuantumResistance'
import { ShieldIcon } from '~/icons/Shield'
import { SwapIcon } from '~/icons/Swap'
import { UserIcon } from '~/icons/User'

export const NATIVE_ROLLUPS_BOOK_URL = 'https://native-rollups.l2beat.com'
export const NATIVE_ROLLUPS_EIP_URL = 'https://eips.ethereum.org/EIPS/eip-8079'

export interface FeatureItem {
  title: string
  description: string
  icon: (props: { className?: string }) => React.ReactNode
}

/** The two headline value propositions ("Why native"). */
export const WHY_NATIVE: FeatureItem[] = [
  {
    title: 'Automatically upgrade with Ethereum',
    description:
      "Native rollups replace their custom state transition function with the EXECUTE precompile — a recursive call to Ethereum's own execution environment. Every time Ethereum hard-forks, native rollups adopt the new features automatically. No bespoke governance processes, no long exit windows, and no gradual divergence from L1.",
    icon: QuantumResistanceIcon,
  },
  {
    title: 'No more dedicated proof system',
    description:
      "Instead of building and maintaining a custom ZK circuit or fraud-proof system — each a source of bugs that forces reliance on security councils and multi-proofs — native rollups delegate verification to L1. The EXECUTE precompile is 'bug-free by construction': any bug in it is a bug in Ethereum itself, fixed by the whole community and hardened by client diversity and formal verification.",
    icon: ShieldIcon,
  },
]

/** The four programmable-customization features. */
export const FEATURES: FeatureItem[] = [
  {
    title: 'Custom sequencing',
    description:
      'Define your own sequencing rules through a smart contract — centralized sequencing with fast preconfirmations, based (L1-)sequencing, or a staked sequencer network.',
    icon: SwapIcon,
  },
  {
    title: 'Custom governance',
    description:
      "The programmable 'consensus layer' lets a rollup keep its own configuration (e.g. a DAO-controlled coinbase or tweaked gas limits) while inheriting and auto-upgrading EVM execution rules from L1.",
    icon: UserIcon,
  },
  {
    title: 'Custom gas tokens',
    description:
      'Rather than adding new transaction types, native rollups use generic L1→L2 messaging to unlock pre-minted tokens — enabling custom gas tokens with no EVM changes.',
    icon: GlobeIcon,
  },
  {
    title: 'Custom fee collection',
    description:
      'A new `burned_fees` block-header field lets a rollup collect the base fee (credit it to any address) instead of burning it, enabling opinionated funding models not possible on L1.',
    icon: CodeIcon,
  },
]

export interface RoadmapItem {
  status: 'done' | 'planned'
  date: string
  title: string
  description: string
}

/**
 * Roadmap timeline. Completed work is `done`; the four grant milestones are
 * `planned` with their target completion dates. Nothing is "in progress".
 */
export const ROADMAP: RoadmapItem[] = [
  {
    status: 'done',
    date: 'January 2025',
    title: 'Founding research',
    description:
      "Justin Drake publishes “Native rollups — superpowers from L1 execution” on ethresear.ch, introducing the EXECUTE precompile that lets a rollup reuse Ethereum's own execution for verification.",
  },
  {
    status: 'done',
    date: 'May 2025',
    title: 'L2BEAT × Nethermind article',
    description:
      'Luca Donno and Conor McMenamin publish “Native Rollups: Where they are, and where they are going”, mapping out the design space and open problems.',
  },
  {
    status: 'done',
    date: '2025',
    title: 'The Native Rollups Book',
    description:
      'L2BEAT publishes the canonical educational resource explaining governance risk, bug risk, and the EXECUTE precompile.',
  },
  {
    status: 'done',
    date: 'November 2025',
    title: 'EIP-8079 (Draft)',
    description:
      'The EXECUTE precompile is formalized as EIP-8079 by Luca Donno (L2BEAT) and Justin Drake (Ethereum Foundation), together with the `burned_fees` header field and an anchoring mechanism for L1→L2 messaging.',
  },
  {
    status: 'done',
    date: 'March 2026',
    title: 'ethrex proof-of-concept',
    description:
      'The ethrex / LambdaClass team, with EF researchers and L2BEAT, demonstrate a working native-rollup PoC implementing EIP-8079 via re-execution — L2 settlement, deposits, contract deployment, cross-layer calls, and withdrawals.',
  },
  {
    status: 'planned',
    date: 'Target: September 2026',
    title: 'Milestone 1 · Rebase on Hegotá',
    description:
      'Rebase of the native rollups EIP on top of Hegotá (mainly ePBS, BALs, FOCIL); update of one client implementation to the latest spec (at least re-execution).',
  },
  {
    status: 'planned',
    date: 'Target: December 2026',
    title: 'Milestone 2 · Native proof verification',
    description:
      'Native proof verification EIP as an extension of native rollups; a CL+EL devnet running the ZK version of the spec.',
  },
  {
    status: 'planned',
    date: 'Target: March 2027',
    title: 'Milestone 3 · Blocks-in-Blobs study',
    description:
      'Study of the interaction with the Blocks-in-Blobs EIP; spec refinements and devnets.',
  },
  {
    status: 'planned',
    date: 'Target: June 2027',
    title: 'Milestone 4 · Proof aggregation',
    description:
      'Definition of the proof aggregation infrastructure needed for proof-carrying transactions; spec refinements and devnets; discussions related to inclusion in a future fork.',
  },
]

/** Bullet list: what the Ethereum core protocol still needs. */
export const CORE_PROTOCOL_NEEDS: { title: string; description: string }[] = [
  {
    title: 'The EXECUTE precompile (EIP-8079)',
    description:
      'A hard fork adding the precompile, the `burned_fees` header extension, and the anchoring predeploy / system transaction.',
  },
  {
    title: 'A DERIVE mechanism',
    description:
      'A precompile/function for L1→L2 deposits and signaling, forced inclusion, and sequencing rules.',
  },
  {
    title: 'L1 zkEVM / realtime proving',
    description:
      'Verifying ZK proofs instead of re-executing every EXECUTE call is what makes native rollups efficient at scale.',
  },
  {
    title: 'Proof-system standardization',
    description:
      'A decision on enshrining specific proof systems vs. per-client choice, closely tied to EIP-8025 (Optional Execution Proofs) and multi-prover setups.',
  },
  {
    title: 'Data availability for traces',
    description:
      'Full traces with state-access proofs are large; the DA design drives native-rollup fees and proof diversity.',
  },
  {
    title: 'An EXECUTE cumulative gas limit',
    description: 'A per-slot bound on the altruistic prover’s workload.',
  },
  {
    title: 'Client zkVM integrations',
    description:
      'Multi-prover setups (SP1, RISC Zero, ZisK, OpenVM) across execution clients, as ethrex already implements.',
  },
]

export type MaterialKind = 'eip' | 'article' | 'book' | 'code' | 'video'

export interface MaterialItem {
  kind: MaterialKind
  label: string
  source: string
  description: string
  href: string
  /** For `video` materials — used to fetch the YouTube thumbnail. */
  videoId?: string
  /** Set when the exact URL still needs confirmation. */
  unverified?: boolean
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

/**
 * External materials. NOTE: entries marked `unverified` use best-known URLs and
 * should be double-checked before shipping (flagged in the PR description).
 */
export const MATERIALS: MaterialItem[] = [
  {
    kind: 'book',
    label: 'The Native Rollups Book',
    source: 'l2beat.com',
    description:
      'The canonical guide to native rollups — governance risk, bug risk, and the EXECUTE precompile.',
    href: NATIVE_ROLLUPS_BOOK_URL,
  },
  {
    kind: 'eip',
    label: 'EIP-8079: Native rollups',
    source: 'eips.ethereum.org',
    description:
      'The formal EIP for the EXECUTE precompile, by Luca Donno and Justin Drake.',
    href: NATIVE_ROLLUPS_EIP_URL,
  },
  {
    kind: 'eip',
    label: 'EIP-8079 discussion',
    source: 'ethereum-magicians.org',
    description: 'The Ethereum Magicians thread tracking the EIP-8079 design.',
    href: 'https://ethereum-magicians.org/t/eip-8079-native-rollups/26565',
  },
  {
    kind: 'article',
    label: 'Native rollups — superpowers from L1 execution',
    source: 'ethresear.ch',
    description:
      "Justin Drake's founding post introducing the EXECUTE precompile (January 2025).",
    href: 'https://ethresear.ch/t/native-rollups-superpowers-from-l1-execution/21517',
  },
  {
    kind: 'article',
    label: 'Native Rollups: Where they are, and where they are going',
    source: 'L2BEAT × Nethermind',
    description:
      'Luca Donno and Conor McMenamin map the design space and open problems (May 2025).',
    href: 'https://medium.com/l2beat',
    unverified: true,
  },
  {
    kind: 'code',
    label: 'ethrex native rollups PoC',
    source: 'github.com/lambdaclass/ethrex',
    description:
      'The Phase-1 proof-of-concept implementing EIP-8079 via re-execution behind a feature flag.',
    href: 'https://github.com/lambdaclass/ethrex/pull/6186',
    unverified: true,
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
      'A short introduction to native rollups and the EXECUTE precompile.',
    href: 'https://www.youtube.com/watch?v=y8Rq_VESOac',
    videoId: 'y8Rq_VESOac',
  },
  {
    kind: 'video',
    label: "Ethereum's Roadmap to 10M TPS",
    source: 'Luca Donno · TOKEN2049 2025',
    description:
      "L2BEAT's Luca Donno on scaling Ethereum — including native rollups (TOKEN2049 Singapore 2025).",
    href: 'https://www.youtube.com/watch?v=0O3JyJpMQLQ',
    videoId: '0O3JyJpMQLQ',
  },
  {
    kind: 'video',
    label: 'Native Proof Verification',
    source: 'Futura Camp',
    description:
      'A session on native proof verification — extending native rollups so L1 checks ZK proofs rather than re-executing.',
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
