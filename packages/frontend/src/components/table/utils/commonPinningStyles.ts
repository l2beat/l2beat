import type { Column } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

// Must not exceed the narrowest padding of a pinned cell (the logo column's
// desktop 6px), otherwise the fade starts inside the cell's own content.
const EDGE_FADE_WIDTH_PX = 6

// Sticky cells are pulled 1px past the scrollport edge so that fractional
// scroll offsets (touch scrolling, browser zoom) cannot leave a sub-pixel
// sliver of scrolled content visible beside them.
export const STICKY_OVERLAP_PX = 1

/**
 * Where a left-pinned column sticks, set by `useStickyTableHeader` from the
 * rendered column widths. Without it the offset comes from the declared sizes,
 * which drift from the real ones whenever content makes a column wider.
 */
export function getPinnedLeftVariable(pinnedIndex: number) {
  return `--sticky-table-pinned-left-${pinnedIndex}`
}

export function getCommonPinningStyles<T>(
  column: Column<T>,
): CSSProperties | undefined {
  const isPinned = column.getIsPinned()
  if (!isPinned) return undefined

  return {
    left:
      isPinned === 'left'
        ? `var(${getPinnedLeftVariable(column.getPinnedIndex())}, ${
            column.getStart('left') - STICKY_OVERLAP_PX
          }px)`
        : undefined,
    right:
      isPinned === 'right'
        ? `${column.getAfter('right') - STICKY_OVERLAP_PX}px`
        : undefined,
    position: 'sticky',
    width: column.getSize(),
    maskImage: getEdgeFadeMask(column),
    zIndex: 10,
  }
}

/**
 * Pinned cells of the sticky header copy (see `useStickyTableHeader`) live
 * outside the scroller, so `position: sticky` cannot pin them; the copy's
 * pinned layer holds them in place instead.
 */
export function getStickyHeaderPinningStyles<T>(
  column: Column<T>,
): CSSProperties | undefined {
  if (!column.getIsPinned()) return undefined

  return {
    width: column.getSize(),
    maskImage: getEdgeFadeMask(column),
  }
}

function getEdgeFadeMask<T>(column: Column<T>) {
  const isLastPinned = column.getIsLastColumn('left')
    ? 'left'
    : column.getIsLastColumn('right')
      ? 'right'
      : undefined
  if (!isLastPinned) return undefined

  return `linear-gradient(to ${
    isLastPinned === 'left' ? 'right' : 'left'
  }, transparent 0, black 0px, black calc(100% - ${EDGE_FADE_WIDTH_PX}px), transparent 100%)`
}
