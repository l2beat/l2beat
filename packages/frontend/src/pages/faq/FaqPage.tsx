import React from 'react'

import { Footer, FooterProps, NavbarProps } from '../../components'
import { Page } from '../../components/Page'

export interface FaqPageProps {
  title: string
  content: string
  footer: FooterProps
  navbar: NavbarProps
}

export function FaqPage(props: FaqPageProps) {
  return (
    <Page navbar={props.navbar}>
      <article
        className="Faq"
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
      <Footer {...props.footer} />
    </Page>
  )
}
