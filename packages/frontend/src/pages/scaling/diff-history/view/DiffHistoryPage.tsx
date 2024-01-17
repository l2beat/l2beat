import React from 'react'

import {
  Footer,
  FooterProps,
  Navbar,
  NavbarProps,
} from '../../../../components'
import {
  ProjectSubPageHeader,
  ProjectSubPageHeaderProps,
} from '../../../../components/header/ProjectSubPageHeader'
import { Markdown } from '../../../../components/Markdown'
import { PageContent } from '../../../../components/PageContent'

export interface DiffHistoryPageProps {
  markdown: string
  navbar: NavbarProps
  footer: FooterProps
  header: ProjectSubPageHeaderProps
}

export function DiffHistoryPage(props: DiffHistoryPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <ProjectSubPageHeader {...props.header} className="mt-11" />
        <article className="prose mx-auto dark:prose-invert lg:max-w-none lg:prose-xl">
          <Markdown withoutDefaultStyling>{props.markdown}</Markdown>
        </article>
      </PageContent>
      <Footer {...props.footer} />
    </>
  )
}
