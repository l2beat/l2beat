import React from 'react'

import {
  Footer,
  FooterProps,
  HeaderProps,
  Navbar,
  NavbarProps,
} from '../../../components'
import { PageContent } from '../../../components/PageContent'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'
import {
  TvlBreakdownHeader,
  TvlBreakdownHeaderProps,
} from './TvlBreakdownHeader'
import { TvlBreakdownView } from './TvlBreakdownView'

export interface TvlBreakdownPageProps {
  navbar: NavbarProps
  header: HeaderProps
  tvlBreakdownHeader: TvlBreakdownHeaderProps
  tvlBreakdownView: TvlBreakdownViewProps
  footer: FooterProps
}

export function ProjectTvlBreakdownPage(props: TvlBreakdownPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent mobileFull>
        <TvlBreakdownHeader {...props.tvlBreakdownHeader} />
        <TvlBreakdownView {...props.tvlBreakdownView} />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
