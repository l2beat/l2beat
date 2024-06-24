import React, { type FC } from 'react'

import OutLinkIcon from '~/icons/outlink.svg'
import ShieldIcon from '~/icons/shield.svg'
import Link from 'next/link'
import { cn } from '~/utils/cn'
import { Markdown } from './markdown/markdown'
import { Callout } from './callout'

export interface WarningBarProps {
  color: 'red' | 'yellow' | 'gray'
  text: string
  href?: string
  icon?: FC<{ className?: string }>
  isCritical?: boolean
  className?: string
  ignoreMarkdown?: boolean
}

export function WarningBar({
  color,
  text,
  icon,
  href,
  isCritical,
  className,
  ignoreMarkdown,
}: WarningBarProps) {
  const iconFill =
    color === 'red'
      ? 'fill-red-300'
      : color === 'yellow'
        ? 'fill-yellow-700 dark:fill-yellow-300'
        : 'fill-gray-700 dark:fill-gray-300'

  const textElement = (
    <>
      {ignoreMarkdown ? (
        text
      ) : (
        <Markdown className="leading-snug" inline>
          {text}
        </Markdown>
      )}
      {isCritical && <span className="text-red-300"> (CRITICAL)</span>}
    </>
  )
  const Icon = icon ?? ShieldIcon
  if (href) {
    return (
      <Link href={href}>
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
      </Link>
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
