import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../components'
import { About } from '../../components/About'
import { BridgesPageSelection } from '../../components/BridgesPageSelection'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { BridgesTvlViewProps, TvlView } from './BridgesTvlView'

export interface BridgesTvlPageProps {
  tvlView: BridgesTvlViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesTvlPage(props: BridgesTvlPageProps) {
  return (
    <Page navbar={props.navbar}>
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
