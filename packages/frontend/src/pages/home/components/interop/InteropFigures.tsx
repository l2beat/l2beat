import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { EM_DASH } from '~/consts/characters'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import type { InteropFlowsData } from '~/server/features/layer2s/interop/getInteropFlows'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HOME_ICON_CLASS, HOME_TEXT } from '../../homeStyles'

/**
 * The interop page's general stats: volume, transfers and routes, then the
 * top chain and token. The busiest protocols get a list of their own; when
 * there are none, a "Top protocol" slot with dashes stands in for it.
 */
export function getInteropFigures(
  stats: InteropFlowsData['stats'],
  chains: InteropChainWithIcon[],
) {
  const { topChain, topToken } = stats
  const topChainWithIcon = topChain
    ? chains.find((c) => c.id === topChain.chainId)
    : undefined
  return {
    volume: (
      <Figure label="Volume" value={formatCurrency(stats.totalVolume, 'usd')} />
    ),
    transfers: (
      <Figure
        label="Transfers"
        value={formatInteger(stats.totalTransferCount)}
      />
    ),
    activeRoutes: (
      <Figure label="Active routes" value={formatInteger(stats.activeFlows)} />
    ),
    topChain: (
      <Top
        label="Top chain"
        item={
          topChainWithIcon && {
            href: topChainWithIcon.href,
            iconUrl: topChainWithIcon.iconUrl,
            name: topChainWithIcon.name,
          }
        }
        value={
          topChain && stats.totalVolume > 0
            ? `${formatPercent(topChain.totalVolume / stats.totalVolume)} of volume`
            : undefined
        }
      />
    ),
    topToken: (
      <Top
        label="Top token"
        item={
          topToken && {
            href: getInteropTokenUrl(topToken),
            iconUrl: topToken.iconUrl,
            name: topToken.symbol,
          }
        }
        value={topToken && formatCurrency(topToken.volume, 'usd')}
      />
    ),
    topProtocol:
      stats.topProtocols.length === 0 ? (
        <Top label="Top protocol" item={undefined} value={undefined} />
      ) : undefined,
  }
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className={cn('truncate', HOME_TEXT.meta)}>{label}</span>
      {/* On phones, the size the other cards' stacked KPIs take. */}
      <span
        className={cn('truncate', HOME_TEXT.number, 'max-sm:text-heading-24')}
      >
        {value}
      </span>
    </div>
  )
}

/** One top item: what it is, who it is, and how much. */
function Top({
  label,
  item,
  value,
}: {
  label: string
  item: { href: string | undefined; iconUrl: string; name: string } | undefined
  value: string | undefined
}) {
  const Who = item?.href ? 'a' : 'span'
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className={cn('truncate', HOME_TEXT.meta)}>{label}</span>
      <Who
        href={item?.href}
        className="flex min-w-0 items-center gap-2 underline-offset-2 hover:underline"
      >
        {item ? (
          <>
            <img src={item.iconUrl} alt="" className={HOME_ICON_CLASS} />
            <span className={cn('truncate', HOME_TEXT.row)}>{item.name}</span>
          </>
        ) : (
          EM_DASH
        )}
      </Who>
      <span className={cn('truncate', HOME_TEXT.meta)}>{value ?? EM_DASH}</span>
    </div>
  )
}
