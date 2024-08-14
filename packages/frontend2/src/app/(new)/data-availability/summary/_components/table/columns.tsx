import { createColumnHelper } from '@tanstack/react-table'
import Image from 'next/image'
import { PentagonRosetteCell } from '~/app/_components/rosette/pentagon/pentagon-rosette-cell'
import { IndexCell } from '~/app/_components/table/cells/index-cell'
import { ProjectNameCell } from '~/app/_components/table/cells/project-name-cell'
import { indexRecalculatedOnFilter } from '~/app/_components/table/filters/index-recalculated-on-filter'
import { EM_DASH } from '~/consts/characters'
import { type DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatNumber } from '~/utils/format-number'
import { mapRisksToRosetteValues } from '../../../_utils/map-risks-to-rosette-values'
import { DaEconomicSecurityCell } from './da-economic-security-cell'
import { ProjectsUsedIn } from './projects-used-in'

const columnHelper = createColumnHelper<DaSummaryEntry>()

export const columns = [
  columnHelper.accessor((_, index) => index + 1, {
    header: '#',
    cell: (ctx) => <IndexCell>{indexRecalculatedOnFilter(ctx)}</IndexCell>,
    meta: {
      headClassName: 'w-0',
    },
  }),
  columnHelper.display({
    id: 'logo',
    cell: (ctx) => (
      <Image
        className="min-h-[18px] min-w-[18px]"
        src={`/icons/${ctx.row.original.slug}.png`}
        width={18}
        height={18}
        alt={`${ctx.row.original.name} logo`}
      />
    ),
    meta: {
      headClassName: 'w-0',
      cellClassName: '!pr-0',
    },
  }),
  columnHelper.accessor('name', {
    header: 'DA Layer',
    cell: (ctx) => (
      <ProjectNameCell
        project={{
          name: ctx.getValue(),
        }}
      />
    ),
  }),
  columnHelper.accessor('daBridge', {
    header: 'DA Bridge',
    cell: (ctx) => (
      <ProjectNameCell
        className="!pl-0"
        project={{
          ...ctx.row.original,
          name: ctx.getValue().name,
          shortName: undefined,
        }}
      />
    ),
  }),
  columnHelper.accessor('risks', {
    header: 'Risks',
    cell: (ctx) => (
      <PentagonRosetteCell
        values={mapRisksToRosetteValues(ctx.getValue())}
        isUnderReview={ctx.row.original.isUnderReview}
      />
    ),
    enableSorting: false,
    meta: {
      hash: 'risk-analysis',
    },
  }),
  columnHelper.accessor('layerType', {
    header: 'Layer type',
  }),
  columnHelper.accessor('tvs', {
    header: 'Total value secured',
    cell: (ctx) => `$${formatNumber(ctx.getValue(), 2)}`,
  }),
  columnHelper.accessor('economicSecurity', {
    header: 'Economic security',
    cell: (ctx) => <DaEconomicSecurityCell value={ctx.getValue()} />,
  }),
  columnHelper.accessor('usedIn', {
    header: 'Used in',
    cell: (ctx) => {
      const value = ctx.getValue()
      return value.length > 0 ? <ProjectsUsedIn usedIn={value} /> : EM_DASH
    },
    enableSorting: false,
  }),
]
