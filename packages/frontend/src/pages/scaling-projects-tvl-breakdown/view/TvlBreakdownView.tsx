import React from 'react'

import { CanonicallyMintedTable } from '../../../components/tvl-breakdown/CanonicallyMintedTable'
import { ExternallyMintedTable } from '../../../components/tvl-breakdown/ExternallyMintedTable'
import { NativelyMintedTable } from '../../../components/tvl-breakdown/NativelyMintedTable'
import { RequestTokenBox } from '../../../components/tvl-breakdown/RequestTokenBox'
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
      <CanonicallyMintedTable
        escrows={props.tvlBreakdowns.canonical}
        explorer="https://etherscan.io"
      />
      <RequestTokenBox />
    </div>
  )
}
