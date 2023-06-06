import cx from 'classnames'
import React from 'react'

import { OutLinkIcon, ShieldIcon } from '../icons'
import { OutLink } from '../OutLink'
import { Callout } from './Callout'

export interface WarningBarProps {
  color: 'red' | 'yellow'
  text: string
  href?: string
  isCritical: boolean
  className?: string
}

export function WarningBar({
  color,
  text,
  href,
  isCritical,
  className,
}: WarningBarProps) {
  const iconFill =
    color === 'red' ? 'fill-red-300' : 'fill-yellow-700 dark:fill-yellow-300'
  const textElement = isCritical ? (
    <>
      {text.slice(0, -1)} <span className="text-red-300">(CRITICAL)</span>
      {text.slice(-1)}
    </>
  ) : (
    text
  )

  if (href) {
    return (
      <OutLink href={href}>
        <Callout
          className={cx('p-4', className)}
          color={color}
          hoverable
          icon={<ShieldIcon className={cx(iconFill)} />}
          body={
            <div className="flex items-center gap-1">
              {textElement}
              <OutLinkIcon />
            </div>
          }
        />
      </OutLink>
    )
  }

  return (
    <Callout
      className={cx('p-4', className)}
      color={color}
      icon={<ShieldIcon className={cx(iconFill)} />}
      body={textElement}
    />
  )
}
