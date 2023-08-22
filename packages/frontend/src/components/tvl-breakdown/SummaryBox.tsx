import React from 'react'

import { PercentChange } from '../PercentChange'

export interface SummaryBoxProps {
  tvl: {
    value: string
    change: string
  }
  cb: {
    value: string
    change: string
  }
  eb: {
    value: string
    change: string
  }
  ntm: {
    value: string
    change: string
  }
}

export function SummaryBox(props: SummaryBoxProps) {
  return (
    <div className="flex justify-between rounded-lg border border-pink-900 bg-purple-700 p-6">
      <StatsItem
        title="Total TVL"
        value={props.tvl.value}
        change={props.tvl.change}
      />
      <StatsItem
        title="Canonically Bridged"
        value={props.cb.value}
        change={props.cb.change}
      />
      <StatsItem
        title="Externally Bridged"
        value={props.eb.value}
        change={props.eb.change}
      />
      <StatsItem
        title="Native Tokens Minted"
        value={props.ntm.value}
        change={props.ntm.change}
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
