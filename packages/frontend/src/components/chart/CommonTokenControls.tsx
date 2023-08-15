import { ValueType } from '@l2beat/shared-pure'
import React from 'react'

import { CloseIcon } from '../icons/CloseIcon'

export interface TokenControl {
  address: string
  symbol: string
  name: string
  assetType: ValueType
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
      <img
        src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${token.address}/logo.png`}
        className="h-4 w-4 rounded-full"
      />
      <p className="text-sm" key={token.symbol}>
        <span className={'font-bold'}>{token.name}</span> ({token.symbol})
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
      <input
        type="checkbox"
        autoComplete="off"
        className="Dropdown-Button peer hidden"
      />
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
      tokens: tokens
        .filter((t) => t.assetType.toString() === 'NMV')
        .slice(0, 15),
    },
    {
      title: 'Externally Bridged Tokens',
      titleColor: 'text-yellow-200',
      tokens: tokens
        .filter((t) => t.assetType.toString() === 'EBV')
        .slice(0, 15),
    },
    {
      title: 'Canonically Bridged Tokens',
      titleColor: 'text-[#D98EFF]',
      tokens: tokens
        .filter((t) => t.assetType.toString() === 'CBV')
        .slice(0, 15),
    },
  ]
}
