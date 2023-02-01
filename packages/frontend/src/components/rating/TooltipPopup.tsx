import { Layer2Rating } from "@l2beat/config"
import React from "react"

import { ArrowRightIcon } from "../icons"
import { RatingBadge } from "./Badge"

export interface RatingProps {
  item?: Layer2Rating
}

export function RatingTooltipPopup({ item }: Required<RatingProps>) {
  return (
    <div className="w-88 gap-4 flex flex-col">
      <span className="font-bold">
        <span className="mr-2">Current score</span>
        <RatingBadge
          category={item.category.score}
          modifier={item.modifier?.score}
        />
      </span>
      <hr className="border-gray-650" />
      <div>
        <p className="text-gray-50 uppercase mb-2 text-[13px] leading-tight">
          Requirements for {item.category.score} score:
        </p>
        <ul className="list-disc list-inside marker:ml-1">
          {item.category.requirements.map((requirement, i) => (
            <li key={i} className="before:-ml-2">
              {requirement}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {item.modifier && (
          <>
            <p className="text-gray-50 uppercase mb-2 text-[13px] leading-tight">
              Additional modifiers:
            </p>
            <ul className="list-disc list-inside ">
              {item.modifier.items.map((modifier, i) => (
                <li key={i} className="before:-ml-2">
                  {modifier}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {item.thingsToImprove && (
        <div>
          <p className="text-gray-50 uppercase mb-2 text-[13px] leading-tight">
            What needs to be fixed for score {item.thingsToImprove.improvedScore}:
          </p>
          <ul className="list-disc list-inside marker:ml-1">
            {item.thingsToImprove.requirements.map((improvement, i) => (
              <li key={i} className="before:-ml-2">
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      )}

      <a href="#" className="font-bold text-link underline">
        Learn more about Rating system<ArrowRightIcon className='fill-link inline-block ml-1' />
      </a>
    </div>
  )
}