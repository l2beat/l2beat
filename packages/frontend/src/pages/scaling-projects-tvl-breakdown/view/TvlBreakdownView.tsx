import React from 'react'
import { TvlBreakdownSummaryBox } from '../../../components/tvl-breakdown/TvlBreakdownSummaryBox'

export interface TvlBreakdownViewProps {
  tvlBreakdownSummary: {
    tvl: {
      value: string
      change: string
    }
    canonical: {
      value: string
      change: string
    }
    external: {
      value: string
      change: string
    }
    native: {
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
