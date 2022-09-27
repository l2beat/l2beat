import React from 'react'

import {
  Chart,
  Footer,
  FooterProps,
  Header,
  NavbarProps,
} from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { ScalingPageSelection } from '../../../components/ScalingPageSelection'
import { ActivityView, ActivityViewProps } from './ActivityView'

export interface ActivityPageProps {
  txCount: string
  sevenDayChangeTxCount: string
  apiEndpoint: string
  activityView: ActivityViewProps
  footer: FooterProps
  navbar: NavbarProps
  showActivity: boolean
}

export function ActivityPage(props: ActivityPageProps) {
  return (
    <Page navbar={props.navbar}>
      <ScalingPageSelection
        showActivity={props.showActivity}
        selected="activity"
      />
      <main>
        <Header
          title="Activity"
          txCount={props.txCount}
          sevenDayChangeTxCount={props.sevenDayChangeTxCount}
        />
        <Chart endpoint={props.apiEndpoint} isPrototype={true}></Chart>
        <ActivityView {...props.activityView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
