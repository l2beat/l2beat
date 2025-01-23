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
  addSentimentToDataAvailability,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common/ReasonForBeingInOther'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import { delayDescriptionFromString } from '../../utils/delayDescription'
import { Badge } from '../badges'
import { StarkexDAC } from '../da-beat/templates/starkex-template'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
} from '../da-beat/types'
import type { Layer2 } from './types'

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

const committee = getCommittee(discovery)

const requiredHonestMembersPercentage = (
  ((committee.accounts.length - committee.minSigners + 1) /
    committee.accounts.length) *
  100
).toFixed(0)

export const immutablex: Layer2 = {
  type: 'layer2',
  id: ProjectId('immutablex'),
  createdAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [
    Badge.VM.AppChain,
    Badge.DA.DAC,
    Badge.Stack.StarkEx,
    Badge.Infra.SHARP,
  ],
  display: {
    reasonsForBeingOther: [REASON_FOR_BEING_OTHER.LOW_DAC_THRESHOLD],
    name: 'Immutable X',
    slug: 'immutablex',
    description:
      'Immutable X is a NFT-focused Validium providing zero gas fees, instant trades and scalability for applications.',
    purposes: ['NFT', 'Exchange'],
    provider: 'StarkEx',
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
  dataAvailability: addSentimentToDataAvailability({
    layers: [DA_LAYERS.DAC],
    bridge: DA_BRIDGES.DAC_MEMBERS({
      membersCount: committee.accounts.length,
      requiredSignatures: committee.minSigners,
    }),
    mode: DA_MODES.STATE_DIFFS,
  }),
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC({
        membersCount: committee.accounts.length,
        requiredSignatures: committee.minSigners,
      }),
      sources: [
        {
          contract: 'StarkExchange',
          references: [
            'https://etherscan.io/address/0x1c3A4EfF75a287Fe6249CAb49606FA25659929A2#code#F34#L123',
          ],
        },
        {
          contract: 'Committee',
          references: [
            'https://etherscan.io/address/0x16BA0f221664A5189cf2C1a7AF0d3AbFc70aA295#code#F1#L63',
          ],
        },
      ],
    },
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
    addresses: [
      discovery.getContractDetails('StarkExchange'),
      discovery.getContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
      ...getSHARPVerifierContracts(discovery, verifierAddress),
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: [
    {
      name: 'Governor',
      accounts: getProxyGovernance(discovery, 'StarkExchange'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromString(upgradeDelay),
    },
    committee,
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
      description:
        'Allowed to update the state. When the Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Trading is live on Immutable X Marketplace',
      link: 'https://twitter.com/immutable/status/1380269810525872131?s=21&t=kyMdE6ORI9f76e8aqizlpg',
      date: '2021-04-08T00:00:00Z',
      description:
        'Immutable has launched the first phase of its Layer 2 scaling protocol.',
      type: 'general',
    },
    {
      name: 'IMX Token introduced',
      link: 'https://www.immutable.com/blog/introducing-imx-to-power-ethereums-first-layer-2-for-nfts',
      date: '2022-06-29T00:00:00Z',
      description:
        'Immutable announce IMX, the native ERC-20 utility token of Immutable X.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
  dataAvailabilitySolution: StarkexDAC({
    bridge: {
      createdAt: new UnixTime(1723211933), // 2024-08-09T13:58:53Z
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
          `${committee.minSigners}/${committee.accounts.length}`,
          requiredHonestMembersPercentage,
        ),
    },
  }),
}
