import React from 'react'
import { TvlBreakdownSummaryBox } from '../../../components/tvl-breakdown/TvlBreakdownSummaryBox'

export interface TvlBreakdownViewProps {
  tvlBreakdownSummary: {
    tvl: {
      value: string
      change: string
    }
    cbv: {
      value: string
      change: string
    }
    ebv: {
      value: string
      change: string
    }
    nmv: {
      value: string
      change: string
    }
  }
}

export function TvlBreakdownView(props: TvlBreakdownViewProps) {
  return (
    <div>
      <TvlBreakdownSummaryBox {...props.tvlBreakdownSummary} />
    </div>
  )
}
