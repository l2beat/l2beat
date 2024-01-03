import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { formatLargeNumber } from '../../utils'
import { ProjectLink } from '../icons'
import { TypeCell } from '../table/TypeCell'
import { DetailsHeader as DetailsHeaderComponent } from './DetailsHeader'
import { StatWithChange } from './stats/StatWithChange'

const meta: Meta<typeof DetailsHeaderComponent> = {
  component: DetailsHeaderComponent,
}
export default meta
type Story = StoryObj<typeof DetailsHeaderComponent>

const project = {
  display: {
    purpose: 'Universal',
    name: 'Arbitrum One',
    slug: 'arbitrum',
  },
  technology: {
    category: 'Optimistic Rollup',
  },
}

const stats = [
  {
    title: 'Total value locked',
    value: (
      <StatWithChange className="font-bold" stat="$331.31M" change="+2.25%" />
    ),
  },
  {
    title: 'Daily TPS',
    value: <StatWithChange stat="2.21" change="-10.23%" />,
  },
  {
    title: '30D tx count',
    value: formatLargeNumber(800321),
  },
  {
    title: 'Purpose',
    value: project.display.purpose,
  },
  {
    title: 'Type',
    value: <TypeCell>{project.technology.category}</TypeCell>,
  },
]

const links: ProjectLink[] = [
  { name: 'Website', links: ['https://bridge.gnosischain.com/'] },
  { name: 'App', links: ['https://bridge.gnosischain.com/'] },
  {
    name: 'Docs',
    links: ['https://docs.gnosischain.com/bridges/tokenbridge/xdai-bridge'],
  },
  {
    name: 'Explorer',
    links: [
      'https://blockscout.com/xdai/mainnet',
      'https://gnosisscan.io/',
      'https://explorer.anyblock.tools/ethereum/poa/xdai/',
      'https://beacon.gnosischain.com/',
      'https://xdai.tokenview.io/',
    ],
  },
  { name: 'Repository', links: ['https://github.com/gnosischain'] },
  {
    name: 'Social',
    links: [
      'https://twitter.com/gnosischain',
      'https://discord.gg/VQb3WzsywU',
      'https://t.me/gnosischain',
    ],
  },
  {
    name: 'rollup.codes',
    links: ['https://rollup.codes/arbitrum-one'],
  },
]

const warning =
  'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.'

export const DetailsHeader: Story = {
  args: {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    stats: { summary: stats },
    links,
    isArchived: false,
    warning,
  },
}

export const ArchivedHeader: Story = {
  args: {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    stats: { summary: stats },
    links,
    isArchived: true,
    warning,
  },
}

export const UpcomingHeader: Story = {
  args: {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    stats: { summary: stats },
    links,
    isUpcoming: true,
  },
}

export const UnderReviewHeader: Story = {
  args: {
    title: project.display.name,
    icon: `/icons/${project.display.slug}.png`,
    stats: { summary: stats },
    links,
    showProjectUnderReview: true,
  },
}
