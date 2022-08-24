import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { Chart as ChartComponent } from '../../components/chart/Chart'
import { configureChart } from '../../scripts/chart'
import { StoryPage } from '../utils/StoryPage'

export default {
  title: 'Components/Chart',
}

function Template() {
  useEffect(() => {
    configureChart()
  }, [])
  return (
    <StoryPage>
      <ChartComponent endpoint="/fakeTvl.json" />
    </StoryPage>
  )
}
export const Chart: Story = Template.bind({})
Chart.parameters = {
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}
