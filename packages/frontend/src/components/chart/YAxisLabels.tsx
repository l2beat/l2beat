import cx from 'classnames'
import React from 'react'

const FONT_STYLE_OPAQUE = 'font-bold text-gray-500/50 dark:text-white/50'
const FONT_STYLE_TRANSPARENT = 'text-gray-500 dark:text-gray-600'
const BORDER_STYLE_OPAQUE =
  'border-gray-500/30 dark:border-white/30 border-b-[2px]'
const BORDER_STYLE_TRANSPARENT = 'border-gray-300 dark:border-gray-850 border-b'

export const OPAQUE_FILL_STYLE = cx(FONT_STYLE_OPAQUE, BORDER_STYLE_OPAQUE)
export const TRANSPARENT_FILL_STYLE = cx(
  FONT_STYLE_TRANSPARENT,
  BORDER_STYLE_TRANSPARENT,
)

export function YAxisLabels({
  className,
  hasOpaqueFill,
}: {
  className?: string
  hasOpaqueFill?: boolean
}) {
  return (
    <div
      className={cx(
        `absolute left-0 top-0 ${
          hasOpaqueFill ? 'z-30' : 'z-10'
        } flex h-full w-full flex-col`,
        className,
      )}
    >
      <Label hasOpaqueFill={hasOpaqueFill} className="h-[20px]" />
      <Label hasOpaqueFill={hasOpaqueFill} className="flex-1" />
      <Label hasOpaqueFill={hasOpaqueFill} className="flex-1" />
      <Label hasOpaqueFill={hasOpaqueFill} className="flex-1" />
      <Label hasOpaqueFill={hasOpaqueFill} className="flex-1" />
    </div>
  )
}

function Label({
  className,
  hasOpaqueFill,
}: {
  className: string
  hasOpaqueFill?: boolean
}) {
  const style = hasOpaqueFill ? OPAQUE_FILL_STYLE : TRANSPARENT_FILL_STYLE
  return (
    <div
      data-role="chart-label"
      className={cx('flex items-end text-sm', style, className)}
    >
      ...
    </div>
  )
}
