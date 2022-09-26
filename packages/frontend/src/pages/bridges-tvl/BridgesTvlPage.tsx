import React from 'react'

import { Footer, FooterProps, Header } from '../../components'
import { About } from '../../components/About'
import { BridgesPageSelection } from '../../components/BridgesPageSelection'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { BridgesTvlViewProps, TvlView } from './BridgesTvlView'

export interface BridgesTvlPageProps {
  tvlView: BridgesTvlViewProps
  footer: FooterProps
}

export function BridgesTvlPage(props: BridgesTvlPageProps) {
  return (
    <Page>
      <BridgesPageSelection selected="tvl" />
      <main>
        <Header title="Value locked" />
        <TvlView {...props.tvlView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
