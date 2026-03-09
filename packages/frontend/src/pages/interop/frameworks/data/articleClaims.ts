import type {
  FrameworkId,
  FrameworkOverview,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { formatCurrency, formatNumber } from '../utils/format'

type ClaimKey = keyof typeof TOOLTIPS

export interface ClaimRow {
  category: string
  key: ClaimKey
  dynamic?: undefined
}

export interface DynamicRow {
  category: string
  key?: undefined
  dynamic: (fw: FrameworkOverview) => string
}

export type Row = string | ClaimRow | DynamicRow

export const ARTICLE_CLAIMS: Record<FrameworkId, Record<string, string>> = {
  'axelar-its': {
    verification: 'Delegated Proof of Stake, threshold signature scheme',
    verificationFlex: 'Can add custom validator set with Axelar Amplifier',
    preBuiltSchemes:
      "Must use Axelar's validator set for verification (75 validators)",
    defaultVerification: 'Signature by >2/3 of 75 validators (by voting power)',
    appParticipation: 'Yes. Can co-sign for large transfers',
    censorship:
      'Individual messages can be censored if >1/3 of validators collude (by voting power)',
    openSource:
      'High code availability for ITS, Axelar Validator network, and Gas Service',
    protocolFees:
      "Network fee, set by Axelar's onchain governance. Currently, avg. fee per transfer = 0.0014 AXL",
    deployedSince: 'July 2023',
    audits: '8',
    bounties: '$2.25M (Axelar)',
    granularControl:
      'ITS is a hub-and-spoke protocol with coordinated control via the Axelar network, allowing teams to address issues and mitigate damage from re-orgs or hacks on a single chain',
    coreContributors: "Interop Labs, Axelar's network of developers",
    adoption: '44+ tokens',
    notableTeams: 'Centrifuge, Kava, Ripple, Aethir',
    vmCoverage: '2 (Cosmos (WasmVM), Ethereum (EVM))',
    chainsDeployed: '18+',
    differentiators:
      "Multi-chain distribution via Squid; tokens can natively support <20s express transfers. No code deployments using interchain.axelar.dev. Axelar's TVL sits at >$300M, placing it among the top 25 PoS chains",
    easeOfIntegration: 'Effortless deployment through a no-code interface',
    documentation: 'Detailed docs with sample code and step-by-step guides',
    developerTools: 'Comprehensive Axelar JS SDK. No code token management UI',
  },
  'wormhole-ntt': {
    verification: 'Configurable m-of-n Transceivers',
    verificationFlex: 'Any Transceivers',
    preBuiltSchemes: 'Can choose Wormhole or Axelar, or both',
    defaultVerification:
      'No defaults (all existing NTT integrations use Wormhole messaging)',
    appParticipation: 'Yes. Can add their own Transceiver',
    censorship: 'Individual messages can be censored by Transceivers',
    openSource:
      'Transceiver implementations for various chains and Relayer implementation details are public',
    protocolFees: 'No fee switch',
    deployedSince: 'Feb 2024',
    audits: '6',
    bounties: '$5M (Wormhole)',
    granularControl:
      'Global Accountant to isolate chain balances and prevent the transfer of more tokens out of a chain than were minted on it. Note: this feature is opt-in for hub/spoke deployments that use Wormhole messaging',
    coreContributors:
      'Wormhole Labs, Wormhole Foundation, xLabs, Asymmetric Research',
    adoption: '20+ tokens',
    notableTeams: 'Lido, Fantom USDC, Jito, Sky (prev. MakerDAO)',
    vmCoverage: '2 (Ethereum, Solana SVM)',
    chainsDeployed: '9+',
    differentiators:
      "Feature rich on Solana with support for Solana token2022 standard and transfer hooks. Cross-chain composability with Wormhole Queries (Ex: JitoSOL's expansion to Arbitrum). Multi-chain distribution via Portal token bridge",
    easeOfIntegration:
      'Simple and quick deployment via easy-to-use CLI with example scripts',
    documentation:
      'Relatively less detailed but provides example implementations',
    developerTools:
      'Script repository for easy deployment and performing basic tasks. No dedicated packages or SDKs',
  },
  layerzero: {
    verification:
      'Configurable x-of-y-of-n Decentralized Verifier Networks (DVN)',
    verificationFlex: 'Any DVN and Executor configuration',
    preBuiltSchemes:
      "Can choose from multiple DVNs. Examples: Axelar's Validator Set, Hashi's Multi-Bridge, Nethermind",
    defaultVerification:
      "Google Cloud and LayerZero Labs OR Polyhedra's zkLightClient and LayerZero Labs (default depends on chain pathway)",
    appParticipation:
      "Yes. Ex: Tapioca's setup: 4-of-7 multisig of Tapioca, Google Cloud, Gelato and Polyhedra DVNs where verification by Tapioca DVN is a must",
    censorship:
      'DVNs can censor apps (all or no messages, not individual ones)',
    openSource:
      "Default DVN and custom Executor code is publicly available. Code for some DVNs is only partially disclosed as they're hosted off-chain for security and economic reasons. One can easily build using only fully open-source options. Example: there are onchain DVNs with public code like Axelar and Hashi",
    protocolFees:
      'Fee switch controlled by ZRO holders (currently disabled). Capped at the combined cost of DVN + Executor fees',
    deployedSince: 'Jan 2024 (V2) (V1 was launched in March 2022)',
    audits: '6',
    bounties: '$15M (LayerZero)',
    granularControl:
      "'Pre-crime' to define custom security conditions for message delivery; if any conditions fail, the message is blocked",
    coreContributors:
      'LayerZero Labs, LayerZero Foundation, Initia (WasmVM deployment)',
    adoption: '120+ tokens',
    notableTeams: 'WBTC, Ethena, EtherFi (weETH), WIF',
    vmCoverage: '4 (Ethereum, Aptos (MoveVM), Tron (TVM), Solana (Beta))',
    chainsDeployed: '90+',
    differentiators:
      'Multi-chain distribution via Stargate; chains are also using OFTs as canonical asset (Stargate Hydra accelerates this; Hydra OFTs are also supported on Jumper). Dev tooling and docs were consistently cited by devs as comprehensive and easy to follow. Currently the most adopted framework and has the most expansive chain support',
    easeOfIntegration:
      'Effortless setup with ready-to-use npx package and templates',
    documentation: 'Comprehensive and well-maintained docs with clear examples',
    developerTools:
      'Simplified deployment with packages such as @layerzerolabs/lz-evm-oapp-v2',
  },
  'hyperlane-hwr': {
    verification:
      'Configurable, any combination of Interchain Security Modules (ISMs)',
    verificationFlex: 'Any ISM combination',
    preBuiltSchemes:
      "Can choose from multiple ISMs. Examples: Aggregation ISM, Routing ISM, Hyperlane's AVS (EigenLayer)",
    defaultVerification: 'Multisig ISM with Hyperlane community validators',
    appParticipation:
      "Yes. Ex: Renzo's setup: Hyperlane's default multisig ISM combined with a custom set of validators, including their own AVS operators and Everclear",
    censorship:
      'ISMs can censor apps (all or no messages, not individual ones)',
    openSource:
      'High code availability for all ISM implementations and Relayer',
    protocolFees: 'Fee switch exists (currently disabled)',
    deployedSince: 'Feb 2023',
    audits: '2',
    bounties: '$2.5M (Hyperlane)',
    granularControl:
      "'Pausable ISM', enabling apps to temporarily halt liveness of warp routes",
    coreContributors:
      'Abacus Works, Hyperlane Foundation, Stride, Forma, Mitosis, Pragma, Movement Labs',
    adoption: 'Data unavailable',
    notableTeams: 'Renzo, Celestia, Injective, Ancient8',
    vmCoverage: '5 (Ethereum, Solana, Cosmos, Starkware (Cairo), Fuel (Sway))',
    chainsDeployed: '60+',
    differentiators:
      'Consistently cited by devs as the easiest to work with permissionlessly, evidenced by the multiple VM implementations maintained by other teams. Open-source, customizable, pre-built bridge UI with Next.js. Multi-chain distribution via Superbridge, offering customized UI for each Warp Token route',
    easeOfIntegration:
      'Simple integration and easy to customize ISMs via the CLI',
    documentation: 'Easy to follow but can be more extensive',
    developerTools:
      'Easy-to-use CLI with a well-integrated testing framework. Customizable UI template for tokens',
  },
}

export const TOOLTIPS: Record<string, string> = {
  verification:
    'How messages get validated across chains: a single option, modular system with multiple options, or a flexible design compatible with any bridge.',
  verificationFlex:
    'Whether token issuers can choose from various verification options or are limited to default settings.',
  preBuiltSchemes:
    'Pre-built verification mechanisms that simplify deployment. Wider selection of reliable, pre-built options is a positive.',
  defaultVerification:
    'Whether the framework provides a default verification mechanism. Most teams opt for defaults due to convenience, making default security critical.',
  appParticipation:
    'Whether teams can participate in the verification process, adding an extra layer of security or enabling control.',
  censorship:
    'Whether and how messages can be censored, potentially disabling applications and causing liveness issues.',
  openSource:
    'Whether the codebase is open-source, enabling developers to audit security features and ensuring code transparency.',
  protocolFees:
    'Message verification and relaying incur fees in all frameworks. Apps can also add custom app-specific fees. A fee switch means the protocol can charge additional fees on top of verification costs.',
  deployedSince:
    "When the framework's smart contracts were deployed, providing insight into operational history.",
  audits:
    "Number of security audits validating the integrity of the framework's smart contracts.",
  bounties:
    'Financial incentives offered to encourage external security researchers to discover and report vulnerabilities.',
  granularControl:
    'Key security features each framework offers for fine-grained control. All frameworks permit rate limits and blacklists.',
  coreContributors:
    'Teams actively building and maintaining the framework. Diverse contributors indicate broader demand and accessibility.',
  adoption:
    'Framework usage measured by deployed tokens and total secured value.',
  notableTeams:
    'Top teams and protocols adopting the framework, reflecting industry trust.',
  vmCoverage:
    'Range of virtual machines supported. Greater VM numbers provide flexibility and compatibility across blockchain environments.',
  chainsDeployed:
    'Number of chains the framework is deployed on, directly relating to accessible markets and DeFi ecosystems.',
  differentiators:
    'Special features, tooling, or integrations that distinguish each framework.',
  easeOfIntegration:
    'How straightforward it is to deploy tokens using the framework based on first-time experience without team support.',
  documentation:
    'How well guides, examples, and references support developer understanding and platform usage.',
  developerTools:
    'Libraries, SDKs, and utilities that make it easier to build, test, and deploy tokens.',
}

export const CLAIM_ROWS: Row[] = [
  // Security
  '_Security',
  { category: 'Verification Mechanism', key: 'verification' },
  { category: 'Flexibility on Verification', key: 'verificationFlex' },
  {
    category: 'Notable Pre-Built Verification Schemes',
    key: 'preBuiltSchemes',
  },
  { category: 'Default Verification Scheme', key: 'defaultVerification' },
  { category: 'App Participation in Verification', key: 'appParticipation' },
  { category: 'Censorship Resistance', key: 'censorship' },
  { category: 'Open-Sourceness', key: 'openSource' },
  // Fees
  '_Fees',
  { category: 'Protocol Fees', key: 'protocolFees' },
  // Smart Contracts
  '_Smart Contracts',
  { category: 'Deployed Since', key: 'deployedSince' },
  { category: 'Audits', key: 'audits' },
  { category: 'Bounties', key: 'bounties' },
  { category: 'Notable Feature for Granular Control', key: 'granularControl' },
  // Adoption & Expansion
  '_Adoption & Expansion',
  { category: 'Core Contributors', key: 'coreContributors' },
  { category: 'Adoption', key: 'adoption' },
  { category: 'Notable Teams', key: 'notableTeams' },
  { category: 'VM Coverage', key: 'vmCoverage' },
  { category: 'Chains Deployed On', key: 'chainsDeployed' },
  { category: 'Unique Differentiators', key: 'differentiators' },
  // Developer Experience
  '_Developer Experience',
  { category: 'Ease of Integration', key: 'easeOfIntegration' },
  { category: 'Documentation', key: 'documentation' },
  { category: 'Developer Tools', key: 'developerTools' },
  // L2BEAT Verified Data
  '_L2BEAT Verified Data',
  {
    category: 'Bridge Types (24h)',
    dynamic: (fw) =>
      fw.bridgeTypes
        .map((b) => `${b.type} (${formatNumber(b.count)})`)
        .join(', ') || 'N/A',
  },
  {
    category: '24h Volume',
    dynamic: (fw) => formatCurrency(fw.volume),
  },
  {
    category: '24h Transfers',
    dynamic: (fw) => formatNumber(fw.transfers),
  },
  {
    category: 'L2BEAT InteropType',
    dynamic: () => 'multichain',
  },
]
