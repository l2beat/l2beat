import React from 'react'

import { Footer, Navbar } from '../../components'

export interface FaqPageProps {
  title: string
  content: string
}

export function FaqPage(props: FaqPageProps) {
  return (
    <div className="Page leading-[1.15]">
      <Navbar />
      <article
        className="Faq"
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
      <Footer />
    </div>
  )
}
