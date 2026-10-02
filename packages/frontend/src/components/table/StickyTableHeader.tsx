import type * as React from 'react'
import type { RefObject } from 'react'
import { cn } from '~/utils/cn'
import {
  type StickyTableRefs,
  stickyTableHeaderClassNames,
} from './useStickyTableHeader'
import { STICKY_OVERLAP_PX } from './utils/commonPinningStyles'

/**
 * Once the table scrolls, its sticky cells stop 1px left of where they start,
 * and so does the pinned layer. The range is a plain length: the form measured
 * to stay on the compositor in WebKit.
 */
const PINNED_LAYER_STYLE = {
  '--sticky-table-pinned-overlap': `${STICKY_OVERLAP_PX}px`,
  animationRange: `0px ${STICKY_OVERLAP_PX}px`,
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
    <table ref={ref} cellSpacing={0} cellPadding={0} {...tableProps}>
      {children}
    </table>
  )

  return (
    <div
      ref={header}
      className={cn(stickyTableHeaderClassNames.header, 'bg-surface-primary')}
    >
      <div className={stickyTableHeaderClassNames.track}>
        {renderCopy(track)}
      </div>
      <div
        className={stickyTableHeaderClassNames.pinnedLayer}
        style={PINNED_LAYER_STYLE}
      >
        {renderCopy(pinned)}
      </div>
    </div>
  )
}
