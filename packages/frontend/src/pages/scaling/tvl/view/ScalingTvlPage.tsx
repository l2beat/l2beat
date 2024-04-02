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
import { ScalingTvlView, ScalingTvlViewProps } from './ScalingTvlView'

export interface ScalingTvlPageProps {
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
  showLiveness: boolean
  showFinality: boolean
  tvlView: ScalingTvlViewProps
}

export function ScalingTvlPage(props: ScalingTvlPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showLiveness={props.showLiveness}
          showFinality={props.showFinality}
          selected="detailed"
        />
        <main className="mt-4 md:mt-12">
          <Chart
            settingsId="scaling-tvl"
            initialType={{ type: 'scaling-detailed-tvl' }}
            header="tvl"
          />
          <ScalingTvlView {...props.tvlView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
