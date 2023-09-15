import React from 'react'

import { TvlBreakdownSummaryBox } from '../../../components/tvl-breakdown/TvlBreakdownSummaryBox'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'

export function TvlBreakdownView(props: TvlBreakdownViewProps) {
  return (
    <div>
      <TvlBreakdownSummaryBox {...props.tvlBreakdownSummary} />
    </div>
  )
}
