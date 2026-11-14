import { formatDollarValueNumber } from '@l2beat/shared-pure'
import { createColumnHelper, type VisibilityState } from '@tanstack/react-table'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { PizzaRosetteCell } from '~/components/rosette/pizza/PizzaRosetteCell'
import { ProofSystemCell } from '~/components/table/cells/ProofSystemCell'
import { TypeInfo } from '~/components/table/cells/TypeInfo'
import { getL2CommonProjectColumns } from '~/components/table/common-project-columns/L2CommonProjectColumns'
import { EM_DASH } from '~/consts/characters'
import type { Breakpoint } from '~/hooks/useBreakpoint'
import type { L2ArchivedEntry } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { cn } from '~/utils/cn'

const columnHelper = createColumnHelper<L2ArchivedEntry>()

/**
 * Descriptive columns. Phones start without them, so Value secured, the
 * figure the tables rank by, is in the first view.
 */
const PHONE_HIDDEN_COLUMNS: VisibilityState = {
  type: false,
  proofSystem: false,
  Purpose: false,
}

export function getL2ArchivedDefaultVisibility(
  breakpoint: Breakpoint | undefined,
): VisibilityState | undefined {
  return breakpoint === 'xs' || breakpoint === 'sm'
    ? PHONE_HIDDEN_COLUMNS
    : undefined
}

/**
 * @param hideDescriptiveOnPhones Hides the descriptive columns with CSS on
 * phones, for the markup painted before the viewport is known. After that the
 * table hides them through its column visibility, which the Columns menu can
 * turn back on.
 */
export function getL2ArchivedColumns(hideDescriptiveOnPhones: boolean) {
  const phoneHidden = hideDescriptiveOnPhones
    ? { headClassName: 'max-md:hidden', cellClassName: 'max-md:hidden' }
    : undefined

  return [
    ...getL2CommonProjectColumns(
      columnHelper,
      (row) => `/layer2s/projects/${row.slug}`,
    ).map((column) =>
      column.id === 'name'
        ? {
            ...column,
            meta: {
              ...column.meta,
              // On phones a long name wraps instead of pushing Value secured
              // out of the first view for every row of the table.
              cellClassName: 'max-md:whitespace-normal max-md:[&_a]:max-w-32',
            },
          }
        : column,
    ),
    columnHelper.display({
      header: 'Risks',
      cell: (ctx) => {
        const risks = ctx.row.original.risks
        if (!risks) {
          return EM_DASH
        }

        return (
          <PizzaRosetteCell
            projectName={ctx.row.original.name}
            href={`/layer2s/projects/${ctx.row.original.slug}#risk-analysis`}
            values={risks}
            isUnderReview={ctx.row.original.statuses?.underReview === 'config'}
          />
        )
      },
      meta: {
        align: 'center',
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (ctx) => (
        <TypeInfo stacks={ctx.row.original.stacks}>{ctx.getValue()}</TypeInfo>
      ),
      meta: phoneHidden,
    }),
    columnHelper.accessor('proofSystem', {
      header: 'Proof system',
      cell: (ctx) => <ProofSystemCell {...ctx.row.original} />,
      meta: {
        ...phoneHidden,
        tooltip:
          'The type of proof system that the project uses to prove its state: either Optimistic (assumed valid unless challenged) or Validity (cryptographically proven upfront)',
      },
    }),
    columnHelper.accessor('totalTvs', {
      id: 'total',
      header: 'Value secured',
      cell: (ctx) => {
        const value = ctx.getValue()
        if (value === undefined) {
          return <NoDataBadge />
        }

        return (
          <span className="font-medium md:text-label-value-15">
            {formatDollarValueNumber(value)}
          </span>
        )
      },
      sortUndefined: 'last',
      sortingFn: ({ original: a }, { original: b }) => {
        const aTvs = a.totalTvs ?? 0
        const bTvs = b.totalTvs ?? 0

        if (aTvs === bTvs) {
          return b.name.localeCompare(a.name)
        }

        return aTvs - bTvs
      },
      meta: {
        align: 'right',
        // Phones scroll the table sideways: starting the column at its left
        // edge keeps the value in the first view, as on the TVS page.
        headClassName: 'max-md:[&>div]:justify-start',
        cellClassName: 'max-md:text-left',
        tooltip:
          'Value secured is the sum of canonically bridged tokens, externally bridged tokens, and native tokens.',
      },
    }),
    columnHelper.display({
      header: 'Purpose',
      cell: (ctx) => ctx.row.original.purposes.join(', '),
      meta: {
        // Room after the right-aligned value so the two don't read as one phrase.
        headClassName: cn('pl-6', phoneHidden?.headClassName),
        cellClassName: cn(
          'pl-6 lg:whitespace-normal',
          phoneHidden?.cellClassName,
        ),
      },
    }),
  ]
}
