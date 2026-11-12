import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { Chapter, Figure, Para, Ref, Strong, ValueSlot } from '../Article'
import type { WindowStats } from '../facts'
import { formatInteger, formatUsd, shareInWords } from '../format'
import { PosterShares, toPosterShares } from '../PosterShares'

const ICONS = 18

/**
 * Chapter 3: who relies on it. The claim names the biggest poster of the last
 * few minutes, so it can change hands while you read; value secured comes
 * from our TVS data for every project that uses Ethereum for data.
 */
export function Reliance({
  window,
  posters,
  usedIn,
  tvs,
}: {
  window: WindowStats | undefined
  posters: Map<string, BlobPoster>
  usedIn: UsedInProjectWithIcon[]
  tvs: number
}) {
  const shares = window ? toPosterShares(window, posters) : undefined
  const leader = shares?.find((s) => s.iconUrl !== undefined)
  const minutes = window ? Math.round(window.seconds / 60) : 13

  return (
    <Chapter
      id="who-relies"
      order={3}
      claim={
        leader ? (
          <>
            {leader.name} posted {shareInWords(leader.share)} of the blobs in
            the last {minutes} minutes
          </>
        ) : (
          <>
            <ValueSlot chars={8} /> posted <ValueSlot chars={6} /> of the blobs
            in the last {minutes} minutes
          </>
        )
      }
      standfirst={
        <>
          {usedIn.length} systems use Ethereum to publish their data, and
          together they secure <Strong>{formatUsd(tvs)}</Strong>. Each one
          inherits what Ethereum guarantees, and what it doesn't.
        </>
      }
    >
      <div className="lg:grid lg:grid-cols-[minmax(0,37rem)_15rem] lg:gap-x-14">
        <Figure className="mt-0 md:mt-0">
          <PosterShares shares={shares} />
        </Figure>
        <aside className="max-lg:hidden">
          <p className="text-[13px] text-secondary leading-[1.5]">
            Shares of the {window ? formatInteger(window.blobs) : '…'} blobs in
            the last {window?.slots ?? 64} slots, attributed by the address that
            posted them. Unattributed blobs come from posters we haven't matched
            to a project yet.
            <Ref id="blobs" />
          </p>
        </aside>
      </div>

      <Para
        note={
          <>
            <Strong>Value secured</Strong> counts assets bridged to these
            systems, minted on them, or bridged by third parties, whether or not
            they're used in DeFi.
          </>
        }
      >
        The bars measure use. Value secured measures what is at stake: the
        assets on these systems, which depend on Ethereum keeping their data
        available so their users can rebuild the state and leave without the
        operator's help.
      </Para>

      <ul
        className="mt-6 flex flex-wrap gap-1.5"
        aria-label="Systems that use Ethereum for data"
      >
        {usedIn.slice(0, ICONS).map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              title={p.name}
              className="flex items-center gap-1.5 rounded-full border border-divider py-1 pr-2.5 pl-1 text-[13px] hover:bg-surface-secondary"
            >
              <img src={p.icon} alt="" className="size-5 rounded-full" />
              {p.name}
            </a>
          </li>
        ))}
        {usedIn.length > ICONS && (
          <li className="flex items-center px-2 text-[13px] text-secondary">
            and {usedIn.length - ICONS} more
          </li>
        )}
      </ul>
    </Chapter>
  )
}
