import React from 'react'

import { ProjectSubPageHeader } from '../../../../components/header/ProjectSubPageHeader'

export interface TvlBreakdownHeaderProps {
  title: string
  slug: string
  tvlBreakdownDate: string
}

export function TvlBreakdownHeader(props: TvlBreakdownHeaderProps) {
  return (
    <div className="mt-11 flex flex-col px-4 md:px-0">
      <ProjectSubPageHeader
        project={{
          name: props.title,
          slug: props.slug,
        }}
        subPageName="TVL Breakdown"
      />
      <div className="my-4 flex flex-col items-start justify-between gap-[10px] md:mt-[38px] md:flex-row md:items-center">
        <h2 className="text-[28px] font-bold md:text-3xl">TVL Breakdown</h2>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-550">
          Timestamp:&nbsp;
          <span className="text-base font-semibold text-black dark:text-white">
            {props.tvlBreakdownDate}
          </span>
        </div>
      </div>
    </div>
  )
}
