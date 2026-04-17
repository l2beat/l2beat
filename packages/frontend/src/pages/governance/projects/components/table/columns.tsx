import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '~/components/badge/Badge'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TableValueCell } from '~/components/table/cells/TableValueCell'
import { getScalingCommonProjectColumns } from '~/components/table/common-project-columns/ScalingCommonProjectColumns'
import {
  adjustTableValue,
  sortTableValues,
} from '~/components/table/sorting/sortTableValues'
import type { GovernanceProjectEntry } from '~/server/features/governance/getGovernanceProjectsEntries'

const columnHelper = createColumnHelper<GovernanceProjectEntry>()

export const governanceProjectColumns = [
  ...getScalingCommonProjectColumns(
    columnHelper,
    (row) => `/scaling/projects/${row.slug}#permissions`,
  ),
  columnHelper.accessor((e) => securityRank(e.stage), {
    id: 'custody',
    header: 'Funds custody',
    meta: {
      tooltip:
        'Who holds the keys. Stage 1 or 2 projects are governed by a Council; all others fall to a single entity.',
    },
    cell: (ctx) => <CustodyCell stage={ctx.row.original.stage} />,
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  columnHelper.accessor((e) => e.multisig?.memberCount ?? -1, {
    id: 'txProcessing',
    header: 'Tx processing',
    meta: {
      tooltip:
        'Who processes transactions. For council-governed projects, the security council threshold (M/N). For single-entity projects, an operations team runs the sequencer.',
    },
    cell: (ctx) => (
      <TxProcessingCell
        stage={ctx.row.original.stage}
        multisig={ctx.row.original.multisig}
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
  }),
  columnHelper.accessor((e) => adjustTableValue(e.censorship), {
    id: 'censorship',
    header: 'Censorship\nguarantee',
    meta: {
      tooltip:
        'Can users still transact if the sequencer censors or goes offline? Derived from the Sequencer Failure risk dimension.',
    },
    cell: (ctx) => (
      <TableValueCell
        value={ctx.row.original.censorship}
        href={`/scaling/projects/${ctx.row.original.slug}#operator`}
      />
    ),
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) =>
      sortTableValues(a.original.censorship, b.original.censorship),
  }),
  columnHelper.accessor((e) => adjustTableValue(e.upgrade), {
    id: 'upgrade',
    header: 'Exit window',
    meta: {
      tooltip:
        'How much notice users have to withdraw before an unwanted upgrade takes effect on funds-holding contracts.',
    },
    cell: (ctx) => <UpgradeCell entry={ctx.row.original} />,
    sortDescFirst: true,
    sortUndefined: 'last',
    sortingFn: (a, b) => sortTableValues(a.original.upgrade, b.original.upgrade),
  }),
  columnHelper.display({
    id: 'privacy',
    header: 'Privacy',
    meta: {
      tooltip:
        'Whether transaction contents are private from third parties. Placeholder — no tracked project provides default privacy today.',
    },
    cell: () => <Badge type="gray">None</Badge>,
  }),
]

function isCouncilStage(stage: GovernanceProjectEntry['stage']): boolean {
  return stage === 'Stage 1' || stage === 'Stage 2'
}

function securityRank(stage: GovernanceProjectEntry['stage']): number {
  // Higher = more decentralized — lets sort put Councils on top.
  if (stage === 'Stage 2') return 2
  if (stage === 'Stage 1') return 1
  return 0
}

function CustodyCell({ stage }: { stage: GovernanceProjectEntry['stage'] }) {
  const widthClass =
    'inline-block min-w-[90px] rounded-full px-2 text-center'
  if (isCouncilStage(stage)) {
    return (
      <Badge
        type="brightYellow"
        className={`${widthClass} border border-[#D9AA1E] bg-[#FFC61B] text-yellow-900`}
      >
        Council
      </Badge>
    )
  }
  return (
    <Badge type="gray" className={widthClass}>
      Single entity
    </Badge>
  )
}

function TxProcessingCell({
  stage,
  multisig,
}: {
  stage: GovernanceProjectEntry['stage']
  multisig: GovernanceProjectEntry['multisig']
}) {
  const isCouncil = isCouncilStage(stage)

  let primary: string
  let secondary: string | undefined

  if (isCouncil) {
    if (!multisig) return <NoDataBadge />
    primary = multisig.threshold ?? `${multisig.memberCount} signers`
    secondary = multisig.breakdown
  } else {
    primary = 'Operations team'
    secondary = multisig?.threshold
  }

  const trigger = (
    <div className="flex flex-col">
      <span className="font-medium">{primary}</span>
      {secondary && (
        <span className="text-2xs text-secondary">{secondary}</span>
      )}
    </div>
  )

  // Single-entity rows without any discovered multisig don't need a tooltip.
  if (!multisig) return trigger

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile>{trigger}</TooltipTrigger>
      <TooltipContent>
        <div className="mb-1 font-medium">{multisig.name}</div>
        {multisig.members.length === 0 ? (
          <div className="text-2xs text-secondary">
            No signers discovered.
          </div>
        ) : (
          <ul className="flex list-none flex-col gap-0.5 text-2xs">
            {multisig.members.map((m) => (
              <li key={m.url + m.name}>
                <a
                  href={m.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {m.name}
                </a>
              </li>
            ))}
            {multisig.memberCount > multisig.members.length && (
              <li className="text-secondary">
                + {multisig.memberCount - multisig.members.length} more
              </li>
            )}
          </ul>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function UpgradeCell({ entry }: { entry: GovernanceProjectEntry }) {
  const base = (
    <TableValueCell
      value={entry.upgrade}
      href={`/scaling/projects/${entry.slug}#permissions`}
    />
  )
  if (entry.upgraders.length === 0) return base

  return (
    <Tooltip>
      <TooltipTrigger disabledOnMobile className="h-[inherit]">
        {base}
      </TooltipTrigger>
      <TooltipContent>
        <div className="mb-1 font-medium">Upgraders</div>
        <ul className="flex list-none flex-col gap-0.5 text-2xs">
          {entry.upgraders.map((actor) => (
            <li key={`${actor.name}|${actor.delay}`}>
              <span className="font-medium">{actor.name}</span>
              <span className="text-secondary"> — {actor.delay}</span>
              {actor.unreachable && (
                <span className="text-secondary"> (unreachable)</span>
              )}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
