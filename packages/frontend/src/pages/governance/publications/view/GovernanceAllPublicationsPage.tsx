import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Link } from '../../../../components/Link'
import { PageContent } from '../../../../components/PageContent'
import { GovernancePublicationEntry } from '../../getGovernancePublicationEntry'

export interface GovernanceAllPublicationsPageProps {
  publications: GovernancePublicationEntry[]
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernanceAllPublicationsPage(
  props: GovernanceAllPublicationsPageProps,
) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        All Publications
        {props.publications.map((post) => (
          <div key={post.id}>
            <Link href={`/governance/posts/${post.id}`}>{post.title}</Link>
          </div>
        ))}
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
