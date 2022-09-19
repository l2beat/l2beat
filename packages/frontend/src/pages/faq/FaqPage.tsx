import React from 'react'

import { Footer } from '../../components'
import { Page } from '../../components/Page'

export interface FaqPageProps {
  title: string
  content: string
}

export function FaqPage(props: FaqPageProps) {
  return (
    <Page>
      <article
        className="Faq"
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
      <Footer />
    </Page>
  )
}
