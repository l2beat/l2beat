import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Header,
  NavbarProps,
} from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { ScalingPageSelection } from '../../../components/ScalingPageSelection'
import { ScalingTvlView, ScalingTvlViewProps } from './ScalingTvlView'

export interface TvlPageProps {
  tvl: string
  sevenDayChange: string
  apiEndpoint: string
  tvlView: ScalingTvlViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
}

export function ScalingTvlPage(props: TvlPageProps) {
  return (
    <Page navbar={props.navbar}>
      <ScalingPageSelection showActivity={props.showActivity} selected="tvl" />
      <main>
        <Header
          title="Value locked"
          tvl={props.tvl}
          sevenDayChange={props.sevenDayChange}
        />
        <Chart endpoint={props.apiEndpoint} />
        <ScalingTvlView {...props.tvlView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
