import { Story } from '@storybook/react'
import React from 'react'

import { StageBadge } from './StageBadge'

export default {
  title: 'Components/Stages',
}

interface TemplateProps {
  category: 'Stage 0' | 'Stage 1' | 'Stage 2' | undefined
  small?: boolean
}

function Template(props: TemplateProps) {
  return (
    <div className="m-4 ml-32">
      <StageBadge category={props.category} small={props.small} />
    </div>
  )
}

export const Badge: Story<TemplateProps> = Template.bind({})
Badge.argTypes = {
  category: {
    control: 'radio',
    options: ['Stage 0', 'Stage 1', 'Stage 2', undefined],
  },
  small: {
    control: 'radio',
    options: [true, false],
  },
}
Badge.args = {
  category: 'Stage 0',
  small: false,
}
