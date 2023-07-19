import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../components'
import { About } from '../../components/About'
import { MultisigReportAnnouncementBar } from '../../components/announcement/AnnouncementBar'
import { BridgesMvpWarning } from '../../components/BridgesMvpWarning'
import { FloatingBanner } from '../../components/floating-banner/FloatingBanner'
import { TvlHeader } from '../../components/header/TvlHeader'
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
  showMultisigReport: boolean
}

export function BridgesTvlPage(props: BridgesTvlPageProps) {
  return (
    <>
      {props.showMultisigReport && (
        <>
          <MultisigReportAnnouncementBar />
          <FloatingBanner />
        </>
      )}
      <Navbar {...props.navbar} />
      <PageContent>
        <BridgesNavigationTabs selected="summary" />
        <main>
          <div data-bridges-only-cell>
            <TvlHeader
              tvl={props.bridgesTvl}
              tvlWeeklyChange={props.bridgesTvlSevenDayChange}
            />
          </div>
          <div data-combined-only-cell className="hidden">
            <TvlHeader
              tvl={props.combinedTvl}
              tvlWeeklyChange={props.combinedTvlSevenDayChange}
            />
          </div>
          <BridgesMvpWarning />
          <Chart tvlEndpoint={props.tvlEndpoint} />
          <BridgesTvlView {...props.tvlView} />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
