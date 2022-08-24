import React, { useEffect } from 'react'

import { Chart as ChartComponent } from '../../components/chart/Chart'
import { Page } from '../../components/Page'
import { configureChart } from '../../scripts/chart'

export default {
  title: 'Components/Chart',
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}

export function Chart() {
  useEffect(() => {
    configureChart()
  }, [])
  return (
    <Page>
      <ChartComponent endpoint="/fakeTvl.json" />
    </Page>
  )
}
