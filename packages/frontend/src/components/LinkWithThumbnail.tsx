import React from 'react'

import { cn } from '../utils/cn'
import { ArrowRightIcon } from './icons'
import { PlainLink } from './PlainLink'

export interface LinkWithThumbnailProps {
  title: string
  description?: string
  src: string
  href: string
  topAccessory?: React.ReactNode
  orientation?: 'vertical' | 'horizontal'
}

export function LinkWithThumbnail({
  orientation = 'horizontal',
  ...props
}: LinkWithThumbnailProps) {
  return (
    <PlainLink
      href={props.href}
      className={cn(
        'group grid gap-6 rounded-md bg-gray-100 transition-all hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800',
        orientation === 'horizontal' && 'grid-cols-7',
      )}
    >
      <img
        src={props.src}
        className={cn(
          'aspect-video w-full object-cover',
          orientation === 'vertical' &&
            'rounded-t-md transition-all will-change-transform group-hover:scale-[1.03] group-hover:rounded-md',
          orientation === 'horizontal' &&
            'col-span-2 rounded-md transition-all will-change-transform group-hover:scale-105',
        )}
      />
      <div
        className={cn(
          orientation === 'vertical' && 'mb-12 mt-6 px-8',
          orientation === 'horizontal' &&
            'col-span-5 self-center transition-all group-hover:translate-x-0.5',
        )}
      >
        {props.topAccessory && <div className="mb-2">{props.topAccessory}</div>}
        <p
          className={cn(
            'text-balance font-bold ',
            orientation === 'vertical' && 'text-2xl leading-[1.1]',
            orientation === 'horizontal' && 'text-lg',
          )}
        >
          {props.title}
        </p>
        {props.description && (
          <p
            className={cn(
              'mt-1.5 text-xs text-opacity-80',
              orientation === 'horizontal' && 'hidden md:block',
            )}
          >
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
