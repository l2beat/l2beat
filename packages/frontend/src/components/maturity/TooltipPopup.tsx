import { StageConfig } from '@l2beat/config'
import React from 'react'

import { MaturityBadge } from './Badge'

export interface MaturityProps {
  item?: StageConfig
}

export function MaturityTooltipPopup({ item }: MaturityProps) {
  return (
    <div className="w-88 flex flex-col gap-4">
      <span className="font-bold">
        <span className="mr-2">Current score</span>
        <MaturityBadge category={'Stage 1'} />
      </span>
      <hr className="border-gray-650" />
      <div>
        <p className="mb-2 text-[13px] uppercase leading-tight text-gray-50">
          Requirements for Stage 1 score:
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
