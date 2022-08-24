import React from 'react'

import { Footer, Navbar } from '../../components'
import { Page } from '../../components/Page'

export interface FaqPageProps {
  title: string
  content: string
}

export function FaqPage(props: FaqPageProps) {
  return (
    <Page>
      <Navbar />
      <article
        className="Faq"
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
      <Footer />
    </Page>
  )
}
