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
import { PageContent } from '../../../components/PageContent'
import {
  ScalingDetailedTvlView,
  ScalingDetailedTvlViewProps,
} from './ScalingDetailedTvlView'

export interface ScalingDetailedTvlPageProps {
  tvl: string
  tvlWeeklyChange: string
  detailedTvlEndpoint: string
  navbar: NavbarProps
  footer: FooterProps
  showDetailedTvl: boolean
  showActivity: boolean
  detailedTvlView: ScalingDetailedTvlViewProps
}

export function ScalingDetailedTvlPage(props: ScalingDetailedTvlPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showDetailedTvl={props.showDetailedTvl}
          selected="detailed"
        />
        <main>
          <TvlHeader tvl={props.tvl} tvlWeeklyChange={props.tvlWeeklyChange} />
          <Chart
            detailedTvlEndpoint={props.detailedTvlEndpoint}
            type="detailedTvl"
          />
          <ScalingDetailedTvlView {...props.detailedTvlView} />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
