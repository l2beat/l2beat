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
import { cn } from '~/utils/cn'
import type { ZkCatalogEntry } from '../../../../server/features/zk-catalog/getZkCatalogEntries'
import { TechStackTag } from '../components/TechStackTag'
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
          <TableRow key={ts.trustedSetup[0]?.id} slug={undefined}>
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
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-label-value-12 text-secondary">
              Used in
            </p>
            <ProjectsUsedIn usedIn={trustedSetups.projectsUsedIn} />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <VerifiedCountWithDetails
          successfulCount={trustedSetups.verifiers.successfulCount}
          unsuccessfulCount={trustedSetups.verifiers.unsuccessfulCount}
          notVerifiedCount={trustedSetups.verifiers.notVerifiedCount}
        />
      </TableCell>
    </>
  )
}

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
