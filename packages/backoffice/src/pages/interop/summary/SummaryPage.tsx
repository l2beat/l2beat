import { RefreshCwIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageSummaryCard } from '~/components/table/TablePageSummaryCard'
import { AppLayout } from '~/layouts/AppLayout'
import { formatDollars } from '~/pages/interop/transfers/utils'
import { api } from '~/react-query/trpc'

export function SummaryPage() {
  const {
    data: configData,
    error: configError,
    isError: isConfigError,
    isLoading: isConfigLoading,
    isFetching: isConfigFetching,
    refetch: refetchConfig,
  } = api.interop.config.summary.useQuery()
  const {
    data: chainsData,
    error: chainsError,
    isError: isChainsError,
    isLoading: isChainsLoading,
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.interop.chains.summary.useQuery()

  const captureChainCount = configData?.capture.chains.length ?? 0
  const oneSidedChainCount = configData?.oneSidedChains.length ?? 0
  const aggregationConfigCount = configData?.aggregation.configs.length ?? 0
  const activeChainsCount =
    chainsData?.rows.filter((chain) => chain.totalTransfersCount > 0).length ??
    0
  const totalOutgoingVolume =
    chainsData?.rows.reduce((sum, row) => sum + row.outgoingValueUsd, 0) ?? 0
  const totalIncomingVolume =
    chainsData?.rows.reduce((sum, row) => sum + row.incomingValueUsd, 0) ?? 0

  const refetchAll = async () => {
    await Promise.all([refetchConfig(), refetchChains()])
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <TablePageSummaryCard
          title="Interop summary"
          description="Short operational overview before digging into the detailed debug pages."
          actions={
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/interop/configuration">Open configuration</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/interop/chains">Open chain summary</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetchAll()}
                disabled={isConfigFetching || isChainsFetching}
              >
                <RefreshCwIcon
                  className={
                    isConfigFetching || isChainsFetching ? 'animate-spin' : ''
                  }
                />
                Refresh
              </Button>
            </>
          }
          summary={
            <>
              <Badge
                variant={
                  configData?.features.captureEnabled
                    ? 'secondary'
                    : 'destructive'
                }
              >
                Capture{' '}
                {configData?.features.captureEnabled ? 'enabled' : 'disabled'}
              </Badge>
              <Badge variant="secondary">
                {captureChainCount} capture chains
              </Badge>
              <Badge variant="secondary">
                {oneSidedChainCount} one-sided chains
              </Badge>
              <Badge variant="secondary">
                {aggregationConfigCount} aggregation configs
              </Badge>
              <Badge variant="secondary">
                {activeChainsCount} active chains
              </Badge>
              <Badge variant="secondary">
                {formatDollars(totalOutgoingVolume)} outgoing
              </Badge>
              <Badge variant="secondary">
                {formatDollars(totalIncomingVolume)} incoming
              </Badge>
            </>
          }
        />

        {isConfigLoading || isChainsLoading ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <LoadingState className="m-6" />
            </CardContent>
          </Card>
        ) : null}

        {isConfigError || isChainsError ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState
                className="m-6"
                cause={configError?.message ?? chainsError?.message}
              />
            </CardContent>
          </Card>
        ) : null}

        {!isConfigLoading &&
        !isChainsLoading &&
        !isConfigError &&
        !isChainsError ? (
          <div className="grid gap-3 xl:grid-cols-2">
            <SummaryCard
              title="Configuration"
              description="Capture policy, one-sided policy, config sync and aggregation at a glance."
              badges={
                <>
                  <Badge variant="secondary">
                    {captureChainCount} capture chains
                  </Badge>
                  <Badge variant="secondary">
                    {oneSidedChainCount} one-sided chains
                  </Badge>
                  <Badge variant="secondary">
                    {aggregationConfigCount} aggregation configs
                  </Badge>
                </>
              }
              href="/interop/configuration"
            />

            <SummaryCard
              title="Chains"
              description="Per-chain capture and one-sided flags with incoming and outgoing transfer volume."
              badges={
                <>
                  <Badge variant="secondary">
                    {activeChainsCount} active chains
                  </Badge>
                  <Badge variant="secondary">
                    {formatDollars(totalOutgoingVolume)} outgoing
                  </Badge>
                  <Badge variant="secondary">
                    {formatDollars(totalIncomingVolume)} incoming
                  </Badge>
                </>
              }
              href="/interop/chains"
            />
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}

function SummaryCard({
  title,
  description,
  badges,
  href,
}: {
  title: string
  description: string
  badges: ReactNode
  href: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">{badges}</div>
        <div>
          <Button asChild variant="outline" size="sm">
            <Link to={href}>Open {title.toLowerCase()}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
