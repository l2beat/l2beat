import { formatActivityCount, formatCurrency } from '@l2beat/shared-pure'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { InteropTopItems } from '~/pages/interop/components/top-items/TopItems'
import type { ProjectInteropData } from '~/server/features/layer2s/interop/getProjectInteropData'

export function ProjectInteropMetrics({
  interop,
}: {
  interop: ProjectInteropData['summary']
}) {
  const headlineStats = [
    {
      label: 'Last 24h cross-chain volume',
      value: formatCurrency(interop.volume, 'usd'),
    },
    {
      label: 'Last 24h cross-chain transfers',
      // A count of transfers: whole numbers below 1K ("55", not "55.00").
      value: formatActivityCount(interop.transferCount, {
        decimals: interop.transferCount < 1000 ? 0 : 2,
      }),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
        {headlineStats.map((stat) => (
          <a
            key={stat.label}
            href="#interop-flows"
            className="group flex max-md:items-center max-md:justify-between md:flex-col md:gap-1.5"
          >
            <span className="text-label-value-13 text-primary leading-4">
              {stat.label}
            </span>
            <span className="font-bold text-label-value-16 group-hover:underline">
              {stat.value}
            </span>
          </a>
        ))}
      </div>
      {/* No protocols or tokens to list: no empty ruled band either. */}
      {(interop.protocols.items.length > 0 ||
        interop.tokens.items.length > 0) && (
        <>
          <HorizontalSeparator />
          <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
            <InteropMetric
              title="Interop protocols used"
              href="#interop-flows"
              items={{
                items: interop.protocols.items.map((protocol) => ({
                  id: protocol.id,
                  displayName: protocol.name,
                  iconUrl: protocol.iconUrl,
                  volume: protocol.volume,
                })),
                remainingCount: interop.protocols.remainingCount,
              }}
            />
            <InteropMetric
              title="Tokens by volume"
              href="#interop-flows"
              items={{
                items: interop.tokens.items.map((token) => ({
                  id: token.id,
                  displayName: token.symbol,
                  iconUrl: token.iconUrl,
                  volume: token.volume,
                })),
                remainingCount: interop.tokens.remainingCount,
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

function InteropMetric({
  title,
  items,
  href,
}: {
  title: string
  href: string
  items: {
    items: {
      id: string
      displayName: string
      iconUrl: string
      volume: number
    }[]
    remainingCount: number
  }
}) {
  if (items.items.length === 0) {
    return null
  }

  return (
    <a href={href} className="group block">
      <p className="mb-2 text-label-value-13 text-primary leading-4 group-hover:underline">
        {title}
      </p>
      <InteropTopItems topItems={items} hideDialog />
    </a>
  )
}
