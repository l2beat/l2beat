import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import { Card, CardContent } from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { TablePageSummaryCard } from '~/components/table/TablePageSummaryCard'
import { AppLayout } from '~/layouts/AppLayout'
import { useBackendApi } from '~/react-query/trpc'
import { TransfersTable } from './table/TransfersTable'
import type { TransferStatsRow } from './types'
import { formatDollars } from './utils'

export function TransfersPage() {
  const api = useBackendApi()
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.transfers.stats.useQuery()

  const rows: TransferStatsRow[] = data ?? []
  const totalTransfers = rows.reduce((sum, row) => sum + row.count, 0)
  const totalSrcValue = rows.reduce((sum, row) => sum + row.srcValueSum, 0)
  const totalDstValue = rows.reduce((sum, row) => sum + row.dstValueSum, 0)
  const totalPairs = rows.reduce((sum, row) => sum + row.chains.length, 0)

  return (
    <AppLayout>
      <div className="flex flex-col gap-3">
        <TablePageSummaryCard
          title="Transfers"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          }
          summary={
            <>
              <Badge variant="secondary">{rows.length} transfer types</Badge>
              <Badge variant="secondary">
                {totalTransfers} total transfers
              </Badge>
              <Badge variant="secondary">
                {formatDollars(totalSrcValue)} source value
              </Badge>
              <Badge variant="secondary">
                {formatDollars(totalDstValue)} destination value
              </Badge>
              <Badge variant="secondary">{totalPairs} chain pairs</Badge>
            </>
          }
        />

        <Card className="gap-0 py-0">
          <CardContent className="px-0">
            {isLoading ? <LoadingState className="m-6" /> : null}
            {isError ? (
              <ErrorState className="m-6" cause={error.message} />
            ) : null}
            {!isLoading && !isError ? (
              <TransfersTable
                data={rows}
                enableCsvExport
                enablePairsCsvExport
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
