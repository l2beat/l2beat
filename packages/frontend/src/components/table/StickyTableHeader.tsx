import type * as React from 'react'
import type { RefObject } from 'react'
import { cn } from '~/utils/cn'
import {
  type StickyTableRefs,
  stickyTableHeaderClassNames,
} from './useStickyTableHeader'
import {
  NOT_A_FOOTER_PROPS,
  STICKY_OVERLAP_PX,
} from './utils/commonPinningStyles'

/**
 * The copy starts as far left as the table, so the pinned layer drops the
 * overlap from its width, ending where the table's pinned cells end.
 */
const PINNED_LAYER_STYLE = {
  '--sticky-table-pinned-overlap': `${STICKY_OVERLAP_PX}px`,
} as React.CSSProperties

/**
 * The visible copy of a sticky table's header, laid out by
 * `useStickyTableHeader`. It is drawn twice: the track slides with the table's
 * horizontal scroll, and the pinned layer above it holds the pinned columns
 * still, like the table's own `position: sticky` cells. Only the two wrapping
 * `div`s are animated; animated table cells run on the main thread in WebKit.
 */
export function StickyTableHeader({
  header,
  track,
  pinned,
  tableProps,
  children,
}: Pick<StickyTableRefs, 'header' | 'track' | 'pinned'> & {
  tableProps: React.TableHTMLAttributes<HTMLTableElement>
  children: React.ReactNode
}) {
  const renderCopy = (ref: RefObject<HTMLTableElement | null>) => (
    // The table's own header, kept invisible, is the one screen readers read.
    <table
      ref={ref}
      role="presentation"
      cellSpacing={0}
      cellPadding={0}
      {...tableProps}
    >
      {children}
    </table>
  )

  return (
    <div
      ref={header}
      className={cn(stickyTableHeaderClassNames.header, 'bg-surface-primary')}
      {...NOT_A_FOOTER_PROPS}
    >
      {/* First, so focus meets the pinned columns' controls before the rest,
          in the order they show. */}
      <div
        className={stickyTableHeaderClassNames.pinnedLayer}
        style={PINNED_LAYER_STYLE}
      >
        {renderCopy(pinned)}
      </div>
      <div className={stickyTableHeaderClassNames.track}>
        {renderCopy(track)}
      </div>
    </div>
  )
}
