import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { renderEthereumProjectMarkdown } from './renderEthereumProjectMarkdown'

// Method: render a hand-built entry (the shape the HTML page receives) and
// read the markdown the way an agent would: split it into H2 sections and
// check each one for the values it must carry. Expected values are literals
// from the fixture, formatted as they appear on the HTML page.
describe(renderEthereumProjectMarkdown.name, () => {
  it('links the HTML page', () => {
    expect(renderEthereumProjectMarkdown(ENTRY)).toMatchRegex(
      /^# Ethereum\n\nMarkdown version of https:\/\/l2beat\.com\/projects\/ethereum\n\n/,
    )
  })

  it('summarizes the stats block, with tooltips as parentheticals', () => {
    const summary = getSection(renderEthereumProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- Type: Public Blockchain',
      '- Secured by: 1.05 M validators',
      '- Duration of storage: 18 days',
      '- Used by: Eclipse, Manta Pacific',
    )
    expect(summary).toMatchRegex(/- Total Value Secured: \$40\.00 B \(Total/)
  })

  it('explains the enshrined bridge instead of a risk rosette', () => {
    const summary = getSection(renderEthereumProjectMarkdown(ENTRY), 'Summary')

    expect(summary).toInclude(
      '- DA Bridge: Enshrined Bridge',
      '### About\n\n**Enshrined Bridge:** Full nodes self-verify the data availability of each block.',
    )
    expect(summary).not.toInclude('### Risks')
  })

  it('links the JSON API for the activity chart', () => {
    expect(
      getSection(renderEthereumProjectMarkdown(ENTRY), 'Activity'),
    ).toInclude(
      '- [Activity chart (JSON)](https://l2beat.com/api/scaling/activity/ethereum)',
    )
  })
})

function getSection(markdown: string, heading: string) {
  const [, afterHeading] = markdown.split(`\n## ${heading}\n`)
  expect(afterHeading).not.toEqual(undefined)
  return (afterHeading ?? '').split('\n## ')[0] ?? ''
}

const ACTIVITY_SECTION = {
  type: 'ActivitySection',
  props: { id: 'activity', title: 'Activity', dataSource: undefined },
} as unknown as ProjectDetailsSection

const ENTRY: EthereumProjectPageEntry = {
  name: 'Ethereum',
  slug: 'ethereum',
  icon: '/icons/ethereum.png',
  type: 'Public Blockchain',
  description: 'Ethereum is the base layer.',
  isUnderReview: false,
  header: {
    links: [],
    tvs: 40_000_000_000,
    economicSecurity: 70_000_000_000,
    durationStorage: 18 * UnixTime.DAY,
    maxThroughputPerSecond: 85_000,
    usedIn: [
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
    ],
    bridgeName: 'Enshrined Bridge',
    callout: {
      title: 'Enshrined Bridge',
      description:
        'Full nodes self-verify the data availability of each block.',
    },
    numberOfValidators: 1_050_000,
  },
  sections: [ACTIVITY_SECTION],
}
