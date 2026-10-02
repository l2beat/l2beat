import { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import { absolutizeLinks } from './markdown'
import { renderProjectMarkdown } from './renderProjectMarkdown'
import { renderProjectSection } from './renderProjectSection'
import { renderStageSection } from './renderSectionStage'

// Method: render one hand-built section at a time (the props the HTML
// component receives) and check the markdown for the text the HTML shows:
// status words, labels and facts that were previously dropped. Expected
// values are literals from the fixtures, worded as on the HTML page.
describe(renderProjectSection.name, () => {
  describe('risk values', () => {
    it('shows both upgrade paths of an exit window, with the regular path explained', () => {
      const markdown = render(riskAnalysis([EXIT_WINDOW]))

      expect(markdown).toInclude(
        '### Exit window\n\nNone (emergency upgrade path; sentiment: bad); 10d (regular upgrade path; sentiment: warning)\n\nRegular upgrades wait 10d.\n\nThere is no window to exit.',
      )
    })

    it('shows the second line and the warning of a value', () => {
      const markdown = render(
        riskAnalysis([
          {
            name: 'Data availability',
            value: 'Onchain',
            secondLine: 'Blobs',
            sentiment: 'good',
            warning: { value: 'Blobs expire.', sentiment: 'warning' },
          },
        ]),
      )

      expect(markdown).toInclude(
        'Onchain (Blobs; sentiment: good)\n\n**Warning:** Blobs expire. (sentiment: warning)',
      )
    })

    it('words summary risks the same way, with warnings nested under them', () => {
      const markdown = renderProjectMarkdown({
        name: 'Arbitrum One',
        pagePath: '/layer2s/projects/arbitrum',
        summary: {
          warnings: [],
          facts: [],
          risks: [
            EXIT_WINDOW,
            {
              name: 'Sequencer failure',
              value: 'Self sequence',
              sentiment: 'good',
              warning: { value: 'Forced txs are slow.', sentiment: 'bad' },
            },
          ],
          description: undefined,
        },
        sections: [],
        apiLinks: {},
      })

      expect(markdown).toInclude(
        '- Exit window: None (emergency upgrade path; sentiment: bad); 10d (regular upgrade path; sentiment: warning)\n- Sequencer failure: Self sequence (sentiment: good)\n',
      )
      expect(markdown).toMatchRegex(
        /\(sentiment: good\)\n +- \*\*Warning:\*\* Forced txs are slow\. \(sentiment: bad\)/,
      )
    })

    it('labels the host L2, individual L3 and combined rows of the L3 table', () => {
      const l2 = riskTuple('Stage 1 value', 'good')
      const l3 = riskTuple('L3 value', 'bad')
      const markdown = render({
        type: 'L3RiskAnalysisSection',
        props: {
          id: 'risk-analysis',
          title: 'Risk analysis',
          l2: { name: 'Arbitrum One', risks: l2 },
          l3: { name: 'Xai', risks: l3 },
          combined: undefined,
          warning: undefined,
          redWarning: undefined,
          unverifiedContracts: [],
        },
      })

      expect(markdown).toInclude(
        '|  | Sequencer failure | State validation | Data availability | Exit window | Proposer failure |',
        '| Arbitrum One (L2) | Stage 1 value (sentiment: good) |',
        '| Xai (L3, individual) | L3 value (sentiment: bad) |',
        '| Xai (L3, combined) | Under review | Under review |',
        '### L3 individual risks\n\nThe information below reflects individual L3 risks.\n\n#### Sequencer failure',
      )
    })
  })

  describe('stage', () => {
    it('words each requirement as met, under review or an issue instead of a checkbox', () => {
      const markdown = renderStage(STAGE_PROPS, 'in effect')

      expect(markdown).toInclude(
        '### Stage 1\n\n1 issue needs fixing.\n\n**Principle**\n\n- Met: Only the Security Council can steal funds.\n\nThe principle explained.\n\n**Guidelines**\n\n- Met: Proofs are permissionless.\n- Under review: Exits are fast.\n- Issue: Users cannot exit without operators.',
      )
      expect(markdown).not.toInclude('[ ]')
    })

    it('lists upcoming guidelines apart while the stage changes are pending', () => {
      const withUpcoming = {
        ...STAGE_PROPS,
        stageConfig: {
          ...STAGE_CONFIG,
          summary: [
            {
              stage: 'Stage 2' as const,
              principle: undefined,
              requirements: [
                { satisfied: true, description: 'Now.' },
                { satisfied: false, description: 'Later.', upcoming: true },
              ],
            },
          ],
        },
      }

      expect(renderStage(withUpcoming, 'pending')).toInclude(
        '### Stage 2\n\n1 requirement met.\n\n- Met: Now.\n\n**Upcoming guidelines**\n\n- Issue (upcoming): Later.',
      )
      expect(renderStage(withUpcoming, 'in effect')).toInclude(
        '### Stage 2\n\n1 issue needs fixing.\n\n- Met: Now.\n- Issue (upcoming): Later.',
      )
    })

    it('states the walkaway test, appchain notes and a pending downgrade', () => {
      const markdown = renderStage(
        {
          ...STAGE_PROPS,
          isAppchain: true,
          walkAway: 'not-passed',
          additionalConsiderations: { short: 'Short.', long: 'Long.' },
          stageConfig: {
            ...STAGE_CONFIG,
            downgradePending: {
              expiresAt: UnixTime(1_790_000_000),
              reasons: ['The proof system is permissioned.'],
              toStage: 'Stage 0',
            },
          },
        },
        'in effect',
      )

      expect(markdown).toInclude(
        'Arbitrum One is a Stage 1 Appchain Optimistic Rollup.',
        '**The project does not pass the walkaway test**: users are not able to exit',
        'Rollup operators cannot compromise the system, but being **application-specific** might bring additional risk.\n\nLong.\n\n**Note:** We',
        '**New requirements coming soon** (effective 2026-09-21 14:13 UTC)',
        '- The proof system is permissioned.',
        '[Learn more about Stages](https://l2beat.com/stages).',
      )
    })
  })

  it('renders governance profile tables, past upgrade stats and the diagram', () => {
    const markdown = render({
      type: 'UpgradesAndGovernanceSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        diagram: DIAGRAM,
        content: 'The DAO upgrades.',
        governanceInfo: {
          securityCouncil: { Threshold: '9/12' },
          tokenGovernance: { Token: 'ARB' },
        },
        pastUpgrades: {
          upgrades: [],
          stats: { count: 0, avgInterval: null, lastInterval: null },
        },
      },
    })

    expect(markdown).toInclude(
      '![A diagram](https://l2beat.com/images/diagram.png)\n\nThe DAO upgrades.',
      '### Governance profile\n\n#### Security Council\n\n| Property | Value |\n| --- | --- |\n| Threshold | 9/12 |\n\n#### Token governance',
      '### Past upgrades',
      '- Count of upgrades: No upgrades\n- Last upgrade: N/A\n- Avg upgrade interval: N/A',
    )
  })

  it('renders state validation provers and program hashes without the ZK catalog intro', () => {
    const markdown = render({
      type: 'StateValidationSection',
      props: {
        id: 'state-validation',
        title: 'State validation',
        diagram: DIAGRAM,
        stateValidation: { categories: [] },
        proverInfos: [
          {
            name: 'SP1',
            icon: '/icons/sp1.png',
            href: '/zk-catalog/sp1',
            trustedSetups: {
              'Groth16-bn254': {
                trustedSetups: [
                  {
                    id: 'aztec-ignition',
                    name: 'Aztec Ignition',
                    risk: 'green',
                    shortDescription: 'Large ceremony.',
                    proofSystem: GROTH16,
                  },
                ],
                verifiers: { successful: { count: 2, attesters: [] } },
                projectsUsedIn: [],
                projectsUsedInByStatus: {},
              },
            },
          },
        ],
        programHashes: [
          {
            hash: '0xabc',
            title: 'Aggregation program',
            verificationStatus: 'notVerified',
            usedIn: [],
          },
        ],
        programHashesDescription: 'Hashes are checked onchain.',
      },
    })

    expect(markdown).toInclude(
      '![A diagram](https://l2beat.com/images/diagram.png)',
      '### Prover: [SP1](https://l2beat.com/zk-catalog/sp1)\n\n#### Trusted setups\n\n- Groth16 (Groth16):\n  - Aztec Ignition, risk green (lowest risk) per the [Trusted Setups Risk Framework](https://forum.l2beat.com/t/the-trusted-setups-framework-for-zk-catalog/381): Large ceremony.\n  - Used in: none\n  - Verifiers: 2 successful',
      '### Program Hashes\n\n#### Aggregation program',
      'Hashes are checked onchain.',
    )
    expect(markdown).not.toInclude('List of known guest zkVM programs')
  })

  it('renders the centralized sequencing spec sheet', () => {
    const markdown = render({
      type: 'SequencingSection',
      props: {
        id: 'sequencing',
        title: 'Sequencing',
        projectName: 'Arbitrum One',
        name: 'Centralized sequencer',
        content: 'One sequencer.',
        sequencingSpec: {
          type: 'centralized',
          trustedPreconfirmation: {
            value: '250ms',
            secondLine: '0.25s blocks',
            sentiment: 'good',
            description: 'Fast.',
          },
          trustedOrdering: { value: 'FCFS' },
          sequencer: { value: 'Offchain Labs' },
          realtimeCensorshipResistance: { value: 'None' },
          forcedInclusion: { value: 'Delayed inbox' },
          inclusionDelay: { value: '1d' },
          inclusionMechanics: { value: 'L1 message' },
          exitDelay: { value: '7d' },
          exitEconomics: { value: '1 ETH' },
        },
      },
    })

    expect(markdown).toInclude(
      '**Centralized sequencing spec sheet**\n\n| Property | Value | Description |\n| --- | --- | --- |\n| Trusted preconfirmation | 250ms, 0.25s blocks (sentiment: good) | Fast. |\n| Trusted ordering | FCFS |  |',
    )
  })

  it('points to the host chain and the related DA layer, with absolute links', () => {
    const hostChainWarning = {
      hostChainName: 'Arbitrum One',
      hostChainSlug: 'arbitrum',
      hostChainIcon: '/icons/arbitrum.png',
    }
    const riskSummary = render({
      type: 'RiskSummarySection',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        riskGroups: [],
        warning: undefined,
        verificationWarnings: {
          programHashes: undefined,
          programHashesDescription: undefined,
        },
        redWarning: undefined,
        hostChainWarning: { ...hostChainWarning, riskCount: 3 },
        unverifiedContracts: [],
      },
    })
    const technology = render({
      type: 'TechnologyChoicesSection',
      props: {
        id: 'technology',
        title: 'Data availability',
        hostChainWarning,
        items: [
          {
            id: 'da',
            name: 'Data is posted to Celestia',
            description: 'Blobs go to Celestia.',
            isIncomplete: false,
            isUnderReview: false,
            risks: [],
            references: [],
            relatedProjectBanner: {
              text: 'Learn more about the DA layer here:',
              href: '/data-availability/projects/celestia/no-bridge',
              project: { name: 'Celestia', icon: '/icons/celestia.png' },
            },
          },
        ],
      },
    })

    expect(riskSummary).toInclude(
      'There are 3 additional risks coming from the host chain [Arbitrum One](https://l2beat.com/layer2s/projects/arbitrum)',
    )
    expect(technology).toInclude(
      'The section considers only the L3 properties. For more details please refer to [Arbitrum One](https://l2beat.com/layer2s/projects/arbitrum)',
      'Blobs go to Celestia.\n\nLearn more about the DA layer here: [Celestia](https://l2beat.com/data-availability/projects/celestia/no-bridge)',
    )
  })

  it('lists updates with date, severity, change count and description', () => {
    const markdown = render({
      type: 'UpdatesSection',
      props: {
        id: 'updates',
        title: 'Updates',
        projectId: ProjectId('arbitrum'),
        updates: [
          {
            id: 'update-1',
            date: '2026-09-01',
            timestamp: UnixTime(1_788_000_000),
            description: 'Upgraded the bridge.',
            isHighSeverity: true,
            changeCount: 3,
          },
        ],
      },
    })

    expect(markdown).toInclude(
      '### [2026-08-29 10:40 UTC](https://l2beat.com/layer2s/projects/arbitrum?update=update-1) (high severity, 3 changes)\n\nUpgraded the bridge.',
    )
  })

  it('carries the liveness anomalies and tracked transactions around the chart', () => {
    const markdown = render({
      type: 'LivenessSection',
      props: {
        id: 'liveness',
        title: 'Liveness',
        project: CHART_PROJECT,
        configuredSubtypes: ['stateUpdates'],
        anomalies: [
          {
            start: UnixTime(1_788_000_000),
            end: undefined,
            status: 'ongoing',
            durationInSeconds: 7_200,
            subtype: 'stateUpdates',
            avgInterval: 3_600,
            isApproved: true,
            failureMechanism: undefined,
          },
        ],
        hasTrackedContractsChanged: false,
        trackedTransactions: {
          batchSubmissions: undefined,
          proofSubmissions: undefined,
          stateUpdates: [
            {
              projectId: ProjectId('arbitrum'),
              sinceTimestamp: 1_700_000_000,
              subtype: 'stateUpdates',
              type: 'l2costs',
              isHistorical: false,
              params: {
                formula: 'functionCall',
                address: EthereumAddress(
                  '0x1111111111111111111111111111111111111111',
                ),
                selector: '0x12345678',
                signature: 'function update()',
              },
            },
          ],
        },
        milestones: [],
        defaultRange: [null, 1],
        isArchived: false,
      },
    })

    expect(markdown).toInclude(
      '### Ongoing anomaly\n\n- No state updates have been performed for the past 2h (since 2026-08-29 10:40 UTC). These typically occur every 1h on average.',
      'The interactive liveness chart is shown on [the HTML page](https://l2beat.com/layer2s/projects/arbitrum#liveness).',
      '#### State updates\n\n- functionCall: 2023-11-14 22:13 UTC - now; currently used; address: [0x1111111111111111111111111111111111111111](https://etherscan.io/address/0x1111111111111111111111111111111111111111); selector: 0x12345678; signature: `function update()`',
      '### Last 30 day anomalies',
    )
  })

  it('spells out the garden verdict and each crop finding', () => {
    const crop = {
      sentiment: 'good' as const,
      status: 'reviewed' as const,
      points: [],
      missing: [],
      additionalConsiderations: [],
      notReviewed: [],
    }
    const markdown = render({
      type: 'GardenCropsSection',
      props: {
        id: 'crops',
        title: 'Crops',
        inGarden: false,
        crops: {
          censorshipResistance: {
            ...crop,
            sentiment: 'bad',
            missing: ['No forced transactions.'],
          },
          openSource: {
            ...crop,
            license: {
              spdxId: 'MIT',
              name: 'MIT License',
              url: 'https://mit',
              categories: [],
            },
            points: ['Code is public.'],
          },
          privacy: { ...crop, status: 'notReviewed', sentiment: 'neutral' },
          security: crop,
        },
      },
    })

    expect(markdown).toInclude(
      'Not in the garden yet. 2 of 4 in bloom.',
      '### Censorship resistance\n\nBad\n\n**What is missing**\n\n- No forced transactions.',
      "### Open source\n\nGood\n\n**What's good**\n\n- License: [MIT License](https://mit)\n- Code is public.",
      '### Privacy\n\nNot reviewed',
      '[See the whole garden](https://l2beat.com/garden).',
    )
  })

  it('keeps the throughput sync warning and explanation next to the chart pointer', () => {
    const markdown = render({
      type: 'ThroughputSection',
      props: {
        id: 'throughput',
        title: 'Throughput',
        project: CHART_PROJECT,
        throughput: [],
        customColors: undefined,
        syncStatus: {
          warning: 'No throughput data since 2026-09-01.',
          isSynced: false,
        },
        milestones: [],
      },
    })

    expect(markdown).toInclude(
      '**Warning:** No throughput data since 2026-09-01.\n\nThe chart shows the actual size of data posted to the DA Layer per day',
      'The interactive throughput chart and its past day stats are shown on [the HTML page](https://l2beat.com/layer2s/projects/arbitrum#throughput).',
    )
  })

  it('names the DA layers a project posts to, or posted to once it stopped', () => {
    const dataPosted = (
      currentDaLayers: { name: string; logo: string; href: string }[],
    ) =>
      render({
        type: 'DataPostedSection',
        props: {
          id: 'data-posted',
          title: 'Data posted',
          project: CHART_PROJECT,
          currentDaLayers,
          pastDaLayers: [CELESTIA],
          milestones: [],
          defaultRange: [null, 1_788_000_000],
          daTrackingConfig: [],
        },
      })

    expect(dataPosted([ETHEREUM])).toInclude(
      'The project currently posts data to [Ethereum](https://l2beat.com/data-availability/projects/ethereum/ethereum); previously it posted to [Celestia](https://l2beat.com/data-availability/projects/celestia/no-bridge).',
    )
    expect(dataPosted([])).toInclude(
      'The project no longer posts data; previously it posted to [Celestia](https://l2beat.com/data-availability/projects/celestia/no-bridge).',
    )
  })

  it('points client-loaded widgets to the HTML page without calling tables charts', () => {
    const markdown = render({
      type: 'InteropTokensSection',
      props: {
        id: 'interop-tokens',
        title: 'Tokens',
        projectId: ProjectId('arbitrum'),
        apiSelection: { from: ['ethereum'], to: ['arbitrum'] },
      },
    })

    expect(markdown).toInclude(
      'The interactive tokens table is shown on [the HTML page](https://l2beat.com/layer2s/projects/arbitrum#interop-tokens).',
    )
  })

  describe('under review', () => {
    it('adds the HTML callout to any section flagged under review', () => {
      const markdown = render({
        type: 'MarkdownSection',
        props: {
          id: 'withdrawals',
          title: 'Withdrawals',
          content: 'Old text.',
          isUnderReview: true,
        },
      })

      expect(markdown).toInclude(
        '## Withdrawals\n\n**Under review:** The information in the section might be incomplete or outdated.',
        'Old text.',
      )
    })

    it('drops the body when the HTML hides it under review', () => {
      const markdown = render({
        type: 'MarkdownSection',
        props: {
          id: 'withdrawals',
          title: 'Withdrawals',
          content: 'Old text.',
          isUnderReview: true,
          hideChildrenIfUnderReview: true,
        },
      })

      expect(markdown).not.toInclude('Old text.')
    })

    it('flags a risk section as under review when one of its values is', () => {
      const markdown = render(
        riskAnalysis([
          { name: 'Exit window', value: 'Review', sentiment: 'UnderReview' },
        ]),
      )

      expect(markdown).toInclude('**Under review:**')
    })
  })

  it('never leaves a heading without a body', () => {
    const markdown = render({
      type: 'UpgradesAndGovernanceSection',
      props: { id: 'upgrades-and-governance', title: 'Upgrades & Governance' },
    })

    expect(markdown).toEqual('## Upgrades & Governance\n\nNo information.')
  })
})

const PAGE_URL = 'https://l2beat.com/layer2s/projects/arbitrum'

/** Links resolve against the page once the whole document is assembled, as `renderProjectMarkdown` does. */
function render(section: ProjectDetailsSection) {
  return absolutizeLinks(
    renderProjectSection(section, 2, {
      apiLinks: {},
      countdowns: PROJECT_COUNTDOWNS,
    }),
    PAGE_URL,
  )
}

/** The stage changes are pending until their countdown ends, so a day either side of now picks the phase. */
function renderStage(
  props: Parameters<typeof renderStageSection>[0],
  stageChanges: 'pending' | 'in effect',
) {
  const offset = stageChanges === 'pending' ? UnixTime.DAY : -UnixTime.DAY
  const countdowns = { stageChanges: UnixTime(UnixTime.now() + offset) }
  return absolutizeLinks(
    renderStageSection(props, 3, { apiLinks: {}, countdowns }),
    PAGE_URL,
  )
}

function riskAnalysis(rosetteValues: RosetteValue[]): ProjectDetailsSection {
  return {
    type: 'RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      rosetteValues,
      warning: undefined,
      redWarning: undefined,
      unverifiedContracts: [],
    },
  }
}

function riskTuple(
  value: string,
  sentiment: RosetteValue['sentiment'],
): [RosetteValue, RosetteValue, RosetteValue, RosetteValue, RosetteValue] {
  const risk = (name: string) => ({ name, value, sentiment })
  return [
    risk('Sequencer failure'),
    risk('State validation'),
    risk('Data availability'),
    risk('Exit window'),
    risk('Proposer failure'),
  ]
}

const EXIT_WINDOW: RosetteValue = {
  name: 'Exit window',
  value: 'None',
  sentiment: 'bad',
  description: 'There is no window to exit.',
  regular: {
    value: '10d',
    sentiment: 'warning',
    description: 'Regular upgrades wait 10d.',
  },
}

const STAGE_CONFIG = {
  stage: 'Stage 1' as const,
  downgradePending: undefined,
  message: undefined,
  stage1PrincipleDescription: 'The principle explained.',
  summary: [
    {
      stage: 'Stage 1' as const,
      principle: {
        satisfied: true,
        description: 'Only the Security Council can steal funds.',
      },
      requirements: [
        {
          satisfied: false,
          description: 'Users cannot exit without operators.',
        },
        { satisfied: 'UnderReview' as const, description: 'Exits are fast.' },
        { satisfied: true, description: 'Proofs are permissionless.' },
      ],
    },
  ],
}

const STAGE_PROPS: Parameters<typeof renderStageSection>[0] = {
  icon: '/icons/arbitrum.png',
  name: 'Arbitrum One',
  type: 'Optimistic Rollup',
  isAppchain: false,
  additionalConsiderations: undefined,
  stageConfig: STAGE_CONFIG,
}

const DIAGRAM = {
  src: { light: { src: '/images/diagram.png', width: 100, height: 100 } },
  caption: 'A diagram',
}

const GROTH16 = {
  id: 'groth16',
  type: 'Groth16' as const,
  name: 'Groth16',
  description: 'A SNARK.',
}

const ETHEREUM = {
  name: 'Ethereum',
  logo: '/icons/ethereum.png',
  href: '/data-availability/projects/ethereum/ethereum',
}

const CELESTIA = {
  name: 'Celestia',
  logo: '/icons/celestia.png',
  href: '/data-availability/projects/celestia/no-bridge',
}

const CHART_PROJECT = {
  id: ProjectId('arbitrum'),
  name: 'Arbitrum One',
  shortName: undefined,
  iconUrl: '/icons/arbitrum.png',
}
