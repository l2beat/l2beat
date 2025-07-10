import { createColumnHelper } from '@tanstack/react-table'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ZkCatalogEntry } from '../utils/getZkCatalogEntries'

const columnHelper = createColumnHelper<ZkCatalogEntry>()

export const zkCatalogColumns = [
  ...getCommonProjectColumns(columnHelper, () => undefined),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (ctx) => {
      return (
        <div className="space-y-px">
          <div className="font-bold text-base leading-none">
            {ctx.row.original.name}
          </div>
          {ctx.row.original.creator && (
            <div className="text-[13px] text-secondary leading-normal">
              {ctx.row.original.creator}
            </div>
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => row.tvs, {
    id: 'tvs',
    cell: (ctx) => {
      return (
        <div className="font-bold text-base">
          {formatCurrency(ctx.row.original.tvs, 'usd')}
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => row.projectsUsedIn, {
    id: 'used-in',
    header: 'Used in',
    cell: (ctx) => {
      return <ProjectsUsedIn usedIn={ctx.row.original.projectsUsedIn} />
    },
  }),
  columnHelper.accessor((row) => row.attesters, {
    id: 'attesters',
    cell: (ctx) => {
      return (
        <div>
          {ctx.row.original.attesters.map((attester) => (
            <div key={attester.id}>
              <span className="font-semibold text-xs leading-none">
                {attester.name}
              </span>
            </div>
          ))}
        </div>
      )
    },
  }),
  columnHelper.accessor((row) => row.trustedSetup, {
    id: 'trusted-setup',
    header: 'Trusted Setup',
    cell: (ctx) => {
      const { risk, shortDescription } = ctx.row.original.trustedSetup
      return (
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            <div
              className={cn(
                'size-6 rounded-full',
                risk === 'green' && 'bg-positive',
                risk === 'yellow' && 'bg-warning',
                risk === 'red' && 'bg-negative',
              )}
            />
            <InfoIcon className="size-[14px]" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm leading-normal">{shortDescription}</div>
          </TooltipContent>
        </Tooltip>
      )
    },
  }),
]
