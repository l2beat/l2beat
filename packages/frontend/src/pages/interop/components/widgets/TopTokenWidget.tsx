import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EM_DASH } from '~/consts/characters'
import { InfoIcon } from '~/icons/Info'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { BetweenChainsInfo } from '../BetweenChainsInfo'

interface Props {
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
  hideProtocol?: boolean
  className?: string
}

export function TopTokenWidget({
  topToken,
  isLoading,
  hideProtocol,
  className,
}: Props) {
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
          <div
            className={cn(
              'hidden xl:grid xl:flex-1 xl:gap-2.5',
              hideProtocol ? 'xl:grid-cols-2' : 'xl:grid-cols-3',
            )}
          >
            <TopTokenStatCards
              topToken={topToken}
              isLoading={isLoading}
              hideProtocol={hideProtocol}
            />
          </div>
        </div>

        <div
          className={cn(
            'hidden md:grid md:gap-3 xl:hidden',
            hideProtocol ? 'md:grid-cols-2' : 'md:grid-cols-3',
          )}
        >
          <TopTokenStatCards
            topToken={topToken}
            isLoading={isLoading}
            hideProtocol={hideProtocol}
          />
        </div>

        <div className="md:hidden">
          <TopTokenStatRows
            topToken={topToken}
            isLoading={isLoading}
            hideProtocol={hideProtocol}
          />
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
  hideProtocol,
}: {
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
  hideProtocol?: boolean
}) {
  return (
    <>
      <TokenStatCard
        label="Volume"
        tooltip="The total USD value of all token transfers completed in the past 24 hours."
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
        tooltip="The total number of token transfer transactions completed in the past 24 hours."
        isLoading={isLoading}
        value={
          topToken ? (
            formatInteger(topToken.transferCount)
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      {!hideProtocol && (
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
      )}
    </>
  )
}

function TopTokenStatRows({
  topToken,
  isLoading,
  hideProtocol,
}: {
  topToken: InteropDashboardData['topToken'] | undefined
  isLoading: boolean
  hideProtocol?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <TokenStatRow
        label="Volume"
        tooltip="The total USD value of all token transfers completed in the past 24 hours."
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
        tooltip="The total number of token transfer transactions completed in the past 24 hours."
        isLoading={isLoading}
        value={
          topToken ? (
            formatInteger(topToken.transferCount)
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      {!hideProtocol && (
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
      )}
    </div>
  )
}

function TokenStatCard({
  label,
  tooltip,
  value,
  isLoading,
}: {
  label: string
  tooltip?: ReactNode
  value: ReactNode
  isLoading: boolean
}) {
  return (
    <div className="flex h-14 flex-col justify-center rounded border border-divider px-4">
      <div className="flex items-center justify-center text-center font-medium text-2xs text-secondary leading-none">
        {label}
        {tooltip ? <InfoTooltip>{tooltip}</InfoTooltip> : null}
      </div>
      <div className="mt-1.5 text-center font-bold text-label-value-15 leading-none">
        {isLoading ? <Skeleton className="mx-auto h-[15px] w-20" /> : value}
      </div>
    </div>
  )
}

function TokenStatRow({
  label,
  tooltip,
  value,
  isLoading,
}: {
  label: string
  tooltip?: ReactNode
  value: ReactNode
  isLoading: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1 font-medium text-label-value-14 text-secondary leading-none">
        {label}
        {tooltip ? <InfoTooltip>{tooltip}</InfoTooltip> : null}
      </div>
      <div className="text-right font-bold text-label-value-15 leading-none">
        {isLoading ? <Skeleton className="h-4 w-20" /> : value}
      </div>
    </div>
  )
}

function InfoTooltip({ children }: { children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger className="mb-px ml-1 inline-flex align-middle">
        <InfoIcon className="size-3 fill-current" />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  )
}
