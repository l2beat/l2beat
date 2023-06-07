import { StageConfig } from '@l2beat/config'
import React from 'react'

import { StageBadge } from './StageBadge'

export interface StageTooltipProps {
  item?: StageConfig
}

export function StageTooltip({ item }: StageTooltipProps) {
  if (!item) return null
  return (
    <div className="w-88 flex flex-col gap-4">
      <span className="font-bold">
        <StageBadge category={'Stage 1'} />
      </span>
      <hr className="border-gray-650" />
      <div>
        <p className="mb-2 text-[13px] uppercase leading-tight text-gray-50">
          Items missing for {item.missing?.nextStage}:
        </p>
        <ul className="ml-2 list-none space-y-2">
          {item.missing?.requirements.map((requirement, i) => (
            <li className="w-60" key={i}>
              ❌ {requirement}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
