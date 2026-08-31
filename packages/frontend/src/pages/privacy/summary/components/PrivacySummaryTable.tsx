import { formatCurrency, formatInteger, pluralize } from '@l2beat/shared-pure'
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Badge } from '~/components/badge/Badge'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrivacyAttributeTag } from '~/components/PrivacyAttributeTag'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { BasicTable } from '~/components/table/BasicTable'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { ColumnsControls } from '~/components/table/controls/ColumnsControls'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import type { PrivacyAnonymitySetSummary } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSummaries'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { PRIVACY_ASSESSMENT } from '../../privacyAssessment'
import { PrivacyAssessmentCell } from './PrivacyAssessmentCell'
import { PrivacyTrustedSetupCell } from './PrivacyTrustedSetupCell'

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

function MetricCell({ children }: { children: React.ReactNode }) {
  if (children === undefined || children === null) {
    return <NoDataBadge />
  }

  return <span className="font-medium text-sm">{children}</span>
}

const columns = [
  ...getCommonProjectColumns(columnHelper, (row) => row.href),
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => {
      const project = {
        name: ctx.row.original.name,
        shortName: ctx.row.original.shortName,
        slug: ctx.row.original.slug,
        icon: ctx.row.original.icon,
        backgroundColor: undefined,
        description: ctx.row.original.description,
        quantumResistance: ctx.row.original.quantumResistant
          ? 'privacy'
          : undefined,
        statuses: {
          underReview: ctx.row.original.isUnderReview ? 'config' : undefined,
        },
      } as const

      return (
        <ProjectNameInfoTooltip project={project}>
          <TableLink href={ctx.row.original.href}>
            <TwoRowCell>
              <TwoRowCell.First>
                <ProjectNameCell project={project} withInfoTooltip />
              </TwoRowCell.First>
              <TwoRowCell.Second>
                {ctx.row.original.isTracked
                  ? `${formatInteger(ctx.row.original.poolsTracked)} ${pluralize(
                      ctx.row.original.poolsTracked,
                      ctx.row.original.summaryTrackedItemName,
                    )} tracked`
                  : 'Not tracked'}
              </TwoRowCell.Second>
            </TwoRowCell>
          </TableLink>
        </ProjectNameInfoTooltip>
      )
    },
    enableSorting: false,
    meta: {
      cellClassName: 'pl-4',
      headClassName: 'pl-4',
    },
  }),
  columnHelper.display({
    id: 'attributes',
    header: 'Attributes',
    cell: (ctx) => {
      const attributes = ctx.row.original.attributes

      if (attributes.length === 0) {
        return <NoDataBadge />
      }

      const half = Math.ceil(attributes.length / 2)
      const rows = [attributes.slice(0, half), attributes.slice(half)].filter(
        (row) => row.length > 0,
      )

      return (
        <div className="flex w-max flex-col gap-1">
          {rows.map((row, index) => (
            <div key={index} className="flex gap-1">
              {row.map((attribute) => (
                <PrivacyAttributeTag key={attribute.id} attribute={attribute} />
              ))}
            </div>
          ))}
        </div>
      )
    },
    enableSorting: false,
    meta: {
      cellClassName: 'py-2',
      tooltip: 'Protocol attributes and capabilities.',
    },
  }),
  columnHelper.accessor('totalValueLockedUsd', {
    id: 'totalValueLockedUsd',
    header: 'TVL',
    cell: (ctx) => {
      if (!ctx.row.original.hasTvl) {
        return <NotApplicableBadge />
      }

      const value = ctx.getValue()
      return (
        <MetricCell>
          {value === undefined ? undefined : formatCurrency(value, 'usd')}
        </MetricCell>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'Total USD value currently held across all tracked assets for the protocol.',
    },
  }),
  columnHelper.accessor('totalDeposits', {
    header: 'Deposits',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <MetricCell>
          {value === undefined ? undefined : formatInteger(value)}
        </MetricCell>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'Total deposit count aggregated across all tracked tokens and buckets.',
    },
  }),
  columnHelper.accessor('totalValueDeposited30dUsd', {
    id: 'totalValueDeposited30dUsd',
    header: '30D vol.',
    cell: (ctx) => {
      const value = ctx.getValue()
      return (
        <MetricCell>
          {value === undefined ? undefined : formatCurrency(value, 'usd')}
        </MetricCell>
      )
    },
    sortUndefined: 'last',
    meta: {
      align: 'right',
      tooltip:
        'Total USD value of all deposits over the last 30 days, based on configured token prices.',
    },
  }),
  columnHelper.accessor(
    (entry) =>
      entry.anonymitySet.status === 'available'
        ? entry.anonymitySet.value
        : undefined,
    {
      id: 'anonymitySet',
      header: 'Anon. set',
      cell: (ctx) => (
        <AnonymitySetCell anonymitySet={ctx.row.original.anonymitySet} />
      ),
      sortUndefined: 'last',
      meta: {
        align: 'right',
        tooltip:
          'Largest configured anonymity set: unique deposit senders during the last 30 complete UTC days.',
      },
    },
  ),
  columnHelper.display({
    id: 'trustedSetup',
    header: 'Setup',
    cell: (ctx) => (
      <PrivacyTrustedSetupCell trustedSetup={ctx.row.original.trustedSetup} />
    ),
    enableSorting: false,
    meta: {
      align: 'center',
      tooltip:
        "Trusted setup used by the project's proving system and its risk.",
    },
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.exitWindow), {
    id: 'exitWindow',
    header: 'Exit',
    cell: (ctx) => (
      <PrivacyAssessmentCell
        value={ctx.row.original.exitWindow}
        showValue
        walkawayTest={ctx.row.original.exitWindow.walkawayTest}
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.exitWindow, b.original.exitWindow),
    meta: {
      align: 'center',
      tooltip:
        'Time users have to withdraw before a malicious upgrade can take effect.',
    },
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.privacy), {
    id: 'privacy',
    header: PRIVACY_ASSESSMENT.title,
    cell: (ctx) => (
      <PrivacyAssessmentCell value={ctx.row.original.privacy} showValue />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.privacy, b.original.privacy),
    meta: {
      align: 'center',
      tooltip: PRIVACY_ASSESSMENT.tooltip,
    },
  }),
  columnHelper.accessor((entry) => adjustTableValue(entry.reproducibility), {
    id: 'reproducibility',
    header: 'Repro',
    cell: (ctx) => (
      <PrivacyAssessmentCell
        value={ctx.row.original.reproducibility}
        showValue
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.reproducibility, b.original.reproducibility),
    meta: {
      align: 'center',
      tooltip:
        'Whether all source code needed to audit the protocol and participate in it is published and can be used locally.',
    },
  }),
]

function AnonymitySetCell({
  anonymitySet,
}: {
  anonymitySet: PrivacyAnonymitySetSummary
}) {
  if (anonymitySet.status === 'syncing') {
    return (
      <Badge type="gray" size="small">
        Syncing
      </Badge>
    )
  }
  if (anonymitySet.status === 'unavailable') {
    return <NoDataBadge />
  }

  if (anonymitySet.status === 'available') {
    return (
      <TwoRowCell className="text-right">
        <TwoRowCell.First>{formatInteger(anonymitySet.value)}</TwoRowCell.First>
        <TwoRowCell.Second>{anonymitySet.label}</TwoRowCell.Second>
      </TwoRowCell>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <NotApplicableBadge />
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        {anonymitySet.description}
      </TooltipContent>
    </Tooltip>
  )
}

const initialSorting: SortingState = [{ id: 'totalValueLockedUsd', desc: true }]

export function PrivacySummaryTable({
  entries,
}: {
  entries: PrivacySummaryEntry[]
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)

  const table = useTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnPinning: {
        left: ['#', 'logo'],
      },
    },
    onSortingChange: setSorting,
  })

  return (
    <PrimaryCard className="mt-4">
      <ColumnsControls columns={table.getAllColumns()} />
      <BasicTable table={table} />
    </PrimaryCard>
  )
}
