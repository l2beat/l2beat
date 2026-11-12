import { useRef } from 'react'
import {
  RollingNumber,
  useReorder,
} from '~/pages/blobs/components/live-blobs/liveMotion'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { UNKNOWN_POSTER_ID } from '../../live/simulatedHead'
import { ValueSlot } from './Article'
import type { WindowStats } from './facts'
import { formatInteger, formatPercentage } from './format'

const NAMED = 7

export interface PosterShare {
  id: string
  name: string
  iconUrl: string | undefined
  href: string | undefined
  color: string
  blobs: number
  share: number
}

/** Ranked by blobs in the window; the long tail and the unattributed fold into one row each */
export function toPosterShares(
  window: WindowStats,
  posters: Map<string, BlobPoster>,
): PosterShare[] {
  const named: PosterShare[] = []
  let others = 0
  let unknown = 0
  for (const { posterId, blobs } of window.byPoster) {
    const poster = posters.get(posterId)
    if (posterId === UNKNOWN_POSTER_ID || !poster) unknown += blobs
    else if (named.length < NAMED) {
      named.push({
        id: poster.id,
        name: poster.name,
        iconUrl: poster.iconUrl,
        href: poster.href,
        color: poster.color,
        blobs,
        share: blobs / window.blobs,
      })
    } else others += blobs
  }
  const tail = (id: string, name: string, blobs: number): PosterShare => ({
    id,
    name,
    iconUrl: undefined,
    href: undefined,
    color: 'var(--surface-tertiary)',
    blobs,
    share: blobs / window.blobs,
  })
  return [
    ...named,
    ...(others > 0 ? [tail('others', 'Everyone else', others)] : []),
    ...(unknown > 0 ? [tail('unknown', 'Unattributed', unknown)] : []),
  ]
}

/**
 * Who posted the window's blobs, as ranked bars. Rows slide when the order
 * changes, so a reader can watch a poster overtake another.
 */
export function PosterShares({
  shares,
}: {
  shares: PosterShare[] | undefined
}) {
  const ref = useRef<HTMLOListElement>(null)
  useReorder(ref, shares?.map((s) => s.id).join() ?? '')
  const top = Math.max(...(shares ?? []).map((s) => s.share), 0.01)
  return (
    <ol ref={ref} className="relative flex flex-col">
      {shares
        ? shares.map((s) => (
            <li
              key={s.id}
              data-flip-key={s.id}
              className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_2.75rem] items-center gap-x-3 border-divider border-b py-2.5 last:border-none sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_2.75rem_4.5rem]"
            >
              <Name share={s} />
              <span className="relative h-3">
                <span
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-r-[3px] transition-transform duration-700 ease-out-quint"
                  style={{
                    transform: `scaleX(${s.share / top})`,
                    background: s.color,
                  }}
                />
              </span>
              <RollingNumber
                value={s.share}
                format={formatPercentage}
                className="text-right font-semibold text-[14px]"
              />
              <span className="text-right text-[13px] text-secondary tabular-nums max-sm:hidden">
                {formatInteger(s.blobs)} blobs
              </span>
            </li>
          ))
        : Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              <ValueSlot chars={12} />
            </li>
          ))}
    </ol>
  )
}

function Name({ share }: { share: PosterShare }) {
  const content = (
    <>
      {share.iconUrl ? (
        <img
          src={share.iconUrl}
          alt=""
          className="size-5 shrink-0 rounded-full"
        />
      ) : (
        <span className="size-5 shrink-0 rounded-full border border-divider border-dashed" />
      )}
      <span className="truncate">{share.name}</span>
    </>
  )
  const className = 'flex min-w-0 items-center gap-2 font-medium text-[15px]'
  return share.href ? (
    <a href={share.href} className={`${className} hover:underline`}>
      {content}
    </a>
  ) : (
    <span className={`${className} text-secondary`}>{content}</span>
  )
}
