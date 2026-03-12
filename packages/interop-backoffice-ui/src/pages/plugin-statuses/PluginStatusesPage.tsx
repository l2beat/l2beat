import { PauseIcon, PlayIcon, RefreshCwIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { PluginStatusesTable } from './table/PluginStatusesTable'
import type { PluginStatus } from './table/types'

const RESYNC_DAY_OPTIONS = [8, 2, 1]

function buildResyncRequestedFrom(days: number, ethereumDays?: number) {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const payload: Record<string, number> = {
    '*': nowSeconds - 3600 * 24 * days,
  }

  if (ethereumDays !== undefined) {
    payload.ethereum = nowSeconds - 3600 * 24 * ethereumDays
  }

  return payload
}

export function PluginStatusesPage() {
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true)
  const [runningActionKey, setRunningActionKey] = useState<string>()
  const [actionStatus, setActionStatus] = useState<{
    kind: 'success' | 'error'
    message: string
  }>()
  const { data, isLoading, isError, error, refetch, isFetching } =
    api.plugin.status.useQuery(undefined, {
      refetchInterval: isAutoRefreshEnabled ? 5_000 : false,
      refetchOnWindowFocus: isAutoRefreshEnabled,
    })
  const requestResync = api.plugin.requestResync.useMutation()
  const restartFromNow = api.plugin.restartFromNow.useMutation()

  const rows: PluginStatus[] = data ?? []
  const rowsWithErrors = rows.filter((row) => row.lastError).length
  const pluginNames = useMemo(
    () =>
      Array.from(new Set(rows.map((status) => status.pluginName))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [rows],
  )

  async function runAction(
    actionKey: string,
    fn: () => Promise<{ message: string }>,
  ) {
    setActionStatus(undefined)
    setRunningActionKey(actionKey)

    try {
      const result = await fn()
      setActionStatus({
        kind: 'success',
        message: result.message,
      })
      await refetch()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown error occurred'
      setActionStatus({
        kind: 'error',
        message,
      })
    } finally {
      setRunningActionKey(undefined)
    }
  }

  async function handleResync(
    pluginName: string,
    days: number,
    ethereumDays?: number,
  ) {
    const actionKey = `${pluginName}:resync:${days}:${ethereumDays ?? '*'}`

    await runAction(actionKey, async () => {
      const result = await requestResync.mutateAsync({
        pluginName,
        resyncRequestedFrom: buildResyncRequestedFrom(days, ethereumDays),
      })

      return {
        message: `Resync requested for ${pluginName} on ${result.updatedChains.length} chains.`,
      }
    })
  }

  async function handleRestartFromNow(pluginName: string) {
    const confirmedValue = window.prompt(
      `This will DELETE ALL DATA for "${pluginName}" and restart syncing from now.\n\nType the plugin name to confirm:`,
    )
    if (confirmedValue !== pluginName) {
      return
    }

    const actionKey = `${pluginName}:restart-from-now`
    await runAction(actionKey, async () => {
      const result = await restartFromNow.mutateAsync({
        pluginName,
      })

      return {
        message: `Wipe & restart requested for ${pluginName} on ${result.updatedChains.length} chains.`,
      }
    })
  }

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Plugin statuses</CardTitle>
              <CardDescription>
                Live sync state from the interop syncers (auto-refresh every 5
                seconds).
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAutoRefreshEnabled((current) => !current)
                }}
              >
                {isAutoRefreshEnabled ? <PauseIcon /> : <PlayIcon />}
                {isAutoRefreshEnabled
                  ? 'Pause auto refresh'
                  : 'Resume auto refresh'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
                disabled={isFetching}
              >
                <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{rows.length} rows</Badge>
            <Badge variant={rowsWithErrors > 0 ? 'destructive' : 'secondary'}>
              {rowsWithErrors} with errors
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <div className="px-6 py-4 text-destructive text-sm">
                Failed to load plugin statuses: {error.message}
              </div>
            ) : null}
            {!isLoading && !isError ? (
              <PluginStatusesTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>

        {pluginNames.length > 0 ? (
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Resync controls</CardTitle>
              <CardDescription>
                Trigger resync windows per plugin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pluginNames.map((pluginName) => (
                <div
                  key={pluginName}
                  className="flex flex-wrap items-center gap-2 border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-[180px] font-medium text-sm">
                    {pluginName}
                  </div>

                  {RESYNC_DAY_OPTIONS.map((days) => {
                    const actionKey = `${pluginName}:resync:${days}:*`
                    return (
                      <Button
                        key={days}
                        variant="outline"
                        size="sm"
                        disabled={runningActionKey !== undefined}
                        onClick={() => void handleResync(pluginName, days)}
                      >
                        {runningActionKey === actionKey ? (
                          <RefreshCwIcon className="animate-spin" />
                        ) : null}
                        Resync {days}d
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={runningActionKey !== undefined}
                    onClick={() => void handleResync(pluginName, 14, 1)}
                  >
                    {runningActionKey === `${pluginName}:resync:14:1` ? (
                      <RefreshCwIcon className="animate-spin" />
                    ) : null}
                    Ethereum 1d, others 14d
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {pluginNames.length > 0 ? (
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>Wipe & restart from now</CardTitle>
              <CardDescription>
                Deletes plugin data and restarts syncing from current head.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pluginNames.map((pluginName) => {
                const actionKey = `${pluginName}:restart-from-now`
                return (
                  <div
                    key={pluginName}
                    className="flex flex-wrap items-center gap-2 border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-[180px] font-medium text-sm">
                      {pluginName}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={runningActionKey !== undefined}
                      onClick={() => void handleRestartFromNow(pluginName)}
                    >
                      {runningActionKey === actionKey ? (
                        <RefreshCwIcon className="animate-spin" />
                      ) : null}
                      Wipe & restart from now
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ) : null}

        {actionStatus ? (
          <div
            className={
              actionStatus.kind === 'success'
                ? 'px-2 text-green-600 text-sm'
                : 'px-2 text-destructive text-sm'
            }
          >
            {actionStatus.message}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
