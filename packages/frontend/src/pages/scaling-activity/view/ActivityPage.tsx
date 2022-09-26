import React from 'react'

import { Footer, FooterProps, Header, NavbarProps } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { ScalingPageSelection } from '../../../components/ScalingPageSelection'
import { ActivityView, ActivityViewProps } from './ActivityView'

export interface ActivityPageProps {
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
        <Header title="Activity" />
        <ActivityView {...props.activityView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
