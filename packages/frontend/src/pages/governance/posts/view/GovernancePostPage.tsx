import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Markdown } from '../../../../components/Markdown'
import { PageContent } from '../../../../components/PageContent'

export interface GovernancePostPageProps {
  post: GovernancePost
  navbar: NavbarProps
  footer: FooterProps
}

export interface GovernancePost {
  title: string
  slug: string
  content: string
}

export function GovernancePostPage(props: GovernancePostPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <Markdown>{props.post.content}</Markdown>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
