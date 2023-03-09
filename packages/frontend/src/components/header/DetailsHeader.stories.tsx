import { Story } from '@storybook/react'
import React from 'react'

import { formatLargeNumber } from '../../utils'
import { PageContent } from '../PageContent'
import { TechnologyCell } from '../table/TechnologyCell'
import {
  DetailsHeader as DetailsHeaderComponent,
  HeaderProps,
} from './DetailsHeader'
import { StatWithChange } from './stats/StatWithChange'

export default {
  title: 'Components/DetailsHeader',
}

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
    title: 'Technology',
    value: <TechnologyCell>{project.technology.category}</TechnologyCell>,
  },
]

function Template(props: HeaderProps) {
  return (
    <PageContent>
      <DetailsHeaderComponent {...props} />
    </PageContent>
  )
}

export const DetailsHeader: Story<HeaderProps> = Template.bind({})
DetailsHeader.args = {
  title: project.display.name,
  icon: `/icons/${project.display.slug}.png`,
  stats: stats,
  isArchived: false,
}

export const ArchivedHeader: Story<HeaderProps> = Template.bind({})
ArchivedHeader.args = {
  title: project.display.name,
  icon: `/icons/${project.display.slug}.png`,
  stats: stats,
  isArchived: true,
}

export const UpcomingHeader: Story<HeaderProps> = Template.bind({})
UpcomingHeader.args = {
  title: project.display.name,
  icon: `/icons/${project.display.slug}.png`,
  stats: stats,
  isUpcoming: true,
}
