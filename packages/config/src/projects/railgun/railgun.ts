import {
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import {
  getTokenByAddress,
  getTokenBySymbol,
} from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('railgun')

const RAILGUN_DEPOSIT_EVENT =
  '0x3a5b9dc26075a3801a6ddccf95fec485bb7500a91b44cec1add984c21ee6db3b'
const RAILGUN_WITHDRAWAL_EVENT =
  '0xd93cf895c7d5b2cd7dc7a098b678b3089f37d91f48d9b83a0800a91cbdf05284'

const TRACKED_TOKENS = [
  { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH' },
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC' },
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI' },
  { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC' },
  { address: '0x85F17Cf997934a597031b2E18a9aB6ebD4B9f6a4', symbol: 'NEAR' },
  { address: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb', symbol: 'FLUID' },
  { address: '0xe76C6c83af64e4C60245D8C7dE953DF673a7A33D', symbol: 'RAIL' },
]

const RAIL_TOKEN = getTokenBySymbol('RAIL')

const railgunCore = discovery.getContract('RailgunSmartWallet')
const shieldFee = discovery.getContractValue<number>(
  'RailgunSmartWallet',
  'shieldFee',
)
const unshieldFee = discovery.getContractValue<number>(
  'RailgunSmartWallet',
  'unshieldFee',
)
const nftFee = discovery.getContractValue<number>(
  'RailgunSmartWallet',
  'nftFee',
)
const stakeLocktime = discovery.getContractValue<number>(
  'Staking',
  'STAKE_LOCKTIME',
)
const proposalSponsorThreshold = discovery.getContractValueBigInt(
  'Voting',
  'PROPOSAL_SPONSOR_THRESHOLD',
)
const sponsorWindow = discovery.getContractValue<number>(
  'Voting',
  'SPONSOR_WINDOW',
)
const votingStartOffset = discovery.getContractValue<number>(
  'Voting',
  'VOTING_START_OFFSET',
)
const votingYayEndOffset = discovery.getContractValue<number>(
  'Voting',
  'VOTING_YAY_END_OFFSET',
)
const votingNayEndOffset = discovery.getContractValue<number>(
  'Voting',
  'VOTING_NAY_END_OFFSET',
)
const executionStartOffset = discovery.getContractValue<number>(
  'Voting',
  'EXECUTION_START_OFFSET',
)
const executionEndOffset = discovery.getContractValue<number>(
  'Voting',
  'EXECUTION_END_OFFSET',
)
const quorum = discovery.getContractValueBigInt('Voting', 'QUORUM')
const RAILGUN_SINCE_TIMESTAMP = UnixTime(railgunCore.sinceTimestamp ?? 0)

function formatBasisPoints(value: number): string {
  return `${Number((value / 100).toFixed(4))}%`
}

const privacyTokens: ProjectPrivacyToken[] = TRACKED_TOKENS.map((token) => {
  const resolved = getTokenByAddress(token.address)

  return {
    token: {
      address: EthereumAddress(token.address),
      iconUrl: resolved.iconUrl,
      symbol: resolved.symbol,
      decimals: resolved.decimals,
      priceId: resolved.coingeckoId,
      sinceTimestamp: resolved.coingeckoListingTimestamp,
    },
    buckets: [
      {
        id: `railgun-${resolved.symbol}`,
        type: 'pool',
        label: resolved.symbol,
        address: railgunCore.address,
        sinceTimestamp: Math.max(
          railgunCore.sinceTimestamp ?? 0,
          resolved.coingeckoListingTimestamp,
        ),
        deposit: {
          event: RAILGUN_DEPOSIT_EVENT,
          extractor: 'railgunShield',
          params: {
            tokenAddress: EthereumAddress(token.address),
          },
        },
        withdrawal: {
          event: RAILGUN_WITHDRAWAL_EVENT,
          extractor: 'railgunUnshield',
          params: {
            tokenAddress: EthereumAddress(token.address),
          },
        },
      },
    ],
  }
})

export const railgun: BaseProject = {
  id: ProjectId('railgun'),
  slug: 'railgun',
  name: 'Railgun',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'An onchain privacy system for Ethereum based on encrypted UTXO-style private balances and zk-proven DeFi interactions.',
    detailedDescription: readProjectMarkdown('railgun', 'detailedDescription', {
      shieldFee: formatBasisPoints(shieldFee),
      unshieldFee: formatBasisPoints(unshieldFee),
      nftFee,
    }),
    links: {
      websites: ['https://railgun.org'],
    },
    badges: [],
  },
  escrows: TRACKED_TOKENS.map((token) => ({
    address: ChainSpecificAddress.address(railgunCore.address),
    chain: ChainSpecificAddress.longChain(railgunCore.address),
    sinceTimestamp: railgunCore.sinceTimestamp ?? 0,
    tokens: [token.symbol],
  })),
  tvsInfo: {
    associatedTokens: [{ symbol: RAIL_TOKEN.symbol, icon: RAIL_TOKEN.iconUrl }],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: 'Railgun',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.Railgun,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('railgun'),
        sinceTimestamp: RAILGUN_SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Railgun 91 circuit verifier 03.07.2026',
        name: 'Railgun verifier',
        sourceLink:
          'https://github.com/Railgun-Privacy/circuits-v2/tree/0aa2d13763a9fcfbb7b7ea9c02e004e71f1394bb/src/library',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'railgun',
          'verificationSteps-03.07.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    tokens: privacyTokens,
    exitWindow: {
      value: formatSeconds(executionStartOffset),
      sentiment: 'warning',
      orderHint: executionStartOffset,
      description: `DAO-approved upgrades wait ${formatSeconds(executionStartOffset)} before they can execute, giving users time to unshield funds if they do not approve the change.`,
      walkawayTest: { passed: true },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The contracts, circuits, and supporting software needed to participate in the protocol are publicly available and can be run locally.',
    },
    privacy: {
      value: 'Optional compliance',
      sentiment: 'good',
      description:
        'Compliance is optional at the core protocol level: users can create proofs of innocence to disassociate deposits from flagged addresses, and relayers can choose to require them.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    riskSummary: readProjectMarkdown('railgun', 'riskSummary'),
    upgradesAndGovernance: readProjectMarkdown(
      'railgun',
      'upgradesAndGovernance',
      {
        stakeLocktime: formatSeconds(stakeLocktime),
        sponsorWindow: formatSeconds(sponsorWindow),
        proposalSponsorThreshold: formatLargeNumber(
          Number(proposalSponsorThreshold / 10n ** 18n),
        ),
        votingStartOffset: formatSeconds(votingStartOffset),
        votingYayEndOffset: formatSeconds(votingYayEndOffset),
        votingNayEndOffset: formatSeconds(votingNayEndOffset),
        quorum: formatLargeNumber(Number(quorum / 10n ** 18n)),
        executionStartOffset: formatSeconds(executionStartOffset),
        executionEndOffset: formatSeconds(executionEndOffset),
      },
    ),
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
