import type { Sentiment } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { createColumnHelper } from '@tanstack/react-table'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import { SentimentText } from '~/components/SentimentText'
import { ExitWindowCell } from '~/components/table/cells/ExitWindowCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import type { OssificationSummaryEntry } from '~/server/features/projects/ossification/getOssificationEntries'
import { OssificationTimelineCell } from './OssificationTimelineCell'

const columnHelper = createColumnHelper<OssificationSummaryEntry>()

/** Bands anchored in the score's own semantics: below 50 the perimeter is
 *  younger than the median exploited code; 80 corresponds to roughly one year
 *  unchanged, past which only ~1 in 5 recorded exploits landed. Percentile
 *  calibration keeps these anchors meaningful across dataset releases. */
function ossificationSentiment(score: number): Sentiment {
  if (score >= 80) return 'good'
  if (score >= 50) return 'warning'
  return 'bad'
}

export const ossificationColumns = [
  ...getCommonProjectColumns(columnHelper, (entry) => entry.href),
  columnHelper.accessor('name', {
    header: 'Project',
    cell: (ctx) => (
      <TableLink href={ctx.row.original.href}>
        <span className="font-medium text-sm">{ctx.getValue()}</span>
      </TableLink>
    ),
    enableHiding: false,
  }),
  columnHelper.accessor('score', {
    header: 'Ossification %',
    cell: (ctx) => {
      if (ctx.row.original.isUnverified) {
        return (
          <span className="font-medium tabular-nums">{ctx.getValue()}</span>
        )
      }
      return (
        <SentimentText
          sentiment={ossificationSentiment(ctx.getValue())}
          className="font-medium tabular-nums"
        >
          {`${ctx.getValue()}`}
        </SentimentText>
      )
    },
    meta: {
      tooltip:
        "The project's critical smart contracts have stayed unchanged longer than the exploited code in N% of recorded incidents. Below 50: younger than the median exploited code. 80+: about a year unchanged.",
    },
    sortDescFirst: true,
  }),
  columnHelper.accessor((entry) => entry.exposure ?? undefined, {
    id: 'exposure',
    header: 'Battle-tested\nexposure',
    cell: (ctx) => {
      const exposure = ctx.row.original.exposure
      if (exposure === null) return <NotApplicableBadge />
      return (
        <span className="tabular-nums">
          {formatCurrency(exposure, 'usd')}
          <span className="ml-0.5 text-secondary text-xs">·years</span>
        </span>
      )
    },
    meta: {
      tooltip:
        'Value secured summed up over the ossified period — the implicit bug bounty the code has withstood, in dollar-years (Example: 6 months of constant 10M TVS without critical code changes gives a value of 5M, 3 years give 30M).',
    },
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  columnHelper.display({
    id: 'timeline',
    header: 'TVS &\nchanges (1y)',
    cell: (ctx) => (
      <OssificationTimelineCell
        timeline={ctx.row.original.timeline}
        projectName={ctx.row.original.name}
      />
    ),
    meta: {
      tooltip:
        'TVS over one year. The highlighted part is the ossified period — its area is the battle-tested exposure. Ticks below the baseline are earlier critical changes to the smart contracts. Heights are normalized per-project.',
      cellClassName: 'py-0',
    },
    enableSorting: false,
  }),
  columnHelper.accessor('criticalChangesPerYear', {
    header: 'Critical\nchanges / year',
    cell: (ctx) => {
      const contractCount = ctx.row.original.contractCount
      return (
        <TwoRowCell>
          <TwoRowCell.First className="tabular-nums">
            {ctx.row.original.clusteredEventCount === 0
              ? '0'
              : ctx.getValue() >= 10
                ? ctx.getValue().toFixed(0)
                : ctx.getValue().toFixed(1)}
          </TwoRowCell.First>
          <TwoRowCell.Second className="mt-0.5">
            {`across ${contractCount} ${contractCount === 1 ? 'contract' : 'contracts'}`}
          </TwoRowCell.Second>
        </TwoRowCell>
      )
    },
    meta: {
      tooltip:
        'Critical change events per year over the trailing 36 months, and the number of contracts in the critical perimeter as classified by our research team.',
    },
    sortDescFirst: true,
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.exitWindow), {
    id: 'exitWindow',
    header: 'Exit\nwindow',
    cell: (ctx) => {
      const exitWindow = ctx.row.original.exitWindow
      if (!exitWindow) return <NotApplicableBadge />
      return <ExitWindowCell value={exitWindow} />
    },
    meta: {
      tooltip:
        'How much time users have to exit before a permitted critical change takes effect. This does not directly affect ossification.',
    },
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.exitWindow, b.original.exitWindow),
  }),
]
