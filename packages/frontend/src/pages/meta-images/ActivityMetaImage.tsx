import React from 'react'

import { Chart, Logo } from '../../components'
import { MetaImageHeader } from './MetaImageHeader'

export interface ActivityMetaImageProps {
  tpsDaily: string
  tpsWeeklyChange: string
  fake?: boolean
}

export function ActivityMetaImage(props: ActivityMetaImageProps) {
  return (
    <div className="leading-[1.15]">
      <MetaImageHeader
        title="Activity"
        isProject={false}
        tpsDaily={props.tpsDaily}
        tpsWeeklyChange={props.tpsWeeklyChange}
      />
      <Chart
        settingsId="meta"
        initialType={
          props.fake
            ? { type: 'storybook-fake-activity' }
            : { type: 'layer2-activity' }
        }
        metaChart
      />
      <Logo
        className="absolute left-1/2 top-1/2 z-100 h-auto w-[250px] -translate-x-1/2 -translate-y-1/2"
        animated={false}
      />
    </div>
  )
}
