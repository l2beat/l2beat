import type { TrustedSetup } from '@l2beat/config'
import { createColumnHelper } from '@tanstack/react-table'
import { useId } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { getCommonProjectColumns } from '~/components/table/utils/common-project-columns/CommonProjectColumns'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ZkCatalogEntry } from '../../../../server/features/zk-catalog/getZkCatalogEntries'
import { TechStackCell } from '../components/TechStackCell'
import { TechStackTag } from '../components/TechStackTag'
import { VerifiedCountWithDetails } from '../components/VerifiedCountWithDetails'

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
            <div className="font-medium text-[13px] text-secondary leading-normal">
              {ctx.row.original.creator}
            </div>
          )}
        </div>
      )
    },
  }),
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
  columnHelper.group({
    id: 'trusted-setup-group',
    columns: [
      columnHelper.display({
        id: 'trusted-setups',
        header: 'Trusted setups',
        meta: {
          tooltip:
            'Shows the trusted setups used within the proving stack and their risks.',
          cellClassName: 'py-4 pl-6',
        },
        cell: (ctx) => {
          return (
            <div className="flex h-full flex-col justify-around space-y-3">
              {Object.entries(ctx.row.original.trustedSetups).map(
                ([proofSystemId, trustedSetups]) => {
                  const id = useId()
                  if (trustedSetups.trustedSetup.length === 0) return null
                  /** biome-ignore lint/style/noNonNullAssertion: it's there */
                  const proofSystem = trustedSetups.trustedSetup[0]!.proofSystem
                  const worstRisk = pickWorstRisk(trustedSetups.trustedSetup)
                  return (
                    <div key={id} className="flex flex-col gap-2">
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2">
                          <div
                            className={cn(
                              'size-6 rounded-full',
                              worstRisk === 'green' && 'bg-positive',
                              worstRisk === 'yellow' && 'bg-warning',
                              worstRisk === 'red' && 'bg-negative',
                            )}
                          />
                          <TechStackTag tag={proofSystem} withoutTooltip />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="mb-3 text-paragraph-14">
                            Trusted setups for{' '}
                            <TechStackTag
                              tag={proofSystem}
                              className="inline-block"
                              withoutTooltip
                            />
                            :
                          </div>
                          {trustedSetups.trustedSetup.map((trustedSetup, i) => {
                            return (
                              <div key={trustedSetup.id} className="flex gap-2">
                                <div
                                  className={cn(
                                    'size-5 shrink-0 rounded-full',
                                    trustedSetup.risk === 'green' &&
                                      'bg-positive',
                                    trustedSetup.risk === 'yellow' &&
                                      'bg-warning',
                                    trustedSetup.risk === 'red' &&
                                      'bg-negative',
                                  )}
                                />
                                <span className="text-xs leading-normal">
                                  {trustedSetup.shortDescription}
                                </span>
                              </div>
                            )
                          })}
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-label-value-12 text-secondary">
                          Used in
                        </p>
                        <ProjectsUsedIn usedIn={trustedSetups.projectsUsedIn} />
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          )
        },
      }),
      columnHelper.display({
        id: 'verifiers',
        header: 'Verifiers',
        cell: (ctx) => {
          return (
            <div className="flex h-full flex-col justify-around">
              {Object.entries(ctx.row.original.trustedSetups).map(
                ([proofSystemId, trustedSetups]) => (
                  <VerifiedCountWithDetails
                    key={proofSystemId}
                    successfulCount={trustedSetups.verifiers.successfulCount}
                    unsuccessfulCount={
                      trustedSetups.verifiers.unsuccessfulCount
                    }
                    notVerifiedCount={trustedSetups.verifiers.notVerifiedCount}
                  />
                ),
              )}
            </div>
          )
        },
        meta: {
          tooltip:
            'Shows the count of verifiers and their verification status - successful or unsuccessful, if verification was performed.',
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
function pickWorstRisk(trustedSetups: TrustedSetup[]) {
  return trustedSetups.reduce<'green' | 'yellow' | 'red'>(
    (acc, trustedSetup) => {
      if (acc === 'red') return acc
      if (trustedSetup.risk === 'red') return 'red'
      if (acc === 'yellow') return acc
      if (trustedSetup.risk === 'yellow') return 'yellow'
      return 'green'
    },
    'green',
  )
}
