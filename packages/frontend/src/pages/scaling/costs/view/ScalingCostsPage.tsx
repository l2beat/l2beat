import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../../components/other-sites/OtherSites'
import { PageContent } from '../../../../components/PageContent'
import { ScalingCostsView, ScalingCostsViewProps } from './ScalingCostsView'

export interface ScalingCostsPageProps {
  costsView: ScalingCostsViewProps
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
  showLiveness: boolean
  showFinality: boolean
}

export function ScalingCostsPage(props: ScalingCostsPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showFinality={props.showFinality}
          showLiveness={props.showLiveness}
          selected="costs"
        />
        <main>
          <SimplePageHeader>Costs</SimplePageHeader>
          <ScalingCostsView {...props.costsView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
