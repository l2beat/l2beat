import { ProjectId } from '@l2beat/shared-pure'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'

// A scaling project entry shaped like the one the HTML page renders, with one
// section of every kind the markdown carries. Shared by the renderer and the
// router tests.

function rosetteValue(
  name: string,
  value: string,
  sentiment: RosetteValue['sentiment'],
): RosetteValue {
  return { name, value, sentiment, description: `${name} description.` }
}

const ROSETTE: ProjectL2Entry['rosette']['self'] = [
  rosetteValue('Sequencer failure', 'Self sequence', 'good'),
  rosetteValue('State validation', 'Fraud proofs (INT)', 'good'),
  rosetteValue('Data availability', 'Onchain', 'good'),
  rosetteValue('Exit window', '7d', 'warning'),
  rosetteValue('Proposer failure', 'Self propose', 'good'),
]

/** Chart sections carry only chart inputs, which the markdown does not read. */
function chartSection(
  type: 'L2TvsSection' | 'ActivitySection' | 'CostsSection',
  id: 'tvs' | 'activity' | 'onchain-costs',
  title: string,
) {
  return { type, props: { id, title } } as ProjectDetailsSection
}

function contract(
  name: string,
  address: string,
  description: string,
): TechnologyContract {
  return {
    id: name,
    name,
    chain: 'ethereum',
    description,
    addresses: [
      {
        name: `${address.slice(0, 6)}…${address.slice(38, 42)}`,
        address,
        href: `https://etherscan.io/address/${address}`,
        verificationStatus: 'verified',
      },
    ],
    admins: [],
    references: [],
    impactfulChange: false,
  }
}

const SECTIONS: ProjectDetailsSection[] = [
  chartSection('L2TvsSection', 'tvs', 'Value Secured'),
  chartSection('ActivitySection', 'activity', 'Activity'),
  chartSection('CostsSection', 'onchain-costs', 'Onchain costs'),
  {
    type: 'RiskSummarySection',
    props: {
      id: 'risk-summary',
      title: 'Risk summary',
      riskGroups: [
        {
          start: 1,
          name: 'Funds can be stolen if',
          items: [
            {
              text: 'a contract receives a malicious code upgrade.',
              referencedId: 'contracts',
              isCritical: true,
            },
            {
              text: 'a malicious state root is not challenged.',
              referencedId: 'state-validation',
              isCritical: false,
            },
          ],
        },
      ],
      warning: undefined,
      verificationWarnings: {
        programHashes: undefined,
        programHashesDescription: undefined,
      },
      redWarning: undefined,
      unverifiedContracts: [],
    },
  },
  {
    type: 'RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      rosetteValues: ROSETTE,
      warning: undefined,
      redWarning: undefined,
      unverifiedContracts: [],
    },
  },
  {
    type: 'StageSection',
    props: {
      id: 'stage',
      title: 'Stage',
      icon: '/icons/arbitrum.png',
      name: 'Arbitrum One',
      type: 'Optimistic Rollup',
      isAppchain: false,
      additionalConsiderations: undefined,
      stageConfig: {
        stage: 'Stage 1',
        downgradePending: undefined,
        message: undefined,
        summary: [
          {
            stage: 'Stage 0',
            principle: undefined,
            requirements: [
              {
                satisfied: true,
                description: 'The project posts all data on L1.',
              },
            ],
          },
          {
            stage: 'Stage 1',
            principle: {
              satisfied: true,
              description:
                'Compromising the Security Council is needed to steal funds.',
            },
            requirements: [
              {
                satisfied: true,
                description: 'Fraud proof system is permissionless.',
              },
            ],
          },
          {
            stage: 'Stage 2',
            principle: undefined,
            requirements: [
              {
                satisfied: false,
                description:
                  'Upgrades unrelated to onchain provable bugs provide at least 30d to exit.',
              },
            ],
          },
        ],
      },
    },
  },
  {
    type: 'StateValidationSection',
    props: {
      id: 'state-validation',
      title: 'State validation',
      diagram: undefined,
      stateValidation: {
        description: 'Updates to the system state can be challenged.',
        categories: [
          {
            title: 'State root proposals',
            description: 'Whitelisted validators propose state roots.',
            risks: [
              {
                category: 'Funds can be stolen if',
                text: 'a malicious state root is not challenged.',
              },
            ],
            references: [
              {
                title: 'RollupUserLogic.sol',
                url: 'https://etherscan.io/address/0x1',
              },
            ],
          },
        ],
      },
    },
  },
  {
    type: 'TechnologyChoicesSection',
    props: {
      id: 'withdrawals',
      title: 'Withdrawals',
      items: [
        {
          id: 'regular-exits',
          name: 'Regular exits',
          description: 'The user initiates the withdrawal on L2.',
          isIncomplete: false,
          isUnderReview: false,
          risks: [
            {
              text: 'Withdrawals can be delayed if the operator is down.',
              isCritical: false,
            },
          ],
          references: [],
        },
      ],
    },
  },
  {
    type: 'PermissionsSection',
    props: {
      id: 'permissions',
      title: 'Permissions',
      permissionsByChain: {
        ethereum: {
          roles: [
            contract(
              'Challengers',
              '0x2222222222222222222222222222222222222222',
              'Can challenge state roots.',
            ),
          ],
          actors: [
            contract(
              'Security Council',
              '0x3333333333333333333333333333333333333333',
              'Can upgrade every contract without delay.',
            ),
          ],
        },
      },
    },
  },
  {
    type: 'ContractsSection',
    props: {
      id: 'contracts',
      title: 'Smart contracts',
      contracts: {
        ethereum: [
          {
            ...contract(
              'RollupProxy',
              '0x4444444444444444444444444444444444444444',
              'Main entry point of the rollup.',
            ),
            addresses: [
              {
                name: '0x4444…4444',
                address: '0x4444444444444444444444444444444444444444',
                href: 'https://etherscan.io/address/0x4444444444444444444444444444444444444444',
                verificationStatus: 'verified',
              },
              {
                name: 'Implementation (Upgradable)',
                address: '0x6666666666666666666666666666666666666666',
                href: 'https://etherscan.io/address/0x6666666666666666666666666666666666666666',
                verificationStatus: 'unverified',
              },
            ],
            upgradeableBy: [{ name: 'Security Council', delay: 'no' }],
          },
        ],
      },
      escrows: [
        contract(
          'Bridge',
          '0x5555555555555555555555555555555555555555',
          'Escrow for ETH.',
        ),
      ],
      risks: [
        {
          text: 'Funds can be stolen if a contract receives a malicious code upgrade.',
          isCritical: true,
        },
      ],
    },
  },
]

export const TEXT_SECTIONS: ProjectDetailsSection[] = [
  {
    type: 'MilestonesAndIncidentsSection',
    props: {
      id: 'milestones-and-incidents',
      title: 'Milestones & Incidents',
      milestones: [
        {
          type: 'general',
          title: 'Mainnet launch',
          url: 'https://arbitrum.io/launch',
          date: '2023-03-23T00:00:00Z',
          description: 'Arbitrum One opened to everyone.',
        },
      ],
    },
  },
  {
    type: 'DetailedDescriptionSection',
    props: {
      id: 'detailed-description',
      title: 'Detailed description',
      description: 'Arbitrum One is a general-purpose optimistic rollup.',
      detailedDescription: 'It runs the Nitro stack.',
    },
  },
  {
    type: 'L3RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      l2: { name: 'Arbitrum One', risks: ROSETTE },
      l3: { name: 'Xai', risks: ROSETTE },
      combined: ROSETTE,
      warning: undefined,
      redWarning: undefined,
      unverifiedContracts: [],
    },
  },
  {
    type: 'Group',
    props: {
      id: 'da-layer',
      title: 'Data availability',
      description: 'Data is posted to a committee.',
      items: [
        {
          type: 'GrissiniRiskAnalysisSection',
          props: {
            id: 'da-layer-risk-analysis',
            title: 'Risk analysis',
            isVerified: undefined,
            layerGrissiniValues: [
              rosetteValue('Economic security', 'None', 'bad'),
            ],
            bridgeGrissiniValues: [],
          },
        },
        {
          type: 'MarkdownSection',
          props: {
            id: 'da-layer-technology',
            title: 'Technology',
            content:
              'The committee signs data availability attestations.\n\n## Architecture\n\nMembers run nodes.\n\n```\n# not a heading\n```',
          },
        },
      ],
    },
  },
  {
    type: 'StateDerivationSection',
    props: {
      id: 'state-derivation',
      title: 'State derivation',
      nodeSoftware: 'Nitro node.',
      genesisState: 'Empty genesis.',
      dataFormat: 'Brotli-compressed batches.',
    },
  },
  {
    type: 'UpgradesAndGovernanceSection',
    props: {
      id: 'upgrades-and-governance',
      title: 'Upgrades & Governance',
      content: 'The Security Council can upgrade the system.',
    },
  },
  {
    type: 'SequencingSection',
    props: {
      id: 'sequencing',
      title: 'Sequencing',
      projectName: 'Arbitrum One',
      name: 'Timeboost',
      content: 'The express lane is auctioned.',
    },
  },
]

export const ENTRY: ProjectL2Entry = {
  id: ProjectId('arbitrum'),
  type: 'layer2',
  name: 'Arbitrum One',
  shortName: undefined,
  slug: 'arbitrum',
  icon: '/icons/arbitrum.png',
  archivedAt: undefined,
  isAppchain: false,
  colors: undefined,
  underReviewStatus: undefined,
  header: {
    description: 'Arbitrum One is a general-purpose optimistic rollup.',
    recentUpdatesCount: 0,
    links: [],
    chainId: 42161,
    category: 'Optimistic Rollup',
    purposes: ['Universal'],
    tvs: {
      breakdown: {
        total: 15_200_000_000,
        native: 5_000_000_000,
        canonical: 8_000_000_000,
        external: 2_200_000_000,
        totalChange: 0.0123,
        totalChangePeriod: '7D',
      },
      additionalTrustAssumptionsPercentage: 0,
      tokens: { warnings: [], associatedTokens: [] },
    },
    activity: {
      lastDayUops: 25.3,
      uopsWeeklyChange: -0.021,
      uopsWeeklyChangePeriod: '7D',
    },
  },
  rosette: { self: ROSETTE },
  sections: SECTIONS,
  hostChainName: 'Ethereum',
  stageConfig: {
    stage: 'Stage 1',
    downgradePending: undefined,
    message: undefined,
    summary: [],
  },
  discoUiHref: undefined,
}
