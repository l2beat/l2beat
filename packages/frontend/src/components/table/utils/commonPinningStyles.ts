import type { Column } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

export type PinningLayerRole =
  | 'body'
  | 'header-main'
  | 'header-group'
  | 'footer-filler'

export function getPinningLayerZIndex(_role: PinningLayerRole) {
  // Keep current visual stacking for now; role mapping is a sticky-header
  // preparation point for future layering changes.
  return 1
}

export function getCommonPinningStyles<T>(
  column: Column<T>,
  role: PinningLayerRole = 'body',
): CSSProperties | undefined {
  const isPinned = column.getIsPinned()
  if (!isPinned) return undefined
  const isLastPinned = column.getIsLastColumn('left')
    ? 'left'
    : column.getIsLastColumn('right')
      ? 'right'
      : undefined

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: 'sticky',
    width: column.getSize(),
    maskImage:
      isLastPinned &&
      `linear-gradient(to ${
        isLastPinned === 'left' ? 'right' : 'left'
      }, transparent 0, black 0px, black calc(100% - 10px), transparent 100%)`,
    zIndex: getPinningLayerZIndex(role),
  }
}
