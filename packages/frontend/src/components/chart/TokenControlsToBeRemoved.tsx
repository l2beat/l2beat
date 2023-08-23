import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { ChartButton } from './ChartButton'
import { TokenControl } from './CommonTokenControls'

export interface TokenControlsToBeRemovedProps {
  tokens?: TokenControl[]
}

export function TokenControlsToBeRemoved({
  tokens,
}: TokenControlsToBeRemovedProps) {
  if (!tokens || tokens.length === 0) {
    return null
  }
  return (
    <div
      data-role="chart-token-controls"
      className="col-span-4 flex flex-wrap items-baseline justify-start gap-x-4"
    >
      <HorizontalSeparator className="mb-4 md:hidden" />
      <span>Tokens:</span>
      {tokens.map((x, i) => (
        <ChartButton
          key={x.symbol}
          name="token"
          value={x.symbol}
          tvlEndpoint={x.tvlEndpoint}
          assetType={x.assetType}
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
