import React from 'react'

import { Footer, Navbar, Page } from '../../components'
import { FaqPageProps } from './getProps'

export function FaqPage(props: FaqPageProps) {
  return (
    <Page metadata={props.metadata}>
      <Navbar />
      <article
        className="Faq"
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
      <Footer />
    </Page>
  )
}
