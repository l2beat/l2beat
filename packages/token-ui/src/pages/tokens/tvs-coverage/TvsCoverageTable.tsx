import { formatCurrency } from '@l2beat/shared-pure'
import { Button } from '~/components/core/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import {
  BridgeIconStack,
  ProjectCell,
  SortableHead,
  StatusBadge,
  TokenCell,
  ValueCell,
} from './cells'
import {
  formatAge,
  type Row,
  type Snapshot,
  type Sort,
  type SortKey,
} from './rows'

const COLUMNS = 7

export function TvsCoverageTable({
  rows,
  totalRows,
  snapshot,
  sort,
  onSort,
  onShowMore,
}: {
  rows: Row[]
  totalRows: number
  snapshot: Snapshot
  sort: Sort
  onSort: (key: SortKey) => void
  onShowMore: () => void
}) {
  const projects = new Map(snapshot.projects.map((p) => [p.id, p]))
  const bridges = new Map(snapshot.bridges.map((b) => [b.id, b]))
  const explorerUrls = new Map(
    snapshot.chains.map((chain) => [chain.name, chain.explorerUrl]),
  )
  const head = { sort, onSort }

  return (
    <Table className="min-w-[880px] table-fixed">
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow>
          <SortableHead
            {...head}
            className="w-[18%]"
            label="Project"
            sortKey="project"
          />
          <SortableHead {...head} label="Token" sortKey="token" />
          <SortableHead
            {...head}
            className="w-28"
            label="Est. value"
            sortKey="value"
            align="right"
          />
          <SortableHead
            {...head}
            className="w-28"
            label="Volume"
            sortKey="volume"
            align="right"
          />
          <SortableHead
            {...head}
            className="w-32 pl-4"
            label="TVS"
            sortKey="status"
          />
          <SortableHead
            {...head}
            className="w-24"
            label="Via"
            sortKey="bridges"
          />
          <SortableHead
            {...head}
            className="w-20"
            label="Last seen"
            sortKey="lastSeen"
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={COLUMNS}
              className="h-24 text-center text-muted-foreground"
            >
              No results
            </TableCell>
          </TableRow>
        )}
        {rows.map((row) => {
          const project = projects.get(row.projectId)
          return (
            <TableRow key={`${row.projectId}:${row.chain}:${row.address}`}>
              <TableCell>
                <ProjectCell row={row} project={project} />
              </TableCell>
              <TableCell>
                <TokenCell
                  row={row}
                  explorerUrl={explorerUrls.get(row.chain)}
                />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <ValueCell row={row} />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <div className="font-medium">
                  {formatCurrency(row.volumeUsd, 'usd')}
                </div>
                <div className="text-muted-foreground text-xs">
                  {row.transferCount.toLocaleString()} txs
                </div>
              </TableCell>
              <TableCell className="pl-4">
                <StatusBadge row={row} />
              </TableCell>
              <TableCell>
                <BridgeIconStack
                  bridges={row.bridges.map((bridge) => ({
                    ...bridge,
                    name: bridges.get(bridge.id)?.name ?? bridge.id,
                    iconUrl: bridges.get(bridge.id)?.iconUrl,
                  }))}
                />
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {formatAge(row.lastSeen, snapshot.generatedAt)}
              </TableCell>
            </TableRow>
          )
        })}
        {rows.length < totalRows && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMNS} className="py-3 text-center">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onShowMore}
              >
                Show more ({(totalRows - rows.length).toLocaleString()} left)
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
