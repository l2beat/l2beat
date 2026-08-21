import { formatCurrency } from '@l2beat/shared-pure'
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table'
import { NotApplicableBadge } from '~/components/badge/NotApplicableBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { BasicTable } from '~/components/table/BasicTable'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { TopNBadge } from '~/pages/interop/summary/components/TopNBadge'
import { TechStackTag } from '~/pages/zk-catalog/v2/components/TechStackTag'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import {
  CountWithAttesters,
  VERIFIER_STATUS_ORDER,
} from '~/pages/zk-catalog/v2/components/VerifiedCountWithDetails'
import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

interface Props {
  entries: ZkCatalogEntry[]
}

export function HomeTopZkProversCard({ entries }: Props) {
  const table = useTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  })

  return (
    <HomeCard className="flex h-full min-w-0 flex-col">
      <HomeCardHeader
        title="ZK Provers"
        badge={<TopNBadge n={5} />}
        href="/zk-catalog"
        linkLabel="View all"
      />
      <div className="mt-2 flex-1">
        <BasicTable table={table} compact />
      </div>
    </HomeCard>
  )
}

const columnHelper = createColumnHelper<ZkCatalogEntry>()

const [_index, ...commonColumns] = getCommonProjectColumns(
  columnHelper,
  (row) => `/zk-catalog/${row.slug}`,
)

const columns = [
  ...commonColumns,
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => {
      const project = {
        ...ctx.row.original,
        nameSecondLine: ctx.row.original.creator,
        quantumResistance: ctx.row.original.quantumResistant
          ? ('prover' as const)
          : undefined,
      }
      return (
        <div className="flex h-full items-center">
          <ProjectNameInfoTooltip project={project}>
            <TableLink href={`/zk-catalog/${ctx.row.original.slug}`}>
              <ProjectNameCell project={project} withInfoTooltip />
            </TableLink>
          </ProjectNameInfoTooltip>
        </div>
      )
    },
    meta: {
      cellClassName: 'lg:pl-2.5',
      headClassName: 'lg:pl-2.5',
    },
  }),
  columnHelper.display({
    id: 'trusted-setups',
    header: 'Trusted setups',
    cell: (ctx) => (
      <TrustedSetupsSummaryCell
        trustedSetupsByProofSystem={ctx.row.original.trustedSetupsByProofSystem}
      />
    ),
    meta: {
      tooltip:
        'Shows the trusted setups used within the proving stack and their risks.',
    },
  }),
  columnHelper.display({
    id: 'verification',
    header: 'Verification',
    cell: (ctx) => (
      <VerificationSummaryCell
        verifiers={Object.values(
          ctx.row.original.trustedSetupsByProofSystem,
        ).map((ts) => ts.verifiers)}
      />
    ),
    meta: {
      tooltip:
        'Shows the number of different versions of onchain verifiers and whether they were independently checked by regenerating them from the proving system’s source code. A green check indicates successful verification, while a red cross indicates a failure to regenerate.',
    },
  }),
  columnHelper.accessor((row) => row.tvs.value, {
    id: 'tvs',
    header: 'TVS',
    cell: (ctx) => (
      <span className="font-medium text-sm">
        {formatCurrency(ctx.getValue(), 'usd')}
      </span>
    ),
    meta: {
      align: 'right',
      tooltip:
        'The values secured by the listed verifiers, calculated as a sum of the total value secured of all projects that use them and are listed on L2BEAT.',
    },
  }),
]

const RISK_ORDER = ['red', 'yellow', 'green', 'N/A'] as const

function TrustedSetupsSummaryCell({
  trustedSetupsByProofSystem,
}: {
  trustedSetupsByProofSystem: ZkCatalogEntry['trustedSetupsByProofSystem']
}) {
  const groups = Object.entries(trustedSetupsByProofSystem).filter(
    ([, { trustedSetups }]) => trustedSetups.length > 0,
  )
  if (groups.length === 0) return null

  const risks = RISK_ORDER.filter((risk) =>
    groups.some(([, { trustedSetups }]) =>
      trustedSetups.some((ts) => ts.risk === risk),
    ),
  )

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-1.5">
        {risks.map((risk) => (
          <TrustedSetupRiskDot
            key={risk}
            risk={risk}
            size="sm"
            className="shrink-0"
          />
        ))}
      </TooltipTrigger>
      <TooltipContent className="flex max-w-[320px] flex-col gap-3">
        {groups.map(([key, { trustedSetups }]) => {
          const proofSystem = trustedSetups[0]?.proofSystem
          if (!proofSystem) return null
          return (
            <div key={key}>
              <div className="mb-3 text-paragraph-14">
                Trusted setup for{' '}
                {/* The cell shows one dot per risk color, not per proof system,
                    so the proof systems have to be named precisely to tell the
                    groups apart (e.g. Groth16: SP1 v6.0.0 vs SP1 v6.1.0). */}
                <TechStackTag
                  tag={proofSystem}
                  className="inline-block"
                  withoutTooltip
                  displayType="typeAndName"
                />
              </div>
              {trustedSetups.map((trustedSetup) => (
                <div key={trustedSetup.id} className="flex gap-2">
                  <TrustedSetupRiskDot
                    risk={trustedSetup.risk}
                    size="sm"
                    className="shrink-0"
                  />
                  <span className="text-xs leading-normal">
                    {trustedSetup.shortDescription}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </TooltipContent>
    </Tooltip>
  )
}

function VerificationSummaryCell({
  verifiers,
}: {
  verifiers: ZkCatalogEntry['trustedSetupsByProofSystem'][string]['verifiers'][]
}) {
  const counts = { successful: 0, notVerified: 0, unsuccessful: 0 }
  for (const verifier of verifiers) {
    for (const status of VERIFIER_STATUS_ORDER) {
      counts[status] += verifier[status]?.count ?? 0
    }
  }

  const totalCount =
    counts.successful + counts.notVerified + counts.unsuccessful
  if (totalCount === 0) {
    return <NotApplicableBadge />
  }

  return (
    <div className="flex items-center gap-3">
      {VERIFIER_STATUS_ORDER.filter((status) => counts[status] > 0).map(
        (status) => (
          <CountWithAttesters
            key={status}
            count={counts[status]}
            attesters={undefined}
            type={status}
          />
        ),
      )}
    </div>
  )
}
