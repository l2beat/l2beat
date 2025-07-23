import type { TrustedSetup } from '@l2beat/config'
import { createColumnHelper } from '@tanstack/react-table'
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
    cell: (ctx) => {
      return (
        <div className="font-bold text-base">
          {formatCurrency(ctx.row.original.tvs, 'usd')}
        </div>
      )
    },
    meta: {
      tooltip:
        'The values secured by the listed verifiers, calculated as a sum of the total value secured of all projects that use them.',
    },
  }),
  columnHelper.display({
    id: 'used-in',
    header: 'Used in',
    cell: (ctx) => {
      return <ProjectsUsedIn usedIn={ctx.row.original.projectsUsedIn} />
    },
  }),
  columnHelper.display({
    id: 'verifiers',
    header: 'Verifiers',
    cell: (ctx) => {
      return <VerifiedCountWithDetails {...ctx.row.original.verifiers} />
    },
    meta: {
      tooltip:
        'Shows the count of verifiers and their verification status - successful or unsuccessful, if verification was performed.',
    },
  }),
  columnHelper.display({
    id: 'attesters',
    header: 'Attesters',
    cell: (ctx) => {
      if (ctx.row.original.attesters.length === 0)
        return <span className="font-semibold text-xs leading-none">N/A</span>

      return (
        <div>
          {ctx.row.original.attesters.map((attester) => (
            <div key={attester.id} className="flex items-center gap-1.5">
              <img
                src={attester.icon}
                alt={attester.name}
                width={16}
                height={16}
              />
              <span className="font-semibold text-xs leading-none">
                {attester.name}
              </span>
            </div>
          ))}
        </div>
      )
    },
    meta: {
      tooltip: 'Shows the entities who have performed a verification.',
    },
  }),
  columnHelper.display({
    id: 'tech-stack',
    header: 'Tech stack',
    cell: (ctx) => {
      return <TechStackCell techStack={ctx.row.original.techStack} />
    },
  }),
  columnHelper.display({
    id: 'trusted-setups',
    header: 'Trusted setups',
    meta: {
      tooltip:
        'Shows the trusted setups used within the proving stack and their risks.',
    },
    cell: (ctx) => {
      return (
        <div className="flex h-full flex-col justify-around">
          {Object.entries(ctx.row.original.trustedSetups).map(
            ([proofSystemId, trustedSetups]) => {
              if (trustedSetups.length === 0) return null
              /** biome-ignore lint/style/noNonNullAssertion: it's there */
              const proofSystem = trustedSetups[0]!.proofSystem
              const worstRisk = pickWorstRisk(trustedSetups)
              return (
                <Tooltip key={proofSystemId}>
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
                    <p className="mb-3 text-paragraph-14">
                      Trusted setups for{' '}
                      <TechStackTag
                        tag={proofSystem}
                        className="inline-block"
                        withoutTooltip
                      />
                      :
                    </p>
                    {trustedSetups.map((trustedSetup) => {
                      return (
                        <div key={trustedSetup.id} className="flex gap-2">
                          <div
                            className={cn(
                              'size-5 shrink-0 rounded-full',
                              trustedSetup.risk === 'green' && 'bg-positive',
                              trustedSetup.risk === 'yellow' && 'bg-warning',
                              trustedSetup.risk === 'red' && 'bg-negative',
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
              )
            },
          )}
        </div>
      )
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
