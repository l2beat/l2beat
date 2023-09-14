import React from 'react'

export interface TvlBreakdownHeaderProps {
  title: string
  icon?: string
  slug: string
  tvlBreakdownDate: string
}

export function TvlBreakdownHeader(props: TvlBreakdownHeaderProps) {
  return (
    <div className="mt-11 flex flex-col">
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
      <div className="mt-[38px] mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold">TVL breakdown</h2>
        <div className="text-xs font-medium text-gray-550">
          Timestamp:&nbsp;
          <span className="text-base font-semibold text-white">
            {props.tvlBreakdownDate} (UTC)
          </span>
        </div>
      </div>
    </div>
  )
}
