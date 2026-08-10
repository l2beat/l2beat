import type { BackendRouterOutputs } from '@l2beat/backend/trpc'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon, RefreshCwIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
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
import { useBackendTrpc } from '~/react-query/trpc'
import { cn } from '~/utils/cn'

type SummaryConfig = BackendRouterOutputs['interop']['summary']['config']
type SummaryChain = SummaryConfig['capture']['chains'][number]

const FEATURE_TOGGLE_LABELS: ReadonlyArray<{
  key: keyof SummaryConfig['featureToggles']
  label: string
}> = [
  { key: 'capture', label: 'Capture' },
  { key: 'matching', label: 'Matching' },
  { key: 'cleaner', label: 'Cleaner' },
  { key: 'aggregation', label: 'Aggregation' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'compare', label: 'Compare' },
  { key: 'financials', label: 'Financials' },
  { key: 'configSync', label: 'Config sync' },
  { key: 'dangerousOperations', label: 'Dangerous ops' },
] as const

export function SummaryPage() {
  const trpc = useBackendTrpc()
  const { data, error, isError, isLoading, isFetching, refetch } = useQuery(
    trpc.interop.summary.config.queryOptions(undefined, {
      staleTime: 60_000,
    }),
  )

  const fullCopyPayload = data
    ? {
        featureToggles: data.featureToggles,
        capture: data.capture.copyPayload,
        configSync: data.configSync,
        oneSidedChains: data.oneSided.copyPayload,
        aggregation: {
          enabled: data.aggregation.enabled,
          configs: data.aggregation.copyPayload,
        },
      }
    : undefined

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <TablePageSummaryCard
          title="Interop configuration"
          description="Live runtime configuration for capture policy, one-sided policy, config sync and aggregation."
          actions={
            <>
              {fullCopyPayload ? (
                <CopyConfigButton label="full config" payload={fullCopyPayload}>
                  Copy full config
                </CopyConfigButton>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </>
          }
          summary={
            data ? (
              <>
                <StatusBadge enabled={data.capture.enabled} label="Capture" />
                <Badge variant="secondary">
                  {data.capture.chains.length} capture chains
                </Badge>
                <Badge variant="secondary">
                  {data.oneSided.chains.length} one-sided chains
                </Badge>
                <StatusBadge
                  enabled={data.aggregation.enabled}
                  label="Aggregation"
                />
                <Badge variant="secondary">
                  {data.configSync.enabled
                    ? `Sync every ${formatInterval(data.configSync.configIntervalMs)}`
                    : 'Config sync disabled'}
                </Badge>
              </>
            ) : isLoading ? (
              <Badge variant="secondary">Loading runtime config</Badge>
            ) : isError ? (
              <Badge variant="destructive">Failed to load runtime config</Badge>
            ) : null
          }
        />

        {isLoading ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <LoadingState className="m-6" />
            </CardContent>
          </Card>
        ) : null}

        {isError ? (
          <Card className="gap-0 py-0">
            <CardContent className="px-0">
              <ErrorState className="m-6" cause={error.message} />
            </CardContent>
          </Card>
        ) : null}

        {data ? (
          <>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <SummarySectionCard
                title="Feature switches"
                description="High-level runtime toggles for the interop engine."
              >
                <div className="flex flex-wrap gap-2">
                  {FEATURE_TOGGLE_LABELS.map((toggle) => (
                    <FeatureToggleBadge
                      key={toggle.key}
                      label={toggle.label}
                      enabled={data.featureToggles[toggle.key]}
                    />
                  ))}
                </div>
              </SummarySectionCard>

              <SummarySectionCard
                title="Config sync"
                description="Summary of config refresh settings."
                action={
                  <CopyConfigButton
                    label="config-sync payload"
                    payload={data.configSync}
                  >
                    Copy config-sync payload
                  </CopyConfigButton>
                }
              >
                <div className="flex flex-wrap gap-2">
                  <StatusBadge enabled={data.configSync.enabled} />
                  <Badge variant="secondary">
                    {data.configSync.chains.length} mapped chains
                  </Badge>
                  <Badge variant="secondary">
                    Interval {formatInterval(data.configSync.configIntervalMs)}
                  </Badge>
                </div>
              </SummarySectionCard>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <SummarySectionCard
                title="Capture chains"
                description="Chains configured as full event sources."
                action={
                  <CopyConfigButton
                    label="capture config"
                    payload={data.capture.copyPayload}
                  >
                    Copy capture config
                  </CopyConfigButton>
                }
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge enabled={data.capture.enabled} />
                    <Badge variant="secondary">
                      {data.capture.chains.length} configured chains
                    </Badge>
                  </div>
                  <ChainList
                    chains={data.capture.chains}
                    emptyMessage="No capture chains configured."
                  />
                </div>
              </SummarySectionCard>

              <SummarySectionCard
                title="One-sided chains"
                description="Allowlist used for partial transfer handling."
                action={
                  <CopyConfigButton
                    label="one-sided chains"
                    payload={data.oneSided.copyPayload}
                  >
                    Copy one-sided chains
                  </CopyConfigButton>
                }
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {data.oneSided.chains.length} one-sided chains
                    </Badge>
                  </div>
                  <ChainList
                    chains={data.oneSided.chains}
                    emptyMessage="No one-sided chains configured."
                  />
                </div>
              </SummarySectionCard>
            </div>

            <SummarySectionCard
              title="Aggregation"
              description="Use copied raw config when the details matter."
              action={
                <CopyConfigButton
                  label="aggregation config"
                  payload={data.aggregation.copyPayload}
                >
                  Copy aggregation config
                </CopyConfigButton>
              }
            >
              <div className="flex flex-wrap gap-2">
                <StatusBadge enabled={data.aggregation.enabled} />
                <Badge variant="secondary">
                  {data.aggregation.configsCount} configs
                </Badge>
                <Badge variant="secondary">
                  {data.aggregation.uniquePluginsCount} unique plugins
                </Badge>
                <Badge variant="secondary">
                  {data.aggregation.configsWithDurationSplitCount} configs with
                  duration splits
                </Badge>
              </div>
            </SummarySectionCard>
          </>
        ) : null}
      </div>
    </AppLayout>
  )
}

function SummarySectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <Card className="gap-4 py-4">
      <CardHeader className="flex flex-col gap-3 px-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-0.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-xs leading-4">
            {description}
          </CardDescription>
        </div>
        {action ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {action}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="px-4">{children}</CardContent>
    </Card>
  )
}

function CopyConfigButton({
  label,
  payload,
  children,
}: {
  label: string
  payload: unknown
  children: ReactNode
}) {
  async function handleClick() {
    try {
      await copyTextToClipboard(JSON.stringify(payload, null, 2))
      toast.success(`${label} copied`)
    } catch (error) {
      toast.error(`Failed to copy ${label}`, {
        description:
          error instanceof Error ? error.message : 'Unknown clipboard error',
      })
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={() => void handleClick()}>
      <CopyIcon />
      {children}
    </Button>
  )
}

function FeatureToggleBadge({
  label,
  enabled,
}: {
  label: string
  enabled: boolean
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        enabled
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-muted-foreground/20 text-muted-foreground',
      )}
    >
      {label}: {enabled ? 'on' : 'off'}
    </Badge>
  )
}

function StatusBadge({ enabled, label }: { enabled: boolean; label?: string }) {
  return (
    <Badge variant={enabled ? 'secondary' : 'outline'}>
      {label ? `${label} ` : ''}
      {enabled ? 'Enabled' : 'Disabled'}
    </Badge>
  )
}

function ChainList({
  chains,
  emptyMessage,
}: {
  chains: SummaryChain[]
  emptyMessage: string
}) {
  if (chains.length === 0) {
    return <p className="text-muted-foreground text-sm">{emptyMessage}</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chains.map((chain) => (
        <Badge key={chain.id} variant="outline" className="gap-1.5">
          <span className="font-medium text-foreground">{chain.name}</span>
          <span className="text-muted-foreground">{chain.id}</span>
        </Badge>
      ))}
    </div>
  )
}

function formatInterval(intervalMs: number): string {
  if (intervalMs % 3_600_000 === 0) {
    return `${intervalMs / 3_600_000}h`
  }
  if (intervalMs % 60_000 === 0) {
    return `${intervalMs / 60_000}m`
  }
  return `${intervalMs}ms`
}

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)

  const selection = document.getSelection()
  const originalRange =
    selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (selection && originalRange) {
    selection.removeAllRanges()
    selection.addRange(originalRange)
  }

  if (!copied) {
    throw new Error('Clipboard API unavailable in this browser context.')
  }
}
