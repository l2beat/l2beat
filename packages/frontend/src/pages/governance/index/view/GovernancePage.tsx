import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Link } from '../../../../components/Link'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePost } from '../../posts/view/GovernancePostPage'

export interface GovernancePageProps {
  posts: GovernancePost[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePage(props: GovernancePageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        Governance page
        {props.posts.map((post) => (
          <div key={post.slug}>
            <Link href={`/governance/posts/${post.slug}`}>{post.title}</Link>
          </div>
        ))}
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
