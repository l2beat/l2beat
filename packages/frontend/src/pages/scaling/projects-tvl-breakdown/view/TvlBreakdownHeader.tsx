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
        <h2 className="font-bold text-[28px] md:text-3xl">TVL Breakdown</h2>
        <div className="font-medium text-gray-500 text-xs dark:text-gray-550">
          Timestamp:&nbsp;
          <span className="font-semibold text-base text-black dark:text-white">
            {props.tvlBreakdownDate}
          </span>
        </div>
      </div>
    </div>
  )
}
