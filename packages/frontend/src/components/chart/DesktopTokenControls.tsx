import classNames from 'classnames'
import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ArrowRightIcon } from '../icons'
import { RichSelect } from '../RichSelect'
import { getParts, TokenControl } from './CommonTokenControls'

export interface DesktopTokenControlsProps {
  tokens?: TokenControl[]
  tvlBreakdownHref: string
}

export function TokenControls({
  tokens,
  tvlBreakdownHref,
}: DesktopTokenControlsProps) {
  if (!tokens || tokens.length === 0) {
    return null
  }

  return (
    <div
      className={classNames('flex h-full')}
      data-role="chart-token-desktop-element"
      data-tvl-only
    >
      <RichSelect
        label="Tokens"
        id="desktop-token-select"
        slideCardTitle="Choose token"
        listClassName="!p-6"
        centered
      >
        <MobileTokenList tokens={tokens} />
        <DesktopTokenList tokens={tokens} />
        <div className="mt-6 flex items-center justify-center gap-1">
          <a
            href={tvlBreakdownHref}
            className="flex flex-wrap items-center gap-1 text-sm font-bold text-blue-700 underline dark:text-blue-500"
          >
            View TVL Breakdown
            <ArrowRightIcon className="fill-current" />
          </a>
        </div>
      </RichSelect>
    </div>
  )
}

function DesktopTokenList({ tokens }: { tokens: TokenControl[] }) {
  const parts = getParts(tokens)

  return (
    <div className="hidden flex-col gap-3 md:flex">
      {parts.map(
        (p, i) =>
          p.tokens.length > 0 && (
            <div key={i}>
              <div className={`text-sm font-bold ${p.titleColor}`}>
                {p.title}
              </div>
              <HorizontalSeparator className="mb-4 border-gray-400 dark:border-gray-650" />
              <div
                className="grid grid-cols-3 gap-x-6"
                data-role="chart-token-controls"
              >
                {p.tokens.map((token, j) => (
                  <RichSelect.Item
                    value={JSON.stringify(token.info)}
                    selectedLabel={token.info.symbol}
                    className="!py-1.5"
                    key={j}
                  >
                    <img src={token.iconUrl} className="h-4 w-4 rounded-full" />
                    <span className="text-sm font-bold">{token.name}</span> (
                    {token.info.symbol})
                  </RichSelect.Item>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  )
}

function MobileTokenList({ tokens }: { tokens: TokenControl[] }) {
  const parts = getParts(tokens)

  return (
    <div className="flex w-full flex-col gap-6 md:hidden">
      {parts.map(
        (p, i) =>
          p.tokens.length > 0 && (
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
                  <RichSelect.Item
                    value={JSON.stringify(token.info)}
                    selectedLabel={token.info.symbol}
                    key={j}
                  >
                    <img src={token.iconUrl} className="h-4 w-4 rounded-full" />
                    <span className="text-sm font-bold">{token.name}</span> (
                    {token.info.symbol})
                  </RichSelect.Item>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  )
}
