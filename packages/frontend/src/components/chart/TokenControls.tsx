import React from 'react'

import { ChartButton } from './ChartButton'

export interface TokenControlsProps {
  tokens?: { symbol: string; endpoint: string }[]
}

export function TokenControls({ tokens }: TokenControlsProps) {
  if (!tokens || tokens.length === 0) {
    return null
  }
  return (
    <div
      data-role="chart-token-controls"
      className="col-span-4 flex items-baseline justify-start flex-wrap gap-x-4"
    >
      <span>Tokens:</span>
      {tokens.map((x, i) => (
        <ChartButton
          key={x.symbol}
          name="token"
          value={x.symbol}
          endpoint={x.endpoint}
          className={i >= 3 ? 'hidden' : undefined}
        />
      ))}
      {tokens.length > 4 && (
        <button
          data-role="chart-more-tokens"
          className="underline decoration-dotted"
        >
          More…
        </button>
      )}
    </div>
  )
}
