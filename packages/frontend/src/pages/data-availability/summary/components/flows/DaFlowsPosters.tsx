import { formatInteger, formatSeconds, pluralize } from '@l2beat/shared-pure'
import { type RefObject, useEffect, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { ViewDetailsLink } from '~/components/ViewDetailsLink'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import type { DaFlowsPoster } from './buildDaFlowsGraph'
import type { DaFlowsUnit } from './daFlowsUnit'
import { formatPosted } from './formatPosted'

interface Props {
  detailsHref: string
  posters: DaFlowsPoster[] | undefined
  totalPosted: number | undefined
  isLoading: boolean
  highlighted: string | undefined
  unit: DaFlowsUnit
  getNodeId: (posterId: string) => string
  onSelect: (nodeId: string) => void
}

// Every row is its own grid, so the columns line up only when their widths
// do not depend on the content: rank, icon, name, data posted, share
const ROW_GRID =
  'grid grid-cols-[1.25rem_1.25rem_minmax(0,1fr)_4.5rem_3rem] items-center gap-x-2'

/**
 * The exact numbers behind the graph. Particles show who posts a lot and who
 * posts little; nobody can read a byte count off a stream of dots. The same
 * goes for how often a project posts and how much it posts at once.
 */
export function DaFlowsPosters({
  detailsHref,
  posters,
  totalPosted,
  isLoading,
  highlighted,
  unit,
  getNodeId,
  onSelect,
}: Props) {
  const listRef = useRef<HTMLOListElement>(null)
  useScrollToHighlighted(listRef, highlighted)
  useBottomFade(listRef, posters)

  return (
    <div className="flex h-full flex-col rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
      <div className="flex items-center justify-between gap-3">
        <div className="font-bold text-heading-20">Posters</div>
        <div className="flex items-center gap-3">
          <span className="font-medium text-[13px] text-secondary leading-none">
            Past day
          </span>
          <ViewDetailsLink href={detailsHref} />
        </div>
      </div>
      {/* A row of the list itself, so its numbers sit in the same columns. The
          ring is drawn inside, where a border would push them off by a pixel */}
      <div
        className={cn(
          ROW_GRID,
          '-mx-2 mt-3 rounded-lg bg-surface-primary px-2 py-1.5 font-medium text-label-value-14 ring-1 ring-divider ring-inset',
        )}
      >
        <span className="col-span-3 flex min-w-0 items-baseline gap-1.5">
          <span className="font-bold">Total</span>
          {posters && (
            <span className="truncate text-label-value-12 text-secondary">
              {formatInteger(posters.length)}{' '}
              {pluralize(posters.length, 'project')}
            </span>
          )}
        </span>
        {isLoading || totalPosted === undefined ? (
          <Skeleton className="col-span-2 h-5 w-full" />
        ) : (
          <>
            <span className="text-right font-bold tabular-nums">
              {formatPosted(totalPosted)}
            </span>
            <span className="text-right text-secondary tabular-nums">
              {formatPercent(1)}
            </span>
          </>
        )}
      </div>
      <ol
        ref={listRef}
        className="-mx-2 mt-1 min-h-0 flex-1 overflow-y-auto"
        style={{
          maskImage: `linear-gradient(to bottom, black calc(100% - var(${FADE_VAR}, 0px)), transparent)`,
        }}
      >
        {isLoading || !posters
          ? Array.from({ length: 8 }, (_, i) => (
              <li key={i} className="px-2 py-1.5">
                <Skeleton className="h-5 w-full" />
              </li>
            ))
          : posters.map((poster, index) => {
              const nodeId = getNodeId(poster.id)
              return (
                <li key={poster.id} data-node-id={nodeId}>
                  <button
                    type="button"
                    onClick={() => onSelect(nodeId)}
                    aria-pressed={highlighted === nodeId}
                    className={cn(
                      ROW_GRID,
                      'w-full rounded px-2 py-1.5 text-left font-medium text-label-value-14 hover:bg-pure-black/5 dark:hover:bg-pure-white/10',
                      highlighted === nodeId &&
                        'bg-pure-black/5 dark:bg-pure-white/10',
                    )}
                  >
                    <span className="text-right text-secondary tabular-nums">
                      {index + 1}
                    </span>
                    {poster.iconUrl ? (
                      <img
                        src={poster.iconUrl}
                        alt=""
                        className="size-5 rounded-full"
                      />
                    ) : (
                      <span className="size-5" />
                    )}
                    <span className="min-w-0 truncate">{poster.name}</span>
                    <span className="text-right tabular-nums">
                      {formatPosted(poster.posted)}
                    </span>
                    <span className="text-right text-secondary tabular-nums">
                      {formatPercent(poster.share)}
                    </span>
                    {poster.batch && (
                      // under the numbers it explains, with the same right edge
                      <span className="col-span-3 col-start-3 truncate text-right text-label-value-12 text-secondary tabular-nums">
                        {unit.format(poster.batch.size)} every{' '}
                        {formatSeconds(poster.batch.interval)}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
      </ol>
    </div>
  )
}

/**
 * Brings the row of what was picked on the graph into view. "Others" stands
 * for many rows, so the list goes to the first of them. Only the list moves,
 * never the page: where the list is not cut short, as on a phone, there is
 * nothing to scroll.
 */
function useScrollToHighlighted(
  listRef: RefObject<HTMLOListElement | null>,
  highlighted: string | undefined,
) {
  useEffect(() => {
    const list = listRef.current
    if (!list || highlighted === undefined) return
    const row = list.querySelector<HTMLElement>(
      `[data-node-id="${CSS.escape(highlighted)}"]`,
    )
    if (!row) return

    const listRect = list.getBoundingClientRect()
    const rowRect = row.getBoundingClientRect()
    if (rowRect.top >= listRect.top && rowRect.bottom <= listRect.bottom) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    list.scrollTo({
      // centered, so the rows around it are in view too
      top:
        list.scrollTop +
        rowRect.top -
        listRect.top -
        (list.clientHeight - rowRect.height) / 2,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }, [listRef, highlighted])
}

const FADE_VAR = '--bottom-fade'
const FADE_HEIGHT = 48

/**
 * Fades the bottom of the list out while there is more of it below, so it
 * reads as cut off rather than as ending. The fade shrinks with what is left
 * to scroll and is gone at the very end, where it would hide the last row.
 * It is set straight on the element, as a render per scroll event would
 * redraw every row.
 */
function useBottomFade(
  listRef: RefObject<HTMLOListElement | null>,
  posters: DaFlowsPoster[] | undefined,
) {
  useEffect(() => {
    const list = listRef.current
    if (!list || !posters) return

    const update = () => {
      const left = list.scrollHeight - list.clientHeight - list.scrollTop
      const fade = Math.max(0, Math.min(FADE_HEIGHT, left))
      list.style.setProperty(FADE_VAR, `${fade}px`)
    }
    update()
    list.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(list)
    return () => {
      list.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [listRef, posters])
}
