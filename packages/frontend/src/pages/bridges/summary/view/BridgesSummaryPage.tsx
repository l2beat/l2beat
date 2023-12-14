import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
import { BridgesMvpWarning } from '../../../../components/BridgesMvpWarning'
import { BridgesNavigationTabs } from '../../../../components/navigation-tabs/BridgesNavigationTabs'
import { PageContent } from '../../../../components/PageContent'
import {
  BridgesSummaryView,
  BridgesSummaryViewProps,
} from './BridgesSummaryView'

export interface BridgesSummaryPageProps {
  tvlView: BridgesSummaryViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesSummaryPage(props: BridgesSummaryPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <BridgesNavigationTabs selected="summary" />
        <main className="mt-4 md:mt-12">
          <BridgesMvpWarning />
          <Chart
            settingsId="bridges-tvl"
            initialType={{ type: 'bridges-tvl', includeCanonical: false }}
            header="tvl"
          />
          <BridgesSummaryView {...props.tvlView} />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
