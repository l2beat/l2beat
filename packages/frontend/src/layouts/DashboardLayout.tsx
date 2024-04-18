import React, { ReactNode } from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../components'
import { About } from '../components/About'
import { OtherSites } from '../components/other-sites/OtherSites'
import { PageContent } from '../components/PageContent'

export interface DashboardLayoutProps {
  navbar: NavbarProps
  footer: FooterProps
  hideOtherSites?: boolean
  tabs: ReactNode
  children: ReactNode
}

export function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        {props.tabs}
        <main className="mt-4 md:mt-12">
          {props.children}
          {!props.hideOtherSites && <OtherSites />}
          <About />
        </main>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
