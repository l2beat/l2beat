import { formatCurrency } from '@l2beat/shared-pure'
import type { FlowProtocol } from '~/server/features/layer2s/interop/getInteropFlows'
import { cn } from '~/utils/cn'
import {
  HOME_ICON_CLASS,
  HOME_ROW_LINK_CLASS,
  HOME_TEXT,
} from '../../homeStyles'
import type { getInteropFigures } from './InteropFigures'

/** The busiest protocols, in a corner beside the graph. */
const CORNER_PROTOCOLS_COUNT = 3

const CORNER_CLASS = 'pointer-events-auto flex max-w-[180px] flex-col gap-4'

/**
 * The figures in the four corners the graph's ring leaves free: totals top
 * left, routes and the top chain top right, the top token bottom left, the
 * busiest protocols bottom right (or, without them, the top protocol beside
 * the token).
 */
export function InteropCornerFigures({
  figures,
  protocols: allProtocols,
}: {
  figures: ReturnType<typeof getInteropFigures>
  protocols: FlowProtocol[]
}) {
  const protocols = allProtocols.slice(0, CORNER_PROTOCOLS_COUNT)
  return (
    <div className="pointer-events-none absolute inset-0 interop-corners:block hidden">
      <div className={cn(CORNER_CLASS, 'absolute top-0 left-0')}>
        {figures.volume}
        {figures.transfers}
      </div>
      <div
        className={cn(
          CORNER_CLASS,
          'absolute top-0 right-0 items-end text-right',
        )}
      >
        {figures.activeRoutes}
        {figures.topChain}
      </div>
      {/* The bottom pair hangs from one line, as the top pair does, so their
          labels and first rows line up however long the lists. */}
      <div className="absolute inset-x-0 bottom-0 flex items-start justify-between">
        <div className={CORNER_CLASS}>
          {figures.topToken}
          {figures.topProtocol}
        </div>
        {protocols.length > 0 && (
          <div
            // As close to its list as the other corners' labels to their rows.
            className={cn(
              CORNER_CLASS,
              'max-w-[220px] items-end gap-1.5 text-right',
            )}
          >
            <span className={HOME_TEXT.meta}>Top protocols</span>
            {/* Shared columns line the icons and names up like a table; the
                figures stand clear of the longest name, as in the tables. */}
            <ol className="grid max-w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-x-2 gap-y-2 text-left">
              {protocols.map(({ slug, name, iconUrl, volume }) => (
                <li key={slug} className="col-span-3 grid grid-cols-subgrid">
                  <a
                    href={`/interop/protocols/${slug}`}
                    title={name}
                    className="group col-span-3 grid grid-cols-subgrid items-center"
                  >
                    <img src={iconUrl} alt="" className={HOME_ICON_CLASS} />
                    <span
                      className={cn(
                        'truncate',
                        HOME_ROW_LINK_CLASS,
                        HOME_TEXT.row,
                      )}
                    >
                      {name}
                    </span>
                    <span className={cn('pl-4 text-right', HOME_TEXT.value)}>
                      {formatCurrency(volume, 'usd')}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
