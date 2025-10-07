import type React from 'react'

import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
import { PlainLink } from './PlainLink'

interface LinkWithThumbnailProps {
  title: string
  description?: string
  src: string
  width: number
  height: number
  href: string
  topAccessory?: React.ReactNode
  orientation?: 'vertical' | 'horizontal'
  className?: string
  customCtaText?: string
}

export function LinkWithThumbnail({
  orientation = 'horizontal',
  ...props
}: LinkWithThumbnailProps) {
  return (
    <PlainLink
      href={props.href}
      className={cn(
        'group flex gap-6 rounded-md transition-colors',
        orientation === 'horizontal' &&
          'bg-surface-primary hover:bg-surface-secondary',
        orientation === 'vertical' && ' flex-col',
        props.className,
      )}
    >
      <img
        src={props.src}
        alt={`Thumbnail of ${props.title}`}
        className={cn(
          'aspect-video w-full object-cover object-center will-change-transform',
          orientation === 'vertical' &&
            'rounded-md border border-divider transition-[scale] group-hover:scale-[1.03]',
          orientation === 'horizontal' &&
            'max-w-36 rounded-md transition-[scale] group-hover:scale-105 md:max-w-48',
        )}
        height={props.height}
        width={props.width}
      />
      <div
        className={cn(
          orientation === 'vertical' &&
            'mb-6 flex h-full flex-col justify-between px-1',
          orientation === 'horizontal' &&
            'self-center py-[15px] transition-transform group-hover:translate-x-0.5',
        )}
      >
        <div>
          {props.topAccessory && <div>{props.topAccessory}</div>}
          <p
            className={cn(
              orientation === 'vertical' &&
                'mt-2 text-heading-18 group-hover:underline lg:text-heading-20',
              orientation === 'horizontal' &&
                'text-heading-16 md:text-heading-18',
              'text-balance',
            )}
          >
            {props.title}
          </p>
          {props.description && (
            <div
              className={cn(orientation === 'horizontal' && 'hidden md:block')}
            >
              <p
                className={cn(
                  'font-normal text-paragraph-14 text-secondary',
                  orientation === 'horizontal' && 'line-clamp-1',
                  orientation === 'vertical' &&
                    'mt-3 line-clamp-3 group-hover:underline',
                )}
              >
                {props.description}
              </p>
            </div>
          )}
        </div>
        <p
          className={cn(
            'flex flex-wrap items-center gap-1 font-bold text-label-value-14 text-link underline transition-colors group-hover:text-blue-550',
            orientation === 'horizontal' && 'md:mt-3',
            orientation === 'vertical' && 'mt-3',
          )}
        >
          {props.customCtaText ?? 'Read now'}
          <ArrowRightIcon className="fill-current" />
        </p>
      </div>
    </PlainLink>
  )
}
