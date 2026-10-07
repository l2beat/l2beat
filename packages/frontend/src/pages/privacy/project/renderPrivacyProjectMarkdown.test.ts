import type {
  PrivacyAdversaryCell,
  PrivacyAdversaryId,
  PrivacyExposureMap,
  PrivacyField,
  ProjectPrivacyAdversaries,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { ProjectPrivacyEntry } from '~/server/features/privacy/project/getPrivacyProjectEntry'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { renderPrivacyProjectMarkdown } from './renderPrivacyProjectMarkdown'

// Method: render one hand-built privacy project entry (the same shape the
// HTML page receives) and read the markdown the way an agent would: split it
// into H2 sections and check each one for the values it must carry. Expected
// values are literals from the fixture, formatted as they appear on the HTML
// page; variants of the entry cover the stats block's "not tracked" states.
describe(renderPrivacyProjectMarkdown.name, () => {
  it('opens with the project name and a link to the HTML page', () => {
    const markdown = renderPrivacyProjectMarkdown(ENTRY)

    expect(markdown).toMatchRegex(
      /^# Tornado Cash\n\nMarkdown version of https:\/\/l2beat\.com\/privacy\/projects\/tornado-cash\n\n/,
    )
  })

  it('gives value locked, deposits and relayers with their change', () => {
    const summary = getSection(renderPrivacyProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Total Value Locked: $412.00 M (+1.50% compared to seven days ago)',
      '- Assets tracked: 1',
      '- Buckets tracked: 2',
      '- Deposits 7D: 120 (-3.00% compared to the previous seven days)',
      '- Deposits 30D: 540',
      '- Deposits Total: 98.00 K',
      '- Active Relayers 30D: 7',
      '- Tracked on: Ethereum, BNB Smart Chain',
      '- Attributes: ZK, Fixed amounts',
      'Tornado Cash is a non-custodial mixer.',
    )
  })

  it('says the metrics are not tracked, like the HTML stats block', () => {
    const summary = getSection(
      renderPrivacyProjectMarkdown({
        ...ENTRY,
        hasTvl: false,
        bucketCount: 0,
        summary: { ...ENTRY.summary, relayerStat: undefined },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Metrics: Not tracked. Data tracking is not available for this project.',
    )
    expect(summary).not.toInclude('Total Value Locked')
    expect(summary).not.toInclude('Deposits')
  })

  it('marks value locked as not applicable when only flows are tracked', () => {
    const summary = getSection(
      renderPrivacyProjectMarkdown({ ...ENTRY, hasTvl: false }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Total Value Locked: N/A',
      '- Deposits 30D: 540',
    )
  })

  it('leads the warnings with the under review banner', () => {
    const summary = getSection(
      renderPrivacyProjectMarkdown({
        ...ENTRY,
        isUnderReview: true,
        warnings: { ...ENTRY.warnings, yellow: 'The relayer list is curated.' },
      }),
      'Summary',
    )

    expect(summary).toMatchRegex(
      /^\n\*\*Warning:\*\* [^\n]*under review[^\n]*\n\n\*\*Warning:\*\* The relayer list is curated\./,
    )
  })

  it('explains each risk profile value after its sentiment', () => {
    const summary = getSection(renderPrivacyProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Privacy: Link privacy. Public observer: Link private (sentiment: good); Chain analyst: Link at risk (sentiment: warning); Network observer: Link private (sentiment: good); Privileged insider: Link private (sentiment: good); Future adversary: Link exposed (sentiment: bad).',
      '- Trusted setup: 1,114 participants (sentiment: good). Groth16 ceremony: A multi-party ceremony.',
      '- Exit window: Infinite (sentiment: good). The pools are immutable. This protocol passes the walkaway test: users can fully use it if all centralized protocol participants disappear.',
      '- Reproducibility: Reproducible (sentiment: good). The client can be built locally.',
    )
  })

  it('keeps a multi-paragraph risk explanation inside its list item', () => {
    const summary = getSection(
      renderPrivacyProjectMarkdown({
        ...ENTRY,
        reproducibility: {
          ...ENTRY.reproducibility,
          description:
            'The client can be built locally.\n\nThe prover keys are not published.',
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '- Reproducibility: Reproducible (sentiment: good). The client can be built locally.\n\n  The prover keys are not published.',
    )
  })

  it('gives the reason a protocol fails the walkaway test', () => {
    const summary = getSection(
      renderPrivacyProjectMarkdown({
        ...ENTRY,
        exitWindow: {
          ...ENTRY.exitWindow,
          walkawayTest: {
            passed: false,
            reason: 'Withdrawals need a relayer.',
          },
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      'This protocol does not pass the walkaway test: users cannot fully use it if all centralized protocol participants disappear. Withdrawals need a relayer.',
    )
  })

  it('surfaces project warnings before the facts', () => {
    const summary = getSection(
      renderPrivacyProjectMarkdown({
        ...ENTRY,
        warnings: {
          emergency: 'Funds are at risk.',
          red: { text: 'Contracts are unverified.' },
          yellow: 'The relayer list is curated.',
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '**Warning:** Funds are at risk.',
      '**Warning:** Contracts are unverified.',
      '**Warning:** The relayer list is curated.',
    )
    expect(summary.indexOf('**Warning:**')).toBeLessThan(
      summary.indexOf('- Total Value Locked:'),
    )
  })

  it('follows the HTML page outline with one H2 per section', () => {
    const headings = renderPrivacyProjectMarkdown(ENTRY)
      .split('\n')
      .filter((line) => line.startsWith('## '))

    expect(headings).toEqual([
      '## Summary',
      '## Privacy',
      '## Value Locked',
      '## Anonymity sets',
      '## Flows',
      '## Assets Breakdown',
      '## Risk summary',
    ])
  })

  it('points chart sections to the HTML page', () => {
    const markdown = renderPrivacyProjectMarkdown(ENTRY)

    expect(getSection(markdown, 'Anonymity sets')).toInclude(
      'https://l2beat.com/privacy/projects/tornado-cash#privacy-anonymity-set',
    )
    expect(getSection(markdown, 'Flows')).toInclude(
      'https://l2beat.com/privacy/projects/tornado-cash#privacy-flows',
    )
  })

  describe('privacy section', () => {
    const privacy = () =>
      getSection(renderPrivacyProjectMarkdown(ENTRY), 'Privacy')

    it('states the promise before the adversaries', () => {
      expect(privacy()).toMatchRegex(
        /^\n\*\*What the protocol promises:\*\* Hides which deposit funds which withdrawal\.\n/,
      )
    })

    it('grades the promise against each adversary and says why', () => {
      expect(privacy()).toInclude(
        '### Chain analyst\n\nLink at risk (sentiment: warning)\n\n**Who:** Correlates all public data. Examples: Chain analytics firms.\n\nTiming narrows the anonymity set.\n\n**Advice:** Wait before withdrawing.',
      )
    })

    it('lists every inside field for the public observer, with notes', () => {
      expect(privacy()).toInclude(
        '**Inside**\n\n- Sender: private\n- Recipient: private\n- Amount: at risk. Private only for fixed denominations.\n- Asset: private\n- Link: private',
      )
    })

    it('lists only the inside fields that differ from the public observer', () => {
      expect(privacy()).toInclude(
        '**Inside, compared with a public observer**\n\n- Link: exposed',
      )
      expect(privacy()).toInclude(
        '### Network observer\n\nLink private (sentiment: good)\n\n**Who:** Sees web2 traffic. Examples: RPC providers.\n\nThe app matches notes locally.\n\nInside, the same as for a public observer.',
      )
    })

    it('resolves sources pointing into the page against the HTML page', () => {
      expect(privacy()).toInclude(
        '**Sources**\n\n- [1 ETH pool](https://l2beat.com/privacy/projects/tornado-cash#Pool_1_ETH)\n- [Withdrawal circuit](https://github.com/tornadocash/tornado-core/blob/master/circuits/withdraw.circom)',
      )
    })
  })

  it('marks the future adversary of a quantum resistant project', () => {
    const markdown = renderPrivacyProjectMarkdown({
      ...ENTRY,
      sections: [
        {
          type: 'PrivacyAdversariesSection',
          props: {
            id: 'privacy-adversaries',
            title: 'Privacy',
            adversaries: {
              ...ADVERSARIES,
              cells: {
                ...ADVERSARIES.cells,
                futureAdversary: {
                  ...ADVERSARIES.cells.futureAdversary,
                  quantumResistant: true,
                },
              },
            },
          },
        },
      ],
    })

    expect(getSection(markdown, 'Summary')).toInclude(
      'Future adversary: Link exposed (sentiment: bad), quantum resistant.',
    )
    expect(getSection(markdown, 'Privacy')).toInclude(
      'A quantum computer could break the commitments.\n\n**Quantum resistant:** This privacy protocol is plausibly quantum resistant',
    )
  })

  it('tabulates assets with every bucket expanded and a total row', () => {
    const breakdown = getSection(
      renderPrivacyProjectMarkdown(ENTRY),
      'Assets Breakdown',
    )

    expect(breakdown).toInclude(
      [
        '| Asset | Buckets | Deposits 7D | Deposits 30D | Deposits Total | Value Locked |',
        '| --- | --- | --- | --- | --- | --- |',
        '| ETH | 2 | 120 ($300.00 K) | 540 ($1.35 M) | 98.00 K ($245.00 M) | $412.00 M |',
        '| ETH: 1 ETH bucket |  | 20 ($50.00 K) | 40 ($100.00 K) | 8.00 K ($20.00 M) | $12.00 M |',
        '| ETH: 10 ETH bucket |  | 100 ($250.00 K) | 500 ($1.25 M) | 90.00 K ($225.00 M) | $400.00 M |',
        '| Total |  | 120 ($300.00 K) | 540 ($1.35 M) | 98.00 K ($245.00 M) | $412.00 M |',
      ].join('\n'),
    )
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

// A privacy project entry shaped like the one the HTML page renders, with one
// section of every kind the page uses; chart sections carry only chart inputs.

const FIELDS: ProjectPrivacyAdversaries['fields'] = (
  [
    ['sender', 'Sender'],
    ['recipient', 'Recipient'],
    ['amount', 'Amount'],
    ['asset', 'Asset'],
    ['linkage', 'Link'],
  ] as const
).map(([id, label]) => ({
  id,
  label,
  subject: label,
  promiseLabel: `${label} privacy`,
  description: `${label} description.`,
}))

function interior(
  overrides: Partial<PrivacyExposureMap> = {},
): PrivacyExposureMap {
  return {
    sender: 'private',
    recipient: 'private',
    amount: 'private',
    asset: 'private',
    linkage: 'private',
    ...overrides,
  }
}

const PUBLIC_OBSERVER_INTERIOR = interior({
  amount: {
    verdict: 'atRisk',
    note: 'Private only for fixed denominations.',
  },
})

function adversary(
  id: PrivacyAdversaryId,
  label: string,
  description: string,
  examples: string,
) {
  return { id, label, description, examples }
}

function cell(
  id: PrivacyAdversaryId,
  value: string,
  sentiment: PrivacyAdversaryCell['sentiment'],
  exposureShort: string,
  rest: Partial<PrivacyAdversaryCell> = {},
): PrivacyAdversaryCell {
  return {
    id,
    value,
    sentiment,
    exposureShort,
    alsoExposed: [],
    interior: PUBLIC_OBSERVER_INTERIOR,
    ...rest,
  }
}

const ADVERSARIES: ProjectPrivacyAdversaries = {
  promise: {
    protects: 'linkage' satisfies PrivacyField,
    text: 'Hides which deposit funds which withdrawal.',
  },
  adversaries: [
    adversary(
      'publicObserver',
      'Public observer',
      'Uses a block explorer.',
      'A journalist.',
    ),
    adversary(
      'chainAnalyst',
      'Chain analyst',
      'Correlates all public data.',
      'Chain analytics firms.',
    ),
    adversary(
      'networkObserver',
      'Network observer',
      'Sees web2 traffic.',
      'RPC providers.',
    ),
    adversary(
      'privilegedInsider',
      'Privileged insider',
      'Holds an operator role.',
      'An upgrade admin.',
    ),
    adversary(
      'futureAdversary',
      'Future adversary',
      'Harvest now, decrypt later.',
      'A quantum computer.',
    ),
  ],
  fields: FIELDS,
  cells: {
    publicObserver: cell(
      'publicObserver',
      'Link private',
      'good',
      'Every withdrawal spends exactly one deposit.',
      {
        // Contract sources arrive resolved to page anchors, see resolvePrivacySources.
        sources: [
          { title: '1 ETH pool', url: '#Pool_1_ETH' },
          {
            title: 'Withdrawal circuit',
            url: 'https://github.com/tornadocash/tornado-core/blob/master/circuits/withdraw.circom',
          },
        ],
      },
    ),
    chainAnalyst: cell(
      'chainAnalyst',
      'Link at risk',
      'warning',
      'Timing narrows the anonymity set.',
      {
        advice: 'Wait before withdrawing.',
        interior: { ...PUBLIC_OBSERVER_INTERIOR, linkage: 'exposed' },
      },
    ),
    networkObserver: cell(
      'networkObserver',
      'Link private',
      'good',
      'The app matches notes locally.',
    ),
    privilegedInsider: cell(
      'privilegedInsider',
      'Link private',
      'good',
      'The pools cannot be upgraded.',
    ),
    futureAdversary: cell(
      'futureAdversary',
      'Link exposed',
      'bad',
      'A quantum computer could break the commitments.',
    ),
  },
}

function chartSection(
  type:
    | 'TvsValueSection'
    | 'PrivacyAnonymitySetSection'
    | 'PrivacyFlowsSection',
  id: 'privacy-tvl' | 'privacy-anonymity-set' | 'privacy-flows',
  title: string,
) {
  return { type, props: { id, title } } as ProjectDetailsSection
}

function deposits(last7d: number, last30d: number, total: number) {
  const usdPerDeposit = 2_500
  return {
    deposits: { last7d, last30d, total },
    depositedValueUsd: {
      last7d: last7d * usdPerDeposit,
      last30d: last30d * usdPerDeposit,
      total: total * usdPerDeposit,
    },
  }
}

const ETH: PrivacyAsset = {
  symbol: 'ETH',
  iconUrl: '/icons/ether.png',
  decimals: 18,
  bucketCount: 2,
  totalAmount: 164_800,
  totalValueUsd: 412_000_000,
  ...deposits(120, 540, 98_000),
  buckets: [
    {
      id: '1-eth',
      label: '1 ETH',
      type: 'denomination',
      denomination: '1',
      totalAmount: 4_800,
      totalValueUsd: 12_000_000,
      ...deposits(20, 40, 8_000),
    },
    {
      id: '10-eth',
      label: '10 ETH bucket',
      type: 'denomination',
      denomination: '10',
      totalAmount: 160_000,
      totalValueUsd: 400_000_000,
      ...deposits(100, 500, 90_000),
    },
  ],
}

const SECTIONS: ProjectDetailsSection[] = [
  {
    type: 'PrivacyAdversariesSection',
    props: {
      id: 'privacy-adversaries',
      title: 'Privacy',
      adversaries: ADVERSARIES,
    },
  },
  chartSection('TvsValueSection', 'privacy-tvl', 'Value Locked'),
  chartSection(
    'PrivacyAnonymitySetSection',
    'privacy-anonymity-set',
    'Anonymity sets',
  ),
  chartSection('PrivacyFlowsSection', 'privacy-flows', 'Flows'),
  {
    type: 'PrivacyAssetsBreakdownSection',
    props: {
      id: 'privacy-assets-breakdown',
      title: 'Assets Breakdown',
      assets: [ETH],
      showTvl: true,
    },
  },
  {
    type: 'MarkdownSection',
    props: {
      id: 'risk-summary',
      title: 'Risk summary',
      content: 'Users can lose privacy if they reuse addresses.',
    },
  },
]

const ENTRY: ProjectPrivacyEntry = {
  id: ProjectId('tornado-cash'),
  slug: 'tornado-cash',
  href: '/privacy/projects/tornado-cash',
  name: 'Tornado Cash',
  icon: '/icons/tornado-cash.png',
  description: 'Tornado Cash is a non-custodial mixer.',
  badges: [],
  projectLinks: [],
  discoUi: {
    href: 'https://disco.l2beat.com/ui/p/tornado-cash',
    images: { desktop: '/desktop.png', mobile: '/mobile.png' },
  },
  bucketCount: 2,
  assetsCount: 1,
  hasTvl: true,
  attributes: [
    { id: 'zk', label: 'ZK', description: 'Uses zero-knowledge proofs.' },
    {
      id: 'fixedAmounts',
      label: 'Fixed amounts',
      description: 'Deposits come in fixed denominations.',
    },
  ],
  trackedOn: [
    { id: 'ethereum', name: 'Ethereum', iconUrl: '/icons/ethereum.png' },
    { id: 'bsc', name: 'BNB Smart Chain', iconUrl: '/icons/bsc.png' },
  ],
  exitWindow: {
    value: 'Infinite',
    sentiment: 'good',
    description: 'The pools are immutable.',
    walkawayTest: { passed: true },
  },
  trustedSetup: {
    value: '1,114 participants',
    sentiment: 'good',
    description: 'Groth16 ceremony: A multi-party ceremony.',
    risk: 'green',
    label: '1,114 participants',
  },
  reproducibility: {
    value: 'Reproducible',
    sentiment: 'good',
    description: 'The client can be built locally.',
  },
  summary: {
    totalValueLockedUsd: 412_000_000,
    totalValueLockedChange7d: 0.015,
    deposits: { total: 98_000, last7d: 120, change7d: -0.03, last30d: 540 },
    relayerStat: { kind: 'activeRelayers', value: 7 },
  },
  isUnderReview: false,
  recentUpdatesCount: 0,
  warnings: {},
  sections: SECTIONS,
}
