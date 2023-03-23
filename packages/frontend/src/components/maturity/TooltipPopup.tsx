import { Layer2Maturity } from '@l2beat/config'
import React from 'react'

import { MaturityBadge } from './Badge'

export interface MaturityProps {
  item?: Layer2Maturity
}

export function MaturityTooltipPopup({ item }: Required<MaturityProps>) {
  return (
    <div className="w-88 flex flex-col gap-4">
      <span className="font-bold">
        <span className="mr-2">Current score</span>
        <MaturityBadge
          category={item.category.score}
          modifier={item.modifier?.score}
        />
      </span>
      <hr className="border-gray-650" />
      <div>
        <p className="mb-2 text-[13px] uppercase leading-tight text-gray-50">
          Requirements for {item.category.score} score:
        </p>
        <ul className="ml-4 list-disc">
          {item.category.requirements.map((requirement, i) => (
            <li key={i}>{requirement}</li>
          ))}
        </ul>
      </div>
      <div>
        {item.modifier && (
          <>
            <p className="mb-2 text-[13px] uppercase leading-tight text-gray-50">
              Additional modifiers:
            </p>
            <ul className="ml-4 list-disc">
              {item.modifier.items.map((modifier, i) => (
                <li key={i}>{modifier}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      {item.thingsToImprove && (
        <div>
          <p className="mb-2 text-[13px] uppercase leading-tight text-gray-50">
            What needs to be fixed for score{' '}
            {item.thingsToImprove.improvedScore}:
          </p>
          <ul className="ml-4 list-disc">
            {item.thingsToImprove.requirements.map((improvement, i) => (
              <li key={i}>{improvement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
