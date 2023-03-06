import { Story } from '@storybook/react'
import React from 'react'

import {
  ScalingTableFilters as ScalingTableFiltersComponent,
  ScalingTableFiltersProps,
} from './ScalingTableFilters'

export default {
  title: 'Components/Table/ScalingFilters',
}

function Template(props: ScalingTableFiltersProps) {
  return (
    <div className="p-10">
      <ScalingTableFiltersComponent {...props} />
    </div>
  )
}

export const AllFilters: Story<ScalingTableFiltersProps> = Template.bind({})
AllFilters.args = {
  upcomingEnabled: true,
}

export const UpcomingHidden: Story<ScalingTableFiltersProps> = Template.bind({})
UpcomingHidden.args = {
  upcomingEnabled: false,
}
