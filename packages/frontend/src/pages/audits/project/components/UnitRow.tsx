import { formatInteger } from '@l2beat/shared-pure'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { AuditsUnitEntry } from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { AUDIT_STATUS_META } from '../../components/auditStatus'
import { UnitDetails } from './UnitDetails'

const KIND_LABEL: Record<AuditsUnitEntry['kind'], string> = {
  contract: 'contract',
  abstract: 'abstract',
  interface: 'interface',
  library: 'library',
  'file-level': 'file-level',
}

type View = 'source' | 'diff' | undefined

export function UnitRow({
  slug,
  unit,
}: {
  slug: string
  unit: AuditsUnitEntry
}) {
  const [view, setView] = useState<View>(undefined)
  const meta = AUDIT_STATUS_META[unit.status]
  const match = unit.match

  function toggle(next: Exclude<View, undefined>) {
    setView((prev) => (prev === next ? undefined : next))
  }

  return (
    <div className="border-divider border-t">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3 py-1.5 text-xs md:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.5fr)_250px]">
        <span className="text-secondary max-md:hidden">
          {KIND_LABEL[unit.kind]}
        </span>
        <span className="min-w-0 truncate font-medium">
          {unit.name}
          <span className="ml-1.5 text-secondary">
            {formatInteger(unit.lines)} lines
          </span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5 max-md:col-span-2">
          <span className={cn('size-2 shrink-0 rounded-sm', meta.bg)} />
          <span className="truncate">
            {meta.label}
            {match?.origin === 'library' && match.libraryName && (
              <span className="text-secondary"> · {match.libraryName}</span>
            )}
            {match?.renamed && (
              <span className="text-secondary"> · as {match.auditedName}</span>
            )}
            {unit.diffStats?.ignoredOnly && (
              <span className="text-secondary"> · ignored changes only</span>
            )}
            {match?.laterAuditedVersionExists && (
              <Tooltip>
                <TooltipTrigger className="ml-1 rounded border border-chart-stacked-yellow px-1 text-[10px] text-chart-stacked-yellow">
                  older revision
                </TooltipTrigger>
                <TooltipContent>
                  The deployed code equals an older audited revision; a later
                  audited revision exists ({match.totalVersions} audited
                  revisions in total).
                </TooltipContent>
              </Tooltip>
            )}
            {unit.warnings.map((w) => (
              <Tooltip key={w}>
                <TooltipTrigger className="ml-1 rounded border border-divider px-1 text-[10px] text-secondary">
                  {w}
                </TooltipTrigger>
                <TooltipContent>
                  {w === 'low-similarity'
                    ? 'The audited unit with this name is very different from the deployed one and may be unrelated.'
                    : 'The deployed unit and the audited unit have different kinds (e.g. contract vs interface).'}
                </TooltipContent>
              </Tooltip>
            ))}
          </span>
        </span>
        <span className="min-w-0 truncate text-secondary max-md:col-span-2">
          {match && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={match.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary hover:underline"
                >
                  {match.repository}/{match.path}{' '}
                  <span className="font-mono">@{match.commit.slice(0, 8)}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent className="max-w-[360px] space-y-1">
                <div className="font-medium">{match.reportTitle}</div>
                <div className="text-secondary">
                  {match.auditor}
                  {match.commitTimestamp &&
                    ` · commit ${match.commitTimestamp.slice(0, 10)}`}
                </div>
                <div>
                  Status: {match.auditStatus.replaceAll('_', ' ')}
                  {match.majorFindings > 0 &&
                    ` (${match.majorFindings} major findings)`}
                </div>
                <div>Review phase: {match.reviewPhase}</div>
                <div>Coverage: {match.coverage}</div>
                <div>
                  Matched by {match.matchedBy}, similarity{' '}
                  {Math.round(match.similarity * 100)}%
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="flex items-center justify-end gap-2 whitespace-nowrap">
          {unit.diffStats && (
            <Tooltip>
              <TooltipTrigger className="font-mono">
                <span className="text-positive">+{unit.diffStats.added}</span>{' '}
                <span className="text-negative">−{unit.diffStats.removed}</span>
                {unit.diffStats.ignoredAdded + unit.diffStats.ignoredRemoved >
                  0 && (
                  <span className="text-secondary">
                    {' '}
                    (+{unit.diffStats.ignoredAdded} −
                    {unit.diffStats.ignoredRemoved})
                  </span>
                )}
              </TooltipTrigger>
              <TooltipContent>
                Added and removed lines that count as differences. In
                parentheses: ignored changes (comments, require messages) that
                do not affect the status or the coverage.
              </TooltipContent>
            </Tooltip>
          )}
          <button
            type="button"
            aria-pressed={view === 'source'}
            onClick={() => toggle('source')}
            className={cn(
              'rounded border border-divider px-1.5 py-0.5',
              view === 'source' && 'bg-surface-secondary',
            )}
          >
            Source
          </button>
          {unit.diffStats && (
            <button
              type="button"
              aria-pressed={view === 'diff'}
              onClick={() => toggle('diff')}
              className={cn(
                'rounded border border-divider px-1.5 py-0.5',
                view === 'diff' && 'bg-surface-secondary',
              )}
            >
              Diff
            </button>
          )}
        </span>
      </div>
      {view && <UnitDetails slug={slug} unit={unit} view={view} />}
    </div>
  )
}
