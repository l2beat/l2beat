import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectL2Entry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { renderL2ProjectMarkdown } from './renderL2ProjectMarkdown'

// Method: render one hand-built project entry (the same shape the HTML page
// receives) and read the markdown the way an agent would: split it into H2
// sections and check each one for the values it must carry. Expected values
// are literals from the fixture, formatted as they appear on the HTML page.
describe(renderL2ProjectMarkdown.name, () => {
  it('opens with the project name and a link to the HTML page', () => {
    const markdown = renderL2ProjectMarkdown(ENTRY)

    expect(markdown).toMatchRegex(
      /^# Arbitrum One\n\nMarkdown version of https:\/\/l2beat\.com\/layer2s\/projects\/arbitrum\n\n/,
    )
  })

  it('summarizes type, stage, host chain and description', () => {
    const summary = getSection(renderL2ProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Type: Optimistic Rollup',
      '- Stage: Stage 1',
      '- Host chain: Ethereum',
      '- Purpose: Universal',
      '- Chain ID: 42161',
      'Arbitrum One is a general-purpose optimistic rollup.',
    )
  })

  it('lists every summary risk with its sentiment', () => {
    const summary = getSection(renderL2ProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Sequencer failure: Self sequence (sentiment: good)',
      '- State validation: Fraud proofs (INT) (sentiment: good)',
      '- Data availability: Onchain (sentiment: good)',
      '- Exit window: 7d (sentiment: warning)',
      '- Proposer failure: Self propose (sentiment: good)',
    )
  })

  it('gives TVS and activity headline numbers with their change', () => {
    const summary = getSection(renderL2ProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Total Value Secured: $15.20 B (+1.23% compared to seven days ago; canonically bridged $8.00 B, natively minted $5.00 B, externally bridged $2.20 B)',
      '- Past day UOPS: 25.30 (-2.10% compared to seven days ago)',
    )
  })

  it('surfaces project warnings before the facts', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          emergencyWarning: 'Funds are at risk.',
          redWarning: { text: 'Critical contracts are unverified.' },
          warning: 'Fraud proof system is under development.',
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '**Warning:** Funds are at risk.',
      '**Warning:** Critical contracts are unverified.',
      '**Warning:** Fraud proof system is under development.',
    )
    expect(summary.indexOf('**Warning:**')).toBeLessThan(
      summary.indexOf('- Type:'),
    )
  })

  it('follows the HTML page outline with one H2 per section', () => {
    const headings = renderL2ProjectMarkdown(ENTRY)
      .split('\n')
      .filter((line) => line.startsWith('## '))

    expect(headings).toEqual([
      '## Summary',
      '## Value Secured',
      '## Activity',
      '## Onchain costs',
      '## Risk summary',
      '## Risk analysis',
      '## Stage',
      '## State validation',
      '## Withdrawals',
      '## Permissions',
      '## Smart contracts',
    ])
  })

  it('links the JSON API for the TVS and activity series', () => {
    const markdown = renderL2ProjectMarkdown(ENTRY)

    expect(getSection(markdown, 'Value Secured')).toInclude(
      '- [TVS chart (JSON)](https://l2beat.com/api/scaling/tvs/arbitrum)',
      '- [TVS breakdown by token (JSON)](https://l2beat.com/api/scaling/tvs/arbitrum/breakdown)',
    )
    expect(getSection(markdown, 'Activity')).toInclude(
      '- [Activity chart (JSON)](https://l2beat.com/api/scaling/activity/arbitrum)',
    )
  })

  it('points chart sections without markdown content to the HTML page', () => {
    expect(
      getSection(renderL2ProjectMarkdown(ENTRY), 'Onchain costs'),
    ).toInclude('https://l2beat.com/layer2s/projects/arbitrum#onchain-costs')
  })

  it('groups the risk summary by category, marking critical risks', () => {
    const riskSummary = getSection(
      renderL2ProjectMarkdown(ENTRY),
      'Risk summary',
    )

    expect(riskSummary).toInclude(
      '### Funds can be stolen if\n\n1. a contract receives a malicious code upgrade (CRITICAL).\n2. a malicious state root is not challenged.\n',
    )
  })

  it('explains each risk analysis value with its sentiment', () => {
    const riskAnalysis = getSection(
      renderL2ProjectMarkdown(ENTRY),
      'Risk analysis',
    )

    expect(riskAnalysis).toInclude(
      '### Exit window\n\n7d (sentiment: warning)\n\nExit window description.',
    )
  })

  it('states the stage and checks off its requirements per stage', () => {
    const stage = getSection(renderL2ProjectMarkdown(ENTRY), 'Stage')

    expect(stage).toInclude(
      'Arbitrum One is a Stage 1 Optimistic Rollup.',
      '### Stage 0\n\n- [x] The project posts all data on L1.',
      '### Stage 1\n\n- [x] Principle: Compromising the Security Council is needed to steal funds.\n- [x] Fraud proof system is permissionless.',
      '### Stage 2\n\n- [ ] Upgrades unrelated to onchain provable bugs provide at least 30d to exit.',
    )
  })

  it('carries state validation text with risks and references', () => {
    const stateValidation = getSection(
      renderL2ProjectMarkdown(ENTRY),
      'State validation',
    )

    expect(stateValidation).toInclude(
      'Updates to the system state can be challenged.',
      '### State root proposals\n\nWhitelisted validators propose state roots.',
      '- Funds can be stolen if a malicious state root is not challenged.',
      '- [RollupUserLogic.sol](https://etherscan.io/address/0x1)',
    )
  })

  it('carries technology text with its risks', () => {
    const withdrawals = getSection(
      renderL2ProjectMarkdown(ENTRY),
      'Withdrawals',
    )

    expect(withdrawals).toInclude(
      '### Regular exits\n\nThe user initiates the withdrawal on L2.',
      '- Withdrawals can be delayed if the operator is down.',
    )
  })

  it('lists permissions per chain as roles and actors with addresses', () => {
    const permissions = getSection(
      renderL2ProjectMarkdown(ENTRY),
      'Permissions',
    )

    expect(permissions).toInclude(
      '### ethereum\n\n#### Roles\n\n##### Challengers\n\nAddresses: [0x2222222222222222222222222222222222222222](https://etherscan.io/address/0x2222222222222222222222222222222222222222)\n\nCan challenge state roots.',
      '#### Actors\n\n##### Security Council\n\nAddresses: [0x3333333333333333333333333333333333333333](https://etherscan.io/address/0x3333333333333333333333333333333333333333)\n\nCan upgrade every contract without delay.',
    )
  })

  it('lists contracts per chain with their upgrade path and risks', () => {
    const contracts = getSection(
      renderL2ProjectMarkdown(ENTRY),
      'Smart contracts',
    )

    expect(contracts).toInclude(
      '### ethereum\n\n#### RollupProxy\n\nAddresses: [0x4444444444444444444444444444444444444444](https://etherscan.io/address/0x4444444444444444444444444444444444444444), [0x6666666666666666666666666666666666666666](https://etherscan.io/address/0x6666666666666666666666666666666666666666) (Implementation (Upgradable), unverified)\n\nMain entry point of the rollup.\n\nCan be upgraded by: Security Council with no delay',
      'The current deployment carries some associated risks:\n\n- Funds can be stolen if a contract receives a malicious code upgrade (CRITICAL).',
    )
  })

  describe('other text sections of scaling pages', () => {
    const render = () =>
      renderL2ProjectMarkdown({ ...ENTRY, sections: TEXT_SECTIONS })

    it('carries descriptions, state derivation, sequencing and governance', () => {
      const markdown = render()
      expect(getSection(markdown, 'Detailed description')).toInclude(
        'Arbitrum One is a general-purpose optimistic rollup.',
        'It runs the Nitro stack.',
      )
      expect(getSection(markdown, 'State derivation')).toInclude(
        '### Node software\n\nNitro node.',
        '### Data format\n\nBrotli-compressed batches.',
      )
      expect(getSection(markdown, 'Sequencing')).toInclude(
        '### Timeboost\n\nThe express lane is auctioned.',
      )
      expect(getSection(markdown, 'Upgrades & Governance')).toInclude(
        'The Security Council can upgrade the system.',
      )
    })

    it('nests grouped sections one level deeper', () => {
      const markdown = render()
      expect(getSection(markdown, 'Data availability')).toInclude(
        'Data is posted to a committee.',
        '### Risk analysis\n\n#### Economic security\n\nNone (sentiment: bad)',
        '### Technology\n\nThe committee signs data availability attestations.',
      )
    })

    it('nests headings inside section text under the section heading', () => {
      const markdown = render()

      expect(getSection(markdown, 'Data availability')).toInclude(
        '#### Architecture\n\nMembers run nodes.\n\n```\n# not a heading\n```',
      )
    })

    it('shows L3 risks combined with the host chain', () => {
      const markdown = render()
      expect(getSection(markdown, 'Risk analysis')).toInclude(
        'The L3 risks depend on the individual properties of L3 and those of the host chain combined.',
        '### Exit window\n\n7d (sentiment: warning)',
      )
    })

    it('lists milestones with dates and links', () => {
      const markdown = render()
      expect(getSection(markdown, 'Milestones & Incidents')).toInclude(
        '- 2023-03-23: [Mainnet launch](https://arbitrum.io/launch). Arbitrum One opened to everyone.',
      )
    })
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

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

const TEXT_SECTIONS: ProjectDetailsSection[] = [
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

const ENTRY: ProjectL2Entry = {
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
