import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import {
  DaEconomicSecurityRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
  RISK_VIEW,
  UPGRADE_MECHANISM,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { DAC } from '../../templates/dac-template'
import {
  getNitroGovernance,
  orbitStackL2,
  WASMVM_OTHER_CONSIDERATIONS,
} from '../../templates/orbitStack'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('nova')
const discovery_arbitrum = new ProjectDiscovery('arbitrum') // needed for governance section

const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'validatorAfkBlocks',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const challengeWindowSeconds = challengeWindow * assumedBlockTime
const challengeGracePeriodSeconds =
  discovery.getContractValue<number>(
    'RollupProxy',
    'challengeGracePeriodBlocks',
  ) * assumedBlockTime

const l1TimelockDelay = discovery.getContractValue<number>(
  'L1Timelock',
  'getMinDelay',
)
const l2TimelockDelay = discovery_arbitrum.getContractValue<number>(
  'L2Timelock',
  'getMinDelay',
)
const totalDelay = l1TimelockDelay + challengeWindowSeconds + l2TimelockDelay

const dac = discovery.getContractValue<{
  membersCount: number
  requiredSignatures: number
}>('SequencerInbox', 'dacKeyset')
const { membersCount, requiredSignatures } = dac

const upgradeExecutorUpgradeability = {
  upgradableBy: [
    { name: 'SecurityCouncil', delay: 'no' },
    { name: 'L1Timelock', delay: formatSeconds(totalDelay) },
  ],
  upgradeConsiderations:
    'An upgrade initiated by the DAO can be vetoed by the Security Council.',
}

const treasuryTimelockDelay = discovery_arbitrum.getContractValue<number>(
  'TreasuryTimelock',
  'getMinDelay',
)

const l2CoreQuorumPercent =
  (discovery_arbitrum.getContractValue<number>(
    'CoreGovernor',
    'quorumNumerator',
  ) /
    discovery_arbitrum.getContractValue<number>(
      'CoreGovernor',
      'quorumDenominator',
    )) *
  100
const l2TreasuryQuorumPercent =
  (discovery_arbitrum.getContractValue<number>(
    'TreasuryGovernor',
    'quorumNumerator',
  ) /
    discovery_arbitrum.getContractValue<number>(
      'TreasuryGovernor',
      'quorumDenominator',
    )) *
  100

const maxTimeVariation = discovery.getContractValue<{
  delayBlocks: number
  futureBlocks: number
  delaySeconds: number
  futureSeconds: number
}>('SequencerInbox', 'maxTimeVariation')

const selfSequencingDelay = maxTimeVariation.delaySeconds

const isPostBoLD = discovery.getContractValue<boolean>(
  'RollupProxy',
  'isPostBoLD',
)

const chainId = 42170

export const nova: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1660003200), // 2022-08-09T00:00:00Z
  additionalBadges: [
    BADGES.VM.WasmVM,
    BADGES.Stack.Nitro,
    BADGES.Other.Governance,
  ],
  discovery,
  hasAtLeastFiveExternalChallengers: true,
  usersHave7DaysToExit: true,
  hasProperSecurityCouncil: true,
  associatedTokens: ['ARB'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  isNodeAvailable: true,
  nodeSourceLink: 'https://github.com/OffchainLabs/nitro',
  stage1Principle: false,
  daAttestedByIndependentParty: true,
  daVerifierSecureOnL1: true,
  daVerifier7DayExitWindow: true,
  daCommitteeDecentralized: true,
  daVerifier30DayExitWindow: false,
  daMechanismEconomicSecurity: false,
  securityCouncilReference:
    'https://docs.arbitrum.foundation/security-council-members',
  stage1PrincipleDescription:
    'The Security Council is properly set up (9/12), but BoLD fraud proof submission on Nova is restricted to a whitelist of 10 validators (validatorWhitelistDisabled = false on the RollupProxy). The whitelisted validators colluding to push a malicious assertion without external challenge is a residual attack path beyond Security Council compromise or sequencer+DAC collusion.',
  display: {
    name: 'Arbitrum Nova',
    slug: 'nova',
    headerWarning:
      'The Arbitrum DAO voted to minimize Arbitrum Nova and transition it to maintenance state. Developers and users are encouraged to migrate to Arbitrum One. See the [Minimizing Arbitrum Nova FAQs](https://forum.arbitrum.foundation/t/minimizing-arbitrum-nova-faqs/30955) for details.',
    description:
      'Arbitrum Nova is an AnyTrust Optimium, differing from Arbitrum One by not posting transaction data onchain.',
    links: {
      websites: [
        'https://nova.arbitrum.io/',
        'https://arbitrum.io/',
        'https://arbitrum.foundation/',
      ],
      bridges: [
        'https://bridge.arbitrum.io/?destinationChain=arbitrum-nova&sourceChain=ethereum',
      ],
      documentation: [
        'https://developer.arbitrum.io/',
        'https://developer.arbitrum.io/inside-arbitrum-nitro/#inside-anytrust',
      ],
      explorers: ['https://nova.arbiscan.io/'],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/nitro',
      ],
      socialMedia: [
        'https://twitter.com/arbitrum',
        'https://arbitrumfoundation.medium.com/',
        'https://discord.gg/Arbitrum',
      ],
      other: ['https://growthepie.com/chains/arbitrum-nova'],
    },
  },
  chainConfig: {
    name: 'nova',
    chainId,
    explorerUrl: 'https://nova.arbiscan.io',
    sinceTimestamp: UnixTime(1656122488),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1746963,
        version: '3',
      },
    ],
    coingeckoPlatform: 'arbitrum-nova',
    apis: [
      {
        type: 'rpc',
        url: 'https://nova.arbitrum.io/rpc',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://arbitrum-nova.blockscout.com/api',
      },
    ],
  },
  nonTemplateProofSystem: {
    type: 'Optimistic',
    name: 'BoLD',
    challengeProtocol: 'Interactive',
  },
  upgradesAndGovernance: {
    content: getNitroGovernance(
      l2CoreQuorumPercent,
      l2TimelockDelay,
      challengeWindowSeconds,
      l1TimelockDelay,
      treasuryTimelockDelay,
      l2TreasuryQuorumPercent,
      challengeGracePeriodSeconds,
    ),
  },
  nonTemplateRiskView: {
    exitWindow: RISK_VIEW.EXIT_WINDOW_NITRO(
      l2TimelockDelay,
      selfSequencingDelay,
      challengeWindowSeconds,
      validatorAfkTime,
      l1TimelockDelay,
      isPostBoLD,
    ),
    stateValidation: {
      ...RISK_VIEW.STATE_ARBITRUM_PERMISSIONED_FRAUD_PROOFS(
        discovery.getContractValue<string[]>('RollupProxy', 'getValidators')
          .length,
        true,
        challengeWindowSeconds,
        challengeGracePeriodSeconds,
        'if-challenged',
      ),
      initialBond: {
        value: formatEther(
          discovery.getContractValue<number>('RollupProxy', 'baseStake'),
        ),
      },
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xA2e996f0cb33575FA0E36e8f62fCd4a9b897aAd3',
      ),
      sinceTimestamp: UnixTime(1659620187),
      tokens: ['DAI'],
      description:
        'DAI Vault for custom DAI Gateway. Fully controlled by MakerDAO governance.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xB2535b988dcE19f9D71dfB22dB6da744aCac21bf',
      ),
      sinceTimestamp: UnixTime(1656305583),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, “wrapped” token will be minted.',
      ...upgradeExecutorUpgradeability,
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x23122da8C581AA7E0d07A36Ff1f16F799650232f',
      ),
      sinceTimestamp: UnixTime(1659620187),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting a custom token on the L2.',
      ...upgradeExecutorUpgradeability,
    }),
  ],
  nonTemplateTechnology: {
    otherConsiderations: [
      ...WASMVM_OTHER_CONSIDERATIONS,
      UPGRADE_MECHANISM.ARBITRUM_DAO(
        l1TimelockDelay,
        challengeWindow * assumedBlockTime,
        l2TimelockDelay,
        challengeGracePeriodSeconds,
      ),
    ],
  },
  milestones: [
    {
      title: 'Bold deployed with a whitelist',
      url: 'https://x.com/arbitrum/status/1889710151332245837',
      date: '2025-02-15T00:00:00Z',
      type: 'general',
    },
    {
      title: 'ArbOS 32 Emergency upgrade',
      url: 'https://github.com/OffchainLabs/nitro/releases/tag/v3.2.0',
      date: '2024-09-25T00:00:00Z',
      description:
        'SecurityCouncil emergency upgrades to fix attack vectors related to Stylus resource pricing.',
      type: 'incident',
    },
    {
      title: 'ArbOS 31 Bianca upgrade',
      url: 'https://www.tally.xyz/gov/arbitrum/proposal/108288822474129076868455956066667369439381709547570289793612729242368710728616',
      date: '2024-09-03T00:00:00Z',
      description:
        'Nova upgrades to ArbOS 31 activating Stylus (new languages for smart contracts).',
      type: 'general',
    },
    {
      title: 'Arbitrum Nova Public Mainnet launch',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
      date: '2022-08-09T00:00:00Z',
      url: 'https://medium.com/offchainlabs/its-time-for-a-new-dawn-nova-is-open-to-the-public-a081df1e4ad2',
      type: 'general',
    },
  ],
  customDa: DAC({
    technology: {
      description: readProjectMarkdown('nova', 'customDaTechnology'),
    },
    dac: {
      requiredMembers: requiredSignatures,
      membersCount: membersCount,
      knownMembers: [
        {
          external: true,
          name: 'ConsenSys Software Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'QuickNode, Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'P2P.org',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'Google Cloud',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: false,
          name: 'Offchain Labs, Inc.',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
        {
          external: true,
          name: 'Opensea Innovation Labs Private Limited',
          href: 'https://docs.arbitrum.foundation/state-of-progressive-decentralization#data-availability-committee-members',
        },
      ],
    },
    risks: {
      upgradeability: DaUpgradeabilityRisk.SecurityCouncil(totalDelay),
      economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
      relayerFailure: DaRelayerFailureRisk.Governance(totalDelay),
    },
  }),
})
