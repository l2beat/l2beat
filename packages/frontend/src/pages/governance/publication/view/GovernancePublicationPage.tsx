import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import { Markdown } from '../../../../components/Markdown'
import { PageContent } from '../../../../components/PageContent'
import { CollectionEntry } from '../../../../content/getCollection'

export interface GovernancePublicationPageProps {
  publication: CollectionEntry<'publications'>
  navbar: NavbarProps
  footer: FooterProps
}

export function GovernancePublicationPage(
  props: GovernancePublicationPageProps,
) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent type="wider" className="mt-20">
        <Markdown>{props.publication.content}</Markdown>
      </PageContent>
      <Footer {...props.footer} className="mt-0 md:mt-20" />
    </>
  )
}
