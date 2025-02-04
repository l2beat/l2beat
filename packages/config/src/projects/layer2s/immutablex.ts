import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { Layer2 } from '../../types'
import { delayDescriptionFromString } from '../../utils/delayDescription'
import { Badge } from '../badges'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
} from '../da-beat/common'
import { StarkexDAC } from '../da-beat/templates/starkex-template'

const discovery = new ProjectDiscovery('immutablex')

const upgradeDelaySeconds = discovery.getContractValue<number>(
  'StarkExchange',
  'StarkWareDiamond_upgradeDelay',
)
const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)
const upgradeDelay = formatSeconds(upgradeDelaySeconds)
const verifierAddress = discovery.getAddressFromValue(
  'GpsFactRegistryAdapter',
  'gpsContract',
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

const { committeePermission, minSigners } = getCommittee(discovery)

const requiredHonestMembersPercentage = (
  ((committeePermission.accounts.length - minSigners + 1) /
    committeePermission.accounts.length) *
  100
).toFixed(0)

export const immutablex: Layer2 = {
  type: 'layer2',
  id: ProjectId('immutablex'),
  capability: 'appchain',
  addedAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [
    Badge.VM.AppChain,
    Badge.DA.DAC,
    Badge.Stack.StarkEx,
    Badge.Infra.SHARP,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.LOW_DAC_THRESHOLD],
  display: {
    name: 'Immutable X',
    slug: 'immutablex',
    description:
      'Immutable X is a NFT-focused Validium providing zero gas fees, instant trades and scalability for applications.',
    purposes: ['NFT', 'Exchange'],
    stack: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://immutable.com/'],
      apps: ['https://market.immutable.com/'],
      documentation: [
        'https://docs.starkware.co/starkex/perpetual/perpetual_overview.html',
      ],
      explorers: ['https://immutascan.io/'],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@immutablex',
        'https://twitter.com/Immutable',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['IMX'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5FDCCA53617f4d2b9134B29090C87D01058e27e9'),
        sinceTimestamp: new UnixTime(1615389188),
        tokens: ['ETH', 'IMX', 'USDC', 'OMI'],
        description: 'Main StarkEx contract, used also as an escrow.',
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: ['immutable'],
      sinceTimestamp: new UnixTime(1615389188),
      resyncLastDays: 7,
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS({
      membersCount: committeePermission.accounts.length,
      requiredSignatures: minSigners,
    }),
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC({
      membersCount: committeePermission.accounts.length,
      requiredSignatures: minSigners,
    }),
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      includingSHARPUpgradeDelaySeconds,
      freezeGracePeriod,
    ),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(freezeGracePeriod),
      secondLine: formatDelay(freezeGracePeriod),
    },
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_NFT,
  },
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW(),
    exitMechanisms: EXITS.STARKEX_SPOT,
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('StarkExchange'),
        discovery.getContractDetails(
          'Committee',
          'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
        ),
        ...getSHARPVerifierContracts(discovery, verifierAddress),
      ],
    },
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Governor',
          getProxyGovernance(discovery, 'StarkExchange'),
          'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
            delayDescriptionFromString(upgradeDelay),
        ),
        committeePermission,
        ...getSHARPVerifierGovernors(discovery, verifierAddress),
        discovery.getPermissionDetails(
          'Operators',
          discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
          'Allowed to update the state. When the Operator is down the state cannot be updated.',
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Trading is live on Immutable X Marketplace',
      url: 'https://twitter.com/immutable/status/1380269810525872131?s=21&t=kyMdE6ORI9f76e8aqizlpg',
      date: '2021-04-08T00:00:00Z',
      description:
        'Immutable has launched the first phase of its Layer 2 scaling protocol.',
      type: 'general',
    },
    {
      title: 'IMX Token introduced',
      url: 'https://www.immutable.com/blog/introducing-imx-to-power-ethereums-first-layer-2-for-nfts',
      date: '2022-06-29T00:00:00Z',
      description:
        'Immutable announce IMX, the native ERC-20 utility token of Immutable X.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
  customDa: StarkexDAC({
    dac: {
      knownMembers: [
        {
          external: false,
          name: 'Immutable',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          external: true,
          name: 'StarkWare',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          external: true,
          name: 'Deversifi',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          external: true,
          name: 'Consensys',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          external: true,
          name: 'Nethermind',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          external: true,
          name: 'Iqlusion',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          external: true,
          name: 'Infura',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
        {
          external: true,
          name: 'Cephalopod',
          href: 'https://assets.website-files.com/646557ee455c3e16e4a9bcb3/6499367de527dd82ab7475a3_Immutable%20Whitepaper%20Update%202023%20(3).pdf',
        },
      ],
    },
    discovery,
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OffChainVerifiable,
      committeeSecurity:
        DaCommitteeSecurityRisk.NoHonestMinimumCommitteeSecurity(
          `${minSigners}/${committeePermission.accounts.length}`,
          requiredHonestMembersPercentage,
        ),
    },
  }),
}
