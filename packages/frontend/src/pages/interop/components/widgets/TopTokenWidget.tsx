import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EM_DASH } from '~/consts/characters'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { BetweenChainsInfo } from '../BetweenChainsInfo'

interface Props {
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
  className?: string
}

export function TopTokenWidget({ topToken, isLoading, className }: Props) {
  return (
    <PrimaryCard
      className={cn(
        'col-span-full max-md:border-b max-md:border-b-divider',
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:flex-row xl:items-center xl:justify-start xl:gap-10">
          <TopTokenHeading />
          <TopTokenIdentity topToken={topToken} isLoading={isLoading} />
          <div className="hidden xl:grid xl:flex-1 xl:grid-cols-3 xl:gap-2.5">
            <TopTokenStatCards topToken={topToken} isLoading={isLoading} />
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:gap-3 xl:hidden">
          <TopTokenStatCards topToken={topToken} isLoading={isLoading} />
        </div>

        <div className="md:hidden">
          <TopTokenStatRows topToken={topToken} isLoading={isLoading} />
        </div>
      </div>
    </PrimaryCard>
  )
}

function TopTokenHeading() {
  return (
    <div className="min-w-0">
      <h2 className="font-bold text-heading-16 md:text-heading-20">
        Top token
      </h2>
      <BetweenChainsInfo
        className="mt-1"
        additionalText="based on 24h volume"
      />
    </div>
  )
}

function TopTokenIdentity({
  topToken,
  isLoading,
}: {
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 xl:min-w-[220px]">
      {isLoading ? (
        <Skeleton className="h-8 w-28" />
      ) : topToken ? (
        <>
          <img
            src={topToken.iconUrl}
            alt={topToken.symbol}
            className="size-8 shrink-0 rounded-full bg-white shadow"
          />
          <div className="truncate font-medium text-label-value-18 text-primary">
            {topToken.symbol}
          </div>
        </>
      ) : (
        <span className="font-bold text-heading-20">{EM_DASH}</span>
      )}
    </div>
  )
}

function TopTokenStatCards({
  topToken,
  isLoading,
}: {
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
}) {
  return (
    <>
      <TokenStatCard
        label="Volume"
        isLoading={isLoading}
        value={
          topToken ? (
            formatCurrency(topToken.volume, 'usd')
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      <TokenStatCard
        label="Transaction count"
        isLoading={isLoading}
        value={
          topToken ? (
            formatInteger(topToken.transferCount)
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      <TokenStatCard
        label="Top protocol used"
        isLoading={isLoading}
        value={
          topToken?.topProtocol ? (
            <span className="inline-flex items-center gap-1.5">
              <img
                src={topToken.topProtocol.iconUrl}
                alt={topToken.topProtocol.name}
                className="size-4 rounded-full bg-white shadow"
              />
              <span className="truncate">{topToken.topProtocol.name}</span>
            </span>
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
    </>
  )
}

function TopTokenStatRows({
  topToken,
  isLoading,
}: {
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <TokenStatRow
        label="Volume"
        isLoading={isLoading}
        value={
          topToken ? (
            formatCurrency(topToken.volume, 'usd')
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      <TokenStatRow
        label="Transaction count"
        isLoading={isLoading}
        value={
          topToken ? (
            formatInteger(topToken.transferCount)
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      <TokenStatRow
        label="Top protocol used"
        isLoading={isLoading}
        value={
          topToken?.topProtocol ? (
            <span className="inline-flex items-center gap-1.5">
              <img
                src={topToken.topProtocol.iconUrl}
                alt={topToken.topProtocol.name}
                className="size-4 rounded-full bg-white shadow"
              />
              <span className="truncate">{topToken.topProtocol.name}</span>
            </span>
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
    </div>
  )
}

function TokenStatCard({
  label,
  value,
  isLoading,
}: {
  label: string
  value: ReactNode
  isLoading: boolean
}) {
  return (
    <div className="flex h-14 flex-col justify-center rounded border border-divider px-4">
      <span className="text-center font-medium text-2xs text-secondary leading-none">
        {label}
      </span>
      <div className="mt-1.5 text-center font-bold text-label-value-15 leading-none">
        {isLoading ? <Skeleton className="mx-auto h-[15px] w-20" /> : value}
      </div>
    </div>
  )
}

function TokenStatRow({
  label,
  value,
  isLoading,
}: {
  label: string
  value: ReactNode
  isLoading: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-medium text-label-value-14 text-secondary leading-none">
        {label}
      </span>
      <div className="text-right font-bold text-label-value-15 leading-none">
        {isLoading ? <Skeleton className="h-4 w-20" /> : value}
      </div>
    </div>
  )
}
