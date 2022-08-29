import React from 'react'

import { Logo } from '../Logo'
import { ChartButton } from './ChartButton'
import { ChartHover } from './ChartHover'
import { ChartLoader } from './ChartLoader'
import { TokenControls } from './TokenControls'

export interface ChartProps {
  endpoint: string
  tokens?: { symbol: string; endpoint: string }[]
  days?: 7 | 30
}

export function Chart({ endpoint, tokens, days = 7 }: ChartProps) {
  return (
    <section data-role="chart" data-endpoint={endpoint} className="Chart">
      <p data-role="chart-range" className="Chart-Range">
        ...
      </p>
      <div data-role="chart-range-controls" className="Chart-RangeControls">
        <ChartButton checked={days === 7} name="range" value="7D" />
        <ChartButton checked={days === 30} name="range" value="30D" />
        <ChartButton name="range" value="90D" />
        <ChartButton name="range" value="180D" />
        <ChartButton name="range" value="1Y" />
        <ChartButton name="range" value="MAX" />
      </div>
      <div
        data-role="chart-view"
        className="Chart-View"
        role="img"
        aria-label="chart"
      >
        <ChartLoader />
        <ChartHover />
        <div className="Chart-Lines">
          <div className="Chart-Line" />
          <div className="Chart-Line" />
          <div className="Chart-Line" />
          <div className="Chart-Line" />
          <div className="Chart-Line" />
        </div>
        <div className="Chart-Labels">
          <div data-role="chart-label" className="Chart-Label">
            ...
          </div>
          <div data-role="chart-label" className="Chart-Label">
            ...
          </div>
          <div data-role="chart-label" className="Chart-Label">
            ...
          </div>
          <div data-role="chart-label" className="Chart-Label">
            ...
          </div>
          <div data-role="chart-label" className="Chart-Label">
            ...
          </div>
        </div>
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
