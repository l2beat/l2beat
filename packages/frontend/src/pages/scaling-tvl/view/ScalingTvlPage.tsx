import { Milestone } from '@l2beat/config'
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
import { ReportBannerWithButton } from '../../../components/report/ReportBannerWithButton'
import { ScalingTvlView, ScalingTvlViewProps } from './ScalingTvlView'

export interface TvlPageProps {
  tvl: string
  tvlWeeklyChange: string
  tvlEndpoint: string
  tvlView: ScalingTvlViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
  showMultisigReport: boolean
  milestones?: Milestone[]
}

export function ScalingTvlPage(props: TvlPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          selected="summary"
        />
        <main>
          <TvlHeader tvl={props.tvl} tvlWeeklyChange={props.tvlWeeklyChange} />
          <Chart
            tvlEndpoint={props.tvlEndpoint}
            milestones={props.milestones}
          />
          <ScalingTvlView {...props.tvlView} />
          {props.showMultisigReport && <ReportBannerWithButton />}
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
