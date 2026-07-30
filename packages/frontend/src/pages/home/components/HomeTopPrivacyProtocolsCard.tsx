import type { TrustedSetup } from '@l2beat/config'
import { createColumnHelper, getCoreRowModel } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectRiskTooltipContent } from '~/components/projects/ProjectRiskTooltipContent'
import { BasicTable } from '~/components/table/BasicTable'
import {
  ProjectNameCell,
  ProjectNameInfoTooltip,
} from '~/components/table/cells/ProjectNameCell'
import { getCommonProjectColumns } from '~/components/table/common-project-columns/CommonProjectColumns'
import { TableLink } from '~/components/table/TableLink'
import { useTable } from '~/hooks/useTable'
import { PrivacyWalkawayTestTooltipContent } from '~/pages/privacy/PrivacyWalkawayTestIcon'
import { PRIVACY_ASSESSMENT } from '~/pages/privacy/privacyAssessment'
import { sentimentToRiskDot } from '~/pages/privacy/sentimentToRiskDot'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

interface Props {
  entries: PrivacySummaryEntry[]
}

export function HomeTopPrivacyProtocolsCard({ entries }: Props) {
  const table = useTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
  })

  return (
    <HomeCard className="flex h-full min-w-0 flex-col">
      <HomeCardHeader title="Privacy" href="/privacy" linkLabel="View all" />
      <div className="mt-3 flex-1">
        <BasicTable table={table} />
      </div>
    </HomeCard>
  )
}

const columnHelper = createColumnHelper<PrivacySummaryEntry>()

const [_index, ...commonColumns] = getCommonProjectColumns(
  columnHelper,
  (row) => row.href,
)

const columns = [
  ...commonColumns,
  columnHelper.accessor('name', {
    header: 'Name',
    enableHiding: false,
    cell: (ctx) => {
      const project = {
        name: ctx.row.original.name,
        shortName: ctx.row.original.shortName,
        slug: ctx.row.original.slug,
        icon: ctx.row.original.icon,
        backgroundColor: undefined,
        description: ctx.row.original.description,
        quantumResistance: ctx.row.original.quantumResistant
          ? 'privacy'
          : undefined,
        statuses: {
          underReview: ctx.row.original.isUnderReview ? 'config' : undefined,
        },
      } as const

      return (
        <div className="flex h-full items-center">
          <ProjectNameInfoTooltip project={project}>
            <TableLink href={ctx.row.original.href}>
              <ProjectNameCell project={project} withInfoTooltip />
            </TableLink>
          </ProjectNameInfoTooltip>
        </div>
      )
    },
    meta: {
      cellClassName: 'lg:pl-2.5',
    },
  }),
  columnHelper.display({
    id: 'properties',
    header: 'Properties',
    cell: (ctx) => <PropertiesCell entry={ctx.row.original} />,
    meta: {
      align: 'center',
      tooltip:
        'Key properties of the protocol: trusted setup, exit window, privacy, and reproducibility. Hover over each dot for details.',
    },
  }),
  columnHelper.accessor('totalValueLockedUsd', {
    header: 'TVL',
    cell: (ctx) => {
      const value = ctx.getValue()
      if (value === undefined) {
        return <NoDataBadge />
      }
      return (
        <span className="font-medium text-sm">
          {formatCurrency(value, 'usd')}
        </span>
      )
    },
    meta: {
      align: 'right',
      tooltip:
        'Total USD value currently held across all tracked assets for the protocol.',
    },
  }),
]

function PropertiesCell({ entry }: { entry: PrivacySummaryEntry }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <PropertyDot label="Setup" risk={entry.trustedSetup.risk}>
        <TrustedSetupTooltipContent trustedSetup={entry.trustedSetup} />
      </PropertyDot>
      <PropertyDot
        label="Exit window"
        risk={sentimentToRiskDot(entry.exitWindow.sentiment)}
      >
        <ProjectRiskTooltipContent risk={entry.exitWindow} variant="table" />
        <PrivacyWalkawayTestTooltipContent
          walkawayTest={entry.exitWindow.walkawayTest}
        />
      </PropertyDot>
      <PropertyDot
        label={PRIVACY_ASSESSMENT.title}
        risk={sentimentToRiskDot(entry.privacy.sentiment)}
      >
        <ProjectRiskTooltipContent risk={entry.privacy} variant="table" />
      </PropertyDot>
      <PropertyDot
        label="Reproducibility"
        risk={sentimentToRiskDot(entry.reproducibility.sentiment)}
      >
        <ProjectRiskTooltipContent
          risk={entry.reproducibility}
          variant="table"
        />
      </PropertyDot>
    </div>
  )
}

function PropertyDot({
  label,
  risk,
  children,
}: {
  label: string
  risk: TrustedSetup['risk']
  children: ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger aria-label={label}>
        <TrustedSetupRiskDot risk={risk} size="sm" className="shrink-0" />
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <div className="mb-2 font-bold text-label-value-14">{label}</div>
        {children}
      </TooltipContent>
    </Tooltip>
  )
}

function TrustedSetupTooltipContent({
  trustedSetup,
}: {
  trustedSetup: TrustedSetup
}) {
  return (
    <div className="space-y-2">
      <div className="font-medium text-sm">{trustedSetup.name}</div>
      <p className="text-xs leading-normal">{trustedSetup.shortDescription}</p>
    </div>
  )
}
