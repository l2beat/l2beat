import { useMutation } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
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
import { useBackendTrpc } from '~/react-query/trpc'

export function RefreshAllFinancialsCard() {
  const trpc = useBackendTrpc()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const refreshFinancials = useMutation(
    trpc.interop.financials.refresh.mutationOptions({
      onSuccess: (data) => {
        toast.success('Financials refresh requested', {
          description: `${data.updatedTransfers} transfers marked as unprocessed.`,
        })
        setIsConfirmDialogOpen(false)
      },
      onError: (error) => {
        toast.error('Financials refresh failed', {
          description: error.message,
        })
      },
    }),
  )

  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle>Refresh all financials</CardTitle>
          <CardDescription>
            Marks every interop transfer as unprocessed so the financials loop
            recalculates them.
          </CardDescription>
        </div>
        <Button
          variant="destructive"
          onClick={() => setIsConfirmDialogOpen(true)}
          disabled={refreshFinancials.isPending}
        >
          <RefreshCwIcon
            className={refreshFinancials.isPending ? 'animate-spin' : ''}
          />
          {refreshFinancials.isPending
            ? 'Requesting refresh...'
            : 'Refresh financials'}
        </Button>
      </CardHeader>
      {refreshFinancials.error ? (
        <CardContent>
          <ErrorState cause={refreshFinancials.error.message} />
        </CardContent>
      ) : null}

      <Dialog
        open={isConfirmDialogOpen}
        onOpenChange={(open) => {
          if (!refreshFinancials.isPending) setIsConfirmDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refresh all financials</DialogTitle>
            <DialogDescription>
              This marks every interop transfer as unprocessed and recalculates
              all financial values from scratch. This affects the whole table
              and can take a long time. Use the reprocessing queue instead if
              you only need to fix specific transfers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={refreshFinancials.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => refreshFinancials.mutate()}
              disabled={refreshFinancials.isPending}
            >
              {refreshFinancials.isPending
                ? 'Requesting refresh...'
                : 'Mark all as unprocessed'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
