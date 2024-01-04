import classNames from 'classnames'
import isString from 'lodash/isString'
import React, { ElementType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

interface TooltipProps<T extends ElementType> {
  children: React.ReactNode
  content: React.ReactElement | string | undefined
  className?: string
  big?: boolean
  disabledOnMobile?: boolean
  as?: T
}

export type TooltipContent = React.ReactElement | string | undefined

export function Tooltip<T extends ElementType>({
  content,
  as,
  big,
  disabledOnMobile,
  className,
  children,
  ...rest
}: TooltipProps<T>) {
  const title = getTitleAttribute(content)
  const Comp = as ?? 'span'

  return (
    <Comp
      className={classNames(title && 'Tooltip', className)}
      data-tooltip-big={big}
      data-tooltip-mobile-disabled={disabledOnMobile}
      title={title}
      {...rest}
    >
      {children}
    </Comp>
  )
}

function getTitleAttribute(content: React.ReactElement | string | undefined) {
  if (!content) {
    return undefined
  }

  if (isString(content)) {
    return content
  }

  return renderToStaticMarkup(content)
}
