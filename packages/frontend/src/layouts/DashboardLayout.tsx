import React, { ReactNode } from 'react'

import { Footer } from '../components'
import { About } from '../components/About'
import { PageContent } from '../components/PageContent'
import { NavWrapper } from '../components/navbar/NavWrapper'
import { usePageBuildContext } from '../components/navbar/navigationContext'
import { OtherSites } from '../components/other-sites/OtherSites'

export interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout(props: DashboardLayoutProps) {
  const { path } = usePageBuildContext()
  const scalingOrBridges = ['/scaling', '/bridges'].some((p) =>
    path.startsWith(p),
  )
  return (
    <NavWrapper legacyNav={!scalingOrBridges}>
      <PageContent>
        <main className="mt-4 md:mt-12">
          {props.children}
          {scalingOrBridges && (
            <>
              <OtherSites />
              <About />
            </>
          )}
        </main>
      </PageContent>
      <Footer />
    </NavWrapper>
  )
}
