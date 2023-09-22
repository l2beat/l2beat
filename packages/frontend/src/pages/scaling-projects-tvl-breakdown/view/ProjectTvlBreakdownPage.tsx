import React from 'react'

import { Footer, FooterProps, Navbar, NavbarProps } from '../../../components'
import { PageContent } from '../../../components/PageContent'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'
import {
  TvlBreakdownHeader,
  TvlBreakdownHeaderProps,
} from './TvlBreakdownHeader'
import { TvlBreakdownView } from './TvlBreakdownView'

export interface TvlBreakdownPageProps {
  navbar: NavbarProps
  tvlBreakdownHeader: TvlBreakdownHeaderProps
  tvlBreakdownView: TvlBreakdownViewProps
  footer: FooterProps
}

export function ProjectTvlBreakdownPage(props: TvlBreakdownPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent mobileFull className="max-w-[928px]">
        <TvlBreakdownHeader {...props.tvlBreakdownHeader} />
        <TvlBreakdownView {...props.tvlBreakdownView} />
      </PageContent>
      <Footer narrow {...props.footer} />
    </>
  )
}
