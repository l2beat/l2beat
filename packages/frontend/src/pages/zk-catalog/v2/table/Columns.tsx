import { createColumnHelper } from '@tanstack/react-table'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ZkCatalogEntry } from '../../../../server/features/zk-catalog/getZkCatalogEntries'
import { TechStackCell } from '../components/TechStackCell'
import { withSpanByTrustedSetups } from './utils/ColUtils'

const columnHelper = createColumnHelper<ZkCatalogEntry>()

const [indexColumn, logoColumn] = getCommonProjectColumns(
  columnHelper,
  (row) => undefined,
)

export const zkCatalogColumns = [
  withSpanByTrustedSetups(indexColumn),
  withSpanByTrustedSetups(logoColumn),
  withSpanByTrustedSetups(
    columnHelper.accessor((row) => row.name, {
      id: 'name',
      cell: (ctx) => {
        return (
          <div className="space-y-px">
            <div className="font-bold text-base leading-none">
              {ctx.row.original.name}
            </div>
            {ctx.row.original.creator && (
              <div className="font-medium text-[13px] text-secondary leading-normal">
                {ctx.row.original.creator}
              </div>
            )}
          </div>
        )
      },
    }),
  ),
  withSpanByTrustedSetups(
    columnHelper.accessor((row) => row.tvs, {
      id: 'tvs',
      meta: {
        tooltip:
          'The values secured by the listed verifiers, calculated as a sum of the total value secured of all projects that use them.',
      },
      cell: (ctx) => {
        return (
          <div className="font-bold text-base">
            {formatCurrency(ctx.row.original.tvs, 'usd')}
          </div>
        )
      },
    }),
  ),
  columnHelper.group({
    id: 'trusted-setup-group',
    columns: [
      columnHelper.display({
        id: 'trusted-setups',
        header: 'Trusted setups',
        meta: {
          tooltip:
            'Shows the trusted setups used within the proving stack and their risks.',
          virtual: true,
        },
      }),
      columnHelper.display({
        id: 'verifiers',
        header: 'Verifiers',
        meta: {
          tooltip:
            'Shows the count of verifiers and their verification status - successful or unsuccessful, if verification was performed.',
          virtual: true,
        },
      }),
    ],
  }),
  withSpanByTrustedSetups(
    columnHelper.display({
      id: 'tech-stack',
      header: 'Tech stack',
      meta: {
        cellClassName: 'pl-6',
        headClassName: 'pl-6',
      },
      cell: (ctx) => {
        return <TechStackCell techStack={ctx.row.original.techStack} />
      },
    }),
  ),
]
