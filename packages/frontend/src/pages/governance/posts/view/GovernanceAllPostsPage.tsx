import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Link } from '../../../../components/Link'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePostEntry } from '../../getGovernancePostEntry'

export interface GovernanceAllPostsPageProps {
  posts: GovernancePostEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernanceAllPostsPage(props: GovernanceAllPostsPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        All posts
        {props.posts.map((post) => (
          <div key={post.id}>
            <Link href={`/governance/posts/${post.id}`}>{post.title}</Link>
          </div>
        ))}
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
