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
import type { InteropTokenDashboardData } from '~/server/features/scaling/interop/getInteropTokenData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { buildInteropUrl } from '../../utils/buildInteropUrl'
import type { InteropSelection } from '../../utils/types'

type TopProtocol = NonNullable<InteropTokenDashboardData['topProtocol']>

interface Props {
  data: InteropTokenDashboardData | undefined
  isLoading: boolean
  apiSelection: InteropSelection
  className?: string
}

export function TokenTopProtocolCard({
  data,
  isLoading,
  apiSelection,
  className,
}: Props) {
  const topProtocol = data?.topProtocol

  return (
    <PrimaryCard
      className={cn(
        'col-span-full mt-4 max-md:border-b max-md:border-b-divider',
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:flex-row xl:items-center xl:justify-start xl:gap-10">
          <TopProtocolHeading />
          <TopProtocolIdentity
            topProtocol={topProtocol}
            apiSelection={apiSelection}
            isLoading={isLoading}
          />
          <div className="hidden xl:grid xl:flex-1 xl:grid-cols-2 xl:gap-2.5">
            <TopProtocolStatCards
              topProtocol={topProtocol}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 md:gap-3 xl:hidden">
          <TopProtocolStatCards
            topProtocol={topProtocol}
            isLoading={isLoading}
          />
        </div>

        <div className="md:hidden">
          <TopProtocolStatRows
            topProtocol={topProtocol}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PrimaryCard>
  )
}

function TopProtocolHeading() {
  return (
    <div className="min-w-0">
      <h2 className="font-bold text-heading-16 md:text-heading-20">
        Top protocol
      </h2>
      <p className="mt-1 font-medium text-paragraph-12 text-secondary">
        Based on 24h volume
      </p>
    </div>
  )
}

function TopProtocolIdentity({
  topProtocol,
  apiSelection,
  isLoading,
}: {
  topProtocol: TopProtocol | undefined
  apiSelection: InteropSelection
  isLoading: boolean
}) {
  const href = topProtocol
    ? buildInteropUrl(
        `/interop/protocols/${topProtocol.slug}`,
        apiSelection,
        'public',
      )
    : undefined
  const content = isLoading ? (
    <Skeleton className="h-8 w-28" />
  ) : topProtocol ? (
    <>
      <img
        src={topProtocol.iconUrl}
        alt={topProtocol.name}
        className="size-8 shrink-0 rounded-full bg-white shadow"
      />
      <div className="truncate font-medium text-label-value-18 text-primary">
        {topProtocol.name}
      </div>
    </>
  ) : (
    <span className="font-bold text-heading-20">{EM_DASH}</span>
  )

  return (
    <div className="flex min-w-0 items-center gap-2 xl:min-w-[220px]">
      {href ? (
        <a
          href={href}
          className="flex min-w-0 items-center gap-2 hover:underline"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}

function TopProtocolStatCards({
  topProtocol,
  isLoading,
}: {
  topProtocol: TopProtocol | undefined
  isLoading: boolean
}) {
  return (
    <>
      <ProtocolStatCard
        label="Volume"
        tooltip="The total USD value of this token's transfers handled by the protocol in the past 24 hours."
        isLoading={isLoading}
        value={
          topProtocol ? (
            formatCurrency(topProtocol.volume.value, 'usd')
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      <ProtocolStatCard
        label="Transaction count"
        tooltip="The total number of this token's transfers handled by the protocol in the past 24 hours."
        isLoading={isLoading}
        value={
          topProtocol ? (
            formatInteger(topProtocol.transfers.value)
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
    </>
  )
}

function TopProtocolStatRows({
  topProtocol,
  isLoading,
}: {
  topProtocol: TopProtocol | undefined
  isLoading: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <ProtocolStatRow
        label="Volume"
        tooltip="The total USD value of this token's transfers handled by the protocol in the past 24 hours."
        isLoading={isLoading}
        value={
          topProtocol ? (
            formatCurrency(topProtocol.volume.value, 'usd')
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
      <ProtocolStatRow
        label="Transaction count"
        tooltip="The total number of this token's transfers handled by the protocol in the past 24 hours."
        isLoading={isLoading}
        value={
          topProtocol ? (
            formatInteger(topProtocol.transfers.value)
          ) : (
            <span className="text-label-value-15">{EM_DASH}</span>
          )
        }
      />
    </div>
  )
}

function ProtocolStatCard({
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

function ProtocolStatRow({
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
