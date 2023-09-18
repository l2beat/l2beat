import React from 'react'

import { ExternallyMintedTable } from '../../../components/tvl-breakdown/ExternallyMintedTable'
import { NativelyMintedTable } from '../../../components/tvl-breakdown/NativelyMintedTable'
import { TvlBreakdownSummaryBox } from '../../../components/tvl-breakdown/TvlBreakdownSummaryBox'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'

export function TvlBreakdownView(props: TvlBreakdownViewProps) {
  return (
    <div>
      <TvlBreakdownSummaryBox {...props.tvlBreakdownSummary} />
      <NativelyMintedTable
        tokens={props.tvlBreakdowns.native}
        explorer={props.explorer}
      />
      <ExternallyMintedTable
        tokens={props.tvlBreakdowns.external}
        explorer={props.explorer}
      />
    </div>
  )
}
