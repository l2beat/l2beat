import React from 'react'

import { Chart, Header, Logo } from '../../components'

export interface ActivityMetaImageProps {
  tpsDaily: string
  tpsWeeklyChange: string
}

export function ActivityMetaImage(props: ActivityMetaImageProps) {
  const name = 'Activity'

  return (
    <div className={'MetaImage overview leading-[1.15]'}>
      <Header
        showTps
        title={name}
        titleClassName={name.length > 12 ? '!text-5xl' : undefined}
        tpsDaily={props.tpsDaily}
        tpsWeeklyChange={props.tpsWeeklyChange}
      />
      <Chart initialType={{ type: 'layer2-activity' }} metaChart />
      <Logo />
    </div>
  )
}
