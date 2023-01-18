import { layer2s } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { Story } from '@storybook/react'
import React from 'react'

import { formatLargeNumber } from '../../utils'
import { PageContent } from '../PageContent'
import { TechnologyCell } from '../table/TechnologyCell'
import { DetailsHeader as DetailsHeaderComponent } from './DetailsHeader'
import { StatWithChange } from './stats/StatWithChange'

export default {
  title: 'Components/DetailsHeader',
}

interface TemplateProps {
  projectId: ProjectId
}

function Template({ projectId }: TemplateProps) {
  const project = layer2s.find((x) => x.id === projectId)

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
      value: project?.display.purpose,
    },
    {
      title: 'Technology',
      value: (
        <TechnologyCell>{project?.technology.category ?? ''}</TechnologyCell>
      ),
    },
  ]

  return (
    <PageContent>
      <DetailsHeaderComponent
        title={project?.display.name ?? ''}
        icon={project?.display.slug && `/icons/${project.display.slug}.png`}
        stats={stats}
      />
    </PageContent>
  )
}

export const HeaderDetails: Story<TemplateProps> = Template.bind({})

HeaderDetails.args = {
  projectId: ProjectId('arbitrum'),
}
