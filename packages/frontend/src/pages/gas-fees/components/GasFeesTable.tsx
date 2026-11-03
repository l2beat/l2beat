import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow,
} from '~/components/table/Table'
import { EM_DASH } from '~/consts/characters'
import type {
  GasFeesSummary,
  GasFeesSummaryRow,
} from '~/server/features/gas-fees/getGasFeesSummary'
import { cn } from '~/utils/cn'
import { formatFee, formatTimes } from './metrics'
import type { GasFeesChain } from './types'

interface Props {
  chains: GasFeesChain[]
  summary: GasFeesSummary | undefined
  isLoading: boolean
  period: string
  highlightedChainId: string | undefined
  setHighlightedChainId: (id: string | undefined) => void
}

const COLUMN_COUNT = 12

export function GasFeesTable({
  chains,
  summary,
  isLoading,
  period,
  highlightedChainId,
  setHighlightedChainId,
}: Props) {
  const notLive = summary?.notLiveIds
    .map((id) => chains.find((c) => c.id === id)?.name)
    .filter(Boolean)
  const unsplit = summary?.rows.find((r) => r.id === 'ethereum')?.split.unsplit

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-xl">
        Ethereum vs Layer 2s
        <span className="font-normal text-secondary"> · {period}</span>
      </h2>
      <Table
        header={
          <TableHeader>
            <TableHeaderRow>
              <TableHead>Chain</TableHead>
              <TableHead align="right">Avg fee</TableHead>
              <TableHead align="right" tooltip="Avg fee vs the previous period">
                Change
              </TableHead>
              <TableHead align="right">Median fee</TableHead>
              <TableHead align="right" tooltip="21,000 gas">
                ETH transfer
              </TableHead>
              <TableHead align="right" tooltip="65,000 gas">
                ERC-20
              </TableHead>
              <TableHead align="right" tooltip="180,000 gas">
                Swap
              </TableHead>
              <TableHead align="right">Total fees</TableHead>
              <TableHead
                align="right"
                tooltip="Set by the protocol from demand and burned on Ethereum. On L2s, the L2's own execution fee."
              >
                Base fee
              </TableHead>
              <TableHead
                align="right"
                tooltip="A tip users add to be included sooner. Bots racing for ordering often pay most of it."
              >
                Priority fee
              </TableHead>
              <TableHead
                align="right"
                tooltip="What L2 users pay for posting their data to Ethereum."
              >
                L1 data
              </TableHead>
              <TableHead align="right">Cheaper by</TableHead>
            </TableHeaderRow>
          </TableHeader>
        }
      >
        <TableBody>
          {isLoading || !summary
            ? chains.map((chain) => (
                <TableRow key={chain.id} highlightId={undefined}>
                  <TableCell colSpan={COLUMN_COUNT}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            : summary.rows.map((row) => {
                const chain = chains.find((c) => c.id === row.id)
                if (!chain) return null
                return (
                  <Row
                    key={row.id}
                    row={row}
                    chain={chain}
                    highlighted={row.id === highlightedChainId}
                    setHighlightedChainId={setHighlightedChainId}
                  />
                )
              })}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-1 text-2xs text-secondary">
        {unsplit !== undefined && unsplit > 0 && (
          <span>
            Ethereum's base and priority fees start at London (5 Aug 2021).
          </span>
        )}
        {notLive && notLive.length > 0 && (
          <span>Not live yet: {notLive.join(', ')}</span>
        )}
      </div>
    </div>
  )
}

function Row({
  row,
  chain,
  highlighted,
  setHighlightedChainId,
}: {
  row: GasFeesSummaryRow
  chain: GasFeesChain
  highlighted: boolean
  setHighlightedChainId: (id: string | undefined) => void
}) {
  const isEthereum = row.id === 'ethereum'
  const { base, priority, l1Data } = row.split
  const splitTotal = base + (priority ?? 0) + l1Data
  return (
    <TableRow
      highlightId={undefined}
      className={cn(
        isEthereum && 'bg-surface-secondary/50',
        highlighted && 'bg-surface-secondary',
      )}
      onMouseEnter={() => setHighlightedChainId(row.id)}
      onMouseLeave={() => setHighlightedChainId(undefined)}
    >
      <TableCell>
        <a href={chain.href} className="flex items-center gap-2">
          <img
            src={chain.iconUrl}
            alt=""
            width={20}
            height={20}
            className="size-5 rounded-full"
          />
          <span className="flex flex-col">
            <span className="font-bold">{chain.name}</span>
            <span className="text-2xs text-secondary">{chain.type}</span>
          </span>
        </a>
      </TableCell>
      <TableCell align="right" className="font-medium tabular-nums">
        {formatFee(row.avgFee)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {row.avgFeeChange === null ? (
          <span className="text-secondary">{EM_DASH}</span>
        ) : (
          <span
            className={row.avgFeeChange < 0 ? 'text-positive' : 'text-negative'}
          >
            {row.avgFeeChange < 0 ? '▼' : '▲'}{' '}
            {Math.abs(row.avgFeeChange * 100).toFixed(1)}%
          </span>
        )}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.medianFee)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.transfer)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.erc20)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.swap)}
      </TableCell>
      <TableCell align="right" className="tabular-nums">
        {formatFee(row.totalFees)}
      </TableCell>
      <SplitCell value={base} total={splitTotal} />
      {priority === null ? (
        <TableCell align="right">
          <Tooltip>
            <TooltipTrigger className="text-secondary underline decoration-dotted underline-offset-2">
              n/a
            </TooltipTrigger>
            <TooltipContent className="w-64">
              {chain.noPriorityFeeNote}
            </TooltipContent>
          </Tooltip>
        </TableCell>
      ) : (
        <SplitCell value={priority} total={splitTotal} />
      )}
      {isEthereum ? (
        <TableCell align="right" className="text-secondary">
          {EM_DASH}
        </TableCell>
      ) : (
        <SplitCell value={l1Data} total={splitTotal} />
      )}
      <TableCell align="right" className="font-medium tabular-nums">
        {row.timesCheaper === null ? (
          <span className="font-normal text-secondary">baseline</span>
        ) : (
          formatTimes(row.timesCheaper)
        )}
      </TableCell>
    </TableRow>
  )
}

function SplitCell({ value, total }: { value: number; total: number }) {
  return (
    <TableCell align="right" className="tabular-nums">
      <span className="flex flex-col items-end leading-tight">
        <span>{formatFee(value)}</span>
        <span className="text-2xs text-secondary">
          {total ? Math.round((value / total) * 100) : 0}%
        </span>
      </span>
    </TableCell>
  )
}
