import React from 'react'

import { cva } from 'class-variance-authority'
import { cn } from '../utils/cn'
import { Callout } from './Callout'
import { Markdown } from './Markdown'
import { PlainLink } from './PlainLink'
import { OutLinkIcon, ShieldIcon } from './icons'

export interface WarningBarProps {
  color: 'red' | 'yellow' | 'gray'
  text: string
  href?: string
  icon?: (props: { className?: string }) => JSX.Element
  isCritical?: boolean
  className?: string
  ignoreMarkdown?: boolean
}

const iconVariants = cva('size-5', {
  variants: {
    color: {
      red: 'fill-red-300',
      yellow: 'fill-yellow-700 dark:fill-yellow-300',
      gray: 'fill-gray-700 dark:fill-gray-300',
    },
  },
})

export function WarningBar({
  color,
  text,
  icon,
  href,
  isCritical,
  className,
  ignoreMarkdown,
}: WarningBarProps) {
  const textElement = ignoreMarkdown ? (
    <>
      {text}
      {isCritical && <span className="text-red-300"> (CRITICAL)</span>}
    </>
  ) : (
    <>
      <Markdown className="leading-snug" inline>
        {text}
      </Markdown>
      {isCritical && <span className="text-red-300"> (CRITICAL)</span>}
    </>
  )
  const Icon = icon ?? ShieldIcon
  if (href) {
    return (
      <PlainLink href={href}>
        <Callout
          className={cn('p-4', className)}
          color={color}
          icon={<Icon className={iconVariants({ color })} />}
          body={
            <div className="flex items-center gap-1">
              {textElement}
              <OutLinkIcon className="shrink-0" />
            </div>
          }
        />
      </PlainLink>
    )
  }

  return (
    <Callout
      className={cn('p-4', className)}
      color={color}
      icon={<Icon className={iconVariants({ color })} />}
      body={textElement}
    />
  )
}
