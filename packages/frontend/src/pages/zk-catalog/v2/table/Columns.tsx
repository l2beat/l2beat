import { createColumnHelper } from '@tanstack/react-table'
import { TableLink } from '~/components/table/TableLink'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ZkCatalogEntry } from '../../../../server/features/zk-catalog/getZkCatalogEntries'
import { TechStackCell } from '../components/TechStackCell'
import { TrustedSetupCell } from '../components/TrustedSetupCell'
import { VerifiedCountWithDetails } from '../components/VerifiedCountWithDetails'

const columnHelper = createColumnHelper<ZkCatalogEntry>()

export const zkCatalogColumns = [
  ...getCommonProjectColumns(columnHelper, (p) => `/zk-catalog/${p.slug}`),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (ctx) => {
      return (
        <TableLink href={`/zk-catalog/${ctx.row.original.slug}`}>
          <div className="w-max space-y-px">
            <div className="max-w-[146px] whitespace-pre-wrap font-bold text-base leading-none">
              {ctx.row.original.name}
            </div>
            {ctx.row.original.creator && (
              <div className="font-medium text-[13px] text-secondary leading-normal">
                {ctx.row.original.creator}
              </div>
            )}
          </div>
        </TableLink>
      )
    },
  }),
  columnHelper.accessor((row) => row.tvs, {
    id: 'tvs',
    meta: {
      tooltip:
        'The values secured by the listed verifiers, calculated as a sum of the total value secured of all projects that use them and are listed on L2BEAT.',
    },
    cell: (ctx) => {
      return (
        <div className="font-bold text-base">
          {formatCurrency(ctx.row.original.tvs, 'usd')}
        </div>
      )
    },
  }),
  columnHelper.group({
    id: 'trusted-setup-group',
    columns: [
      columnHelper.display({
        id: 'trusted-setups',
        header: 'Trusted setups',
        cell: (ctx) => {
          const first = Object.values(
            ctx.row.original.trustedSetupsByProofSystem,
          )[0]
          if (!first) return null
          return <TrustedSetupCell {...first} />
        },
        meta: {
          tooltip:
            'Shows the trusted setups used within the proving stack and their risks.',
          cellClassName: 'px-6 pt-4 pb-3',

          additionalRows: (ctx) => {
            return Object.entries(ctx.row.original.trustedSetupsByProofSystem)
              .slice(1)
              .map(([key, ts]) => <TrustedSetupCell key={key} {...ts} />)
          },
        },
      }),
      columnHelper.display({
        id: 'verifiers',
        header: 'Verifiers',
        cell: (ctx) => {
          const first = Object.values(
            ctx.row.original.trustedSetupsByProofSystem,
          )[0]
          if (!first) return null
          return <VerifiedCountWithDetails data={first.verifiers} />
        },
        meta: {
          tooltip:
            'Shows the number of different versions of onchain verifiers and whether they were independently checked by regenerating them from the proving system’s source code. A green check indicates successful verification, while a red cross indicates a failure to regenerate.',
          additionalRows: (ctx) => {
            return Object.entries(ctx.row.original.trustedSetupsByProofSystem)
              .slice(1)
              .map(([key, ts]) => (
                <VerifiedCountWithDetails key={key} data={ts.verifiers} />
              ))
          },
        },
      }),
    ],
  }),
  columnHelper.display({
    id: 'tech-stack',
    header: 'Tech stack',
    cell: (ctx) => {
      return <TechStackCell techStack={ctx.row.original.techStack} />
    },
  }),
]
