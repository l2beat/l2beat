import React from 'react'

import { Footer, Navbar } from '../../../../components'
import { PageContent } from '../../../../components/PageContent'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'
import {
  TvlBreakdownHeader,
  TvlBreakdownHeaderProps,
} from './TvlBreakdownHeader'
import { TvlBreakdownView } from './TvlBreakdownView'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'

export interface TvlBreakdownPageProps {
  tvlBreakdownHeader: TvlBreakdownHeaderProps
  tvlBreakdownView: TvlBreakdownViewProps
}

export function ProjectTvlBreakdownPage(props: TvlBreakdownPageProps) {
  return (
    <DashboardLayout hideOtherSites>
      <PageContent mobileFull className="max-w-[928px]">
        <TvlBreakdownHeader {...props.tvlBreakdownHeader} />
        <TvlBreakdownView {...props.tvlBreakdownView} />
      </PageContent>
    </DashboardLayout>
  )
}
