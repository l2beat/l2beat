import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { About } from '../../../../components/About'
import { SimplePageHeader } from '../../../../components/header/SimplePageHeader'
import { ScalingNavigationTabs } from '../../../../components/navigation-tabs/ScalingNavigationTabs'
import { OtherSites } from '../../../../components/other-sites/OtherSites'
import { PageContent } from '../../../../components/PageContent'
import {
  FinalityDiagram,
  FinalityDiagramsSection,
} from './FinalityDiagramsSection'
import { FinalityWarning } from './FinalityWarning'
import {
  ScalingFinalityView,
  ScalingFinalityViewProps,
} from './ScalingFinalityView'

export interface FinalityPageProps {
  finalityView: ScalingFinalityViewProps
  diagrams: FinalityDiagram[]
  navbar: NavbarProps
  footer: FooterProps
  showActivity: boolean
  showLiveness: boolean
  showFinality: boolean
}

export function ScalingFinalityPage(props: FinalityPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          showActivity={props.showActivity}
          showFinality={props.showFinality}
          showLiveness={props.showLiveness}
          selected="finality"
        />
        <main>
          <SimplePageHeader>Finality</SimplePageHeader>
          <FinalityWarning />
          <ScalingFinalityView {...props.finalityView} />
          <FinalityDiagramsSection
            className="mt-20"
            diagrams={props.diagrams}
          />
          <OtherSites />
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
