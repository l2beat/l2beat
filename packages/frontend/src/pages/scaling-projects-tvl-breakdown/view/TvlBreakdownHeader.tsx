import React from 'react'

export interface TvlBreakdownHeaderProps {
  title: string
  icon?: string
  slug: string
  tvlBreakdownDate: string
}

export function TvlBreakdownHeader(props: TvlBreakdownHeaderProps) {
  return (
    <div className="mt-11 flex flex-col px-4 md:px-0">
      <div className="flex items-center gap-[6px]">
        {props.icon && (
          <img
            className="h-4 w-4 md:h-4 md:w-4"
            src={props.icon}
            alt={`${props.title} logo`}
          />
        )}
        <h1 className="text-base font-medium">
          <a href={`/scaling/projects/${props.slug}`}>{props.title}</a>
          <span className="mx-1 text-gray-550">/</span>TVL Breakdown
        </h1>
      </div>
      <div className="mt-4 mb-4 flex flex-col items-start justify-between gap-[10px] md:mt-[38px] md:flex-row md:items-center">
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
