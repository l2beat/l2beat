import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type {
  DaProjectPageEntry,
  EthereumDaProjectPageEntry,
} from '~/server/features/data-availability/project/getDaProjectEntry'
import { renderDaProjectMarkdown } from './renderDaProjectMarkdown'

// Method: render hand-built DA page entries (the same shapes the HTML page
// receives: a layer with a selected bridge, and Ethereum with its enshrined
// bridge) and read the markdown the way an agent would: split it into H2
// sections and check each one for the values it must carry. Expected values
// are literals from the fixtures, formatted as they appear on the HTML page.
describe(renderDaProjectMarkdown.name, () => {
  it('opens with the layer name and a link to the HTML page of the selected bridge', () => {
    const markdown = renderDaProjectMarkdown(ENTRY)

    expect(markdown).toMatchRegex(
      /^# Celestia\n\nMarkdown version of https:\/\/l2beat\.com\/data-availability\/projects\/celestia\/blobstream\n\n/,
    )
  })

  it('summarizes the stats block, with tooltips as parentheticals', () => {
    const summary = getSection(renderDaProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Type: Public Blockchain',
      '- Total Value Secured: $1.50 B (across the L2s and L3s listed on L2BEAT that use this DA layer, excluding sovereign rollups)',
      '- Economic security: $800.00 M (slashable in case of a data withholding attack)',
      '- Secured by: 100 validators',
      '- Duration of storage: 30 days',
      '- Max throughput: 2 MiB/s',
      '- DA Bridge: Blobstream (TVS $1.20 B)',
      '- Used by: Eclipse, Manta Pacific',
    )
  })

  it('links the other bridges of the layer to their markdown pages', () => {
    const summary = getSection(renderDaProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Other DA bridges: [No DA Bridge](https://l2beat.com/data-availability/projects/celestia/no-bridge.md) (TVS $300.00 M)',
    )
    expect(summary).not.toInclude('[Blobstream]')
  })

  it('lists layer and selected bridge risks with their sentiment', () => {
    const summary = getSection(renderDaProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '### Risks\n\n- Economic security: Onchain (sentiment: good)\n- Fraud detection: None (sentiment: bad)\n- Committee security: 2/3 of validators (sentiment: warning)',
    )
  })

  it('stands in the no-bridge risk when no bridge is selected, as the HTML page does', () => {
    const markdown = renderDaProjectMarkdown(NO_BRIDGE_ENTRY)

    expect(getSection(markdown, 'Summary')).toInclude(
      '- DA Bridge: No DA Bridge',
      '- Fraud detection: None (sentiment: bad)\n- DA Bridge: No bridge (sentiment: neutral)',
    )
    expect(getSection(markdown, 'No DA Bridge')).toInclude(
      '### Risk analysis\n\n#### DA Bridge\n\nNo bridge (sentiment: neutral)\n\nWithout a DA Bridge, Ethereum has no proof of data availability for this project.',
    )
  })

  it('surfaces anomaly, archive and review banners before the facts', () => {
    const summary = getSection(
      renderDaProjectMarkdown({
        ...ENTRY,
        archivedAt: UnixTime(1_700_000_000),
        isUnderReview: true,
        header: { ...ENTRY.header, ongoingAnomaly: 'single' },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '**Warning:** Ongoing anomaly in the DA bridge liveness, see [the HTML page](https://l2beat.com/data-availability/projects/celestia/blobstream#da-bridge-liveness).',
      '**Warning:** This project is archived and no longer maintained.',
      '**Warning:** This project is under review.',
    )
    expect(summary.indexOf('**Warning:**')).toBeLessThan(
      summary.indexOf('- Type:'),
    )
  })

  it('calls the storage of a DA service without a pruning window flexible', () => {
    const summary = getSection(
      renderDaProjectMarkdown({
        ...ENTRY,
        kind: 'DA Service',
        type: 'DA Service',
        header: { ...ENTRY.header, durationStorage: undefined },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Duration of storage: Flexible (depends on the offchain configuration of the DAC)',
    )
  })

  it('follows the HTML page outline, layer and bridge as grouped sections', () => {
    const headings = renderDaProjectMarkdown(ENTRY)
      .split('\n')
      .filter((line) => /^#{2,3} /.test(line))

    expect(headings).toEqual([
      '## Summary',
      '### Risks',
      '## Throughput',
      '## Milestones & Incidents',
      '## Risk summary',
      '### Celestia risks',
      '### Blobstream risks',
      '## Celestia',
      '### Risk analysis',
      '### Technology',
      '## Blobstream',
      '### Liveness',
      '### Risk analysis',
      '### Technology',
      '### Permissions',
      '### Contracts',
    ])
  })

  it('points chart sections to the HTML page', () => {
    const markdown = renderDaProjectMarkdown(ENTRY)

    expect(getSection(markdown, 'Throughput')).toInclude(
      'https://l2beat.com/data-availability/projects/celestia/blobstream#throughput',
    )
    expect(getSection(markdown, 'Blobstream')).toInclude(
      'https://l2beat.com/data-availability/projects/celestia/blobstream#da-bridge-liveness',
    )
  })

  it('splits the risk summary into layer and bridge risks by category', () => {
    const riskSummary = getSection(
      renderDaProjectMarkdown(ENTRY),
      'Risk summary',
    )

    expect(riskSummary).toInclude(
      '### Celestia risks\n\n#### Funds can be lost if\n\n1. the data is withheld by a supermajority of validators.',
      '### Blobstream risks\n\n**Warning:** This bridge includes unverified contracts.\n\n#### Funds can be stolen if\n\n2. the bridge contract receives a malicious code upgrade (CRITICAL).',
    )
  })

  it('names the bridge risks after the layer when the bridge shares its name', () => {
    const riskSummary = getSection(
      renderDaProjectMarkdown({
        ...ENTRY,
        sections: [riskSummarySection('Celestia', 'Celestia')],
      }),
      'Risk summary',
    )

    expect(riskSummary).toInclude('### Celestia bridge risks')
  })

  it('carries the layer and bridge descriptions, risk analysis and technology', () => {
    const markdown = renderDaProjectMarkdown(ENTRY)

    expect(getSection(markdown, 'Celestia')).toInclude(
      'Celestia is a modular data availability network.',
      '### Risk analysis\n\n#### Economic security\n\nOnchain (sentiment: good)\n\nEconomic security description.',
      '### Technology\n\n#### Data availability sampling\n\nLight nodes sample the data.',
      '- Funds can be lost if the data is withheld by a supermajority of validators.',
      '- [Celestia specs](https://celestia.org/specs)',
    )
    expect(getSection(markdown, 'Blobstream')).toInclude(
      'Blobstream relays data roots to Ethereum.',
      '#### Committee security\n\n2/3 of validators (sentiment: warning)',
    )
  })

  it('lists the DA committee members with their keys above the permissions', () => {
    const blobstream = getSection(renderDaProjectMarkdown(ENTRY), 'Blobstream')

    expect(blobstream).toInclude(
      '### Permissions\n\nThe DA committee has the following members:\n\n- [Member One](https://member-one.example) (key: 0xabcdef0123456789)\n- [Member Two](https://member-two.example)\n\n#### ethereum\n\n##### Actors\n\n###### Blobstream Multisig',
    )
  })

  describe('Ethereum, whose DA bridge is enshrined', () => {
    it('links the page of Ethereum with its own bridge', () => {
      expect(renderDaProjectMarkdown(ETHEREUM_ENTRY)).toMatchRegex(
        /^# Ethereum\n\nMarkdown version of https:\/\/l2beat\.com\/data-availability\/projects\/ethereum\/ethereum\n\n/,
      )
    })

    it('explains the enshrined bridge instead of a risk rosette', () => {
      const summary = getSection(
        renderDaProjectMarkdown(ETHEREUM_ENTRY),
        'Summary',
      )

      expect(summary).toInclude(
        '- DA Bridge: Enshrined Bridge',
        '- Secured by: 1.05 M validators',
        '### About\n\n**Enshrined Bridge:** Full nodes self-verify the data availability of each block.',
      )
      expect(summary).not.toInclude('### Risks')
    })

    it('links the JSON API for the activity chart', () => {
      expect(
        getSection(renderDaProjectMarkdown(ETHEREUM_ENTRY), 'Activity'),
      ).toInclude(
        '- [Activity chart (JSON)](https://l2beat.com/api/scaling/activity/ethereum)',
      )
    })
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

// DA page entries shaped like the ones the HTML page renders, with one
// section of every kind DA pages carry.

function rosetteValue(
  name: string,
  value: string,
  sentiment: RosetteValue['sentiment'],
): RosetteValue {
  return { name, value, sentiment, description: `${name} description.` }
}

const LAYER_RISKS = [
  rosetteValue('Economic security', 'Onchain', 'good'),
  rosetteValue('Fraud detection', 'None', 'bad'),
]

const BRIDGE_RISKS = [
  rosetteValue('Committee security', '2/3 of validators', 'warning'),
]

/** Chart sections carry only chart inputs, which the markdown does not read. */
function chartSection(
  type: 'ThroughputSection' | 'LivenessSection' | 'ActivitySection',
  id: 'throughput' | 'da-bridge-liveness' | 'activity',
  title: string,
) {
  return { type, props: { id, title } } as ProjectDetailsSection
}

function riskSummarySection(
  layerName: string,
  bridgeName: string,
): ProjectDetailsSection {
  return {
    type: 'DaRiskSummarySection',
    props: {
      id: 'risk-summary',
      title: 'Risk summary',
      layer: {
        name: layerName,
        risks: [
          {
            start: 1,
            name: 'Funds can be lost if',
            items: [
              {
                text: 'the data is withheld by a supermajority of validators.',
                referencedId: 'da-layer-technology',
                isCritical: false,
              },
            ],
          },
        ],
      },
      bridge: {
        name: bridgeName,
        isVerified: false,
        risks: [
          {
            start: 2,
            name: 'Funds can be stolen if',
            items: [
              {
                text: 'the bridge contract receives a malicious code upgrade.',
                referencedId: 'da-bridge-contracts',
                isCritical: true,
              },
            ],
          },
        ],
      },
      isVerified: true,
      warning: undefined,
      redWarning: undefined,
    },
  }
}

function contract(name: string, address: string): TechnologyContract {
  return {
    id: name,
    name,
    chain: 'ethereum',
    description: `${name} description.`,
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

const LAYER_GROUP: ProjectDetailsSection = {
  type: 'Group',
  props: {
    id: 'da-layer',
    title: 'Celestia',
    description: 'Celestia is a modular data availability network.',
    items: [
      {
        type: 'GrissiniRiskAnalysisSection',
        props: {
          id: 'da-layer-risk-analysis',
          title: 'Risk analysis',
          isVerified: true,
          layerGrissiniValues: LAYER_RISKS,
        },
      },
      {
        type: 'MarkdownSection',
        props: {
          id: 'da-layer-technology',
          title: 'Technology',
          // Real DA technology descriptions start at `##`.
          content:
            '## Data availability sampling\n\nLight nodes sample the data.',
          risks: [
            {
              text: 'Funds can be lost if the data is withheld by a supermajority of validators.',
              isCritical: false,
            },
          ],
          references: [
            { title: 'Celestia specs', url: 'https://celestia.org/specs' },
          ],
        },
      },
    ],
  },
}

const SECTIONS: ProjectDetailsSection[] = [
  chartSection('ThroughputSection', 'throughput', 'Throughput'),
  {
    type: 'MilestonesAndIncidentsSection',
    props: {
      id: 'milestones-and-incidents',
      title: 'Milestones & Incidents',
      milestones: [
        {
          title: 'Mainnet launch',
          url: 'https://blog.celestia.org/mainnet',
          date: '2023-10-31T00:00:00Z',
          type: 'general',
        },
      ],
    },
  },
  riskSummarySection('Celestia', 'Blobstream'),
  LAYER_GROUP,
  {
    type: 'Group',
    props: {
      id: 'da-bridge',
      title: 'Blobstream',
      description: 'Blobstream relays data roots to Ethereum.',
      items: [
        chartSection('LivenessSection', 'da-bridge-liveness', 'Liveness'),
        {
          type: 'GrissiniRiskAnalysisSection',
          props: {
            id: 'da-bridge-risk-analysis',
            title: 'Risk analysis',
            isVerified: true,
            isNoBridge: false,
            bridgeGrissiniValues: BRIDGE_RISKS,
          },
        },
        {
          type: 'MarkdownSection',
          props: {
            id: 'da-bridge-technology',
            title: 'Technology',
            content: 'Validators sign data root tuples.',
          },
        },
        {
          type: 'PermissionsSection',
          props: {
            id: 'da-bridge-permissions',
            title: 'Permissions',
            permissionedEntities: [
              {
                name: 'Member One',
                href: 'https://member-one.example',
                key: '0xabcdef0123456789',
              },
              { name: 'Member Two', href: 'https://member-two.example' },
            ],
            permissionsByChain: {
              ethereum: {
                roles: [],
                actors: [
                  contract(
                    'Blobstream Multisig',
                    '0x1111111111111111111111111111111111111111',
                  ),
                ],
              },
            },
          },
        },
        {
          type: 'ContractsSection',
          props: {
            id: 'da-bridge-contracts',
            title: 'Contracts',
            contracts: {
              ethereum: [
                contract(
                  'Blobstream',
                  '0x2222222222222222222222222222222222222222',
                ),
              ],
            },
            escrows: [],
            risks: [],
          },
        },
      ],
    },
  },
]

const USED_IN = [
  {
    id: ProjectId('eclipse'),
    name: 'Eclipse',
    slug: 'eclipse',
    icon: '/icons/eclipse.png',
    url: '/layer2s/projects/eclipse',
  },
  {
    id: ProjectId('mantapacific'),
    name: 'Manta Pacific',
    slug: 'mantapacific',
    icon: '/icons/mantapacific.png',
    url: '/layer2s/projects/mantapacific',
  },
]

const ENTRY: DaProjectPageEntry = {
  entryType: 'common',
  name: 'Celestia',
  slug: 'celestia',
  icon: '/icons/celestia.png',
  kind: 'Public Blockchain',
  type: 'Public Blockchain',
  description: 'Celestia is a modular data availability network.',
  isUnderReview: false,
  archivedAt: undefined,
  colors: undefined,
  selectedBridge: {
    name: 'Blobstream',
    slug: 'blobstream',
    isNoBridge: false,
    grissiniValues: BRIDGE_RISKS,
  },
  bridges: [
    {
      name: 'No DA Bridge',
      slug: 'no-bridge',
      isNoBridge: true,
      grissiniValues: [],
      tvs: 300_000_000,
      usedIn: [],
    },
    {
      name: 'Blobstream',
      slug: 'blobstream',
      isNoBridge: false,
      grissiniValues: BRIDGE_RISKS,
      tvs: 1_200_000_000,
      usedIn: USED_IN,
    },
  ],
  header: {
    daLayerGrissiniValues: LAYER_RISKS,
    daBridgeGrissiniValues: BRIDGE_RISKS,
    tvs: 1_500_000_000,
    links: [],
    economicSecurity: 800_000_000,
    durationStorage: 30 * UnixTime.DAY,
    maxThroughputPerSecond: 2 * 1024 ** 2,
    usedIn: USED_IN,
    numberOfValidators: 100,
  },
  sections: SECTIONS,
}

const NO_BRIDGE_ENTRY: DaProjectPageEntry = {
  ...ENTRY,
  selectedBridge: {
    name: 'No DA Bridge',
    slug: 'no-bridge',
    isNoBridge: true,
    grissiniValues: [],
  },
  header: { ...ENTRY.header, daBridgeGrissiniValues: [] },
  sections: [
    LAYER_GROUP,
    {
      type: 'Group',
      props: {
        id: 'da-bridge',
        title: 'No DA Bridge',
        items: [
          {
            type: 'GrissiniRiskAnalysisSection',
            props: {
              id: 'da-bridge-risk-analysis',
              title: 'Risk analysis',
              isVerified: true,
              isNoBridge: true,
              bridgeGrissiniValues: [],
            },
          },
        ],
      },
    },
  ],
}

const ETHEREUM_ENTRY: EthereumDaProjectPageEntry = {
  entryType: 'ethereum',
  name: 'Ethereum',
  slug: 'ethereum',
  icon: '/icons/ethereum.png',
  kind: 'Public Blockchain',
  type: 'Public Blockchain',
  description: 'Ethereum is the base layer.',
  isUnderReview: false,
  archivedAt: undefined,
  colors: undefined,
  header: {
    links: [],
    tvs: 40_000_000_000,
    economicSecurity: 70_000_000_000,
    durationStorage: 18 * UnixTime.DAY,
    maxThroughputPerSecond: 85_000,
    usedIn: USED_IN,
    bridgeName: 'Enshrined Bridge',
    callout: {
      title: 'Enshrined Bridge',
      description:
        'Full nodes self-verify the data availability of each block.',
    },
    numberOfValidators: 1_050_000,
  },
  sections: [chartSection('ActivitySection', 'activity', 'Activity')],
}
