import React from 'react'

import { cn } from '../utils/cn'
import { Callout } from './Callout'
import { OutLinkIcon, ShieldIcon } from './icons'
import { Markdown } from './Markdown'
import { PlainLink } from './PlainLink'

export interface WarningBarProps {
  color: 'red' | 'yellow'
  text: string
  href?: string
  icon?: (props: { className?: string }) => JSX.Element
  isCritical?: boolean
  className?: string
}

export function WarningBar({
  color,
  text,
  icon,
  href,
  isCritical,
  className,
}: WarningBarProps) {
  const iconFill =
    color === 'red' ? 'fill-red-300' : 'fill-yellow-700 dark:fill-yellow-300'

  const textElement = (
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
          hoverable
          icon={<Icon className={cn('size-5', iconFill)} />}
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
      icon={<Icon className={cn('size-5', iconFill)} />}
      body={textElement}
    />
  )
}
