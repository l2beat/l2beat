import React, { ComponentPropsWithoutRef } from 'react'

import { cn } from '../utils/cn'
import { ArrowRightIcon } from './icons'

type LinkProps<T extends React.ElementType> = {
  type?: LinkType
  className?: string
  textClassName?: string
  showArrow?: boolean
  underline?: boolean
  as?: T
} & ComponentPropsWithoutRef<T>
type LinkType = 'primary' | 'danger' | 'plain'

// Make sure this is compatible with markdown.css
const textClassesByType: Record<LinkType, string> = {
  primary: 'text-blue-700 group-hover:text-blue-550 dark:text-blue-500',
  danger: 'text-red-300 group-hover:text-red-700',
  plain: 'text-black dark:text-white',
}

export function Link<T extends React.ElementType>({
  type = 'primary',
  className,
  textClassName,
  children,
  showArrow,
  underline = true,
  as,
  ...rest
}: LinkProps<T>) {
  const Comp = as ?? 'a'

  return (
    <Comp
      className={cn(
        'group cursor-pointer data-[state=highlighted]:relative data-[state=highlighted]:z-10',
        'data-[state=highlighted]:before:absolute data-[state=highlighted]:before:-left-1 data-[state=highlighted]:before:-top-0.5',
        'data-[state=highlighted]:before:-bottom-0.5 data-[state=highlighted]:before:-right-1 data-[state=highlighted]:before:rounded',
        'data-[state=highlighted]:before:-z-10 data-[state=highlighted]:before:border',
        'data-[state=highlighted]:before:border-dashed data-[state=highlighted]:before:border-yellow-700 data-[state=highlighted]:before:bg-yellow-250/50 data-[state=highlighted]:before:content-[""]',
        'data-[state=highlighted]:before:dark:border-yellow-250 data-[state=highlighted]:before:dark:bg-yellow-250/10',
        className,
      )}
      target={'href' in rest && isOutLink(rest.href) ? '_blank' : undefined}
      rel={
        'href' in rest && isOutLink(rest.href)
          ? 'noreferrer noopener'
          : undefined
      }
      {...rest}
    >
      <span
        className={cn(
          'inline-flex items-center font-semibold transition-colors',
          textClassesByType[type],
          textClassName,
        )}
      >
        <span
          className={cn(
            'flex items-center gap-1',
            underline && 'underline',
            showArrow && 'transition-transform group-hover:-translate-x-px',
          )}
        >
          {children}
        </span>
        {showArrow && (
          <ArrowRightIcon className="ml-1 inline-block fill-current transition-transform group-hover:translate-x-px group-hover:fill-blue-550 dark:fill-blue-500" />
        )}
      </span>
    </Comp>
  )
}

export function isOutLink(href: string | undefined | null) {
  if (!href) return false
  return /^https?:\/\//.test(href)
}
