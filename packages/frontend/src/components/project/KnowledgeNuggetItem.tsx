import { KnowledgeNugget } from '@l2beat/config'
import React from 'react'

import { ArrowRightIcon } from '../icons'
import { OutLink } from '../OutLink'

export interface KnowledgeNuggetProps {
  knowledgeNugget: KnowledgeNugget
}

export function KnowledgeNuggetItem({ knowledgeNugget }: KnowledgeNuggetProps) {
  return (
    <div className="group grid max-w-md grid-cols-5 items-center gap-3 rounded-md pr-4 transition-all hover:bg-gray-400 dark:hover:bg-gray-900 ">
      <div className="relative col-span-2 overflow-hidden rounded-md pb-2/3 drop-shadow-md">
        <img
          src={knowledgeNugget.thumbnailUrl}
          className="absolute h-full w-full object-cover transition-all group-hover:scale-105"
        />
      </div>
      <div className="col-span-3 flex-col transition-all group-hover:translate-x-0.5">
        <p className="text-lg font-bold leading-tight">
          {knowledgeNugget.title}
        </p>
        <OutLink
          className="flex flex-wrap items-center gap-1 text-sm font-bold text-link underline"
          href={knowledgeNugget.url}
        >
          Learn more
          <ArrowRightIcon className="fill-link" />
        </OutLink>
      </div>
    </div>
  )
}
