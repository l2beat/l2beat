import React, { ReactNode } from 'react'

import { Footer } from '../components'
import { About } from '../components/About'
import { PageContent } from '../components/PageContent'
import { NavWrapper } from '../components/navbar/NavWrapper'
import { usePageBuildContext } from '../build/pageBuildContext'
import { OtherSites } from '../components/other-sites/OtherSites'
import { cn } from '../utils/cn'

export interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout(props: DashboardLayoutProps) {
  const { path } = usePageBuildContext()

  // Enable new layout for /scaling and /bridges pages, but not for detailed project pages
  const scalingOrBridges =
    ['/scaling', '/bridges'].some((p) => path.startsWith(p)) &&
    !path.includes('/projects')

  return (
    <NavWrapper legacyNav={!scalingOrBridges}>
      <PageContent
        className={cn(
          // This is a bit of a hack to make sure the page content is full height (and the footer is out of view)
          'min-h-[calc(100vh_-_5rem)]',
          // When using the legacy layout we need to take header height into account
          !scalingOrBridges &&
            'max-w-none px-0 md:px-0 min-h-[calc(100vh_-_13.5rem)]',
        )}
      >
        <main className={cn(!!scalingOrBridges && 'mt-4 md:mt-12 relative')}>
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
