import { RefreshCwIcon } from 'lucide-react'
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
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import {
  formatDollars,
  formatTransferTimestamp,
} from '~/pages/interop/transfers/utils'
import { api } from '~/react-query/trpc'

export function HighlightsPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.highlights.latest.useQuery()

  const topPath = data?.topPathByVolume ?? null
  const chainIncrease = data?.largestVolumeIncreaseByChain ?? null
  const tokenIncrease = data?.largestVolumeIncreaseByToken ?? null
  const protocolIncrease = data?.largestVolumeIncreaseByProtocol ?? null

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Highlights</CardTitle>
              <CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Top path by volume</CardTitle>
            <CardDescription>
              Source to destination chain pair with the highest aggregate USD
              volume over the latest 24h window.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <LoadingState /> : null}

            {isError ? <ErrorState cause={error.message} /> : null}

            {!isLoading && !isError && topPath === null ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyTitle>No aggregate snapshot</EmptyTitle>
                  <EmptyDescription>
                    Aggregated transfer history has not been generated yet.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}

            {!isLoading && !isError && topPath !== null ? (
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <div className="space-y-2">
                  <div className="text-muted-foreground text-sm">
                    {formatTransferTimestamp(topPath.windowStart)} UTC -{' '}
                    {formatTransferTimestamp(topPath.windowEnd)} UTC
                  </div>
                  <div className="font-semibold text-2xl">
                    {topPath.srcChain} {'->'} {topPath.dstChain}
                  </div>
                </div>
                <dl className="grid gap-3 sm:grid-cols-3 md:min-w-[520px]">
                  <Metric
                    label="Volume"
                    value={formatDollars(topPath.volumeUsd)}
                  />
                  <Metric
                    label="Transfers"
                    value={topPath.transferCount.toLocaleString()}
                  />
                  <Metric
                    label="Protocols"
                    value={topPath.protocolCount.toLocaleString()}
                  />
                </dl>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {!isLoading && !isError ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <VolumeIncreaseCard
              title="Largest chain volume increase"
              description="Source chain with the largest USD volume increase across all destination paths."
              entityLabel="Chain"
              entity={chainIncrease?.chain}
              metric={chainIncrease}
            />
            <VolumeIncreaseCard
              title="Largest token volume increase"
              description="Token with the largest USD volume increase across all paths."
              entityLabel="Token"
              entity={tokenIncrease?.abstractTokenId}
              metric={tokenIncrease}
            />
            <VolumeIncreaseCard
              title="Largest protocol volume increase"
              description="Protocol with the largest USD volume increase across all paths."
              entityLabel="Protocol"
              entity={protocolIncrease?.id}
              metric={protocolIncrease}
            />
          </div>
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

function VolumeIncreaseCard(props: {
  title: string
  description: string
  entityLabel: string
  entity: string | undefined
  metric: VolumeIncreaseMetric | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {props.metric === null || props.entity === undefined ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No increase found</EmptyTitle>
              <EmptyDescription>
                No positive volume delta was found for the latest comparison.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-muted-foreground text-sm">
                {formatTransferTimestamp(props.metric.windowStart)} UTC -{' '}
                {formatTransferTimestamp(props.metric.windowEnd)} UTC
              </div>
              <div>
                <div className="text-muted-foreground text-sm">
                  {props.entityLabel}
                </div>
                <div className="font-semibold text-xl">{props.entity}</div>
              </div>
            </div>
            <dl className="grid gap-3">
              <Metric
                label="Increase"
                value={`+${formatDollars(props.metric.increaseUsd)}`}
              />
              <Metric
                label="Current volume"
                value={formatDollars(props.metric.currentVolumeUsd)}
              />
              <Metric
                label="Previous volume"
                value={formatDollars(props.metric.previousVolumeUsd)}
              />
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Metric(props: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <dt className="text-muted-foreground text-sm">{props.label}</dt>
      <dd className="mt-1 font-semibold text-xl">{props.value}</dd>
    </div>
  )
}
