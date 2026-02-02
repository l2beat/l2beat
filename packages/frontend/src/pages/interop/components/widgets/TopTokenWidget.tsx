import { assert } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { PercentChange } from '~/components/PercentChange'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { InfoIcon } from '~/icons/Info'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

export function TopTokenWidget({
  interopChains,
  topToken,
  isLoading,
  className,
}: {
  interopChains: InteropChainWithIcon[]
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
  className?: string
}) {
  const tokenName = topToken?.token.name ?? EM_DASH
  const tokenSymbol = topToken?.token.symbol
  const showSymbol =
    tokenSymbol !== undefined && tokenSymbol !== topToken?.token.name

  const topPath = topToken?.topPath
    ? {
        src: getChainDetails(interopChains, topToken.topPath.srcChain),
        dst: getChainDetails(interopChains, topToken.topPath.dstChain),
      }
    : undefined

  return (
    <PrimaryCard
      className={cn(
        'flex flex-col gap-4 max-md:rounded-lg md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
        <div>
          <h2 className="font-bold text-heading-16 md:text-heading-20">
            Top token
          </h2>
          <div className="mt-0.5 font-medium text-label-value-12 text-secondary md:text-label-value-14">
            Across the selected paths based on volume
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {isLoading ? (
            <Skeleton className="size-10 rounded-full" />
          ) : topToken ? (
            <img
              src={topToken.token.iconUrl}
              alt={`${tokenName} token icon`}
              className="size-10 rounded-full bg-white shadow"
            />
          ) : (
            <div className="size-10 rounded-full bg-surface-secondary" />
          )}
          <div className="flex items-center gap-1.5 font-medium text-label-value-16 md:text-label-value-18">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </>
            ) : (
              <>
                <span className="text-primary">{tokenName}</span>
                {showSymbol && (
                  <span className="text-secondary">{tokenSymbol}</span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-stretch gap-2">
        <TopTokenStatCard
          label="Last 24h volume"
          isLoading={isLoading}
          value={
            <span className="font-bold text-primary">
              {topToken ? formatCurrency(topToken.volume, 'usd') : EM_DASH}
            </span>
          }
          change={topToken?.volumeChange}
        />
        <TopTokenStatCard
          label="Last 24h transfer count"
          isLoading={isLoading}
          value={
            <span className="font-bold text-primary">
              {topToken ? formatInteger(topToken.transferCount) : EM_DASH}
            </span>
          }
          change={topToken?.transferCountChange}
        />
        <TopTokenStatCard
          label="Top protocol used"
          isLoading={isLoading}
          value={
            topToken?.topProtocol ? (
              <div className="flex items-center gap-1.5">
                <img
                  src={topToken.topProtocol.iconUrl}
                  alt={`${topToken.topProtocol.name} icon`}
                  className="size-4 rounded-full bg-white shadow"
                />
                <span className="font-semibold text-primary">
                  {topToken.topProtocol.name}
                </span>
              </div>
            ) : (
              <span className="font-bold text-primary">{EM_DASH}</span>
            )
          }
        />
        <TopTokenStatCard
          label="Top chain path"
          isLoading={isLoading}
          value={
            topPath ? (
              <div className="flex items-center gap-1.5">
                <img
                  src={topPath.src.iconUrl}
                  alt={topPath.src.name}
                  className="size-4 rounded-full bg-white shadow"
                />
                <ArrowRightIcon className="size-4 fill-brand" />
                <img
                  src={topPath.dst.iconUrl}
                  alt={topPath.dst.name}
                  className="size-4 rounded-full bg-white shadow"
                />
              </div>
            ) : (
              <span className="font-bold text-primary">{EM_DASH}</span>
            )
          }
        />
      </div>
    </PrimaryCard>
  )
}

function TopTokenStatCard({
  label,
  value,
  change,
  isLoading,
}: {
  label: string
  value: ReactNode
  change?: number
  isLoading: boolean
}) {
  return (
    <div className="flex min-w-[140px] flex-1 flex-col items-center justify-center rounded border border-divider px-4 py-3 text-center">
      <div className="flex items-center gap-1 text-label-value-12 text-secondary">
        <span>{label}</span>
        <InfoIcon className="size-3" />
      </div>
      <div className="mt-1 flex items-center gap-1 text-label-value-14">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-16" />
            {change !== undefined && <Skeleton className="h-3 w-10" />}
          </>
        ) : (
          <>
            {value}
            {change !== undefined && (
              <PercentChange
                value={change}
                className="ml-1"
                textClassName="w-auto text-[13px]"
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function getChainDetails(
  interopChains: InteropChainWithIcon[],
  id: string,
) {
  const chain = interopChains.find((c) => c.id === id)
  assert(chain, `Chain not found: ${id}`)
  return chain
}
