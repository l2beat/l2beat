import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { HorizontalSeparator } from '../HorizontalSeparator'
import { Logo } from '../Logo'
import { TokenControl } from './TokenControls'
import { YAxisLabels } from './YAxisLabels'

export interface ChartProps {
  type?: 'tvl' | 'activity'
  tvlEndpoint?: string
  activityEndpoint?: string
  tokens?: TokenControl[]
  className?: string
  hasActivity?: boolean
  hasTvl?: boolean
  metaChart?: boolean
  mobileFull?: boolean
  milestones?: Milestone[]
}

export function ChartUpcoming({ mobileFull: fullWidth = false }: ChartProps) {
  return (
    <>
      <section
        data-role="chart"
        data-type="tvl"
        data-tvl-endpoint={`/api/placeholder-tvl.json`}
        className={cx(
          fullWidth
            ? 'bg-gray-100 px-4 py-6 dark:bg-gray-950 md:bg-transparent md:p-0 md:dark:bg-transparent'
            : 'mt-4',
          'md:mt-8',
        )}
      >
        <div className="mb-4 gap-5 md:mb-6 md:flex md:items-center">
          <h2 className="hidden text-3xl font-bold md:inline">Chart</h2>
        </div>
        <div className="flex flex-col justify-center gap-4">
          <div
            data-role="chart-view"
            className="relative col-span-4 h-[160px] xs:h-[200px] sm:h-[260px]"
            role="img"
            aria-label="chart"
          >
            <Logo className="absolute bottom-2 right-2 z-10 h-[25px] w-[60px] opacity-40" />
            <canvas
              data-role="chart-canvas"
              className="absolute bottom-0 left-0 z-20 block h-[calc(100%_-_20px)] w-full blur-sm "
            />
            <YAxisLabels className="blur-sm" />
            <div className="absolute top-0 z-60 flex  h-full w-full items-center justify-center">
              <div className="flex h-[20%] w-1/2 items-center justify-center rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                Coming soon
              </div>
            </div>
          </div>
        </div>
      </section>
      <HorizontalSeparator className="mt-4 hidden md:mt-6 md:block" />
    </>
  )
}
