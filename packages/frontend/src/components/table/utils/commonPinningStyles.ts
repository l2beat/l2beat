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
 * Pinned cells stick unless an ancestor sets this to `static`, as the sticky
 * header copy does: it lives outside the scroller, so it pins its cells itself.
 */
const PINNED_POSITION_VARIABLE = '--sticky-table-pinned-position'

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
  const isLastPinned = column.getIsLastColumn('left')
    ? 'left'
    : column.getIsLastColumn('right')
      ? 'right'
      : undefined

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
    position:
      `var(${PINNED_POSITION_VARIABLE}, sticky)` as CSSProperties['position'],
    width: column.getSize(),
    maskImage:
      isLastPinned &&
      `linear-gradient(to ${
        isLastPinned === 'left' ? 'right' : 'left'
      }, transparent 0, black 0px, black calc(100% - ${EDGE_FADE_WIDTH_PX}px), transparent 100%)`,
    zIndex: 10,
  }
}

/** Marks pinned header cells, for the sticky header copy to tell them apart. */
export const PINNED_CELL_ATTRIBUTE = 'data-pinned'

export function getPinnedHeaderCellProps<T>(column: Column<T>) {
  return {
    style: getCommonPinningStyles(column),
    [PINNED_CELL_ATTRIBUTE]: column.getIsPinned() ? '' : undefined,
  }
}
