import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { TechnologyContract } from '~/components/projects/sections/ContractEntry'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { renderDefiProjectMarkdown } from './renderDefiProjectMarkdown'

// Method: render one hand-built DeFi project entry (the same shape the HTML
// page receives) and read the markdown the way an agent would: split it into
// H2 sections and check each one for the values it must carry. Expected
// values are literals from the fixture, worded as on the HTML page.
describe(renderDefiProjectMarkdown.name, () => {
  it('opens with the project name and a link to the HTML page', () => {
    const markdown = renderDefiProjectMarkdown(ENTRY)

    expect(markdown).toMatchRegex(
      /^# Lido\n\nMarkdown version of https:\/\/l2beat\.com\/defi\/projects\/lido\n\n/,
    )
  })

  it('gives the TVL and category of the DeFi summary table, without a risk rosette', () => {
    const summary = getSection(
      renderDefiProjectMarkdown(ENTRY, TOTAL_VALUE_LOCKED_USD),
      'Summary',
    )

    expect(summary).toInclude(
      '- TVL: $26.53 B (total USD value of assets locked in the protocol)\n- Category: Liquid Staking',
      '### About\n\nLido is a liquid staking protocol.',
    )
    expect(summary).not.toInclude('### Risks')
  })

  it('leaves out the TVL of a project whose value is not tracked', () => {
    const summary = getSection(
      renderDefiProjectMarkdown(ENTRY, undefined),
      'Summary',
    )

    expect(summary).not.toInclude('- TVL:')
  })

  it('lists the header links, badges with their descriptions and the contracts explorer', () => {
    const summary = getSection(renderDefiProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '### Links\n\n- Website: https://lido.fi\n- Contracts explorer (Disco): https://disco.l2beat.com/ui/p/lido',
      '### Badges\n\n- Ethereum: Ethereum badge.\n- Chainlink: Chainlink badge.',
    )
  })

  it('surfaces the under review status and warnings before the facts', () => {
    const summary = getSection(
      renderDefiProjectMarkdown({
        ...ENTRY,
        isUnderReview: true,
        warnings: {
          emergency: 'Funds are at risk.',
          red: { text: 'Critical contracts are unverified.' },
          yellow: 'Withdrawals are paused.',
        },
      }),
      'Summary',
    )

    expect(summary).toInclude(
      '**Warning:** This project is under review.',
      '**Warning:** Funds are at risk.',
      '**Warning:** Critical contracts are unverified.',
      '**Warning:** Withdrawals are paused.',
    )
    expect(summary.indexOf('**Warning:**')).toBeLessThan(
      summary.indexOf('- Category:'),
    )
  })

  it('follows the HTML page outline with one H2 per section', () => {
    const headings = renderDefiProjectMarkdown(ENTRY)
      .split('\n')
      .filter((line) => line.startsWith('## '))

    expect(headings).toEqual([
      '## Summary',
      '## Protocol description',
      '## Value Locked',
      '## External dependencies',
      '## Permissions',
      '## Smart contracts',
    ])
  })

  it('carries the protocol description with its references', () => {
    const description = getSection(
      renderDefiProjectMarkdown(ENTRY),
      'Protocol description',
    )

    expect(description).toInclude(
      'Users deposit ETH and receive stETH.',
      '- [Lido docs](https://docs.lido.fi)',
    )
  })

  it('points the value locked chart to the HTML page', () => {
    expect(
      getSection(renderDefiProjectMarkdown(ENTRY), 'Value Locked'),
    ).toInclude('https://l2beat.com/defi/projects/lido#tvs')
  })

  it('lists external dependencies with absolute links and review status', () => {
    const dependencies = getSection(
      renderDefiProjectMarkdown(ENTRY),
      'External dependencies',
    )

    expect(dependencies).toInclude(
      [
        '- [Chainlink](https://l2beat.com/defi/projects/chainlink): Provides the ETH/USD price.',
        '- Obol (not reviewed): Runs distributed validators.',
      ].join('\n'),
    )
  })

  it('says so when there are no external dependencies', () => {
    const dependencies = getSection(
      renderDefiProjectMarkdown({
        ...ENTRY,
        sections: [externalDependencies([])],
      }),
      'External dependencies',
    )

    expect(dependencies).toInclude('This project has no external dependencies')
  })

  it('lists permissions and contracts per chain with addresses', () => {
    const markdown = renderDefiProjectMarkdown(ENTRY)

    expect(getSection(markdown, 'Permissions')).toInclude(
      '#### Actors\n\n##### Lido DAO Agent\n\nAddresses: [0x2222222222222222222222222222222222222222](https://etherscan.io/address/0x2222222222222222222222222222222222222222)\n\nCan upgrade every contract.',
    )
    expect(getSection(markdown, 'Smart contracts')).toInclude(
      '### ethereum\n\n#### Lido\n\nAddresses: [0x3333333333333333333333333333333333333333](https://etherscan.io/address/0x3333333333333333333333333333333333333333)\n\nThe stETH token and deposit entry point.',
    )
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

// A DeFi project entry shaped like the one the HTML page renders, with every
// section kind getDefiProjectEntry builds.

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

function badge(id: string, name: string): ProjectDefiEntry['badges'][number] {
  return {
    id,
    type: 'Other',
    name,
    description: `${name} badge.`,
    action: undefined,
    src: `/images/badges/${id}.png`,
    width: 100,
    height: 100,
  }
}

function externalDependencies(
  dependencies: Extract<
    ProjectDetailsSection,
    { type: 'ExternalDependenciesSection' }
  >['props']['dependencies'],
): ProjectDetailsSection {
  return {
    type: 'ExternalDependenciesSection',
    props: {
      id: 'external-dependencies',
      title: 'External dependencies',
      dependencies,
    },
  }
}

const DISCO_UI = {
  href: 'https://disco.l2beat.com/ui/p/lido',
  images: { desktop: '/desktop.png', mobile: '/mobile.png' },
}

const SECTIONS: ProjectDetailsSection[] = [
  {
    type: 'DetailedDescriptionSection',
    props: {
      id: 'detailed-description',
      title: 'Protocol description',
      description: undefined,
      detailedDescription: 'Users deposit ETH and receive stETH.',
      references: [{ title: 'Lido docs', url: 'https://docs.lido.fi' }],
    },
  },
  // Chart inputs only, which the markdown does not read.
  {
    type: 'TvsValueSection',
    props: { id: 'tvs', title: 'Value Locked' },
  } as ProjectDetailsSection,
  externalDependencies([
    {
      name: 'Chainlink',
      icon: '/icons/chainlink.png',
      description: 'Provides the ETH/USD price.',
      href: '/defi/projects/chainlink',
      reviewed: true,
    },
    {
      name: 'Obol',
      icon: '/icons/obol.png',
      description: 'Runs distributed validators.',
      reviewed: false,
    },
  ]),
  {
    type: 'PermissionsSection',
    props: {
      id: 'permissions',
      title: 'Permissions',
      discoUi: DISCO_UI,
      permissionsByChain: {
        ethereum: {
          roles: [],
          actors: [
            contract(
              'Lido DAO Agent',
              '0x2222222222222222222222222222222222222222',
              'Can upgrade every contract.',
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
      discoUi: DISCO_UI,
      contracts: {
        ethereum: [
          contract(
            'Lido',
            '0x3333333333333333333333333333333333333333',
            'The stETH token and deposit entry point.',
          ),
        ],
      },
      escrows: [],
      risks: [],
    },
  },
]

const TOTAL_VALUE_LOCKED_USD = 26_530_000_000

const ENTRY: ProjectDefiEntry = {
  id: ProjectId('lido'),
  slug: 'lido',
  name: 'Lido',
  icon: '/icons/lido.png',
  description: 'Lido is a liquid staking protocol.',
  category: 'Liquid Staking',
  badges: [badge('ethereum', 'Ethereum'), badge('chainlink', 'Chainlink')],
  projectLinks: [{ name: 'Website', links: ['https://lido.fi'] }],
  discoveryHref: DISCO_UI.href,
  discoUi: DISCO_UI,
  isUnderReview: false,
  warnings: {},
  sections: SECTIONS,
}
