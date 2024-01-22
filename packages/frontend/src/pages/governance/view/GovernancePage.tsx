import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { PageContent } from '../../../components/PageContent'

export interface GovernancePageProps {
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePage(props: GovernancePageProps){
  return <>
        <Navbar {...props.navbar} />
      <PageContent>

  XD
      </PageContent>
      <Footer {...props.footer} /></>
}
