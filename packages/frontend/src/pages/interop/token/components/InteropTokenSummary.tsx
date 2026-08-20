import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { Badge } from '~/components/badge/Badge'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { EM_DASH } from '~/consts/characters'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import { InteropNoDataBadge } from '../../components/InteropNoDataBadge'
import { InteropTopPathValue } from '../../components/InteropTopPathValue'
import { TopProtocolsCell } from '../../components/protocols/TopProtocolsCell'
import { AvgDurationCell } from '../../components/table/AvgDurationCell'

export function InteropTokenSummary({
  data,
  isLoading,
  tokenCategory,
  deploymentsCount,
}: {
  data: InteropTokenDashboardData | undefined
  isLoading: boolean
  tokenCategory: string | null
  deploymentsCount: number
}) {
  const token = data?.token

  return (
    <section
      id="summary"
      data-role="nav-section"
      className="mt-4 flex w-full scroll-mt-[100vh] flex-col border-divider px-4 max-md:border-b max-md:pb-6 md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="grid grid-cols-1 gap-x-3 max-md:gap-y-3 md:grid-cols-3">
        <StatsItem
          title="Category"
          isLoading={isLoading}
          value={<CategoryBadge category={tokenCategory} />}
        />
        <StatsItem
          title="Last 24h volume"
          isLoading={isLoading}
          value={
            token?.volume !== null && token?.volume !== undefined
              ? formatCurrency(token.volume, 'usd')
              : EM_DASH
          }
        />
        <StatsItem
          title="Last 24h transfer count"
          isLoading={isLoading}
          value={token ? formatInteger(token.transferCount) : EM_DASH}
        />
      </div>
      <HorizontalSeparator className="col-span-3 my-4 max-md:hidden" />
      <div className="grid grid-cols-1 gap-x-3 max-md:mt-3 max-md:gap-y-3 md:grid-cols-3">
        <StatsItem
          title="Last 24h avg. transfer time"
          isLoading={isLoading}
          value={
            token?.avgDuration ? (
              <AvgDurationCell
                className="font-bold text-label-value-16"
                splitClassName="flex-row gap-3 text-label-value-16 font-bold md:gap-3"
                averageDuration={token.avgDuration}
              />
            ) : token ? (
              <InteropNoDataBadge size="extraSmall" />
            ) : (
              EM_DASH
            )
          }
        />
        <StatsItem
          title="Last 24h avg. transfer value"
          isLoading={isLoading}
          value={
            token?.avgValue !== null && token?.avgValue !== undefined
              ? formatCurrency(token.avgValue, 'usd')
              : EM_DASH
          }
        />
        <StatsItem
          title="Last 24h top path"
          isLoading={isLoading}
          value={
            data?.topPath ? (
              <InteropTopPathValue path={data.topPath} />
            ) : (
              EM_DASH
            )
          }
        />
      </div>
      <HorizontalSeparator className="col-span-3 my-4 max-md:hidden" />
      <div className="grid grid-cols-1 gap-x-3 max-md:mt-3 max-md:gap-y-3 md:grid-cols-3">
        <StatsItem
          title="Protocols used"
          href="#interop-protocols"
          isLoading={isLoading}
          value={
            data?.entries?.length ? (
              <TopProtocolsCell protocols={data.entries} />
            ) : (
              EM_DASH
            )
          }
        />
        {deploymentsCount > 0 && (
          <StatsItem
            title="Deployments"
            isLoading={isLoading}
            value={
              <a href="#onchain-deployments" className="hover:underline">
                {formatInteger(deploymentsCount)}
              </a>
            }
          />
        )}
      </div>
    </section>
  )
}

function StatsItem({
  title,
  value,
  isLoading,
  href,
}: {
  title: string
  value: ReactNode
  isLoading: boolean
  href?: string
}) {
  const content = (
    <>
      <span className="shrink-0 font-medium text-paragraph-12 text-secondary">
        {title}
      </span>
      <div className="min-w-0 text-right font-bold text-label-value-16 leading-none group-hover:underline md:text-left">
        {isLoading ? <Skeleton className="h-5 w-24" /> : value}
      </div>
    </>
  )
  const className =
    'flex gap-3 max-md:items-start max-md:justify-between md:flex-col md:gap-1.5'

  return href ? (
    <a href={href} className={`group ${className}`}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  )
}

function CategoryBadge({ category }: { category: string | null }) {
  if (!category) return EM_DASH

  return (
    <Badge
      className="bg-blue-700 font-bold text-white uppercase"
      size="small"
      padding="small"
    >
      {category}
    </Badge>
  )
}
