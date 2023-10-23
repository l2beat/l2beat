import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../../components/other-sites/OtherSites'
import { PageContent } from '../../../../components/PageContent'
import {
  ScalingDetailedTvlView,
  ScalingDetailedTvlViewProps,
} from './ScalingDetailedTvlView'

export interface ScalingDetailedTvlPageProps {
  detailedTvlEndpoint: string
  navbar: NavbarProps
  footer: FooterProps
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
          selected="detailed"
        />
        <main className="mt-4 md:mt-12">
          <Chart
            settingsId="scaling-tvl"
            initialType={{ type: 'layer2-detailed-tvl' }}
            withHeader
          />
          <ScalingDetailedTvlView {...props.detailedTvlView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
