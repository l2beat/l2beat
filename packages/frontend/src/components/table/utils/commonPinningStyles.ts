import type { Column } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

// Must not exceed the narrowest padding of a pinned cell (the logo column's
// desktop 6px), otherwise the fade starts inside the cell's own content.
const EDGE_FADE_WIDTH_PX = 6

// Sticky cells are pulled 1px past the scrollport edge so that fractional
// scroll offsets (touch scrolling, browser zoom) cannot leave a sub-pixel
// sliver of scrolled content visible beside them.
const STICKY_OVERLAP_PX = 1

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

  return {
    left:
      isPinned === 'left'
        ? `${column.getStart('left') - STICKY_OVERLAP_PX}px`
        : undefined,
    right:
      isPinned === 'right'
        ? `${column.getAfter('right') - STICKY_OVERLAP_PX}px`
        : undefined,
    position: 'sticky',
    width: column.getSize(),
    maskImage:
      isLastPinned &&
      `linear-gradient(to ${
        isLastPinned === 'left' ? 'right' : 'left'
      }, transparent 0, black 0px, black calc(100% - ${EDGE_FADE_WIDTH_PX}px), transparent 100%)`,
    zIndex: 10,
  }
}
