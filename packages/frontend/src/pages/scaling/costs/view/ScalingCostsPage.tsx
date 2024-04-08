import { Milestone } from '@l2beat/config'
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
import { ScalingCostsView, ScalingCostsViewProps } from './ScalingCostsView'

export interface ScalingCostsPageProps {
  costsView: ScalingCostsViewProps
  navbar: NavbarProps
  footer: FooterProps
  milestones: Milestone[] | undefined
}

export function ScalingCostsPage(props: ScalingCostsPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="costs"
        />
        <main className="mt-4 md:mt-12">
          <Chart
            settingsId="scaling-costs"
            initialType={{ type: 'scaling-costs' }}
            milestones={props.milestones}
            header="costs"
          />
          <ScalingCostsView {...props.costsView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
