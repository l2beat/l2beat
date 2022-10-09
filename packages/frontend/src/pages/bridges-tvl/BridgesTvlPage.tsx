import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../components'
import { About } from '../../components/About'
import { BridgesMvpWarning } from '../../components/BridgesMvpWarning'
import { TvlHeader } from '../../components/header/TvlHeader'
import { IncludeLayer2sCheckbox } from '../../components/IncludeLayer2sCheckbox'
import { BridgesNavigationTabs } from '../../components/navigation-tabs/BridgesNavigationTabs'
import { PageContent } from '../../components/PageContent'
import { BridgesTvlView, BridgesTvlViewProps } from './BridgesTvlView'

export interface BridgesTvlPageProps {
  bridgesTvl: string
  bridgesTvlSevenDayChange: string
  combinedTvl: string
  combinedTvlSevenDayChange: string
  tvlEndpoint: string
  tvlView: BridgesTvlViewProps
  footer: FooterProps
  navbar: NavbarProps
}

export function BridgesTvlPage(props: BridgesTvlPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <BridgesNavigationTabs selected="tvl" />
        <main>
          <div data-bridges-only>
            <TvlHeader
              tvl={props.bridgesTvl}
              tvlWeeklyChange={props.bridgesTvlSevenDayChange}
            />
          </div>
          <div data-combined-only className="hidden">
            <TvlHeader
              tvl={props.combinedTvl}
              tvlWeeklyChange={props.combinedTvlSevenDayChange}
            />
          </div>
          <BridgesMvpWarning />
          <Chart tvlEndpoint={props.tvlEndpoint} />
          <IncludeLayer2sCheckbox className="mt-8 -mb-4" />
          <BridgesTvlView {...props.tvlView} />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
