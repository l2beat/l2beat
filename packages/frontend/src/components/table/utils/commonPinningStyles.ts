import type { Column } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

export function getCommonPinningStyles<T>(
  column: Column<T>,
): CSSProperties | undefined {
  const isPinned = column.getIsPinned()
  if (!isPinned) return undefined
  const isLastPinned = column.getIsLastColumn('left')
    ? 'left'
    : column.getIsLastColumn('right')
      ? 'right'
      : undefined

  const maskGradient =
    isLastPinned &&
    `linear-gradient(to ${
      isLastPinned === 'left' ? 'right' : 'left'
    }, transparent 0, black 0px, black calc(100% - 10px), transparent 100%)`

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: 'sticky',
    width: column.getSize(),
    transform: 'translateZ(0)', // Force GPU compositing for iOS WebView
    WebkitMaskImage: maskGradient, // Safari/iOS prefix
    maskImage: maskGradient,
    zIndex: 1,
  }
}
