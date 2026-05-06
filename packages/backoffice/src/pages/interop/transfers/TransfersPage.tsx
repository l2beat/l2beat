import { RefreshCwIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { TransfersTable } from './table/TransfersTable'
import type { TransferStatsRow } from './types'
import { formatDollars } from './utils'

export function TransfersPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.interop.transfers.stats.useQuery()

  const rows: TransferStatsRow[] = data ?? []
  const totalTransfers = rows.reduce((sum, row) => sum + row.count, 0)
  const totalSrcValue = rows.reduce((sum, row) => sum + row.srcValueSum, 0)
  const totalDstValue = rows.reduce((sum, row) => sum + row.dstValueSum, 0)
  const totalPairs = rows.reduce((sum, row) => sum + row.chains.length, 0)

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <CardTitle>Transfers</CardTitle>
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
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{rows.length} transfer types</Badge>
            <Badge variant="secondary">{totalTransfers} total transfers</Badge>
            <Badge variant="secondary">
              {formatDollars(totalSrcValue)} source value
            </Badge>
            <Badge variant="secondary">
              {formatDollars(totalDstValue)} destination value
            </Badge>
            <Badge variant="secondary">{totalPairs} chain pairs</Badge>
          </CardContent>
        </Card>

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
