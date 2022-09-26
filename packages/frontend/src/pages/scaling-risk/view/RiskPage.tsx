import React from 'react'

import { Footer, FooterProps, Header } from '../../../components'
import { About } from '../../../components/About'
import { OtherSites } from '../../../components/OtherSites'
import { Page } from '../../../components/Page'
import { ScalingPageSelection } from '../../../components/ScalingPageSelection'
import { RiskView, RiskViewProps } from './RiskView'

export interface RiskPageProps {
  riskView: RiskViewProps
  footer: FooterProps
}

export function RiskPage(props: RiskPageProps) {
  return (
    <Page>
      <ScalingPageSelection selected="risk" />
      <main>
        <Header title="Risk Analysis" />
        <RiskView {...props.riskView} />
        <OtherSites />
        <About />
      </main>
      <Footer {...props.footer} />
    </Page>
  )
}
