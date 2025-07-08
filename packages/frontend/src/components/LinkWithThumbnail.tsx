import type React from 'react'

import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
import { PlainLink } from './PlainLink'

export interface LinkWithThumbnailProps {
  title: string
  description?: string
  src: string
  width: number
  height: number
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
        'group flex gap-6 rounded-md bg-surface-primary transition-all hover:bg-surface-secondary',
        orientation === 'vertical' && 'max-w-96 flex-col bg-surface-secondary',
        props.className,
      )}
    >
      <img
        src={props.src}
        alt={`Thumbnail of ${props.title}`}
        className={cn(
          'aspect-video w-full object-cover object-left will-change-transform',
          orientation === 'vertical' &&
            'rounded-t-md transition-all group-hover:scale-[1.03] group-hover:rounded-md',
          orientation === 'horizontal' &&
            'max-w-36 rounded-md transition-all group-hover:scale-105 md:max-w-48',
        )}
        height={props.height}
        width={props.width}
      />
      <div
        className={cn(
          orientation === 'vertical' &&
            'mb-6 flex h-full flex-col justify-between px-6',
          orientation === 'horizontal' &&
            'self-center py-[15px] transition-all group-hover:translate-x-0.5',
        )}
      >
        <div>
          {props.topAccessory && <div>{props.topAccessory}</div>}
          <p
            className={cn(
              orientation === 'vertical' && 'mt-2 text-heading-20',
              orientation === 'horizontal' &&
                'text-heading-16 md:text-heading-18',
              'text-balance',
            )}
          >
            {props.title}
          </p>
          {props.description && (
            <div className="hidden md:block">
              <p
                className={cn(
                  'text-paragraph-14 text-secondary',
                  orientation === 'horizontal' && 'line-clamp-1',
                  orientation === 'vertical' && 'mt-3 line-clamp-3',
                )}
              >
                {props.description}
              </p>
            </div>
          )}
        </div>
        <p className="flex flex-wrap items-center gap-1 font-bold text-label-value-14 text-link underline transition-colors group-hover:text-blue-550 md:mt-3">
          Learn more
          <ArrowRightIcon className="fill-current" />
        </p>
      </div>
    </PlainLink>
  )
}
