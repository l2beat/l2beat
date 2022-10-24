import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { About } from '../../../components/About'
import { TvlHeader } from '../../../components/header/TvlHeader'
import { ScalingNavigationTabs } from '../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../components/OtherSites'
import { PageContent } from '../../../components/PageContent'
import { ScalingTvlView, ScalingTvlViewProps } from './ScalingTvlView'

export interface TvlPageProps {
  tvl: string
  tvlWeeklyChange: string
  tvlEndpoint: string
  tvlView: ScalingTvlViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
}

export function ScalingTvlPage(props: TvlPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          selected="tvl"
        />
        <main>
          <TvlHeader tvl={props.tvl} tvlWeeklyChange={props.tvlWeeklyChange} />
          <Chart tvlEndpoint={props.tvlEndpoint} />
          <ScalingTvlView {...props.tvlView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
