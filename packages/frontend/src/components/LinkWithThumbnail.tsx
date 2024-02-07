import React from 'react'

import { ArrowRightIcon } from './icons'
import { OutLink } from './OutLink'

export interface LinkWithThumbnailProps {
  title: string
  src: string
  href: string
}

export function LinkWithThumbnail(props: LinkWithThumbnailProps) {
  return (
    <OutLink
      href={props.href}
      className="group flex items-center gap-6 rounded-md pr-4 transition-all hover:bg-zinc-300 dark:hover:bg-zinc-800"
    >
      <img
        src={props.src}
        className="aspect-video h-[98px] rounded-md object-cover transition-all group-hover:scale-105"
      />
      <div className="col-span-5 flex-col transition-all group-hover:translate-x-0.5">
        <p className="text-lg font-bold leading-tight">{props.title}</p>
        <p className="flex flex-wrap items-center gap-1 text-sm font-semibold text-blue-700 underline transition-colors group-hover:text-blue-550 dark:text-blue-500">
          Learn more
          <ArrowRightIcon className="fill-current" />
        </p>
      </div>
    </OutLink>
  )
}
