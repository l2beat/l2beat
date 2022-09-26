import React from 'react'

import { Footer, FooterProps } from '../../components'
import { Page } from '../../components/Page'

export interface FaqPageProps {
  title: string
  content: string
  footer: FooterProps
}

export function FaqPage(props: FaqPageProps) {
  return (
    <Page>
      <article
        className="Faq"
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
      <Footer {...props.footer} />
    </Page>
  )
}
