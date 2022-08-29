import React from 'react'

import { Logo } from '../Logo'
import { ChartButton } from './ChartButton'
import { ChartHover } from './ChartHover'
import { ChartLoader } from './ChartLoader'
import { RangeControls } from './RangeControls'
import { TokenControls } from './TokenControls'
import { YAxisLabels } from './YAxisLabels'

export interface ChartProps {
  endpoint: string
  tokens?: { symbol: string; endpoint: string }[]
  days?: 7 | 30
}

export function Chart({ endpoint, tokens, days = 7 }: ChartProps) {
  return (
    <section
      data-role="chart"
      data-endpoint={endpoint}
      className="grid grid-cols-[auto_auto_1fr_auto] sm:gap-y-2 gap-y-4 mt-2 sm:mt-4"
    >
      <p
        data-role="chart-range"
        className="col-span-2 font-bold flex items-center whitespace-pre sm:whitespace-normal h-[37px] sm:h-auto"
      >
        ...
      </p>
      <RangeControls days={days} />
      <div
        data-role="chart-view"
        className="relative col-span-4 h-[160px] xs:h-[200px] sm:h-[260px]"
        role="img"
        aria-label="chart"
      >
        <ChartLoader />
        <ChartHover />
        <YAxisLabels />
        <Logo className="Chart-Watermark" />
        <canvas data-role="chart-canvas" className="Chart-Canvas" />
      </div>
      <div
        data-role="chart-currency-controls"
        className="Chart-CurrencyControls"
      >
        <ChartButton checked name="currency" value="USD" />
        <ChartButton name="currency" value="ETH">
          ETH<sup>*</sup>
        </ChartButton>
      </div>
      <p data-role="chart-description" className="Chart-Description">
        ...
      </p>
      <div data-role="chart-scale-controls" className="Chart-ScaleControls">
        <ChartButton name="scale" value="LOG" />
        <ChartButton checked name="scale" value="LIN" />
      </div>
      <TokenControls tokens={tokens} />
    </section>
  )
}
