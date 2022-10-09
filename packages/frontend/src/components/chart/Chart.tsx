import cx from 'classnames'
import React from 'react'

import { Logo } from '../Logo'
import { ChartHover } from './ChartHover'
import { ChartLoader } from './ChartLoader'
import { CurrencyControls } from './CurrencyControls'
import { RangeControls } from './RangeControls'
import { ScaleControls } from './ScaleControls'
import { TimeRange } from './TimeRange'
import { TokenControl, TokenControls } from './TokenControls'
import { YAxisLabels } from './YAxisLabels'

export interface ChartProps {
  type?: 'tvl' | 'activity'
  tvlEndpoint?: string
  activityEndpoint?: string
  tokens?: TokenControl[]
  days?: 7 | 30
  hideControls?: boolean
  className?: string
}

export function Chart({
  tvlEndpoint,
  activityEndpoint,
  tokens,
  days = 7,
  hideControls = false,
  type,
}: ChartProps) {
  return (
    <section
      data-role="chart"
      data-type={type ?? 'tvl'}
      data-tvl-endpoint={tvlEndpoint}
      data-activity-endpoint={activityEndpoint}
      className={cx('flex flex-col gap-4', 'mt-4 sm:mt-8')}
    >
      <div className="flex justify-between">
        <TimeRange />
        {!hideControls && <RangeControls days={days} />}
      </div>
      <div
        data-role="chart-view"
        className="relative col-span-4 h-[160px] xs:h-[200px] sm:h-[260px]"
        role="img"
        aria-label="chart"
      >
        <ChartLoader />
        <ChartHover />
        <Logo className="absolute bottom-2 right-2 z-10 w-[60px] h-[25px] opacity-40" />
        <canvas
          data-role="chart-canvas"
          className="absolute z-20 bottom-0 left-0 block w-full h-[calc(100%_-_20px)]"
        />
        <YAxisLabels />
      </div>
      <div className="flex justify-between">
        {!hideControls && <CurrencyControls />}
        {!hideControls && <ScaleControls />}
      </div>
      {!hideControls && <TokenControls tokens={tokens} />}
    </section>
  )
}
