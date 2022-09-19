import React from 'react'

import { Footer, Header } from '../../components'
import { About } from '../../components/About'
import { BridgesPageSelection } from '../../components/BridgesPageSelection'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { BridgesTvlViewProps, TvlView } from './BridgesTvlView'

export type BridgesTvlPageProps = BridgesTvlViewProps

export function BridgesTvlPage(props: BridgesTvlPageProps) {
  return (
    <Page>
      <BridgesPageSelection selected="tvl" />
      <main>
        <Header title="Value locked" />
        <TvlView {...props} />
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
