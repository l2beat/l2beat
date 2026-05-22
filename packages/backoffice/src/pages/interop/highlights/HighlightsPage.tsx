import { RefreshCwIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '~/components/core/Empty'
import { ErrorState } from '~/components/ErrorState'
import { ExternalLink } from '~/components/ExternalLink'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { formatDollars } from '~/pages/interop/transfers/utils'
import { api } from '~/react-query/trpc'

export function HighlightsPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.highlights.latest.useQuery()

  const topPath = data?.topPathByVolume ?? null
  const topChainByInflow = data?.topChainByInflow ?? null
  const chainIncrease = data?.largestVolumeIncreaseByChain ?? null
  const tokenIncrease = data?.largestVolumeIncreaseByToken ?? null
  const protocolIncrease = data?.largestVolumeIncreaseByProtocol ?? null
  const uopsIncrease = data?.largestUopsIncreaseByChain ?? null
  const tvsIncrease = data?.largestTvsIncreaseByChain ?? null

  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <Card className="gap-3 py-4">
          <CardHeader className="flex flex-col gap-3 px-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle>Highlights</CardTitle>
              <CardDescription className="text-xs leading-4">
                Focused interop metrics for the latest 24h aggregate window.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </CardHeader>
        </Card>

        {isLoading ? (
          <Card className="py-4">
            <CardContent className="px-4">
              <LoadingState />
            </CardContent>
          </Card>
        ) : null}

        {isError ? (
          <Card className="py-4">
            <CardContent className="px-4">
              <ErrorState cause={error.message} />
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !isError ? (
          <div className="grid gap-3 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <Card className="gap-3 py-4">
              <CardHeader className="px-4">
                <CardTitle>
                  Highest source to destination chain pair by aggregate USD
                  volume
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                {topPath === null ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>No aggregate snapshot</EmptyTitle>
                      <EmptyDescription>
                        Aggregated transfer history has not been generated yet.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="grid overflow-hidden rounded-md border text-sm sm:grid-cols-2">
                    <DetailCell label="Source" value={topPath.srcChain} />
                    <DetailCell label="Destination" value={topPath.dstChain} />
                    <DetailCell
                      label="Volume"
                      value={formatDollars(topPath.volumeUsd)}
                    />
                    <DetailCell
                      label="Transfers"
                      value={topPath.transferCount.toLocaleString()}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="gap-3 py-4">
              <CardHeader className="px-4">
                <CardTitle>
                  Largest inflow and activity deltas in the same 24h window.
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4">
                <HighlightList>
                  <HighlightRow
                    label="Largest chain inflow"
                    entityLabel="Chain"
                    entity={topChainByInflow?.chain}
                    primaryLabel="Inflow volume"
                    primaryValue={
                      topChainByInflow
                        ? formatDollars(topChainByInflow.volumeUsd)
                        : undefined
                    }
                    secondary={[
                      {
                        label: 'Transfers',
                        value:
                          topChainByInflow?.transferCount.toLocaleString() ??
                          '',
                      },
                      {
                        label: 'Protocols',
                        value:
                          topChainByInflow?.protocolCount.toLocaleString() ??
                          '',
                      },
                    ]}
                    emptyText="No inflows found"
                  />
                  <HighlightRow
                    label="Largest UOPS increase"
                    entityLabel="Chain"
                    entity={uopsIncrease?.chain}
                    primaryLabel="Increase"
                    primaryValue={
                      uopsIncrease
                        ? `+${uopsIncrease.increase.toLocaleString()}`
                        : undefined
                    }
                    secondary={
                      uopsIncrease
                        ? [
                            {
                              label: 'Current',
                              value: uopsIncrease.currentCount.toLocaleString(),
                            },
                            {
                              label: 'Previous',
                              value:
                                uopsIncrease.previousCount.toLocaleString(),
                            },
                          ]
                        : []
                    }
                    emptyText="No positive UOPS delta"
                  />
                  <HighlightRow
                    label="Largest TVS increase"
                    entityLabel="Chain"
                    entity={tvsIncrease?.chain}
                    primaryLabel="Increase"
                    primaryValue={
                      tvsIncrease
                        ? `+${formatDollars(tvsIncrease.increaseUsd)}`
                        : undefined
                    }
                    secondary={volumeSecondary(tvsIncrease)}
                    emptyText="No positive TVS delta"
                  />
                </HighlightList>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <Card className="gap-3 py-4">
            <CardHeader className="px-4">
              <CardTitle>
                Largest positive USD volume deltas compared with the previous
                day.
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <HighlightList>
                <HighlightRow
                  label="Chain"
                  entityLabel="Source chain"
                  entity={chainIncrease?.chain}
                  primaryLabel="Increase"
                  primaryValue={
                    chainIncrease
                      ? `+${formatDollars(chainIncrease.increaseUsd)}`
                      : undefined
                  }
                  secondary={volumeSecondary(chainIncrease)}
                  emptyText="No positive chain volume delta"
                />
                <HighlightRow
                  label="Token"
                  entityLabel="Token"
                  entity={tokenIncrease?.token.id}
                  entityContent={
                    tokenIncrease ? (
                      <TokenEntity token={tokenIncrease.token} />
                    ) : undefined
                  }
                  primaryLabel="Increase"
                  primaryValue={
                    tokenIncrease
                      ? `+${formatDollars(tokenIncrease.increaseUsd)}`
                      : undefined
                  }
                  secondary={volumeSecondary(tokenIncrease)}
                  emptyText="No positive token volume delta"
                />
                <HighlightRow
                  label="Protocol"
                  entityLabel="Protocol"
                  entity={protocolIncrease?.id}
                  entityHref={getProtocolHref(protocolIncrease?.id)}
                  primaryLabel="Increase"
                  primaryValue={
                    protocolIncrease
                      ? `+${formatDollars(protocolIncrease.increaseUsd)}`
                      : undefined
                  }
                  secondary={volumeSecondary(protocolIncrease)}
                  emptyText="No positive protocol volume delta"
                />
              </HighlightList>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  )
}

interface VolumeIncreaseMetric {
  windowStart: number
  windowEnd: number
  previousWindowStart: number
  previousWindowEnd: number
  currentVolumeUsd: number
  previousVolumeUsd: number
  increaseUsd: number
}

function DetailCell(props: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-b p-3 sm:border-r sm:[&:nth-child(2n)]:border-r-0 [&:nth-last-child(-n+1)]:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
      <div className="text-muted-foreground text-xs">{props.label}</div>
      <div className="mt-1 truncate font-semibold text-sm">{props.value}</div>
    </div>
  )
}

function HighlightList(props: { children: ReactNode }) {
  return <div className="divide-y">{props.children}</div>
}

function HighlightRow(props: {
  label: string
  entityLabel: string
  entity: string | undefined
  entityHref?: string
  entityContent?: ReactNode
  primaryLabel: string
  primaryValue: string | undefined
  secondary?: { label: string; value: string }[]
  emptyText: string
}) {
  if (props.entity === undefined || props.primaryValue === undefined) {
    return (
      <div className="grid gap-3 py-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-0.5">
          <div className="font-medium text-sm">{props.label}</div>
          <div className="text-muted-foreground text-xs">
            {props.entityLabel}
          </div>
        </div>
        <div className="text-muted-foreground text-sm md:col-span-2">
          {props.emptyText}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-3 py-3 md:grid-cols-[minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,1fr)] md:items-center">
      <div className="space-y-0.5">
        <div className="font-medium text-sm">{props.label}</div>
        <div className="text-muted-foreground text-xs">{props.entityLabel}</div>
      </div>

      <div className="min-w-0 font-semibold text-sm">
        {props.entityContent ?? (
          <EntityValue entity={props.entity} href={props.entityHref} />
        )}
      </div>
      <dl className="grid grid-cols-3 gap-3">
        <Metric label={props.primaryLabel} value={props.primaryValue} />
        {(props.secondary ?? []).slice(0, 2).map((item) => (
          <Metric key={item.label} label={item.label} value={item.value} />
        ))}
      </dl>
    </div>
  )
}

function EntityValue(props: { entity: string; href: string | undefined }) {
  if (props.href === undefined) {
    return <span className="block truncate">{props.entity}</span>
  }

  return (
    <ExternalLink href={props.href} className="max-w-full truncate">
      {props.entity}
    </ExternalLink>
  )
}

function TokenEntity(props: {
  token: {
    id: string
    symbol: string
    issuer: string | null
    iconUrl: string | null
  }
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {props.token.iconUrl ? (
        <img
          src={props.token.iconUrl}
          alt={props.token.symbol}
          className="size-6 shrink-0 rounded-full"
        />
      ) : null}
      <div className="min-w-0">
        <div className="truncate font-semibold text-sm">
          {props.token.symbol}
        </div>
        <div className="truncate text-muted-foreground text-xs">
          ID: {props.token.id}
          {props.token.issuer ? ` · Issuer: ${props.token.issuer}` : ''}
        </div>
      </div>
    </div>
  )
}

function volumeSecondary(metric: VolumeIncreaseMetric | null | undefined) {
  if (!metric) {
    return []
  }

  return [
    {
      label: 'Current',
      value: formatDollars(metric.currentVolumeUsd),
    },
    {
      label: 'Previous',
      value: formatDollars(metric.previousVolumeUsd),
    },
  ]
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-muted-foreground text-xs">{props.label}</dt>
      <dd className="mt-0.5 truncate font-semibold text-sm">{props.value}</dd>
    </div>
  )
}

function getProtocolHref(protocolId: string | undefined) {
  if (protocolId === undefined) {
    return undefined
  }

  return `https://l2beat.com/interop/protocols/${protocolId}`
}
