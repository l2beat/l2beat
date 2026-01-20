/**
 * Escrow Categorization Analysis Tool
 *
 * This script analyzes escrows for L2Beat projects to categorize them as:
 * - Rollup-Secured: Controlled by the rollup's governance
 * - Issuer-Secured: Controlled by the token issuer (no added trust assumption)
 * - Third-Party-Secured: Controlled by a third party (added trust assumption)
 *
 * Usage: node -r esbuild-register scripts/escrowAnalysis/analyzeEscrows.ts [projectId]
 */

import chalk from 'chalk'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Types
// Escrow-level category (who controls the escrow)
type SecurityCategory =
  | 'rollup-secured'
  | 'issuer-secured'
  | 'third-party-secured'

// Bridge-level category (what messaging system is used)
type BridgeType = 'canonical' | 'external'

interface TokenValue {
  symbol: string
  valueUsd: number
  amount: number
  issuer: string | null
}

// Represents a party with privileged functions that can put tokens at risk
interface TrustedParty {
  name: string
  role: string // e.g., "Contract Admin", "DVN Operator", "Attestation Service"
  powers: string[] // e.g., ["upgrade contracts", "pause transfers", "validate messages"]
  riskDescription: string // How this party can put tokens at risk
}

interface EscrowAnalysis {
  address: string
  name: string
  category: SecurityCategory // Who controls the escrow (rollup/issuer/third-party)
  bridgeType: BridgeType // What messaging is used (canonical/external)
  categoryReason: string
  admin: string | null
  adminName: string | null
  isRollupControlled: boolean
  tokens: TokenValue[]
  totalValueUsd: number
  source: string | null
  description: string | null
  isNativeToken?: boolean
  bridgeProtocol?: string
  // New: All parties with privileged functions
  trustedParties?: TrustedParty[]
}

interface EscrowReport {
  projectId: string
  timestamp: number
  escrows: EscrowAnalysis[]
  externalTokens: ExternalTokenAnalysis[]
  summary: {
    totalTvl: number
    // Bridge-level breakdown (by messaging type)
    canonicalTvl: number // Uses rollup's canonical messaging (fraud/validity proofs)
    externalTvl: number // Uses external bridge (third-party validation)
    // Escrow-level breakdown (by admin) - for reference
    byAdmin: {
      rollupControlled: number
      issuerControlled: number
      thirdPartyControlled: number
    }
  }
  externalTokensSummary: {
    totalCount: number
    totalValue: number
    byProtocol: Record<string, { count: number; value: number }>
    byCategory: Record<SecurityCategory, { count: number; value: number }>
  }
}

interface DiscoveryEntry {
  address: string
  name?: string
  type: string
  proxyType?: string
  values?: Record<string, unknown>
  description?: string
  category?: { name: string; priority: number }
  receivedPermissions?: Array<{
    permission: string
    from: string
    via?: Array<{ address: string; delay?: number }>
  }>
  directlyReceivedPermissions?: Array<{
    permission: string
    from: string
  }>
}

interface Discovery {
  name: string
  entries: DiscoveryEntry[]
}

interface TvsTokenAmount {
  type: string
  chain?: string
  address?: string
  escrowAddress?: string
  decimals?: number
}

interface TvsTokenFormula {
  type: string
  operator?: string
  arguments?: Array<{
    type: string
    amount?: TvsTokenAmount
    priceId?: string
    arguments?: Array<{ type: string; amount?: TvsTokenAmount }>
  }>
  amount?: TvsTokenAmount
}

interface TvsToken {
  id: string
  name: string
  symbol: string
  category: string
  source: string
  isAssociated: boolean
  address?: { address: string }
  formula: TvsTokenFormula
  priceUsd: number
  value: number
  valueForProject: number
  amount: number
  isGasToken: boolean
}

// Token config from local TVS JSON (has bridgedUsing)
interface TvsJsonTokenConfig {
  id: string
  symbol: string
  name: string
  source: string
  bridgedUsing?: {
    bridges: Array<{
      name: string
      slug?: string
    }>
  }
  amount?: {
    type: string
    address?: string
  }
}

interface TvsApiResponse {
  success: boolean
  data: TvsToken[]
}

// Token issuer mapping (known issuers) - normalized names
const TOKEN_ISSUERS: Record<string, string> = {
  DAI: 'MakerDAO',
  USDS: 'MakerDAO',
  sUSDS: 'MakerDAO',
  wstETH: 'Lido DAO',
  stETH: 'Lido DAO',
  LPT: 'Livepeer',
  USDC: 'Circle',
  USDT: 'Tether',
  WBTC: 'BitGo',
  cbBTC: 'Coinbase',
}

// Known external escrow admins
const EXTERNAL_ADMINS: Record<string, string> = {
  // Lido wstETH escrow admin
  'eth:0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c': 'Lido DAO',
  // Maker L1Escrow wards (admin pattern)
  'eth:0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB': 'MakerDAO',
  'eth:0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58': 'MakerDAO',
}

// Known issuer-controlled escrows (escrows where we know the issuer relationship)
// Map escrow address to issuer name
const KNOWN_ISSUER_ESCROWS: Record<string, string> = {
  'eth:0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A': 'Livepeer', // LPT L1 Escrow
}

// Arbitrum specific escrow configuration
const ARBITRUM_ESCROWS = [
  {
    address: 'eth:0xcEe284F754E854890e311e3280b767F80797180d',
    name: 'Custom ERC20 Gateway',
    tokens: ['*'],
    source: 'canonical',
    description:
      'Main entry point for users depositing ERC20 tokens that require minting custom tokens on L2.',
  },
  {
    address: 'eth:0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
    name: 'Standard ERC20 Gateway',
    tokens: ['*'],
    source: 'canonical',
    description:
      'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
  },
  {
    address: 'eth:0xA10c7CE4b876998858b1a9E12b10092229539400',
    name: 'Maker/Sky DAI Vault',
    tokens: ['DAI', 'USDS', 'sUSDS'],
    source: 'external',
    description:
      'Maker/Sky-controlled vault for DAI, USDS and sUSDS bridged with canonical messaging.',
  },
  {
    address: 'eth:0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a',
    name: 'Lido wstETH Vault',
    tokens: ['wstETH'],
    source: 'external',
    description:
      'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
  },
  {
    address: 'eth:0x6A23F4940BD5BA117Da261f98aae51A8BFfa210A',
    name: 'Livepeer LPT Vault',
    tokens: ['LPT'],
    source: 'external',
    description: 'LPT Vault for custom Livepeer Token Gateway.',
  },
]

// Native/external tokens without L1 escrows (minted directly on L2)
interface NativeToken {
  symbol: string
  name: string
  l2Address: string
  issuer: string
  bridgeProtocol: string
  source: 'native' | 'external'
  description: string
}

// Known bridge protocols for tokens (by L2 address on Arbitrum)
// Trust model analysis:
// - ISSUER-SECURED: The token issuer directly controls ALL privileged functions
// - THIRD-PARTY-SECURED: A third party controls one or more privileged functions
//
// Privileged functions that can put tokens at risk:
// - Minting: Create tokens out of thin air
// - Burning: Destroy tokens without consent
// - Pausing: Freeze all transfers
// - Blacklisting: Freeze specific addresses
// - Contract upgrades: Change any logic
// - Security config: Change validators/DVNs
//
// See: https://l2beat.com/bridges/projects/layerzerov2oft

interface BridgeProtocolInfo {
  protocol: string
  issuer: string
  category: SecurityCategory
  notes?: string
  trustedParties: TrustedParty[]
}

// Common trusted party definitions for reuse
const LAYERZERO_TRUSTED_PARTIES: TrustedParty[] = [
  {
    name: 'LayerZero Labs',
    role: 'Protocol Operator',
    powers: ['change default DVNs', 'upgrade MessageLib', 'control endpoint config'],
    riskDescription: 'Can redirect validation to malicious DVNs or change security assumptions',
  },
  {
    name: 'LayerZero DVN',
    role: 'Message Validator',
    powers: ['validate cross-chain messages', 'approve minting'],
    riskDescription: 'Can approve fraudulent mints or censor legitimate transfers',
  },
]

const WORMHOLE_TRUSTED_PARTIES: TrustedParty[] = [
  {
    name: 'Wormhole Guardians',
    role: 'Message Validator',
    powers: ['validate cross-chain messages', 'approve minting'],
    riskDescription: 'Guardian collusion can approve fraudulent transfers',
  },
]

const CHAINLINK_CCIP_TRUSTED_PARTIES: TrustedParty[] = [
  {
    name: 'Chainlink Node Operators',
    role: 'Message Validator',
    powers: ['validate cross-chain messages', 'relay proofs'],
    riskDescription: 'Node operator collusion can approve fraudulent transfers',
  },
  {
    name: 'Chainlink Risk Management Network',
    role: 'Security Monitor',
    powers: ['pause transfers', 'rate limiting'],
    riskDescription: 'Can censor or delay legitimate transfers',
  },
]

const AXELAR_TRUSTED_PARTIES: TrustedParty[] = [
  {
    name: 'Axelar Validators',
    role: 'Message Validator',
    powers: ['validate cross-chain messages', 'approve minting'],
    riskDescription: 'Validator collusion can approve fraudulent transfers',
  },
]

const KNOWN_BRIDGE_PROTOCOLS: Record<string, BridgeProtocolInfo> = {
  // Circle CCTP - Circle controls BOTH the token AND the bridge attestation service
  // This is TRUE issuer-secured: Circle is the only party that can mint/burn
  '0xaf88d065e77c8cc2239327c5edb3a432268e5831': {
    protocol: 'Circle CCTP',
    issuer: 'Circle',
    category: 'issuer-secured',
    notes: 'Circle controls attestation service - true issuer control',
    trustedParties: [
      {
        name: 'Circle',
        role: 'Token Issuer & Bridge Operator',
        powers: ['mint/burn USDC', 'blacklist addresses', 'pause transfers', 'control attestation service'],
        riskDescription: 'Full control over USDC - same trust as holding USDC on any chain',
      },
    ],
  },

  // Layer Zero OFT tokens - THIRD-PARTY-SECURED
  // USDT0 specific: Uses Everdawn Labs DVN in addition to LayerZero DVN
  '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9': {
    protocol: 'Layer Zero v2 OFT',
    issuer: 'Tether',
    category: 'third-party-secured',
    notes: 'Uses LayerZero DVN + Everdawn Labs DVN. Trust LZ Labs + Everdawn.',
    trustedParties: [
      {
        name: 'Tether',
        role: 'Token Issuer',
        powers: ['blacklist addresses', 'pause USDT', 'control reserves'],
        riskDescription: 'Can freeze your address or halt all USDT transfers',
      },
      {
        name: 'Everdawn Labs',
        role: 'OFT Contract Admin',
        powers: ['upgrade OFT contracts', 'change OApp config', 'set DVN requirements'],
        riskDescription: 'Can introduce malicious logic via contract upgrade',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
      {
        name: 'Everdawn DVN',
        role: 'Message Validator',
        powers: ['validate cross-chain messages', 'approve minting'],
        riskDescription: 'Can approve fraudulent mints or censor transfers',
      },
    ],
  },

  // Generic LayerZero OFT tokens
  '0x4186bfc76e2e237523cbc30fd220fe055156b41f': {
    protocol: 'Layer Zero OFT',
    issuer: 'Kelp DAO',
    category: 'third-party-secured',
    notes: 'rsETH - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'Kelp DAO',
        role: 'Token Issuer & OFT Owner',
        powers: ['upgrade OFT contract', 'configure DVNs', 'control rsETH protocol'],
        riskDescription: 'Can change bridge security or upgrade contracts maliciously',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },
  '0x2416092f143378750bb29b79ed961ab195cceea5': {
    protocol: 'Layer Zero OFT',
    issuer: 'Renzo',
    category: 'third-party-secured',
    notes: 'ezETH - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'Renzo',
        role: 'Token Issuer & OFT Owner',
        powers: ['upgrade OFT contract', 'configure DVNs', 'control ezETH protocol'],
        riskDescription: 'Can change bridge security or upgrade contracts maliciously',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },
  '0x6985884c4392d348587b19cb9eaaf157f13271cd': {
    protocol: 'Layer Zero (Native)',
    issuer: 'Layer Zero',
    category: 'issuer-secured',
    notes: 'ZRO - LayerZero native token, issuer controls',
    trustedParties: [
      {
        name: 'LayerZero Labs',
        role: 'Token Issuer & Protocol Operator',
        powers: ['control ZRO token', 'operate all LayerZero infrastructure'],
        riskDescription: 'Full control - same trust as using LayerZero at all',
      },
    ],
  },
  '0xf8173a39c56a554837c4c7f104153a005d284d11': {
    protocol: 'Layer Zero OFT',
    issuer: 'Open Campus',
    category: 'third-party-secured',
    notes: 'EDU - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'Open Campus',
        role: 'Token Issuer & OFT Owner',
        powers: ['upgrade OFT contract', 'configure DVNs'],
        riskDescription: 'Can change bridge security or upgrade contracts',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },
  '0x35751007a407ca6feffe80b3cb397736d2cf4dbe': {
    protocol: 'Layer Zero OFT',
    issuer: 'Frax',
    category: 'third-party-secured',
    notes: 'weETH - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'Frax',
        role: 'Token Issuer & OFT Owner',
        powers: ['upgrade OFT contract', 'configure DVNs'],
        riskDescription: 'Can change bridge security or upgrade contracts',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },
  '0xc87b37a581ec3257b734886d9d3a581f5a9d056c': {
    protocol: 'Layer Zero OFT',
    issuer: 'Aethir',
    category: 'third-party-secured',
    notes: 'ATH - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'Aethir',
        role: 'Token Issuer & OFT Owner',
        powers: ['upgrade OFT contract', 'configure DVNs'],
        riskDescription: 'Can change bridge security or upgrade contracts',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },

  // The Graph custom gateway - Issuer controls their own bridge
  '0x9623063377ad1b27544c965ccd7342f7ea7e88c7': {
    protocol: 'The Graph Gateway',
    issuer: 'The Graph',
    category: 'issuer-secured',
    notes: 'The Graph operates their own custom bridge infrastructure',
    trustedParties: [
      {
        name: 'The Graph Council',
        role: 'Token Issuer & Bridge Operator',
        powers: ['control GRT token', 'operate bridge infrastructure', 'upgrade contracts'],
        riskDescription: 'Full control over GRT bridge - same trust as holding GRT',
      },
    ],
  },

  // Chainlink CCIP - Third party bridge
  '0x18c14c2d707b2212e17d1579789fc06010cfca23': {
    protocol: 'Chainlink CCIP',
    issuer: 'Chainlink/Various',
    category: 'third-party-secured',
    notes: 'Chainlink node operators validate cross-chain messages',
    trustedParties: CHAINLINK_CCIP_TRUSTED_PARTIES,
  },

  // Wormhole NTT - Third party bridge
  '0x0ce45dd53affbb011884ef1866e0738f58ab7969': {
    protocol: 'Wormhole NTT',
    issuer: 'Hashkey',
    category: 'third-party-secured',
    notes: 'cgETH - Wormhole Guardian network validates messages',
    trustedParties: [
      {
        name: 'Hashkey',
        role: 'Token Issuer',
        powers: ['control cgETH token', 'configure NTT settings'],
        riskDescription: 'Can change bridge configuration',
      },
      ...WORMHOLE_TRUSTED_PARTIES,
    ],
  },

  // Maple Syrup - Need to verify if issuer controls bridge
  '0x41ca7586cc1311807b4605fbb748a3b8862b42b5': {
    protocol: 'Maple Finance',
    issuer: 'Maple Finance',
    category: 'third-party-secured',
    notes: 'syrupUSDC - Bridge control needs verification',
    trustedParties: [
      {
        name: 'Maple Finance',
        role: 'Token Issuer',
        powers: ['control syrupUSDC', 'unknown bridge powers'],
        riskDescription: 'Bridge trust model not fully verified',
      },
    ],
  },

  // Threshold tBTC - Threshold network validates
  '0x6c84a8f1c29108f47a79964b5fe888d4f4d0de40': {
    protocol: 'Threshold Network',
    issuer: 'Threshold',
    category: 'issuer-secured',
    notes: 'tBTC - Threshold operators are the token governance',
    trustedParties: [
      {
        name: 'Threshold Network',
        role: 'Token Issuer & Bridge Operator',
        powers: ['control tBTC minting', 'operate threshold signature scheme', 'govern protocol'],
        riskDescription: 'Threshold signers control BTC custody - same trust as tBTC itself',
      },
    ],
  },

  // Wormhole
  '0xc944e90c64b2c07662a292be6244bdf05cda44a7': {
    protocol: 'Wormhole',
    issuer: 'The Graph',
    category: 'third-party-secured',
    notes: 'GRT via Wormhole - Guardian network validates',
    trustedParties: [
      {
        name: 'The Graph',
        role: 'Token Issuer',
        powers: ['control GRT token governance'],
        riskDescription: 'Controls underlying token',
      },
      ...WORMHOLE_TRUSTED_PARTIES,
    ],
  },

  // Stargate / Layer Zero
  '0x6694340fc020c5e6b96567843da2df01b2ce1eb6': {
    protocol: 'Stargate',
    issuer: 'Stargate',
    category: 'third-party-secured',
    notes: 'STG - Built on LayerZero',
    trustedParties: [
      {
        name: 'Stargate DAO',
        role: 'Protocol Operator',
        powers: ['control STG token', 'configure Stargate pools'],
        riskDescription: 'Controls Stargate protocol parameters',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },

  // Frax Ferry - Frax controls their own bridge
  '0x178412e79c25968a32e89b11f63b33f733770c2a': {
    protocol: 'Frax Ferry',
    issuer: 'Frax',
    category: 'issuer-secured',
    notes: 'frxETH - Frax team operates the Ferry bridge',
    trustedParties: [
      {
        name: 'Frax Team',
        role: 'Token Issuer & Bridge Operator',
        powers: ['control frxETH', 'operate Ferry bridge', 'process withdrawals'],
        riskDescription: 'Full control over frxETH bridge - same trust as holding frxETH',
      },
    ],
  },
  '0x95ab45875cffdba1e5f451b950bc2e42c0053f39': {
    protocol: 'Frax Ferry',
    issuer: 'Frax',
    category: 'issuer-secured',
    notes: 'sfrxETH - Frax team operates the Ferry bridge',
    trustedParties: [
      {
        name: 'Frax Team',
        role: 'Token Issuer & Bridge Operator',
        powers: ['control sfrxETH', 'operate Ferry bridge', 'process withdrawals'],
        riskDescription: 'Full control over sfrxETH bridge - same trust as holding sfrxETH',
      },
    ],
  },

  // Aave GHO via CCIP - Chainlink validates, but Aave controls token
  '0x7dff72693f6a4149b17e7c6314655f6a9f7c8b33': {
    protocol: 'Chainlink CCIP',
    issuer: 'Aave',
    category: 'third-party-secured',
    notes: 'GHO - Chainlink CCIP validates, adds trust in Chainlink',
    trustedParties: [
      {
        name: 'Aave DAO',
        role: 'Token Issuer',
        powers: ['control GHO token', 'set minting caps', 'govern Aave protocol'],
        riskDescription: 'Controls GHO token parameters',
      },
      ...CHAINLINK_CCIP_TRUSTED_PARTIES,
    ],
  },

  // Ethena via Layer Zero
  '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34': {
    protocol: 'Layer Zero OFT',
    issuer: 'Ethena',
    category: 'third-party-secured',
    notes: 'USDe - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'Ethena Labs',
        role: 'Token Issuer & OFT Owner',
        powers: ['control USDe', 'manage delta-neutral positions', 'upgrade OFT'],
        riskDescription: 'Controls USDe backing and bridge configuration',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },
  '0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2': {
    protocol: 'Layer Zero OFT',
    issuer: 'Ethena',
    category: 'third-party-secured',
    notes: 'sUSDe - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'Ethena Labs',
        role: 'Token Issuer & OFT Owner',
        powers: ['control sUSDe', 'manage staking rewards', 'upgrade OFT'],
        riskDescription: 'Controls sUSDe mechanics and bridge configuration',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },

  // Ondo via Axelar
  '0x35e050d3c0ec2d29d269a8eeea763a183bdf9abe': {
    protocol: 'Axelar',
    issuer: 'Ondo',
    category: 'third-party-secured',
    notes: 'USDY - Axelar validator set validates messages',
    trustedParties: [
      {
        name: 'Ondo Finance',
        role: 'Token Issuer',
        powers: ['control USDY', 'manage treasury backing', 'KYC/whitelist'],
        riskDescription: 'Controls USDY issuance and backing',
      },
      ...AXELAR_TRUSTED_PARTIES,
    ],
  },

  // EtherFi via Layer Zero
  '0x7189fb5b6504bbff6a852b13b7a82cf78e81f1ee': {
    protocol: 'Layer Zero OFT',
    issuer: 'EtherFi',
    category: 'third-party-secured',
    notes: 'ETHFI - Trust LayerZero Labs DVN infrastructure',
    trustedParties: [
      {
        name: 'EtherFi',
        role: 'Token Issuer & OFT Owner',
        powers: ['control ETHFI token', 'upgrade OFT contract'],
        riskDescription: 'Controls ETHFI and bridge configuration',
      },
      ...LAYERZERO_TRUSTED_PARTIES,
    ],
  },
}

// Extended token issuers (includes more tokens)
const EXTENDED_TOKEN_ISSUERS: Record<string, string> = {
  ...TOKEN_ISSUERS,
  rsETH: 'Kelp DAO',
  ezETH: 'Renzo',
  ZRO: 'Layer Zero',
  EDU: 'Open Campus',
  ATH: 'Aethir',
  GRT: 'The Graph',
  syrupUSDC: 'Maple Finance',
  clBTC: 'Corn Finance',
  tBTC: 'Threshold',
  frxETH: 'Frax',
  sfrxETH: 'Frax',
  SOL: 'Solana/Wormhole',
  RDNT: 'Radiant',
  XBG: 'XBorg',
  sUSDe: 'Ethena',
  USDe: 'Ethena',
  ETHFI: 'EtherFi',
  MOR: 'Morpheus',
  USDY: 'Ondo',
  GHO: 'Aave',
  STG: 'Stargate',
}

// Native token configuration with security category
interface NativeTokenConfig extends NativeToken {
  category: SecurityCategory
  categoryReason: string
}

const ARBITRUM_NATIVE_TOKENS: NativeTokenConfig[] = [
  {
    symbol: 'USDC',
    name: 'Native USDC (Circle CCTP)',
    l2Address: 'arb1:0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    issuer: 'Circle',
    bridgeProtocol: 'Circle CCTP',
    source: 'external',
    description:
      'Native USDC minted directly on Arbitrum by Circle via Cross-Chain Transfer Protocol. Circle controls the attestation service.',
    category: 'issuer-secured',
    categoryReason: 'Circle controls both USDC token AND the CCTP attestation service. True issuer control.',
  },
  {
    symbol: 'USDT',
    name: 'USDT0 (Layer Zero OFT)',
    l2Address: 'arb1:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    issuer: 'Tether',
    bridgeProtocol: 'Layer Zero v2 OFT',
    source: 'external',
    description:
      'USDT0 on Arbitrum via Layer Zero OFT. Validated by LayerZero DVN + Everdawn Labs DVN.',
    category: 'third-party-secured',
    categoryReason: 'Trust LayerZero Labs (3-of-5 multisig) + Everdawn Labs DVN. Tether does not directly control the bridge.',
  },
]

interface ExternalTokenAnalysis {
  symbol: string
  name: string
  l2Address: string
  valueUsd: number
  amount: number
  bridgeProtocol: string
  issuer: string
  category: SecurityCategory
  categoryReason: string
  formulaType: string
  trustedParties?: TrustedParty[]
}

// Main rollup contracts (to compare admin against)
const ARBITRUM_ROLLUP_ADMINS = [
  'eth:0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa', // ProxyAdmin
  'eth:0x3ffFbAdAF827559da092217e474760E2b2c3CeDd', // UpgradeExecutor
  'eth:0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD', // ProxyAdmin 2
]

function loadDiscovery(projectId: string): Discovery {
  const discoveryPath = join(
    __dirname,
    `../../src/projects/${projectId}/discovered.json`,
  )
  const content = readFileSync(discoveryPath, 'utf-8')
  return JSON.parse(content)
}

function findEntryByAddress(
  discovery: Discovery,
  address: string,
): DiscoveryEntry | undefined {
  return discovery.entries.find((e) => e.address === address)
}

function getAdminFromEntry(entry: DiscoveryEntry): string | null {
  if (entry.values && '$admin' in entry.values) {
    return entry.values['$admin'] as string
  }
  // For immutable contracts with wards (Maker pattern)
  if (entry.values && 'wards' in entry.values) {
    const wards = entry.values['wards'] as string[]
    if (wards && wards.length > 0) {
      return wards[0] // Return first ward as admin
    }
  }
  return null
}

function isRollupControlled(admin: string | null): boolean {
  if (!admin) return false
  return ARBITRUM_ROLLUP_ADMINS.includes(admin)
}

function getAdminName(
  admin: string | null,
  discovery: Discovery,
): string | null {
  if (!admin) return null

  // Check external admins first
  if (EXTERNAL_ADMINS[admin]) {
    return EXTERNAL_ADMINS[admin]
  }

  // Look up in discovery
  const entry = findEntryByAddress(discovery, admin)
  if (entry?.name) {
    return entry.name
  }

  // Check if it's a rollup admin
  if (ARBITRUM_ROLLUP_ADMINS.includes(admin)) {
    return 'Arbitrum DAO'
  }

  return null
}

function classifyEscrow(
  escrowConfig: (typeof ARBITRUM_ESCROWS)[0],
  entry: DiscoveryEntry | undefined,
  discovery: Discovery,
  tokens: TokenValue[],
): EscrowAnalysis {
  const admin = entry ? getAdminFromEntry(entry) : null
  let adminName = getAdminName(admin, discovery)
  const rollupControlled = isRollupControlled(admin)

  // Check if this is a known issuer-controlled escrow
  const knownIssuer = KNOWN_ISSUER_ESCROWS[escrowConfig.address]
  if (knownIssuer && !adminName) {
    adminName = knownIssuer
  }

  let category: SecurityCategory
  let bridgeType: BridgeType
  let categoryReason: string

  if (rollupControlled) {
    // Escrow is controlled by the rollup
    category = 'rollup-secured'
    bridgeType = 'canonical'
    categoryReason = `Escrow admin (${adminName || 'ProxyAdmin'}) is controlled by the rollup governance`
  } else if (escrowConfig.source === 'external') {
    // External escrow - check if issuer matches admin
    const tokenIssuers = [
      ...new Set(tokens.map((t) => t.issuer).filter(Boolean)),
    ]

    // Check if known issuer escrow
    if (knownIssuer) {
      category = 'issuer-secured'
      // CANONICAL_EXTERNAL escrows use canonical messaging even though admin is external
      bridgeType = 'canonical'
      categoryReason = `Escrow controlled by ${knownIssuer} (token issuer), uses canonical messaging`
    } else if (
      adminName &&
      tokenIssuers.length > 0 &&
      tokenIssuers.every((issuer) => issuer === adminName)
    ) {
      // Issuer controls both escrow and token - uses canonical messaging
      category = 'issuer-secured'
      bridgeType = 'canonical'
      categoryReason = `Escrow admin (${adminName}) is the same as token issuer, uses canonical messaging`
    } else {
      // Third party controls escrow - NOT using canonical messaging
      category = 'third-party-secured'
      bridgeType = 'external'
      categoryReason = `Escrow controlled by ${adminName || 'external party'} which differs from token issuers`
    }
  } else {
    // Fallback - should not reach here for known escrows
    category = 'third-party-secured'
    bridgeType = 'external'
    categoryReason = `Could not determine admin relationship`
  }

  return {
    address: escrowConfig.address,
    name: escrowConfig.name,
    category,
    bridgeType,
    categoryReason,
    admin,
    adminName,
    isRollupControlled: rollupControlled,
    tokens,
    totalValueUsd: tokens.reduce((sum, t) => sum + t.valueUsd, 0),
    source: escrowConfig.source,
    description: escrowConfig.description,
  }
}

async function fetchTvsBreakdown(projectId: string): Promise<TvsToken[]> {
  const url = `https://l2beat.com/api/scaling/tvs/${projectId}/breakdown`
  console.log(chalk.gray(`Fetching TVL data from ${url}...`))

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = (await response.json()) as TvsApiResponse
    return data.data || []
  } catch (error) {
    console.error(
      chalk.yellow(`Warning: Could not fetch TVL data: ${error}`),
    )
    return []
  }
}

// Load local TVS JSON config to get bridgedUsing data
function loadTvsConfig(projectId: string): Map<string, TvsJsonTokenConfig> {
  const configPath = join(__dirname, `../../src/tvs/json/${projectId}.json`)
  const tokenMap = new Map<string, TvsJsonTokenConfig>()

  try {
    const content = readFileSync(configPath, 'utf-8')
    const config = JSON.parse(content) as { tokens: TvsJsonTokenConfig[] }
    const tokens = config.tokens || []

    for (const token of tokens) {
      // Map by symbol (lowercase) for easy lookup
      tokenMap.set(token.symbol.toLowerCase(), token)
      // Also map by L2 address if available
      if (token.amount?.address) {
        tokenMap.set(token.amount.address.toLowerCase(), token)
      }
    }

    console.log(chalk.gray(`Loaded ${tokens.length} tokens from local TVS config`))
  } catch (error) {
    console.warn(chalk.yellow(`Could not load TVS config: ${error}`))
  }

  return tokenMap
}

// Get bridge protocol from local config
function getBridgeFromConfig(
  token: TvsToken,
  tvsConfig: Map<string, TvsJsonTokenConfig>
): string | null {
  // Try by symbol
  const bySymbol = tvsConfig.get(token.symbol.toLowerCase())
  if (bySymbol?.bridgedUsing?.bridges?.[0]?.name) {
    return bySymbol.bridgedUsing.bridges[0].name
  }

  // Try by address
  if (token.address?.address) {
    const byAddress = tvsConfig.get(token.address.address.toLowerCase())
    if (byAddress?.bridgedUsing?.bridges?.[0]?.name) {
      return byAddress.bridgedUsing.bridges[0].name
    }
  }

  return null
}

// Extract escrow addresses from a token formula recursively
function extractEscrowAddresses(formula: TvsTokenFormula): string[] {
  const addresses: string[] = []

  function extract(obj: unknown): void {
    if (!obj || typeof obj !== 'object') return

    const record = obj as Record<string, unknown>

    // Check if this is a balanceOfEscrow type
    if (record.type === 'balanceOfEscrow' && record.escrowAddress) {
      addresses.push((record.escrowAddress as string).toLowerCase())
    }

    // Check amount field
    if (record.amount && typeof record.amount === 'object') {
      extract(record.amount)
    }

    // Check arguments array
    if (Array.isArray(record.arguments)) {
      for (const arg of record.arguments) {
        extract(arg)
      }
    }
  }

  extract(formula)
  return addresses
}

function mapTvsToTokens(
  escrowAddress: string,
  tvsData: TvsToken[],
): TokenValue[] {
  // Normalize address for comparison
  const normalizedAddress = escrowAddress.replace('eth:', '').toLowerCase()

  const tokens: TokenValue[] = []

  for (const token of tvsData) {
    // Check if this token's formula references our escrow address
    const escrowAddresses = extractEscrowAddresses(token.formula)

    if (escrowAddresses.includes(normalizedAddress)) {
      tokens.push({
        symbol: token.symbol,
        valueUsd: token.value,
        amount: token.amount,
        issuer: TOKEN_ISSUERS[token.symbol] || null,
      })
    }
  }

  // Sort by value descending
  tokens.sort((a, b) => b.valueUsd - a.valueUsd)

  return tokens
}

function analyzeNativeToken(
  nativeToken: NativeTokenConfig,
  tvsData: TvsToken[],
): EscrowAnalysis | null {
  // Find matching tokens - may be multiple entries (e.g., native USDC vs bridged USDC.e)
  const matchingTokens = tvsData.filter(
    (t) => t.symbol === nativeToken.symbol && t.source === 'external',
  )

  // Find the one with totalSupply or calculation formula (not escrow-based)
  let tokenData = matchingTokens.find((t) => {
    const formula = t.formula
    // Direct totalSupply
    if (formula.type === 'totalSupply') return true
    // Calculation based on totalSupply (like native USDC)
    if (formula.type === 'calculation' && formula.arguments) {
      const hasSupplyArg = formula.arguments.some((arg) => {
        if (arg.type === 'value' && arg.amount?.type === 'totalSupply') return true
        return false
      })
      return hasSupplyArg
    }
    return false
  })

  // Fallback: just get the external source token with highest value
  if (!tokenData && matchingTokens.length > 0) {
    tokenData = matchingTokens.reduce((max, t) =>
      t.value > max.value ? t : max,
    )
  }

  if (!tokenData) return null

  // Native tokens (no L1 escrow) use external bridges, not canonical messaging
  // Even CCTP uses Circle's attestation service, not rollup fraud proofs
  const bridgeType: BridgeType = 'external'

  return {
    address: nativeToken.l2Address,
    name: nativeToken.name,
    category: nativeToken.category,
    bridgeType,
    categoryReason: nativeToken.categoryReason,
    admin: null,
    adminName: nativeToken.issuer,
    isRollupControlled: false,
    tokens: [
      {
        symbol: nativeToken.symbol,
        valueUsd: tokenData.value,
        amount: tokenData.amount,
        issuer: nativeToken.issuer,
      },
    ],
    totalValueUsd: tokenData.value,
    source: nativeToken.source,
    description: nativeToken.description,
    isNativeToken: true,
    bridgeProtocol: nativeToken.bridgeProtocol,
  }
}

// Map bridge names (from L2Beat config) to security info
// These are bridges that require third-party trust
const BRIDGE_SECURITY_INFO: Record<string, { category: SecurityCategory; trustedParties: TrustedParty[] }> = {
  'Layer Zero': {
    category: 'third-party-secured',
    trustedParties: LAYERZERO_TRUSTED_PARTIES,
  },
  'Wormhole NTT': {
    category: 'third-party-secured',
    trustedParties: [
      {
        name: 'Wormhole Guardian Network',
        role: 'Message Validator',
        powers: ['validate cross-chain messages', 'approve minting'],
        riskDescription: 'Guardians can approve fraudulent mints if 13/19 collude',
      },
    ],
  },
  'Chainlink CCIP': {
    category: 'third-party-secured',
    trustedParties: [
      {
        name: 'Chainlink Node Operators',
        role: 'Message Validator',
        powers: ['validate cross-chain messages', 'relay proofs'],
        riskDescription: 'Node operators control message validation',
      },
    ],
  },
  'Axelar': {
    category: 'third-party-secured',
    trustedParties: [
      {
        name: 'Axelar Validator Set',
        role: 'Message Validator',
        powers: ['validate cross-chain messages', 'approve minting'],
        riskDescription: 'Validators control message approval via threshold signature',
      },
    ],
  },
  'Stargate': {
    category: 'third-party-secured',
    trustedParties: LAYERZERO_TRUSTED_PARTIES,
  },
}

// Analyze ALL external tokens from the API (not just manually configured ones)
function analyzeAllExternalTokens(
  tvsData: TvsToken[],
  alreadyAnalyzedAddresses: Set<string>,
  tvsConfig: Map<string, TvsJsonTokenConfig>,
): ExternalTokenAnalysis[] {
  const externalTokens = tvsData.filter((t) => t.source === 'external')
  const results: ExternalTokenAnalysis[] = []

  for (const token of externalTokens) {
    const l2Address = token.address?.address?.toLowerCase() || ''

    // Skip if already analyzed as part of escrows or native tokens
    // Check various address formats
    const addressVariants = [
      l2Address,
      `arb1:${l2Address}`,
      `eth:${l2Address}`,
    ]
    const alreadyAnalyzed = addressVariants.some((addr) =>
      alreadyAnalyzedAddresses.has(addr.toLowerCase()),
    )

    // Skip tokens already handled by L1 escrows (balanceOfEscrow formula)
    const isEscrowBacked = token.formula.type === 'balanceOfEscrow'
    if (isEscrowBacked) continue

    // Skip if this symbol was already handled (like native USDC, USDT)
    const handledSymbols = ['USDC', 'USDT']
    if (handledSymbols.includes(token.symbol) && token.formula.type !== 'balanceOfEscrow') {
      // Check if it's already in the analyzed set
      if (alreadyAnalyzed) continue
    }

    // Skip very small values
    if (token.value < 100000) continue // Skip < $100k

    // First try: Get bridge from L2Beat's local config (most reliable)
    const bridgeFromConfig = getBridgeFromConfig(token, tvsConfig)

    // Second try: Look up known bridge protocol by address
    const knownProtocol = KNOWN_BRIDGE_PROTOCOLS[l2Address]

    let bridgeProtocol: string
    let issuer: string
    let category: SecurityCategory
    let categoryReason: string
    let trustedParties: TrustedParty[] | undefined

    if (bridgeFromConfig) {
      // Use L2Beat's config - this is the authoritative source
      bridgeProtocol = bridgeFromConfig
      issuer = EXTENDED_TOKEN_ISSUERS[token.symbol] || 'Unknown'

      // Look up security info for this bridge
      const bridgeInfo = BRIDGE_SECURITY_INFO[bridgeFromConfig]
      if (bridgeInfo) {
        category = bridgeInfo.category
        trustedParties = bridgeInfo.trustedParties
        const partyCount = trustedParties.length
        categoryReason = `Token bridged via ${bridgeProtocol}. ${partyCount} parties with privileged functions that can put tokens at risk.`
      } else {
        // Bridge name found but not in our security mapping - treat as third-party
        category = 'third-party-secured'
        categoryReason = `Token bridged via ${bridgeProtocol}. Trust model not fully analyzed.`
        trustedParties = [
          {
            name: `${bridgeProtocol} Operator`,
            role: 'Bridge Controller',
            powers: ['validate messages', 'mint tokens'],
            riskDescription: `${bridgeProtocol} controls message validation and token minting`,
          },
        ]
      }
    } else if (knownProtocol) {
      // Fall back to manually curated mapping
      bridgeProtocol = knownProtocol.protocol
      issuer = knownProtocol.issuer
      category = knownProtocol.category
      trustedParties = knownProtocol.trustedParties
      const partyCount = trustedParties?.length || 0
      categoryReason =
        category === 'issuer-secured'
          ? `Token controlled by ${issuer} via ${bridgeProtocol}. Issuer controls all privileged functions.`
          : `Token bridged via ${bridgeProtocol}. ${partyCount} parties with privileged functions that can put tokens at risk.`
    } else {
      // Unknown protocol - try to infer from name
      issuer = EXTENDED_TOKEN_ISSUERS[token.symbol] || 'Unknown'
      bridgeProtocol = inferBridgeProtocol(token)
      // IMPORTANT: Unknown bridges should ALWAYS be third-party-secured
      category = 'third-party-secured'
      categoryReason = `Unknown bridge protocol (${bridgeProtocol}). Trust model not verified.`
      trustedParties = [
        {
          name: 'Unknown Bridge Operator',
          role: 'Bridge Controller',
          powers: ['mint tokens', 'potentially upgrade contracts', 'unknown other powers'],
          riskDescription: 'Bridge trust model not researched - unknown parties may control privileged functions',
        },
      ]
    }

    results.push({
      symbol: token.symbol,
      name: token.name,
      l2Address,
      valueUsd: token.value,
      amount: token.amount,
      bridgeProtocol,
      issuer,
      category,
      categoryReason,
      formulaType: token.formula.type,
      trustedParties,
    })
  }

  // Sort by value descending
  results.sort((a, b) => b.valueUsd - a.valueUsd)

  return results
}

function inferBridgeProtocol(token: TvsToken): string {
  // Try to infer bridge protocol from formula or name
  const formula = token.formula
  const name = token.name.toLowerCase()
  const symbol = token.symbol.toLowerCase()

  if (formula.type === 'totalSupply') {
    // Common patterns in token names
    if (name.includes('layer') || name.includes('layerzero')) return 'Layer Zero (Inferred)'
    if (name.includes('wormhole')) return 'Wormhole (Inferred)'
    if (name.includes('axelar')) return 'Axelar (Inferred)'
    if (name.includes('ccip')) return 'Chainlink CCIP (Inferred)'
    if (name.includes('cctp')) return 'Circle CCTP (Inferred)'
    if (name.includes('stargate')) return 'Stargate (Inferred)'

    // Return a more descriptive unknown
    return 'Unknown Bridge (Needs Research)'
  }

  if (formula.type === 'calculation') {
    return 'Native/Calculated Supply'
  }

  return 'Unknown Bridge (Needs Research)'
}

function formatUsd(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

function getCategoryIcon(category: SecurityCategory): string {
  switch (category) {
    case 'rollup-secured':
      return chalk.green('✓')
    case 'issuer-secured':
      return chalk.yellow('⚡')
    case 'third-party-secured':
      return chalk.red('⚠')
  }
}

function getCategoryLabel(category: SecurityCategory): string {
  switch (category) {
    case 'rollup-secured':
      return chalk.green('ROLLUP-SECURED')
    case 'issuer-secured':
      return chalk.yellow('ISSUER-SECURED')
    case 'third-party-secured':
      return chalk.red('THIRD-PARTY-SECURED')
  }
}

function printReport(report: EscrowReport): void {
  const width = 75
  const line = '─'.repeat(width)
  const doubleLine = '═'.repeat(width)

  console.log('')
  console.log(chalk.bold(`┌${doubleLine}┐`))
  console.log(
    chalk.bold(
      `│ ${report.projectId.toUpperCase()} ESCROW ANALYSIS`.padEnd(width) + '│',
    ),
  )
  console.log(chalk.bold(`├${line}┤`))

  // Separate L1 escrows and native tokens
  const l1Escrows = report.escrows.filter((e) => !e.isNativeToken)
  const nativeTokens = report.escrows.filter((e) => e.isNativeToken)

  // Print L1 Escrows
  if (l1Escrows.length > 0) {
    console.log('')
    console.log(
      chalk.bold(`│ ${'═'.repeat(width - 2)}│`),
    )
    console.log(
      chalk.bold(`│ L1 ESCROWS (Traditional Bridge)`.padEnd(width + 1) + '│'),
    )
  }

  for (let i = 0; i < l1Escrows.length; i++) {
    const escrow = l1Escrows[i]

    console.log('')
    console.log(
      chalk.bold(`│ [ESCROW ${i + 1}] ${escrow.name}`.padEnd(width + 1) + '│'),
    )
    console.log(
      `│ Address: ${escrow.address.replace('eth:', '')}`.padEnd(width + 1) +
        '│',
    )
    console.log(
      `│ TVL: ${chalk.bold(formatUsd(escrow.totalValueUsd))}`.padEnd(
        width + 10,
      ) + '│',
    )

    const adminDisplay = escrow.adminName || escrow.admin || 'Unknown'
    console.log(`│ Admin: ${adminDisplay}`.padEnd(width + 1) + '│')
    console.log(
      `│ Category: ${getCategoryIcon(escrow.category)} ${getCategoryLabel(escrow.category)}`.padEnd(
        width + 20,
      ) + '│',
    )
    console.log(`│ Reason: ${escrow.categoryReason}`.padEnd(width + 1) + '│')

    if (escrow.tokens.length > 0) {
      console.log(`│ ${'─'.repeat(width - 2)}│`)
      console.log(`│ Tokens:`.padEnd(width + 1) + '│')

      // Show top 5 tokens by value
      const topTokens = escrow.tokens.slice(0, 5)
      for (const token of topTokens) {
        const issuerInfo = token.issuer ? ` (issuer: ${token.issuer})` : ''
        console.log(
          `│   - ${token.symbol}: ${formatUsd(token.valueUsd)}${issuerInfo}`.padEnd(
            width + 1,
          ) + '│',
        )
      }
      if (escrow.tokens.length > 5) {
        console.log(
          `│   ... and ${escrow.tokens.length - 5} more tokens`.padEnd(
            width + 1,
          ) + '│',
        )
      }
    }
  }

  // Print Native Tokens
  if (nativeTokens.length > 0) {
    console.log('')
    console.log(
      chalk.bold(`│ ${'═'.repeat(width - 2)}│`),
    )
    console.log(
      chalk.bold(`│ NATIVE TOKENS (No L1 Escrow)`.padEnd(width + 1) + '│'),
    )

    for (let i = 0; i < nativeTokens.length; i++) {
      const token = nativeTokens[i]

      console.log('')
      console.log(
        chalk.bold(chalk.cyan(`│ [NATIVE ${i + 1}] ${token.name}`.padEnd(width + 1) + '│')),
      )
      console.log(
        `│ L2 Address: ${token.address.replace('arb1:', '')}`.padEnd(width + 1) +
          '│',
      )
      console.log(
        `│ TVL: ${chalk.bold(formatUsd(token.totalValueUsd))}`.padEnd(
          width + 10,
        ) + '│',
      )
      console.log(`│ Issuer: ${token.adminName}`.padEnd(width + 1) + '│')
      console.log(`│ Bridge: ${token.bridgeProtocol}`.padEnd(width + 1) + '│')
      console.log(
        `│ Category: ${getCategoryIcon(token.category)} ${getCategoryLabel(token.category)}`.padEnd(
          width + 20,
        ) + '│',
      )
      console.log(`│ Reason: ${token.categoryReason}`.padEnd(width + 1) + '│')
    }
  }

  // External Tokens Section (non-escrow-backed)
  if (report.externalTokens && report.externalTokens.length > 0) {
    console.log('')
    console.log(
      chalk.bold(`│ ${'═'.repeat(width - 2)}│`),
    )
    console.log(
      chalk.bold(chalk.magenta(`│ OTHER EXTERNAL TOKENS (No L1 Escrow)`.padEnd(width + 1) + '│')),
    )
    console.log(
      `│ ${chalk.gray(`These tokens are minted on L2 via external bridges`)}`.padEnd(width + 10) + '│',
    )

    // Group by bridge protocol for display
    const byProtocol = new Map<string, ExternalTokenAnalysis[]>()
    for (const token of report.externalTokens) {
      const protocol = token.bridgeProtocol
      if (!byProtocol.has(protocol)) {
        byProtocol.set(protocol, [])
      }
      byProtocol.get(protocol)!.push(token)
    }

    // Sort protocols by total value
    const sortedProtocols = Array.from(byProtocol.entries())
      .map(([protocol, tokens]) => ({
        protocol,
        tokens,
        totalValue: tokens.reduce((sum, t) => sum + t.valueUsd, 0),
      }))
      .sort((a, b) => b.totalValue - a.totalValue)

    for (const { protocol, tokens, totalValue } of sortedProtocols) {
      console.log('')
      console.log(
        `│ ${chalk.cyan(`[${protocol}]`)} - ${formatUsd(totalValue)}`.padEnd(width + 10) + '│',
      )

      // Show top tokens for this protocol
      const topTokens = tokens.slice(0, 3)
      for (const token of topTokens) {
        const categoryIcon = getCategoryIcon(token.category)
        console.log(
          `│   ${categoryIcon} ${token.symbol}: ${formatUsd(token.valueUsd)} (${token.issuer})`.padEnd(
            width + 10,
          ) + '│',
        )
      }
      if (tokens.length > 3) {
        const remaining = tokens.length - 3
        const remainingValue = tokens.slice(3).reduce((sum, t) => sum + t.valueUsd, 0)
        console.log(
          `│   ${chalk.gray(`... +${remaining} more (${formatUsd(remainingValue)})`)}`.padEnd(
            width + 10,
          ) + '│',
        )
      }
    }

    // External tokens summary
    console.log('')
    console.log(`│ ${'─'.repeat(width - 2)}│`)
    console.log(
      chalk.bold(`│ External Tokens Summary`.padEnd(width + 1) + '│'),
    )
    console.log(
      `│ Total: ${report.externalTokensSummary.totalCount} tokens, ${formatUsd(report.externalTokensSummary.totalValue)}`.padEnd(
        width + 1,
      ) + '│',
    )

    const extIssuerSecured = report.externalTokensSummary.byCategory['issuer-secured'] || { count: 0, value: 0 }
    const extThirdParty = report.externalTokensSummary.byCategory['third-party-secured'] || { count: 0, value: 0 }

    console.log(
      `│   ${chalk.yellow('Issuer-Secured:')}  ${extIssuerSecured.count} tokens, ${formatUsd(extIssuerSecured.value)}`.padEnd(
        width + 10,
      ) + '│',
    )
    console.log(
      `│   ${chalk.red('Third-Party:')}     ${extThirdParty.count} tokens, ${formatUsd(extThirdParty.value)}`.padEnd(
        width + 10,
      ) + '│',
    )
  }

  // Summary
  console.log('')
  console.log(`├${line}┤`)
  console.log(chalk.bold(`│ OVERALL SUMMARY`.padEnd(width + 1) + '│'))
  console.log(
    `│ Total TVL: ${chalk.bold(formatUsd(report.summary.totalTvl))}`.padEnd(
      width + 10,
    ) + '│',
  )

  const canonicalPct =
    report.summary.totalTvl > 0
      ? ((report.summary.canonicalTvl / report.summary.totalTvl) * 100).toFixed(1)
      : '0'
  const externalPct =
    report.summary.totalTvl > 0
      ? ((report.summary.externalTvl / report.summary.totalTvl) * 100).toFixed(1)
      : '0'

  console.log('')
  console.log(chalk.bold(`│ By Bridge Type (Security Model):`.padEnd(width + 1) + '│'))
  console.log(
    `│   ${chalk.green('Canonical:')}     ${formatUsd(report.summary.canonicalTvl).padStart(10)}  (${canonicalPct}%)`.padEnd(
      width + 20,
    ) + '│',
  )
  console.log(
    chalk.gray(`│     └─ Uses rollup fraud/validity proofs for withdrawals`.padEnd(width + 1) + '│'),
  )
  console.log(
    `│   ${chalk.yellow('External:')}      ${formatUsd(report.summary.externalTvl).padStart(10)}  (${externalPct}%)`.padEnd(
      width + 20,
    ) + '│',
  )
  console.log(
    chalk.gray(`│     └─ Uses external validation (CCTP, LayerZero, etc.)`.padEnd(width + 1) + '│'),
  )

  // Escrow admin breakdown
  console.log('')
  console.log(chalk.bold(`│ By Escrow Admin (for reference):`.padEnd(width + 1) + '│'))
  const { byAdmin } = report.summary
  console.log(
    `│   ${chalk.green('Rollup-controlled:')}  ${formatUsd(byAdmin.rollupControlled).padStart(10)}`.padEnd(
      width + 10,
    ) + '│',
  )
  console.log(
    `│   ${chalk.cyan('Issuer-controlled:')}  ${formatUsd(byAdmin.issuerControlled).padStart(10)}`.padEnd(
      width + 10,
    ) + '│',
  )
  console.log(
    `│   ${chalk.red('Third-party:')}        ${formatUsd(byAdmin.thirdPartyControlled).padStart(10)}`.padEnd(
      width + 10,
    ) + '│',
  )

  console.log(`└${doubleLine}┘`)
  console.log('')
}

async function main(): Promise<void> {
  const projectId = process.argv[2] || 'arbitrum'

  console.log(chalk.bold(`\nAnalyzing escrows for ${projectId}...\n`))

  // Load discovery data
  const discovery = loadDiscovery(projectId)
  console.log(
    chalk.gray(`Loaded discovery with ${discovery.entries.length} entries`),
  )

  // Fetch TVL data
  const tvsData = await fetchTvsBreakdown(projectId)
  console.log(
    chalk.gray(
      `Found ${tvsData.length} tokens in TVL data`,
    ),
  )

  // Load local TVS config for bridgedUsing data
  const tvsConfig = loadTvsConfig(projectId)

  // Analyze each L1 escrow
  const escrows: EscrowAnalysis[] = []

  console.log(chalk.bold('\n--- L1 Escrows (Traditional Bridge) ---'))
  for (const escrowConfig of ARBITRUM_ESCROWS) {
    const entry = findEntryByAddress(discovery, escrowConfig.address)
    const tokens = mapTvsToTokens(escrowConfig.address, tvsData)
    const analysis = classifyEscrow(escrowConfig, entry, discovery, tokens)
    escrows.push(analysis)
  }

  // Analyze native tokens (no L1 escrow)
  console.log(chalk.bold('\n--- Native Tokens (No L1 Escrow) ---'))
  for (const nativeToken of ARBITRUM_NATIVE_TOKENS) {
    const analysis = analyzeNativeToken(nativeToken, tvsData)
    if (analysis) {
      console.log(
        chalk.gray(
          `  Found ${nativeToken.symbol}: ${formatUsd(analysis.totalValueUsd)} via ${nativeToken.bridgeProtocol}`,
        ),
      )
      escrows.push(analysis)
    } else {
      console.log(chalk.yellow(`  Warning: Could not find data for ${nativeToken.symbol}`))
    }
  }

  // Collect already analyzed addresses
  const analyzedAddresses = new Set<string>()
  for (const escrow of escrows) {
    analyzedAddresses.add(escrow.address.toLowerCase())
  }
  for (const nativeToken of ARBITRUM_NATIVE_TOKENS) {
    analyzedAddresses.add(nativeToken.l2Address.toLowerCase())
    analyzedAddresses.add(nativeToken.l2Address.replace('arb1:', '').toLowerCase())
  }

  // Analyze ALL external tokens from the API
  console.log(chalk.bold('\n--- Other External Tokens ---'))
  const externalTokens = analyzeAllExternalTokens(tvsData, analyzedAddresses, tvsConfig)
  console.log(chalk.gray(`  Found ${externalTokens.length} additional external tokens`))

  // Build external tokens summary
  const externalTokensSummary = {
    totalCount: externalTokens.length,
    totalValue: externalTokens.reduce((sum, t) => sum + t.valueUsd, 0),
    byProtocol: {} as Record<string, { count: number; value: number }>,
    byCategory: {} as Record<SecurityCategory, { count: number; value: number }>,
  }

  for (const token of externalTokens) {
    // By protocol
    if (!externalTokensSummary.byProtocol[token.bridgeProtocol]) {
      externalTokensSummary.byProtocol[token.bridgeProtocol] = { count: 0, value: 0 }
    }
    externalTokensSummary.byProtocol[token.bridgeProtocol].count++
    externalTokensSummary.byProtocol[token.bridgeProtocol].value += token.valueUsd

    // By category
    if (!externalTokensSummary.byCategory[token.category]) {
      externalTokensSummary.byCategory[token.category] = { count: 0, value: 0 }
    }
    externalTokensSummary.byCategory[token.category].count++
    externalTokensSummary.byCategory[token.category].value += token.valueUsd
  }

  // Calculate summary by bridge type (canonical vs external messaging)
  //
  // CANONICAL: Uses rollup's fraud/validity proofs for withdrawal security
  //   - Standard gateways (rollup-controlled)
  //   - Issuer escrows using canonical messaging (DAI, wstETH, LPT)
  //
  // EXTERNAL: Uses external validation (attestation services, DVNs, etc.)
  //   - Native tokens with no L1 escrow (USDC via CCTP, USDT0 via LayerZero)
  //   - Auto-discovered external tokens

  // From L2Beat API: source="canonical" is the standard rollup TVL
  const apiCanonicalTvl = tvsData
    .filter((t) => t.source === 'canonical')
    .reduce((sum, t) => sum + t.value, 0)

  // Issuer-secured escrows that use canonical messaging (not native tokens)
  const issuerCanonicalEscrows = escrows.filter(
    (e) => e.category === 'issuer-secured' && e.bridgeType === 'canonical' && !e.isNativeToken
  )
  const issuerCanonicalTvl = issuerCanonicalEscrows.reduce((sum, e) => sum + e.totalValueUsd, 0)

  // Total canonical = API canonical + issuer escrows using canonical messaging
  const canonicalTvl = apiCanonicalTvl + issuerCanonicalTvl

  // Native tokens (no L1 escrow) - all use external bridges
  const nativeTokenEscrows = escrows.filter((e) => e.isNativeToken)
  const nativeTokenTvl = nativeTokenEscrows.reduce((sum, e) => sum + e.totalValueUsd, 0)

  // Auto-discovered external tokens
  const autoExternalTvl = externalTokens.reduce((sum, t) => sum + t.valueUsd, 0)

  // Total external = native tokens + auto-discovered external tokens
  const externalTvl = nativeTokenTvl + autoExternalTvl

  const totalTvl = canonicalTvl + externalTvl

  // Also track by admin for transparency
  const byAdmin = {
    rollupControlled: apiCanonicalTvl,
    issuerControlled: issuerCanonicalTvl +
      nativeTokenEscrows.filter(e => e.category === 'issuer-secured').reduce((sum, e) => sum + e.totalValueUsd, 0) +
      externalTokens.filter(t => t.category === 'issuer-secured').reduce((sum, t) => sum + t.valueUsd, 0),
    thirdPartyControlled:
      nativeTokenEscrows.filter(e => e.category === 'third-party-secured').reduce((sum, e) => sum + e.totalValueUsd, 0) +
      externalTokens.filter(t => t.category === 'third-party-secured').reduce((sum, t) => sum + t.valueUsd, 0),
  }

  const summary = {
    totalTvl,
    canonicalTvl,
    externalTvl,
    byAdmin,
  }

  const report: EscrowReport = {
    projectId,
    timestamp: Date.now(),
    escrows,
    externalTokens,
    summary,
    externalTokensSummary,
  }

  // Print report
  printReport(report)

  // Save JSON output
  const outputPath = join(__dirname, `${projectId}-escrow-analysis.json`)
  writeFileSync(outputPath, JSON.stringify(report, null, 2))
  console.log(chalk.gray(`JSON report saved to ${outputPath}`))
}

main().catch((error) => {
  console.error(chalk.red('Error:'), error)
  process.exit(1)
})
