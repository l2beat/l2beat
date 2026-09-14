import type { Column } from '@tanstack/react-table'
import type { CSSProperties } from 'react'

const FADE_WIDTH_PX = 10

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
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: 'sticky',
    width: column.getSize(),
    ...(isLastPinned && getEdgeFadeMask(isLastPinned)),
    zIndex: 10,
  }
}

/**
 * Fades the outer edge of the last pinned cell so content scrolling underneath
 * dissolves instead of being cut off. The fade must never dim the cell's own
 * content (e.g. a project logo), so a solid content-box layer is unioned with
 * a gradient clipped to the padding box: the fade only ever lives in the
 * padding, whatever its width.
 */
function getEdgeFadeMask(side: 'left' | 'right'): CSSProperties {
  const fadeTowards = side === 'left' ? 'right' : 'left'
  return {
    maskImage: `linear-gradient(black, black), linear-gradient(to ${fadeTowards}, black calc(100% - ${FADE_WIDTH_PX}px), transparent)`,
    maskClip: 'content-box, padding-box',
    maskComposite: 'add',
  }
}
