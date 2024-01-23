import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Markdown } from '../../../../components/Markdown'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePostEntry } from '../../getGovernancePostEntry'

export interface GovernancePostPageProps {
  post: GovernancePostEntry
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePostPage(props: GovernancePostPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        {props.post.author.data.firstName} {props.post.author.data.lastName}
        <Markdown>{props.post.content}</Markdown>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
