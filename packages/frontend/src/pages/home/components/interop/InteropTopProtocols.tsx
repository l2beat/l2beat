import { formatCurrency } from '@l2beat/shared-pure'
import type { FlowProtocol } from '~/server/features/layer2s/interop/getInteropFlows'
import { cn } from '~/utils/cn'
import {
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_TEXT,
} from '../../homeStyles'
import { HomeRank, HomeRankedName } from '../HomeRankedTable'

/** Protocols under the graph; stacked from lg, as many as the height holds. */
const TOP_PROTOCOLS_COUNT = 5

/** The busiest protocols over the last 24h, ranked like the other cards. */
export function InteropTopProtocols({
  protocols,
}: {
  protocols: FlowProtocol[]
}) {
  if (protocols.length === 0) {
    return null
  }
  return (
    <div className="flex interop-corners:hidden interop-stacked:min-h-0 min-w-0 interop-stacked:flex-1 interop-stacked:basis-0 flex-col gap-2 interop-stacked:overflow-hidden">
      <h3 className={HOME_TEXT.sectionTitle}>Top protocols</h3>
      {/* Stacked from lg, the list takes the height left and shows as many
          whole rows as fit. */}
      <ol
        className={cn(
          'interop-stacked:home-fill-rows interop-stacked:min-h-0 interop-stacked:flex-1 interop-stacked:basis-0 interop-stacked:overflow-hidden',
          HOME_ROW_LINES_CLASS,
        )}
      >
        {protocols.map(({ slug, name, iconUrl, volume }, index) => (
          <li
            key={slug}
            className={cn(
              // The ranked tables' gaps, so stacked under them on phones the
              // icons and names line up.
              'flex w-full items-center gap-4',
              HOME_ROW_CLASS,
              index >= TOP_PROTOCOLS_COUNT && 'interop-stacked:flex hidden',
            )}
          >
            <HomeRank rank={index + 1} />
            <HomeRankedName
              name={name}
              href={`/interop/protocols/${slug}`}
              iconUrl={iconUrl}
              className="flex-1"
            />
            <span className={cn('shrink-0', HOME_TEXT.value)}>
              {formatCurrency(volume, 'usd')}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
