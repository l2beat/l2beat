import React from 'react'
import { PageContent } from '../../../../components/PageContent'
import { DashboardLayout } from '../../../../layouts/DashboardLayout'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'
import {
  TvlBreakdownHeader,
  TvlBreakdownHeaderProps,
} from './TvlBreakdownHeader'
import { TvlBreakdownView } from './TvlBreakdownView'

export interface TvlBreakdownPageProps {
  tvlBreakdownHeader: TvlBreakdownHeaderProps
  tvlBreakdownView: TvlBreakdownViewProps
}

export function ProjectTvlBreakdownPage(props: TvlBreakdownPageProps) {
  return (
    <DashboardLayout>
      <PageContent mobileFull className="max-w-[928px]">
        <TvlBreakdownHeader {...props.tvlBreakdownHeader} />
        <TvlBreakdownView {...props.tvlBreakdownView} />
      </PageContent>
    </DashboardLayout>
  )
}
