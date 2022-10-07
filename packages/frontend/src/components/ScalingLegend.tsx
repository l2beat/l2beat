import React from 'react'

import { OptimismIcon, StarkWareIcon, WarningIcon, ZkSyncIcon } from './icons'

export interface ScalingLegendProps {
  showTokenWarnings?: boolean
}

export function ScalingLegend(props: ScalingLegendProps) {
  return (
    <div className="grid md:grid-cols-2 gap-2 mt-4 text-sm">
      <div className="flex flex-col gap-2">
        <p className="flex gap-1">
          <StarkWareIcon className="relative min-w-[24px] -top-0.5" />
          <span>&ndash;</span>
          <span>This project is built using StarkEx.</span>
        </p>
        <p className="flex gap-1">
          <OptimismIcon className="relative min-w-[24px] -top-0.5" />
          <span>&ndash;</span>
          <span>This project is based on Optimism&apos;s code base.</span>
        </p>
        <p className="flex gap-1">
          <ZkSyncIcon className="relative min-w-[24px] -top-0.5" />
          <span>&ndash;</span>
          <span>This project is based on zkSync&apos;s code base.</span>
        </p>
      </div>
      {props.showTokenWarnings && (
        <div className="flex flex-col gap-2">
          <p className="flex gap-1">
            <WarningIcon className="fill-yellow-700 dark:fill-yellow-300 relative min-w-[24px] -top-0.5" />
            <span>&ndash;</span>
            <span>
              A token associated with the project accounts for more than 10% of
              the TVL.
            </span>
          </p>
          <p className="flex gap-1">
            <WarningIcon className="fill-red-700 dark:fill-red-300 relative min-w-[24px] -top-0.5" />
            <span>&ndash;</span>
            <span>
              A token associated with the project accounts for more than 90% of
              the TVL. This may make the metric vulnerable to manipulation if
              the majority of the supply is concentrated and markets are very
              illiquid.
            </span>
          </p>
        </div>
      )}
    </div>
  )
}
