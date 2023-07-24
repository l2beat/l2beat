import React from 'react'

import { Chart, Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { TvlHeader } from '../../../components/header/TvlHeader'
import { ScalingNavigationTabs } from '../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../components/other-sites/OtherSites'
import { PageContent } from '../../../components/PageContent'
import { DetailedTvlView, DetailedTvlViewProps } from './DetailedTvlView'

export interface L2AssetsPageProps {
  tvl: string
  tvlWeeklyChange: string
  navbar: NavbarProps
  footer: FooterProps
  showL2Assets: boolean
  showActivity: boolean
  detailedTvlView: DetailedTvlViewProps
}

export function L2AssetsPage(props: L2AssetsPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showTvlBreakdown={props.showL2Assets}
          selected="detailed"
        />
        <main>
          <TvlHeader tvl={props.tvl} tvlWeeklyChange={props.tvlWeeklyChange} />
          <Chart detailedTvlEndpoint={"halucinate_data"} type={"detailedTvl"}/>
          <DetailedTvlView {...props.detailedTvlView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
