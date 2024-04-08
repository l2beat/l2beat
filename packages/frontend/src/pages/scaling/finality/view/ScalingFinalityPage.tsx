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

export interface ScalingFinalityPageProps {
  finalityView: ScalingFinalityViewProps
  diagrams: FinalityDiagram[]
  navbar: NavbarProps
  footer: FooterProps
}

export function ScalingFinalityPage(props: ScalingFinalityPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ScalingNavigationTabs
          features={props.navbar.features}
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
