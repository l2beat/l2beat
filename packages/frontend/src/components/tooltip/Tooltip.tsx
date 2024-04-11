import React, { ReactElement } from 'react'

interface TooltipProps {
  children: [
    ReactElement<TooltipTriggerProps>,
    ReactElement<TooltipContentProps>,
  ]
  className?: string
  big?: boolean
  disabledOnMobile?: boolean
}

export type TooltipContentType = React.ReactElement | string | undefined

export function Tooltip({
  big,
  disabledOnMobile,
  className,
  children,
  ...rest
}: TooltipProps) {
  return (
    <div
      className={className}
      data-role="tooltip"
      data-tooltip-big={big}
      data-tooltip-mobile-disabled={disabledOnMobile}
      {...rest}
    >
      {children}
    </div>
  )
}

interface TooltipTriggerProps {
  children: React.ReactNode
  className?: string
  doNotHideOnClick?: boolean
}

export function TooltipTrigger({
  children,
  className,
  doNotHideOnClick,
  ...rest
}: TooltipTriggerProps) {
  return (
    <div
      data-role="tooltip-trigger"
      className={className}
      data-do-not-hide-on-click={doNotHideOnClick}
      {...rest}
    >
      {children}
    </div>
  )
}

interface TooltipContentProps {
  children: React.ReactNode
  prefferedPosition?: 'top' | 'bottom'
}

export function TooltipContent({
  children,
  prefferedPosition,
}: TooltipContentProps) {
  if (!children) return null
  return (
    <div
      className="hidden"
      data-role="tooltip-content"
      data-preffered-position={prefferedPosition}
    >
      {children}
    </div>
  )
}
