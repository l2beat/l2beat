import React from 'react'

import { cn } from '../utils/cn'
import { ArrowRightIcon } from './icons'
import { PlainLink } from './PlainLink'

export interface LinkWithThumbnailProps {
  title: string
  description?: string
  src: string
  href: string
  orientation: 'vertical' | 'horizontal'
}

export function LinkWithThumbnail({
  orientation = 'horizontal',
  ...props
}: LinkWithThumbnailProps) {
  return (
    <PlainLink
      href={props.href}
      className={cn(
        'group flex items-center gap-6 rounded-md bg-gray-100 transition-all hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800',
        orientation === 'vertical' && 'w-max flex-col',
      )}
    >
      <img
        src={props.src}
        className={cn(
          'aspect-video object-cover',
          orientation === 'vertical' &&
            'w-[384px] rounded-t-md transition-all will-change-transform group-hover:scale-[1.03] group-hover:rounded-md',
          orientation === 'horizontal' &&
            'w-[175px] rounded-md transition-all will-change-transform group-hover:scale-105',
        )}
      />
      <div
        className={cn(
          orientation === 'vertical' && 'mb-12 mt-6 max-w-[384px] px-8',
          orientation === 'horizontal' &&
            'transition-all group-hover:translate-x-0.5',
        )}
      >
        <p
          className={cn(
            'font-bold leading-tight',
            orientation === 'vertical' && 'text-2xl',
            orientation === 'horizontal' && 'text-lg',
          )}
        >
          {props.title}
        </p>
        {props.description && (
          <p className="mt-1.5 hidden text-xs text-opacity-80 md:block">
            {props.description}
          </p>
        )}
        <p className="mt-3 flex flex-wrap items-center gap-1 text-sm font-semibold text-blue-700 underline transition-colors group-hover:text-blue-550 dark:text-blue-500">
          Learn more
          <ArrowRightIcon className="fill-current" />
        </p>
      </div>
    </PlainLink>
  )
}
