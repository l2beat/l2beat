import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureExpandableContainer } from '../../scripts/configureExpandableContainer'
import { MilestonesSection, MilestonesSectionProps } from './MilestonesSection'

export default {
  title: 'Components/Project/MilestonesSection',
}

type TemplateProps = Omit<MilestonesSectionProps, 'title' | 'id'>

function Template(props: TemplateProps) {
  useEffect(() => configureExpandableContainer(), [])
  return (
    <div className="p-4">
      <MilestonesSection title="Milestones" id="milestones" {...props} />
    </div>
  )
}

export const Collapsed: Story<TemplateProps> = Template.bind({})
Collapsed.args = {
  milestones: [
    {
      name: 'Creation of Arbitrum One',
      link: 'https://l2beat.com',
      date: '2019-11-14T00:00:00Z',
    },
    {
      name: 'Arbitrum Odyssey begins',
      link: 'https://l2beat.com',
      date: '2022-06-25T00:00:00Z',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
    },
    {
      name: 'Nitro upgrade is activated',
      link: 'https://l2beat.com',
      date: '2022-08-31T00:00:00Z',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
    },
  ],
}

export function Expanded() {
  useEffect(() => {
    document.querySelector<HTMLElement>('.ExpandableContainerButton')?.click()
  }, [])
  return (
    <Template
      milestones={[
        {
          name: 'Creation of Arbitrum One',
          link: 'https://l2beat.com',
          date: '2019-11-14T00:00:00Z',
        },
        {
          name: 'Arbitrum Odyssey begins',
          link: 'https://l2beat.com',
          date: '2022-06-25T00:00:00Z',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
        },
        {
          name: 'Nitro upgrade is activated',
          link: 'https://l2beat.com',
          date: '2022-08-31T00:00:00Z',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
        },
      ]}
    />
  )
}

export const NotExpandable: Story<TemplateProps> = Template.bind({})
NotExpandable.args = {
  milestones: [
    {
      name: 'Creation of Arbitrum One',
      link: 'https://l2beat.com',
      date: '2019-11-14T00:00:00Z',
    },
    {
      name: 'Arbitrum Odyssey begins',
      link: 'https://l2beat.com',
      date: '2022-06-25T00:00:00Z',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis dui eu odio aliquam, in sodales dolor lacinia. Aliquam pharetra malesuada urna turpis.',
    },
  ],
}
