import type { Column } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

interface CommonPinningStylesOptions {
  scrollOffset?: number
  scrollOffsetVar?: string
  zIndex?: number
}

export function getCommonPinningStyles<T>(
  column: Column<T>,
  options?: CommonPinningStylesOptions,
): CSSProperties | undefined {
  const isPinned = column.getIsPinned()
  if (!isPinned) return undefined
  const scrollOffset = options?.scrollOffset ?? 0
  const scrollOffsetVar = options?.scrollOffsetVar
  const isLastPinned = column.getIsLastColumn('left')
    ? 'left'
    : column.getIsLastColumn('right')
      ? 'right'
      : undefined

  const left =
    isPinned !== 'left'
      ? undefined
      : scrollOffsetVar
        ? `calc(${column.getStart('left')}px + var(${scrollOffsetVar}, 0px))`
        : `${column.getStart('left') + scrollOffset}px`

  const right =
    isPinned !== 'right'
      ? undefined
      : scrollOffsetVar
        ? `calc(${column.getAfter('right')}px - var(${scrollOffsetVar}, 0px))`
        : `${column.getAfter('right') - scrollOffset}px`

  return {
    left,
    right,
    position: 'sticky',
    width: column.getSize(),
    maskImage:
      isLastPinned &&
      `linear-gradient(to ${
        isLastPinned === 'left' ? 'right' : 'left'
      }, transparent 0, black 0px, black calc(100% - 10px), transparent 100%)`,
    zIndex: options?.zIndex ?? 10,
  }
}
