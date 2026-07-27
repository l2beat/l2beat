import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RotateCcwIcon } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { useBackendTrpc } from '~/react-query/trpc'
import { RefreshAllFinancialsCard } from './RefreshAllFinancialsCard'
import { TransferFilterBuilder } from './TransferFilterBuilder'
import { FinancialTransfersTable } from './table/FinancialTransfersTable'
import type { FinancialTransfersFilterInput } from './types'
import { formatUsd } from './utils'

export function FinancialsPage() {
  const trpc = useBackendTrpc()
  const queryClient = useQueryClient()
  const [appliedFilter, setAppliedFilter] =
    useState<FinancialTransfersFilterInput>()
  const [isReprocessDialogOpen, setIsReprocessDialogOpen] = useState(false)

  const transfers = useQuery(
    trpc.interop.financials.transfers.queryOptions(appliedFilter ?? {}, {
      enabled: appliedFilter !== undefined,
    }),
  )

  const reprocess = useMutation(
    trpc.interop.financials.reprocess.mutationOptions({
      onSuccess: (data) => {
        toast.success('Financials reprocessing scheduled', {
          description: `${data.updatedTransfers} transfers marked as unprocessed.`,
        })
        setIsReprocessDialogOpen(false)
        void queryClient.invalidateQueries(
          trpc.interop.financials.transfers.queryFilter(),
        )
      },
      onError: (error) => {
        toast.error('Scheduling reprocessing failed', {
          description: error.message,
        })
      },
    }),
  )

  const stats = transfers.data?.stats
  const isTruncated =
    transfers.data !== undefined &&
    transfers.data.stats.totalCount > transfers.data.transfers.length

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Financial transfers</CardTitle>
            <CardDescription>
              Search interop transfers by filters, preview their financials, and
              mark everything matching for reprocessing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TransferFilterBuilder
              isSearching={transfers.isFetching}
              onApply={setAppliedFilter}
              onClear={() => setAppliedFilter(undefined)}
            />

            {transfers.isLoading && appliedFilter !== undefined ? (
              <LoadingState />
            ) : null}
            {transfers.isError ? (
              <ErrorState cause={transfers.error.message} />
            ) : null}
            {transfers.data && stats ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {stats.totalCount.toLocaleString()} matching
                    </Badge>
                    <Badge variant="secondary">
                      {stats.unprocessedCount.toLocaleString()} unprocessed
                    </Badge>
                    <Badge variant="secondary">
                      Src value {formatUsd(stats.srcValueUsdSum)}
                    </Badge>
                    <Badge variant="secondary">
                      Dst value {formatUsd(stats.dstValueUsdSum)}
                    </Badge>
                    <Badge variant="secondary">
                      {stats.missingSrcValueCount.toLocaleString()} missing src
                      value
                    </Badge>
                    <Badge variant="secondary">
                      {stats.missingDstValueCount.toLocaleString()} missing dst
                      value
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsReprocessDialogOpen(true)}
                    disabled={stats.totalCount === 0 || reprocess.isPending}
                  >
                    <RotateCcwIcon />
                    Mark matching as unprocessed
                  </Button>
                </div>

                {isTruncated ? (
                  <p className="text-muted-foreground text-sm">
                    Previewing the {transfers.data.transfers.length} most recent
                    of {stats.totalCount.toLocaleString()} matching transfers.
                    Reprocessing applies to all of them.
                  </p>
                ) : null}

                <FinancialTransfersTable data={transfers.data.transfers} />
              </>
            ) : null}
          </CardContent>
        </Card>

        <RefreshAllFinancialsCard />
      </div>

      <Dialog
        open={isReprocessDialogOpen}
        onOpenChange={(open) => {
          if (!reprocess.isPending) setIsReprocessDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule financials reprocessing</DialogTitle>
            <DialogDescription>
              This marks all {stats?.totalCount.toLocaleString()} transfers
              matching the applied filters as unprocessed so the financials loop
              recalculates them — including transfers beyond the preview. Their
              current financial values will be overwritten.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsReprocessDialogOpen(false)}
              disabled={reprocess.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (appliedFilter !== undefined) reprocess.mutate(appliedFilter)
              }}
              disabled={appliedFilter === undefined || reprocess.isPending}
            >
              {reprocess.isPending
                ? 'Scheduling...'
                : 'Mark matching as unprocessed'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
