import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../components'
import { PageContent } from '../../components/PageContent'

export interface FaqPageProps {
  title: string
  content: string
  footer: FooterProps
  navbar: NavbarProps
}

export function FaqPage(props: FaqPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent narrow>
        <article
          className="Faq"
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
