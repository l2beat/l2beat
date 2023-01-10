import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { ArrowRightIcon } from '../icons/Arrows'
import { OutLink } from '../OutLink'

export interface KnowledgeNuggetProps {
  knowledgeNugget: KnowledgeNugget
}

export function KnowledgeNuggetItem(props: KnowledgeNuggetProps) {
  const { knowledgeNugget } = props
  return (
    <div className="group grid grid-cols-5 gap-3 pr-4 max-w-md rounded-md items-center transition-all hover:bg-gray-400 dark:hover:bg-gray-900 ">
      <div className="relative col-span-2 pb-2/3 overflow-hidden rounded-md drop-shadow-md">
        <img
          src={knowledgeNugget.thumbnailUrl}
          className="absolute h-full w-full object-cover transition-all group-hover:scale-105"
        />
      </div>
      <div className="flex-col col-span-3 transition-all group-hover:translate-x-0.5">
        <span className="font-bold text-lg leading-none">
          {knowledgeNugget.title}
        </span>
        <OutLink
          className="text-sm underline font-bold text-purple-900 dark:text-blue-475"
          href={knowledgeNugget.url}
        >
          <div className="flex flex-wrap">
            Learn more
            <ArrowRightIcon
              className="fill-purple-900 dark:fill-blue-475"
              transform="translate(4,3.2)"
            />
          </div>
        </OutLink>
      </div>
    </div>
  )
}
