import React from 'react'

import { HeaderProps, Navbar, NavbarProps } from '../../../components'
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
}

export function ProjectTvlBreakdownPage(props: TvlBreakdownPageProps) {
  return (
    <>
      <Navbar {...props.navbar} />
      <PageContent>
        <TvlBreakdownHeader {...props.tvlBreakdownHeader} />
        <TvlBreakdownView {...props.tvlBreakdownView} />
      </PageContent>
    </>
  )
}
