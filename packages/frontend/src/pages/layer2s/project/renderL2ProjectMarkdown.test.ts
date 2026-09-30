import { ChainSpecificAddress, ProjectId } from '@l2beat/shared-pure'
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

  it('lists the stats in the order of the HTML stats block, then the description', () => {
    const summary = getSection(renderL2ProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Stage: Stage 1\n- Gas token: ETH\n- Type: Optimistic Rollup\n- Purpose: Universal\n- Host chain: Ethereum\n- Chain ID: 42161',
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
      "- Total Value Secured: $15.20 B (+1.23% compared to seven days ago; canonically bridged $8.00 B, natively minted $5.00 B, externally bridged $2.20 B; 12.5% with additional trust assumptions compared to the tokens involved and the Stage assigned to the project's canonical messaging bridge)",
      '- Past day UOPS: 25.30 (-2.10% compared to seven days ago)',
    )
  })

  it('keeps the TVS and UOPS stats the HTML shows as "No data"', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: { ...ENTRY.header, tvs: undefined, activity: undefined },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Total Value Secured: No data\n',
      '- Past day UOPS: No data\n',
    )
  })

  it('splits TVS by asset class and lists the associated tokens apart, as the tokens breakdown tooltip does', () => {
    const tvs = ENTRY.header.tvs
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          tvs: tvs && {
            ...tvs,
            tokens: {
              warnings: [],
              associatedTokens: [{ symbol: 'ARB', icon: undefined }],
              breakdown: {
                total: 10_000_000_000,
                ether: 5_000_000_000,
                stablecoin: 3_000_000_000,
                btc: 0,
                other: 2_000_000_000,
                associated: 1_000_000_000,
                rwaPublic: 0,
                rwaRestricted: 0,
              },
            },
          },
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- TVS by asset: ETH & derivatives $5.00 B (50.0%), Stablecoins $3.00 B (30.0%), Other $2.00 B (20.0%)\n- Associated tokens: ARB: $1.00 B (10.0% of TVS)\n',
    )
  })

  it('marks the stage of an appchain as the HTML stage badge does', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        isAppchain: true,
        stageConfig: {
          ...ENTRY.stageConfig,
          stage: 'Stage 1',
          additionalConsiderations: {
            short: 'The chain only runs one app.',
            long: 'Longer.',
          },
        } as ProjectL2Entry['stageConfig'],
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Stage: Stage 1 (Appchain: The chain only runs one app.)',
    )
  })

  it('explains why a project is listed in Others, with each consequence', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: { ...ENTRY.header, category: 'Other' },
        reasonsForBeingOther: [
          {
            label: 'No proofs',
            shortDescription: "The proof system isn't fully functional",
            description: 'A malicious proposer can finalize an invalid state.',
          },
        ],
      }),
      'Summary',
    )

    expect(summary).toInclude(
      "**Warning:** Why is the project listed in others? The proof system isn't fully functional. Consequence: a malicious proposer can finalize an invalid state. Learn more about the [recategorisation](https://medium.com/l2beat/",
    )
  })

  it('lists the combined risks of an L3 and says so, as the HTML rosette opens on them', () => {
    const [sequencer, stateValidation, dataAvailability, , proposer] = ROSETTE
    const combined: ProjectL2Entry['rosette']['self'] = [
      sequencer,
      stateValidation,
      dataAvailability,
      rosetteValue('Exit window', '2d', 'bad'),
      proposer,
    ]
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        type: 'layer3',
        name: 'Xai',
        hostChainName: 'Arbitrum One',
        rosette: { self: ROSETTE, host: ROSETTE, stacked: combined },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Risks shown: combined risks of Xai and its host chain Arbitrum One',
      '- Exit window: 2d (sentiment: bad)',
    )
    expect(summary).not.toInclude('- Exit window: 7d')
  })

  it('gives the last 24h cross-chain activity, linking protocols and tokens', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          interop: {
            volume: 12_000_000,
            transferCount: 1,
            protocols: {
              items: [
                {
                  id: 'across',
                  name: 'Across',
                  iconUrl: '/icons/across.png',
                  volume: 8_000_000,
                },
              ],
              remainingCount: 4,
            },
            tokens: {
              items: [
                {
                  id: 'C0Hmkq',
                  symbol: 'ETH',
                  iconUrl: '/icons/eth.png',
                  volume: 7_000_000,
                },
              ],
              remainingCount: 0,
            },
          },
        },
        sections: [
          {
            type: 'InteropFlowsSection',
            props: {
              id: 'interop-flows',
              title: 'Volume and flows',
              protocols: [
                {
                  id: 'across',
                  slug: 'across',
                  name: 'Across',
                  iconUrl: '/icons/across.png',
                },
              ],
            },
          } as ProjectDetailsSection,
        ],
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Last 24h cross-chain volume: $12.00 M',
      '- Last 24h cross-chain transfers: 1\n',
      '- Interop protocols used (last 24h volume): [Across](https://l2beat.com/interop/protocols/across) ($8.00 M), and 4 more',
      '- Tokens by volume (last 24h): [ETH](https://l2beat.com/interop/tokens/C0Hmkq/eth) ($7.00 M)',
    )
  })

  it('lists the header links, badges with their descriptions and the contracts explorer', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          links: [{ name: 'Website', links: ['https://arbitrum.io'] }],
          badges: [
            {
              id: 'OPStack',
              type: 'Stack',
              name: 'Built on Arbitrum Orbit',
              description: 'The project is built on Arbitrum Orbit.',
              action: undefined,
              src: '/images/badges/orbit.png',
              width: 100,
              height: 100,
            },
          ],
        },
        discoUiHref: 'https://disco.l2beat.com/ui/p/arbitrum',
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '### Links\n\n- Website: https://arbitrum.io\n- Contracts explorer (Disco): https://disco.l2beat.com/ui/p/arbitrum',
      '### Badges\n\n- Built on Arbitrum Orbit: The project is built on Arbitrum Orbit.',
    )
  })

  it('names the proof system of a project without a category', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          category: undefined,
          proofSystemType: 'Validity',
        },
      }),
      'Summary',
    )

    expect(summary).toInclude('- Proof system: Validity\n')
    expect(summary).not.toInclude('- Type:')
  })

  it('qualifies TVS with its warnings, nested under the TVS fact', () => {
    const tvs = ENTRY.header.tvs
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          tvs: tvs && {
            ...tvs,
            warning: {
              value: 'The TVS includes tokens locked in a third-party bridge.',
              sentiment: 'warning',
            },
            tokens: {
              ...tvs.tokens,
              warnings: [
                {
                  value:
                    'The ARB token associated with Arbitrum One accounts for 40% of the TVS.',
                  sentiment: 'bad',
                },
              ],
            },
          },
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      [
        'canonical messaging bridge)',
        '  - **Warning:** The TVS includes tokens locked in a third-party bridge. (sentiment: warning)',
        '  - **Warning:** The ARB token associated with Arbitrum One accounts for 40% of the TVS. (sentiment: bad)',
        '- Past day UOPS:',
      ].join('\n'),
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

  it('warns that an archived or under-review project may be outdated', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        archivedAt: 1_700_000_000,
        underReviewStatus: 'impactful-change',
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '**Warning:** This project is archived and no longer maintained.',
      '**Warning:** There are impactful changes and part of the information might be outdated.',
    )
  })

  it('links site paths from config text on the production origin', () => {
    const summary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        header: {
          ...ENTRY.header,
          description: 'See the ![diagram](/images/arbitrum/overview.png).',
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '![diagram](https://l2beat.com/images/arbitrum/overview.png)',
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

  it('warns about unverified contracts and program hashes as critical', () => {
    const riskSummary = getSection(
      renderL2ProjectMarkdown({
        ...ENTRY,
        sections: SECTIONS.map((section) =>
          section.type === 'RiskSummarySection'
            ? {
                ...section,
                props: {
                  ...section.props,
                  verificationWarnings: {
                    programHashes: 'Program hashes could not be verified.',
                    programHashesDescription: undefined,
                  },
                  unverifiedContracts: [
                    {
                      address: ChainSpecificAddress(
                        'eth:0x6666666666666666666666666666666666666666',
                      ),
                      target: { id: 'rollup-proxy', label: 'RollupProxy' },
                    },
                  ],
                },
              }
            : section,
        ),
      }),
      'Risk summary',
    )

    expect(riskSummary).toInclude(
      '**Warning:** 1 address has unverified source code (CRITICAL).\n\n- RollupProxy: 0x6666666666666666666666666666666666666666',
      '**Warning:** Program hashes could not be verified (CRITICAL).',
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

  it('states the stage and whether each requirement is met or an issue, per stage', () => {
    const stage = getSection(renderL2ProjectMarkdown(ENTRY), 'Stage')

    expect(stage).toInclude(
      'Arbitrum One is a Stage 1 Optimistic Rollup.',
      '### Stage 0\n\n1 requirement met.\n\n- Met: The project posts all data on L1.',
      '**Principle**\n\n- Met: Compromising the Security Council is needed to steal funds.',
      '**Guidelines**\n\n- Met: Fraud proof system is permissionless.',
      '### Stage 2\n\n1 issue needs fixing.\n\n- Issue: Upgrades unrelated to onchain provable bugs provide less than 30d to exit.',
    )
  })

  it('lists what the stage assessment covers and excludes', () => {
    const stage = getSection(renderL2ProjectMarkdown(ENTRY), 'Stage')

    expect(stage).toInclude(
      '### Scope of assessment\n\n#### In scope\n\n- Contracts on Ethereum\n\n#### Not in scope\n\n- The Orbit chains built on it',
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

  it('notes technology text that requires more research', () => {
    const withdrawals = getSection(
      renderL2ProjectMarkdown(ENTRY),
      'Withdrawals',
    )

    expect(withdrawals).toInclude(
      '### Forced exits\n\n**Note:** This section requires more research and might not present accurate information.\n\nThe user forces the withdrawal on L1.',
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
      '### ethereum\n\n#### RollupProxy\n\nAddresses: [0x4444444444444444444444444444444444444444](https://etherscan.io/address/0x4444444444444444444444444444444444444444), [0x6666666666666666666666666666666666666666](https://etherscan.io/address/0x6666666666666666666666666666666666666666) (Implementation (Upgradable), unverified), [0x7777777777777777777777777777777777777777](https://etherscan.io/address/0x7777777777777777777777777777777777777777) (Admin)\n\nMain entry point of the rollup.\n\nCan be upgraded by: Security Council with no delay',
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

// A scaling project entry shaped like the one the HTML page renders, with one
// section of every kind the markdown carries.

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

/** Chart sections with no facts around the chart; the chart data itself loads in the browser. */
function chartSection(
  type: 'L2TvsSection' | 'ActivitySection' | 'CostsSection',
  id: 'tvs' | 'activity' | 'onchain-costs',
  title: string,
) {
  return {
    type,
    props: {
      id,
      title,
      trackedTransactions: {
        batchSubmissions: undefined,
        proofSubmissions: undefined,
        stateUpdates: undefined,
      },
    },
  } as ProjectDetailsSection
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
      scopeOfAssessment: {
        inScope: ['Contracts on Ethereum'],
        notInScope: ['The Orbit chains built on it'],
      },
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
                  'Upgrades unrelated to onchain provable bugs provide less than 30d to exit.',
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
        {
          id: 'forced-exits',
          name: 'Forced exits',
          description: 'The user forces the withdrawal on L1.',
          isIncomplete: true,
          isUnderReview: false,
          risks: [],
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
            admins: [
              {
                name: 'Admin',
                address: '0x7777777777777777777777777777777777777777',
                href: 'https://etherscan.io/address/0x7777777777777777777777777777777777777777',
                verificationStatus: 'verified',
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
    gasTokens: ['ETH'],
    tvs: {
      breakdown: {
        total: 15_200_000_000,
        native: 5_000_000_000,
        canonical: 8_000_000_000,
        external: 2_200_000_000,
        totalChange: 0.0123,
        totalChangePeriod: '7D',
      },
      additionalTrustAssumptionsPercentage: 0.125,
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
