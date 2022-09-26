import React from 'react'

import { Footer, Header } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { ScalingPageSelection } from '../../../components/ScalingPageSelection'
import { ActivityView, ActivityViewProps } from './ActivityView'

export interface ActivityPageProps {
  activityView: ActivityViewProps
}

export function ActivityPage(props: ActivityPageProps) {
  return (
    <Page>
      <ScalingPageSelection selected="activity" />
      <main>
        <Header title="Activity" />
        <ActivityView {...props.activityView} />
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
