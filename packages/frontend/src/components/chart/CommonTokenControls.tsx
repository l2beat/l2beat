import { AssetType } from '@l2beat/shared-pure'
import React from 'react'

import { CloseIcon } from '../icons/CloseIcon'

export interface TokenControl {
  iconUrl: string
  symbol: string
  name: string
  assetType: AssetType
  tvlEndpoint: string
}

export function TokenCell({ token }: { token: TokenControl }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-1.5">
      <input
        className="peer hidden"
        name="token"
        type={'radio'}
        autoComplete="off"
        value={token.symbol}
        data-tvl-endpoint={token.tvlEndpoint}
        data-asset-type={token.assetType}
      />
      <p className="text-sm" key={token.symbol}>
        {token.symbol}
      </p>
    </label>
  )
}

export function SelectedTokenButton() {
  return (
    <label
      className="flex hidden cursor-pointer items-center justify-between gap-1.5 rounded-md bg-white px-2 text-base transition-all dark:bg-black"
      data-role="chart-token-chosen"
    >
      <input type="checkbox" autoComplete="off" className="peer hidden" />
      <p>NO TOKEN</p>
      <CloseIcon className="h-3 w-3 fill-gray-550 dark:fill-gray-50" />
    </label>
  )
}

export function getParts(tokens: TokenControl[]) {
  return [
    {
      title: 'Natively Minted Tokens',
      titleColor: 'text-[#FF6DCD]',
      tokens: tokens.filter((t) => t.assetType.toString() === 'NMV'),
    },
    {
      title: 'Externally Bridged Tokens',
      titleColor: 'text-yellow-200',
      tokens: tokens.filter((t) => t.assetType.toString() === 'EBV'),
    },
    {
      title: 'Canonically Bridged Tokens',
      titleColor: 'text-[#D98EFF]',
      tokens: tokens.filter((t) => t.assetType.toString() === 'CBV'),
    },
  ]
}
