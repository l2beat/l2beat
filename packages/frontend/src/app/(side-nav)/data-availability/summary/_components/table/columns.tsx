import { createColumnHelper } from '@tanstack/react-table'
import { PentagonRosetteCell } from '~/components/rosette/pentagon/pentagon-rosette-cell'
import { ProjectNameCell } from '~/components/table/cells/project-name-cell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns'
import { EM_DASH } from '~/consts/characters'
import { ChevronIcon } from '~/icons/chevron'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/format'
import { mapRisksToRosetteValues } from '../../../_utils/map-risks-to-rosette-values'
import { DaEconomicSecurityCell } from './da-economic-security-cell'
import { ProjectsUsedIn } from './projects-used-in'

const columnHelper = createColumnHelper<DaSummaryEntry>()

const nameColumn = columnHelper.accessor('name', {
  header: 'DA Layer',
  meta: {
    tooltip:
      'The data availability layer where the data (transaction data or state diffs) is posted.',
  },
  cell: (ctx) => (
    <ProjectNameCell
      project={{
        name: ctx.getValue(),
      }}
    />
  ),
})

const daBridgeColumn = columnHelper.accessor('daBridge', {
  header: 'DA Bridge',
  cell: (ctx) => {
    const value = ctx.getValue()
    if (value === 'multiple') {
      return (
        <button
          className="flex flex-row items-center gap-4 italic text-gray-500 dark:text-gray-400"
          onClick={(e) => {
            e.preventDefault()
            ctx.row.toggleExpanded()
          }}
        >
          Multiple bridges
          <ChevronIcon
            className={cn(
              'fill-black transition-transform dark:fill-white',
              ctx.row.getIsExpanded() && 'rotate-180',
            )}
          />
        </button>
      )
    }
    return (
      <ProjectNameCell
        className="!pl-0"
        project={{
          ...ctx.row.original,
          name: value.name,
          shortName: undefined,
        }}
      />
    )
  },
  meta: {
    cellClassName: 'pl-8',
    headClassName: 'pl-8',
    tooltip:
      'The DA bridge through which Ethereum is informed that data has been made available. ',
  },
})

const risksColumn = columnHelper.accessor('risks', {
  header: 'Risks',
  cell: (ctx) => {
    const value = ctx.getValue()

    const hasNoBridge =
      ctx.row.original.daBridge !== 'multiple' &&
      ctx.row.original.daBridge.type === 'NoBridge'

    if ('accessibility' in value) {
      return (
        <PentagonRosetteCell
          className="justify-start"
          values={mapRisksToRosetteValues(value)}
          isUnderReview={ctx.row.original.isUnderReview}
          hasNoBridge={hasNoBridge}
        />
      )
    }

    return (
      <PentagonRosetteCell
        className="justify-start"
        values={mapRisksToRosetteValues({
          economicSecurity: value.economicSecurity,
          fraudDetection: value.fraudDetection,
          attestations: {
            value: 'Depends on the DA Bridge',
            sentiment: 'neutral',
          },
          exitWindow: {
            value: 'Depends on the DA Bridge',
            sentiment: 'neutral',
          },
          accessibility: {
            value: 'Depends on the DA Bridge',
            sentiment: 'neutral',
          },
        })}
        isUnderReview={ctx.row.original.isUnderReview}
        hasNoBridge={hasNoBridge}
      />
    )
  },
  enableSorting: false,
  meta: {
    hash: 'risk-analysis',
  },
})

const tvsColumn = columnHelper.accessor('tvs', {
  header: 'Total value secured',
  cell: (ctx) =>
    ctx.row.original.usedIn.length > 0
      ? formatCurrency(ctx.row.original.tvs, 'usd', {
          showLessThanMinimum: false,
        })
      : EM_DASH,
  meta: {
    tooltip: 'The total value locked of all L2s using this layer.',
  },
})

const slashableStakeColumn = columnHelper.accessor('economicSecurity', {
  header: 'Slashable stake',
  cell: (ctx) => <DaEconomicSecurityCell value={ctx.getValue()} />,
  meta: {
    tooltip:
      'The assets that are slashable in case of a data withholding attack (the amount of funds a committee would need to burn to successfully deceive the DA bridge). It’s equal to 2/3 of the total validating stake, if any.',
  },
})

const slashableStakeForCustomSystem = columnHelper.accessor(
  'economicSecurity',
  {
    header: 'Slashable stake',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (ctx.row.original.risks.economicSecurity.type === 'Unknown') {
        return formatCurrency(0, 'usd', { showLessThanMinimum: false })
      }

      return <DaEconomicSecurityCell value={value} />
    },
    meta: {
      tooltip:
        'The assets that are slashable in case of a data withholding attack (the amount of funds a committee would need to burn to successfully deceive the DA bridge). It’s equal to 2/3 of the total validating stake, if any.',
    },
  },
)

const usedInColumn = columnHelper.accessor('usedIn', {
  header: 'Used in',
  cell: (ctx) => {
    const value = ctx.getValue()
    return value.length > 0 ? <ProjectsUsedIn usedIn={value} /> : EM_DASH
  },
  enableSorting: false,
})

export const columns = [
  ...getCommonProjectColumns(columnHelper),
  nameColumn,
  daBridgeColumn,
  risksColumn,
  tvsColumn,
  slashableStakeColumn,
  usedInColumn,
]

export const customSystemsColumns = [
  ...getCommonProjectColumns(columnHelper),
  nameColumn,
  daBridgeColumn,
  risksColumn,
  tvsColumn,
  slashableStakeForCustomSystem,
]
