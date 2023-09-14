import React from 'react'

import { TvlBreakdownViewProps } from '../../pages/scaling-projects-tvl-breakdown/props/getTvlBreakdownView'
import { PercentChange } from '../PercentChange'

export function TvlBreakdownSummaryBox(
  props: TvlBreakdownViewProps['tvlBreakdownSummary'],
) {
  return (
    <div className="flex justify-between rounded-lg border border-pink-900 bg-purple-700 p-6">
      <StatsItem
        title="Total TVL"
        value={props.tvl.value}
        change={props.tvl.change}
      />
      <StatsItem
        title="Canonically Bridged"
        value={props.canonical.value}
        change={props.canonical.change}
      />
      <StatsItem
        title="Externally Bridged"
        value={props.external.value}
        change={props.external.change}
      />
      <StatsItem
        title="Natively Minted"
        value={props.native.value}
        change={props.native.change}
      />
    </div>
  )
}

interface StatsItemProps {
  title: string
  value: string
  change: string
}

function StatsItem(props: StatsItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-600">{props.title}</span>
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold text-white">{props.value}</span>
        <div className="text-base font-semibold">
          <PercentChange value={props.change} />
        </div>
      </div>
    </div>
  )
}
