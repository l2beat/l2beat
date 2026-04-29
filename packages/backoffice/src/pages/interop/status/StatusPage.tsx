import { RefreshCwIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
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
import { Checkbox } from '~/components/core/Checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import { Input } from '~/components/core/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { PluginStatusesTable } from './table/PluginStatusesTable'

const RESYNC_OPTIONS: ReadonlyArray<{
  key: string
  label: string
  days: number
  ethereumDays?: number
}> = [
  { key: '8d', label: 'Resync 8d', days: 8 },
  { key: '2d', label: 'Resync 2d', days: 2 },
  { key: '1d', label: 'Resync 1d', days: 1 },
  {
    key: 'eth-1d-others-14d',
    label: 'Resync Ethereum 1d, others 14d',
    days: 14,
    ethereumDays: 1,
  },
] as const

function buildResyncPayload(
  pluginName: string,
  days: number,
  ethereumDays?: number,
) {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const resyncRequestedFrom: Record<string, number> = {
    '*': nowSeconds - 3_600 * 24 * days,
  }

  if (ethereumDays !== undefined) {
    resyncRequestedFrom.ethereum = nowSeconds - 3_600 * 24 * ethereumDays
  }

  return { pluginName, resyncRequestedFrom }
}

export function StatusPage() {
  const utils = api.useUtils()
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [restartDialogPlugin, setRestartDialogPlugin] = useState<string | null>(
    null,
  )
  const [restartConfirmation, setRestartConfirmation] = useState('')
  const [pendingResyncKey, setPendingResyncKey] = useState<string | null>(null)
  const [pendingRestartPlugin, setPendingRestartPlugin] = useState<
    string | null
  >(null)

  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.status.pluginSyncStatuses.useQuery(undefined, {
      refetchInterval: autoRefresh ? 5_000 : false,
    })

  const rows = data ?? []
  const pluginNames = Array.from(
    new Set(rows.map((row) => row.pluginName)),
  ).sort((a, b) => a.localeCompare(b))
  const errorsCount = rows.filter((row) => row.lastError !== undefined).length
  const resyncRequestedCount = rows.filter(
    (row) => row.resyncRequestedFrom !== undefined,
  ).length

  const resync = api.interop.status.resync.useMutation({
    onSuccess: (result, input) => {
      toast.success(
        `${input.pluginName}: resync requested for ${result.updatedChains.length} chains`,
      )
      void utils.interop.status.pluginSyncStatuses.invalidate()
    },
    onError: (mutationError) => {
      toast.error(mutationError.message)
    },
    onSettled: () => {
      setPendingResyncKey(null)
    },
  })

  const restartFromNow = api.interop.status.restartFromNow.useMutation({
    onSuccess: (result, input) => {
      toast.success(
        `${input.pluginName}: restart requested for ${result.updatedChains.length} chains`,
      )
      setRestartDialogPlugin(null)
      setRestartConfirmation('')
      void utils.interop.status.pluginSyncStatuses.invalidate()
    },
    onError: (mutationError) => {
      toast.error(mutationError.message)
    },
    onSettled: () => {
      setPendingRestartPlugin(null)
    },
  })

  function handleResync(
    pluginName: string,
    days: number,
    ethereumDays?: number,
  ) {
    const optionKey = `${pluginName}:${days}:${ethereumDays ?? 'all'}`
    setPendingResyncKey(optionKey)
    resync.mutate(buildResyncPayload(pluginName, days, ethereumDays))
  }

  function handleRestartDialogChange(open: boolean) {
    if (!open) {
      setRestartDialogPlugin(null)
      setRestartConfirmation('')
    }
  }

  function handleRestartFromNow() {
    if (!restartDialogPlugin) {
      return
    }

    setPendingRestartPlugin(restartDialogPlugin)
    restartFromNow.mutate({ pluginName: restartDialogPlugin })
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Plugin statuses</CardTitle>
              <CardDescription>
                Sync state and destructive resync controls migrated from the
                legacy interop status page.
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
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="plugin-statuses-auto-refresh"
                className="flex items-center gap-2 text-sm"
              >
                <Checkbox
                  id="plugin-statuses-auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={(checked) =>
                    setAutoRefresh(checked === true)
                  }
                />
                Refresh every 5 seconds
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{pluginNames.length} plugins</Badge>
              <Badge variant="secondary">{rows.length} chain states</Badge>
              <Badge variant={errorsCount > 0 ? 'destructive' : 'secondary'}>
                {errorsCount} errors
              </Badge>
              <Badge
                variant={resyncRequestedCount > 0 ? 'destructive' : 'secondary'}
              >
                {resyncRequestedCount} resync requested
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <PluginStatusesTable data={rows} enableCsvExport />
            ) : null}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Resync plugins</CardTitle>
            <CardDescription>
              Request a partial replay from a recent timestamp for every chain
              in a plugin cluster.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pluginNames.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plugin</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pluginNames.map((pluginName) => (
                    <TableRow key={pluginName}>
                      <TableCell className="font-medium">
                        {pluginName}
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <div className="flex flex-wrap gap-2">
                          {RESYNC_OPTIONS.map((option) => {
                            const key = `${pluginName}:${option.days}:${option.ethereumDays ?? 'all'}`
                            return (
                              <Button
                                key={option.key}
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={
                                  resync.isPending || restartFromNow.isPending
                                }
                                onClick={() =>
                                  handleResync(
                                    pluginName,
                                    option.days,
                                    option.ethereumDays,
                                  )
                                }
                              >
                                <RotateCcwIcon
                                  className={
                                    pendingResyncKey === key && resync.isPending
                                      ? 'animate-spin'
                                      : ''
                                  }
                                />
                                {option.label}
                              </Button>
                            )
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Wipe and restart from now</CardTitle>
            <CardDescription>
              Deletes historical data for the plugin and resumes syncing without
              replaying prior history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pluginNames.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plugin</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pluginNames.map((pluginName) => (
                    <TableRow key={pluginName}>
                      <TableCell className="font-medium">
                        {pluginName}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={
                            resync.isPending || restartFromNow.isPending
                          }
                          onClick={() => {
                            setRestartDialogPlugin(pluginName)
                            setRestartConfirmation('')
                          }}
                        >
                          <Trash2Icon
                            className={
                              pendingRestartPlugin === pluginName &&
                              restartFromNow.isPending
                                ? 'animate-pulse'
                                : ''
                            }
                          />
                          Wipe and restart from now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={restartDialogPlugin !== null}
        onOpenChange={handleRestartDialogChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm wipe and restart</DialogTitle>
            <DialogDescription>
              This deletes all data for{' '}
              <span className="font-medium">{restartDialogPlugin}</span> and
              restarts syncing from the current tip. Existing history will not
              be replayed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Type <span className="font-medium">{restartDialogPlugin}</span> to
              confirm.
            </p>
            <Input
              value={restartConfirmation}
              onChange={(event) => setRestartConfirmation(event.target.value)}
              placeholder={restartDialogPlugin ?? ''}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleRestartDialogChange(false)}
              disabled={restartFromNow.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRestartFromNow}
              disabled={
                restartDialogPlugin === null ||
                restartConfirmation !== restartDialogPlugin ||
                restartFromNow.isPending
              }
            >
              Wipe and restart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
