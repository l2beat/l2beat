import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Header,
  NavbarProps,
} from '../../components'
import { About } from '../../components/About'
import { BridgesPageSelection } from '../../components/BridgesPageSelection'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { BridgesTvlView, BridgesTvlViewProps } from './BridgesTvlView'

export interface BridgesTvlPageProps {
  bridgesTvl: string
  bridgesTvlSevenDayChange: string
  combinedTvl: string
  combinedTvlSevenDayChange: string
  apiEndpoint: string
  tvlView: BridgesTvlViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesTvlPage(props: BridgesTvlPageProps) {
  return (
    <Page navbar={props.navbar}>
      <BridgesPageSelection selected="tvl" />
      <main>
        <label>
          <input id="combined-bridges" type="checkbox" />{' '}
          <span>Include Layer2s as bridges</span>
        </label>
        <div data-bridges-only>
          <Header
            title="Value locked"
            tvl={props.bridgesTvl}
            tvlWeeklyChange={props.bridgesTvlSevenDayChange}
          />
        </div>
        <div data-combined-only className="hidden">
          <Header
            title="Value locked"
            tvl={props.combinedTvl}
            tvlWeeklyChange={props.combinedTvlSevenDayChange}
          />
        </div>
        <Chart endpoint={props.apiEndpoint} />
        <BridgesTvlView {...props.tvlView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
