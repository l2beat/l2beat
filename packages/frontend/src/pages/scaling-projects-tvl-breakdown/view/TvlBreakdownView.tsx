import React from 'react'

import { CanonicallyBridgedTable } from '../../../components/tvl-breakdown/CanonicallyBridgedTable'
import { ExternallyBridgedTable } from '../../../components/tvl-breakdown/ExternallyBridgedTable'
import { NativelyMintedTable } from '../../../components/tvl-breakdown/NativelyMintedTable'
import { RequestTokenBox } from '../../../components/tvl-breakdown/RequestTokenBox'
import { TvlBreakdownSummaryBox } from '../../../components/tvl-breakdown/TvlBreakdownSummaryBox'
import { TvlBreakdownViewProps } from '../props/getTvlBreakdownView'

export function TvlBreakdownView(props: TvlBreakdownViewProps) {
  return (
    <div>
      <TvlBreakdownSummaryBox {...props.tvlBreakdownSummary} />
      <NativelyMintedTable tokens={props.tvlBreakdowns.native} />
      <ExternallyBridgedTable tokens={props.tvlBreakdowns.external} />
      <CanonicallyBridgedTable tokens={props.tvlBreakdowns.canonical} />
      <RequestTokenBox />
    </div>
  )
}
