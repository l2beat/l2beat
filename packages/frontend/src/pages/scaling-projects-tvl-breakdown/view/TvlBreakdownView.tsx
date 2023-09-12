import React from 'react'

import { NativelyMintedTable } from '../../../components/tvl-breakdown/NativelyMintedTable'
import { TvlBreakdownSummaryBox } from '../../../components/tvl-breakdown/TvlBreakdownSummaryBox'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'

export function TvlBreakdownView(props: TvlBreakdownViewProps) {
  return (
    <div>
      <TvlBreakdownSummaryBox {...props.tvlBreakdownSummary} />
      <NativelyMintedTable tokens={props.tvlBreakdowns.native} />
    </div>
  )
}
