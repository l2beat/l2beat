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
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { buildInteropUrl } from '../../utils/buildInteropUrl'
import type { InteropSelection } from '../../utils/types'

type TopProtocol = NonNullable<InteropTokenDashboardData['topProtocol']>

const TOP_PROTOCOL_STATS = [
  {
    label: 'Volume',
    tooltip:
      "The total USD value of this token's transfers handled by the protocol in the past 24 hours.",
    format: (topProtocol: TopProtocol) =>
      formatCurrency(topProtocol.volume.value, 'usd'),
  },
  {
    label: 'Transaction count',
    tooltip:
      "The total number of this token's transfers handled by the protocol in the past 24 hours.",
    format: (topProtocol: TopProtocol) =>
      formatInteger(topProtocol.transfers.value),
  },
] as const

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
            <TopProtocolStats
              topProtocol={topProtocol}
              isLoading={isLoading}
              variant="card"
            />
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 md:gap-3 xl:hidden">
          <TopProtocolStats
            topProtocol={topProtocol}
            isLoading={isLoading}
            variant="card"
          />
        </div>

        <div className="md:hidden">
          <TopProtocolStats
            topProtocol={topProtocol}
            isLoading={isLoading}
            variant="row"
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
    ? buildInteropUrl(`/interop/protocols/${topProtocol.slug}`, apiSelection)
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

function TopProtocolStats({
  topProtocol,
  isLoading,
  variant,
}: {
  topProtocol: TopProtocol | undefined
  isLoading: boolean
  variant: 'card' | 'row'
}) {
  const stats = TOP_PROTOCOL_STATS.map((stat) => (
    <ProtocolStat
      key={stat.label}
      variant={variant}
      label={stat.label}
      tooltip={stat.tooltip}
      isLoading={isLoading}
      value={formatStatValue(topProtocol, stat.format)}
    />
  ))

  if (variant === 'row') {
    return <div className="flex flex-col gap-2">{stats}</div>
  }

  return <>{stats}</>
}

function formatStatValue(
  topProtocol: TopProtocol | undefined,
  format: (protocol: TopProtocol) => ReactNode,
) {
  return topProtocol ? (
    format(topProtocol)
  ) : (
    <span className="text-label-value-15">{EM_DASH}</span>
  )
}

function ProtocolStat({
  variant,
  label,
  tooltip,
  value,
  isLoading,
}: {
  variant: 'card' | 'row'
  label: string
  tooltip: string
  value: ReactNode
  isLoading: boolean
}) {
  const labelContent = (
    <>
      {label}
      <InfoTooltip>{tooltip}</InfoTooltip>
    </>
  )

  if (variant === 'card') {
    return (
      <div className="flex h-14 flex-col justify-center rounded border border-divider px-4">
        <div className="flex items-center justify-center text-center font-medium text-2xs text-secondary leading-none">
          {labelContent}
        </div>
        <div className="mt-1.5 text-center font-bold text-label-value-15 leading-none">
          {isLoading ? <Skeleton className="mx-auto h-[15px] w-20" /> : value}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-1 font-medium text-label-value-14 text-secondary leading-none">
        {labelContent}
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
