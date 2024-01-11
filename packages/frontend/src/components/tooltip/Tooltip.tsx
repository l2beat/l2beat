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
}

export function TooltipTrigger({ children, className }: TooltipTriggerProps) {
  return (
    <div data-role="tooltip-trigger" className={className}>
      {children}
    </div>
  )
}

interface TooltipContentProps {
  children: React.ReactNode
}

export function TooltipContent({ children }: TooltipContentProps) {
  if (!children) return null
  return <template data-role="tooltip-content">{children}</template>
}
