import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
import {
  TvlBreakdownHeader,
  TvlBreakdownHeaderProps,
} from './TvlBreakdownHeader'
import { TvlBreakdownView, TvlBreakdownViewProps } from './TvlBreakdownView'

export interface TvlBreakdownPageProps {
  navbar: NavbarProps
  header: HeaderProps
  tvlBreakdownHeader: TvlBreakdownHeaderProps
  tvlBreakdownView: TvlBreakdownViewProps
  footer: FooterProps
}

export function ProjectPage(props: TvlBreakdownPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <TvlBreakdownHeader {...props.tvlBreakdownHeader} />
        <TvlBreakdownView {...props.tvlBreakdownView} />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
