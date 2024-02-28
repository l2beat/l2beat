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
  className?: string
}

export function LinkWithThumbnail({
  orientation = 'horizontal',
  ...props
}: LinkWithThumbnailProps) {
  return (
    <PlainLink
      href={props.href}
      className={cn(
        'group flex gap-6 rounded-md bg-gray-100 transition-all hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800',
        orientation === 'vertical' && 'max-w-96 flex-col',
        props.className,
      )}
    >
      <img
        src={props.src}
        className={cn(
          'aspect-video w-full object-cover will-change-transform',
          orientation === 'vertical' &&
            'rounded-t-md transition-all group-hover:scale-[1.03] group-hover:rounded-md',
          orientation === 'horizontal' &&
            'max-w-36 rounded-md transition-all group-hover:scale-105 md:max-w-48',
        )}
      />
      <div
        className={cn(
          orientation === 'vertical' && 'mb-12 mt-6 px-8',
          orientation === 'horizontal' &&
            'self-center transition-all group-hover:translate-x-0.5',
        )}
      >
        {props.topAccessory && <div className="mb-2">{props.topAccessory}</div>}
        <p
          className={cn(
            orientation === 'vertical' && 'text-2xl',
            orientation === 'horizontal' && 'text-lg',
            'text-balance font-bold leading-[1.1]',
          )}
        >
          {props.title}
        </p>
        {props.description && (
          <div className="hidden md:block">
            <p
              className={cn(
                'mt-1.5 text-xs text-opacity-80',
                orientation === 'horizontal' && 'line-clamp-1 pr-2',
                orientation === 'vertical' && 'line-clamp-3',
              )}
            >
              {props.description}
            </p>
          </div>
        )}
        <p className="mt-3 flex flex-wrap items-center gap-1 text-sm font-semibold text-blue-700 underline transition-colors group-hover:text-blue-550 dark:text-blue-500">
          Learn more
          <ArrowRightIcon className="fill-current" />
        </p>
      </div>
    </PlainLink>
  )
}
