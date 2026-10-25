import { formatCurrency } from '@l2beat/shared-pure'
import { useEffect, useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/core/Table'
import {
  BridgeIconStack,
  ProjectCell,
  SortableHead,
  StatusBadge,
  TokenCell,
} from './cells'
import {
  DismissalAction,
  type DismissalActions,
  DismissedBadge,
} from './DismissalCell'
import {
  formatSnapshotDay,
  type Row,
  rowId,
  type Snapshot,
  type Sort,
  type SortKey,
} from './rows'
import { ValueCell } from './ValueCell'

const COLUMNS = 8

export function TvsCoverageTable({
  rows,
  totalRows,
  snapshot,
  sort,
  onSort,
  onShowMore,
  dismissalActions,
}: {
  rows: Row[]
  totalRows: number
  snapshot: Snapshot
  sort: Sort
  onSort: (key: SortKey) => void
  onShowMore: () => void
  dismissalActions: DismissalActions
}) {
  const projects = new Map(snapshot.projects.map((p) => [p.id, p]))
  const bridges = new Map(snapshot.bridges.map((b) => [b.id, b]))
  const bridgeInfo = (id: string) => ({
    name: bridges.get(id)?.name ?? id,
    iconUrl: bridges.get(id)?.iconUrl,
  })
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
            className="w-36"
            label="Est. value"
            sortKey="value"
            align="right"
          />
          <SortableHead
            {...head}
            className="w-24"
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
          <TableHead className="w-10" />
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
        {rows.map((row) => (
          <TableRow key={rowId(row)}>
            <TableCell>
              <ProjectCell row={row} project={projects.get(row.projectId)} />
            </TableCell>
            <TableCell>
              <TokenCell row={row} explorerUrl={explorerUrls.get(row.chain)} />
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
              {row.dismissal ? (
                <DismissedBadge dismissal={row.dismissal} />
              ) : (
                <StatusBadge row={row} />
              )}
            </TableCell>
            <TableCell>
              <BridgeIconStack bridges={row.bridges} bridgeInfo={bridgeInfo} />
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">
              {formatSnapshotDay(row.lastSeen)}
            </TableCell>
            <TableCell className="px-0 text-right">
              <DismissalAction
                row={row}
                name={projects.get(row.projectId)?.name ?? row.projectId}
                actions={dismissalActions}
              />
            </TableCell>
          </TableRow>
        ))}
        {rows.length < totalRows && (
          <LoadMoreRow key={rows.length} onVisible={onShowMore} />
        )}
      </TableBody>
    </Table>
  )
}

function LoadMoreRow({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLTableRowElement>(null)
  useEffect(() => {
    const row = ref.current
    if (!row) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onVisible()
      },
      {
        root: row.closest('[data-slot="card-content"]'),
        rootMargin: '0px 0px 600px 0px',
      },
    )
    observer.observe(row)
    return () => observer.disconnect()
  }, [onVisible])
  return (
    <TableRow ref={ref} aria-hidden="true" className="border-0">
      <TableCell colSpan={COLUMNS} className="h-px p-0" />
    </TableRow>
  )
}
