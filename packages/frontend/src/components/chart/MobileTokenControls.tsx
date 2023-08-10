import React from 'react'
import { HorizontalSeparator } from '../HorizontalSeparator'

import { ExpandIcon } from '../icons/Expand'
import { SlideCard } from '../SlideCard'
import { TokenControl } from './DesktopTokenControls'

export interface MobileTokenControlsProps {
  tokens?: TokenControl[]
}

function TokenCell({ token }: { token: TokenControl }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-1.5">
      <input
        className="peer hidden"
        name="token"
        type={'radio'}
        autoComplete="off"
        value={token.symbol}
        data-tvl-endpoint={token.tvlEndpoint}
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

export function MobileTokenControls({ tokens }: MobileTokenControlsProps) {
  if (!tokens || tokens.length === 0) {
    return null
  }

  const parts = [
    {
      title: 'Natively Minted Tokens',
      titleColor: 'text-[#FF6DCD]',
      tokens: tokens.slice(0, 5),
    },
    {
      title: 'Externally Bridged Tokens',
      titleColor: 'text-yellow-200',
      tokens: tokens.slice(15, 25),
    },
    {
      title: 'Canonically Bridged Tokens',
      titleColor: 'text-[#D98EFF]',
      tokens: tokens.slice(30, 45),
    },
  ]

  return (
    <div className="flex items-center gap-x-4 md:hidden">
      <span>View other tokens</span>
      <SlideCard
        button={
          <>
            <div className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1 text-base dark:bg-gray-750">
              Select
              <ExpandIcon />
            </div>
          </>
        }
        title={'Chose a token'}
      >
        <div className="flex flex-col gap-6 w-full">
          {parts.map((p, i) => (
            <div key={i}>
              <div className={`text-sm font-bold ${p.titleColor}`}>
                {p.title}
              </div>
              <HorizontalSeparator className="mb-4 dark:border-gray-650" />
              <div
                className="flex flex-col gap-y-3 gap-x-6"
                data-role="chart-token-controls"
              >
                {p.tokens.map((token, j) => (
                  <TokenCell token={token} key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SlideCard>
    </div>
  )
}
