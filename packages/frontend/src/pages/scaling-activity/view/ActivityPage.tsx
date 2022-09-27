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
  tpsDaily: string
  tpsWeeklyChange: string
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
          tpsDaily={props.tpsDaily}
          tpsWeeklyChange={props.tpsWeeklyChange}
        />
<<<<<<< HEAD
        <Chart endpoint={props.apiEndpoint} hideControls></Chart>
=======
        <Chart endpoint={props.apiEndpoint} isPrototype={true}></Chart>
>>>>>>> 6d32d83f (hide part of chart UI)
        <ActivityView {...props.activityView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
