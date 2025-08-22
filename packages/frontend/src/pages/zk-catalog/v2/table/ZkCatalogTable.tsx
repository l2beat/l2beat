import type { TrustedSetup } from '@l2beat/config'
import {
  getCoreRowModel,
  getSortedRowModel,
  type Row,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { TableCell, TableRow } from '~/components/table/Table'
import { useTable } from '~/hooks/useTable'
import type { ZkCatalogEntry } from '../../../../server/features/zk-catalog/getZkCatalogEntries'
import { TechStackTag } from '../components/TechStackTag'
import { TrustedSetupRiskDot } from '../components/TrustedSetupRiskDot'
import { VerifiedCountWithDetails } from '../components/VerifiedCountWithDetails'
import { BasicZkCatalogTable } from './BasicZkCatalogTable'
import { zkCatalogColumns } from './Columns'

export function ZkCatalogTable({ entries }: { entries: ZkCatalogEntry[] }) {
  const filterEntries = useFilterEntries()

  const filteredEntries = useMemo(
    () => entries.filter(filterEntries),
    [entries, filterEntries],
  )

  const table = useTable({
    columns: zkCatalogColumns,
    data: filteredEntries,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      columnPinning: {
        left: ['#', 'logo'],
      },
      sorting: [
        {
          id: 'tvs',
          desc: true,
        },
      ],
    },
  })

  const renderSpanFill = ({ row }: { row: Row<ZkCatalogEntry> }) => {
    const remainingTrustedSetups = Object.values(
      row.original.trustedSetups,
    ).slice(1)

    if (remainingTrustedSetups.length === 0) {
      return null
    }
    return (
      <>
        {remainingTrustedSetups.map((ts) => (
          <TableRow key={ts.trustedSetup[0]?.id} slug={row.original.id}>
            <TrustedSetupCells trustedSetups={ts} />
          </TableRow>
        ))}
      </>
    )
  }

  const renderInlineSpanFill = ({ row }: { row: Row<ZkCatalogEntry> }) => {
    const firstTrustedSetup = Object.values(row.original.trustedSetups)[0]
    if (!firstTrustedSetup) {
      return null
    }

    return <TrustedSetupCells trustedSetups={firstTrustedSetup} />
  }

  return (
    <PrimaryCard className="mt-1 max-md:mt-4">
      <BasicZkCatalogTable
        table={table}
        renderSpanFill={renderSpanFill}
        renderInlineSpanFill={renderInlineSpanFill}
      />
    </PrimaryCard>
  )
}

function TrustedSetupCells({
  trustedSetups,
}: {
  trustedSetups: ZkCatalogEntry['trustedSetups'][string]
}) {
  const proofSystem = trustedSetups.trustedSetup[0]?.proofSystem
  if (trustedSetups.trustedSetup.length === 0 || !proofSystem) return null

  const worstRisk = pickWorstRisk(trustedSetups.trustedSetup)
  return (
    <>
      <TableCell className="px-6 pt-4 pb-3 first:pt-3 first:pb-4 first:pl-6">
        <div className="flex flex-col items-start gap-2">
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2">
              {worstRisk === 'N/A' ? (
                <span className="text-2xl leading-none">🤩</span>
              ) : (
                <TrustedSetupRiskDot risk={worstRisk} size="md" />
              )}
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
              </div>
              {trustedSetups.trustedSetup.map((trustedSetup, i) => {
                return (
                  <div key={trustedSetup.id} className="flex gap-2">
                    {trustedSetup.risk === 'N/A' ? (
                      <div className="mt-px text-lg leading-none">🤩</div>
                    ) : (
                      <TrustedSetupRiskDot
                        risk={trustedSetup.risk}
                        size="sm"
                        className="shrink-0"
                      />
                    )}
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
            <ProjectsUsedIn
              noL2ClassName="text-label-value-12 font-medium text-secondary"
              usedIn={trustedSetups.projectsUsedIn}
            />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <VerifiedCountWithDetails data={trustedSetups.verifiers} />
      </TableCell>
    </>
  )
}

function pickWorstRisk(trustedSetups: TrustedSetup[]): TrustedSetup['risk'] {
  const riskHierarchy = ['red', 'yellow', 'green', 'N/A'] as const

  for (const risk of riskHierarchy) {
    if (trustedSetups.some((ts) => ts.risk === risk)) {
      return risk
    }
  }
  return 'N/A'
}
