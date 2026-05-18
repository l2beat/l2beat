import { RefreshCwIcon } from 'lucide-react'
import { CopyToClipboardButton } from '~/components/CopyToClipboardButton'
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
import { api } from '~/react-query/trpc'
import type { ChainMetadata, InteropConfigSummary } from '../summary/types'

export function ConfigPage() {
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
    isFetching: isChainsFetching,
    refetch: refetchChains,
  } = api.interop.chains.metadata.useQuery()

  const summary: InteropConfigSummary | undefined = configData
  const chains = chainsData ?? []
  const chainsById = new Map(chains.map((chain) => [chain.id, chain]))
  const captureChainIds = summary?.capture.chains.map((chain) => chain.id) ?? []
  const oneSidedChainIds = summary?.oneSidedChains ?? []
  const captureOneSidedOverlap = captureChainIds.filter((chainId) =>
    oneSidedChainIds.includes(chainId),
  )
  const aggregationConfigs = summary?.aggregation.configs ?? []
  const uniqueAggregationPlugins = new Set(
    aggregationConfigs.flatMap((config) =>
      config.plugins.map((plugin) => plugin.plugin),
    ),
  ).size
  const configsWithDurationSplits = aggregationConfigs.filter((config) =>
    Object.values(config.durationSplit ?? {}).some(
      (splits) => (splits?.length ?? 0) > 0,
    ),
  ).length
  const rawConfigJson = summary ? JSON.stringify(summary, null, 2) : ''
  const rawCaptureJson = JSON.stringify(summary?.capture ?? null, null, 2)
  const rawOneSidedJson = JSON.stringify(oneSidedChainIds, null, 2)
  const rawConfigSyncJson = JSON.stringify(summary?.configSync ?? null, null, 2)
  const rawAggregationJson = JSON.stringify(
    summary?.aggregation ?? null,
    null,
    2,
  )

  const refetchAll = async () => {
    await Promise.all([refetchConfig(), refetchChains()])
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <TablePageSummaryCard
          title="Interop configuration"
          description="Live runtime configuration for capture policy, one-sided policy, config sync and aggregation."
          actions={
            <>
              <CopyToClipboardButton
                label="full config"
                value={rawConfigJson}
                disabled={!summary}
              />
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
                  summary?.features.captureEnabled ? 'secondary' : 'destructive'
                }
              >
                Capture{' '}
                {summary?.features.captureEnabled ? 'enabled' : 'disabled'}
              </Badge>
              <Badge variant="secondary">
                {captureChainIds.length} capture chains
              </Badge>
              <Badge variant="secondary">
                {oneSidedChainIds.length} one-sided chains
              </Badge>
              <Badge
                variant={
                  summary?.features.aggregationEnabled
                    ? 'secondary'
                    : 'destructive'
                }
              >
                Aggregation{' '}
                {summary?.features.aggregationEnabled ? 'enabled' : 'disabled'}
              </Badge>
              <Badge variant="secondary">
                Sync every{' '}
                {formatConfigInterval(summary?.configSync.configIntervalMs)}
              </Badge>
              {captureOneSidedOverlap.length > 0 ? (
                <Badge variant="destructive">
                  {captureOneSidedOverlap.length} capture/one-sided overlaps
                </Badge>
              ) : null}
            </>
          }
        />

        {isConfigLoading ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <LoadingState className="m-6" />
            </CardContent>
          </Card>
        ) : null}

        {isConfigError ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState className="m-6" cause={configError.message} />
            </CardContent>
          </Card>
        ) : null}

        {!isConfigLoading && !isConfigError && summary ? (
          <>
            {isChainsError ? (
              <div className="px-2 text-destructive text-sm">
                Failed to load chain metadata ({chainsError.message}). Chain ids
                are shown without friendly names.
              </div>
            ) : null}

            <div className="grid gap-3 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Feature switches</CardTitle>
                  <CardDescription>
                    High-level runtime toggles for the interop engine.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  <FeatureFlag
                    label="Capture"
                    enabled={summary.features.captureEnabled}
                  />
                  <FeatureFlag
                    label="Matching"
                    enabled={summary.features.matchingEnabled}
                  />
                  <FeatureFlag
                    label="Cleaner"
                    enabled={summary.features.cleanerEnabled}
                  />
                  <FeatureFlag
                    label="Aggregation"
                    enabled={summary.features.aggregationEnabled}
                  />
                  <FeatureFlag
                    label="Dashboard"
                    enabled={summary.features.dashboardEnabled}
                  />
                  <FeatureFlag
                    label="Compare"
                    enabled={summary.features.compareEnabled}
                  />
                  <FeatureFlag
                    label="Financials"
                    enabled={summary.features.financialsEnabled}
                  />
                  <FeatureFlag
                    label="Config sync"
                    enabled={summary.features.configSyncEnabled}
                  />
                  <FeatureFlag
                    label="Dangerous ops"
                    enabled={summary.features.dangerousOperationsEnabled}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>Config sync</CardTitle>
                    <CardDescription>
                      Summary of config refresh settings.
                    </CardDescription>
                  </div>
                  <CopyToClipboardButton
                    label="config-sync payload"
                    value={rawConfigSyncJson}
                    disabled={!summary}
                  />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  <Badge
                    variant={
                      summary.configSync.enabled ? 'secondary' : 'destructive'
                    }
                  >
                    {summary.configSync.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Badge variant="secondary">
                    {summary.configSync.chains.length} mapped chains
                  </Badge>
                  <Badge variant="secondary">
                    Interval{' '}
                    {formatConfigInterval(summary.configSync.configIntervalMs)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>Capture chains</CardTitle>
                    <CardDescription>
                      Chains configured as full event sources.
                    </CardDescription>
                  </div>
                  <CopyToClipboardButton
                    label="capture config"
                    value={rawCaptureJson}
                    disabled={!summary}
                  />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant={
                        summary.capture.enabled ? 'secondary' : 'destructive'
                      }
                    >
                      {summary.capture.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Badge variant="secondary">
                      {captureChainIds.length} configured chains
                    </Badge>
                  </div>
                  <ChainBadgeList
                    chainsById={chainsById}
                    ids={captureChainIds}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>One-sided chains</CardTitle>
                    <CardDescription>
                      Allowlist used for partial transfer handling.
                    </CardDescription>
                  </div>
                  <CopyToClipboardButton
                    label="one-sided chains"
                    value={rawOneSidedJson}
                    disabled={!summary}
                  />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary">
                      {oneSidedChainIds.length} one-sided chains
                    </Badge>
                    {captureOneSidedOverlap.length > 0 ? (
                      <Badge variant="destructive">
                        Overlap should normally stay empty
                      </Badge>
                    ) : null}
                  </div>
                  <ChainBadgeList
                    chainsById={chainsById}
                    ids={oneSidedChainIds}
                    warnIds={new Set(captureOneSidedOverlap)}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div className="space-y-1">
                  <CardTitle>Aggregation</CardTitle>
                  <CardDescription>
                    Keep this high-level here. Use copied raw config when the
                    details matter.
                  </CardDescription>
                </div>
                <CopyToClipboardButton
                  label="aggregation config"
                  value={rawAggregationJson}
                  disabled={!summary}
                />
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                <Badge
                  variant={
                    summary.aggregation.enabled ? 'secondary' : 'destructive'
                  }
                >
                  {summary.aggregation.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
                <Badge variant="secondary">
                  {aggregationConfigs.length} configs
                </Badge>
                <Badge variant="secondary">
                  {uniqueAggregationPlugins} unique plugins
                </Badge>
                <Badge variant="secondary">
                  {configsWithDurationSplits} configs with duration splits
                </Badge>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}

function formatConfigInterval(value: number | undefined) {
  if (value === undefined) return '-'

  const totalMinutes = Math.round(value / 60_000)
  if (totalMinutes % (24 * 60) === 0) {
    return `${totalMinutes / (24 * 60)}d`
  }
  if (totalMinutes % 60 === 0) {
    return `${totalMinutes / 60}h`
  }
  return `${totalMinutes}m`
}

function FeatureFlag({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <Badge
      variant="outline"
      className={
        enabled
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 text-slate-600'
      }
    >
      {label}: {enabled ? 'on' : 'off'}
    </Badge>
  )
}

function ChainBadgeList({
  ids,
  chainsById,
  warnIds,
}: {
  ids: string[]
  chainsById: Map<string, ChainMetadata>
  warnIds?: Set<string>
}) {
  if (ids.length === 0) {
    return <div className="text-muted-foreground text-sm">None configured.</div>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const chain = chainsById.get(id)
        const warn = warnIds?.has(id) ?? false

        return (
          <Badge
            key={id}
            variant="outline"
            className={
              warn
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-slate-200 text-slate-700'
            }
          >
            {chain?.name ?? id}
            <span className="font-mono text-[10px] opacity-70">{id}</span>
          </Badge>
        )
      })}
    </div>
  )
}
