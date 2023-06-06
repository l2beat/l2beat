import { StageConfig } from '@l2beat/config'
import React from 'react'

import { StageBadge } from './Badge'

export interface StageTooltipProps {
  item?: StageConfig
}

export function StageTooltipPopup({ item }: StageTooltipProps) {
  return (
    <div className="w-88 flex flex-col gap-4">
      <span className="font-bold">
        <StageBadge category={'Stage 1'} />
      </span>
      <hr className="border-gray-650" />
      <div>
        <p className="mb-2 text-[13px] uppercase leading-tight text-gray-50">
          Items missing for {item?.missing?.nextStage}:
        </p>
        <ul className="ml-4 list-disc">
          {item?.missing?.requirements.map((requirement, i) => (
            <li key={i}>{requirement}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
