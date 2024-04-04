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
import {
  ScalingDataAvailabilityView,
  ScalingDataAvailabilityViewProps,
} from './ScalingDataAvailabilityView'

export interface ScalingDataAvailabilityPageProps {
  dataAvailabilityView: ScalingDataAvailabilityViewProps
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingDataAvailabilityPage(
  props: ScalingDataAvailabilityPageProps,
) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
          selected="data-availability"
        />
        <main>
          <SimplePageHeader>Data Availability</SimplePageHeader>
          <ScalingDataAvailabilityView {...props.dataAvailabilityView} />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
