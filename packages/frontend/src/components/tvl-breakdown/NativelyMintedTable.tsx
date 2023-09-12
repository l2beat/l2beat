import { ProjectAssetsBreakdownApiResponse } from '@l2beat/shared-pure'
import React from 'react'

interface NativelyMintedTableProps {
  tokens: ProjectAssetsBreakdownApiResponse['breakdowns'][string]['native']
}

export function NativelyMintedTable(props: NativelyMintedTableProps) {
  return <div>test</div>
}
