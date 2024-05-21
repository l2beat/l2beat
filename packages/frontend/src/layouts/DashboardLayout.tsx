import React, { ReactNode } from 'react'

import { Footer } from '../components'
import { About } from '../components/About'
import { PageContent } from '../components/PageContent'
import { NavWrapper } from '../components/navbar/NavWrapper'

export interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <NavWrapper>
      <PageContent>
        <main className="mt-4 md:mt-12">
          {props.children}
          <About />
        </main>
      </PageContent>
      <Footer />
    </NavWrapper>
  )
}
