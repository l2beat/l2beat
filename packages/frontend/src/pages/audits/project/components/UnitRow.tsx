import { formatInteger } from '@l2beat/shared-pure'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { AuditsUnitEntry } from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import {
  AUDIT_STATUS_META,
  formatFindingIds,
  hasUnresolvedMajorFinding,
  MAJOR_FINDING_DESCRIPTION,
} from '../../components/auditStatus'
import { UnitDetails } from './UnitDetails'

const KIND_LABEL: Record<AuditsUnitEntry['kind'], string> = {
  contract: 'contract',
  abstract: 'abstract',
  interface: 'interface',
  library: 'library',
  'file-level': 'file-level',
  program: 'program',
}

type View = 'source' | 'diff' | undefined

const ACTION_BUTTON =
  'inline-flex w-[76px] shrink-0 items-center justify-center rounded border px-1.5 py-0.5 text-2xs leading-4'

function DisabledAction({ label, reason }: { label: string; reason: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-disabled
          className={cn(
            ACTION_BUTTON,
            'cursor-default border-divider border-dashed text-secondary opacity-50',
          )}
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  )
}

export function UnitRow({
  unit,
  hideIgnoredChanges,
}: {
  unit: AuditsUnitEntry
  hideIgnoredChanges: boolean
}) {
  const [view, setView] = useState<View>(undefined)
  const meta = AUDIT_STATUS_META[unit.status]
  const match = unit.match
  const majorFinding = hasUnresolvedMajorFinding(unit)

  function toggle(next: Exclude<View, undefined>) {
    setView((prev) => (prev === next ? undefined : next))
  }

  return (
    <div
      className={cn(
        'border-divider border-t',
        majorFinding && 'border-l-2 border-l-negative bg-negative/5',
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-3 py-1.5 text-xs md:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.5fr)_176px_240px]">
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
          <span
            className={cn(
              'size-2 shrink-0 rounded-sm',
              majorFinding ? 'bg-negative' : meta.bg,
            )}
          />
          <span className="truncate">
            {majorFinding ? (
              <Tooltip>
                <TooltipTrigger className="font-medium text-negative">
                  {meta.label} with major finding
                </TooltipTrigger>
                <TooltipContent className="max-w-[360px]">
                  {MAJOR_FINDING_DESCRIPTION}
                  {match && (
                    <div className="mt-1 text-secondary">
                      {match.majorFindings} major{' '}
                      {match.majorFindings === 1 ? 'finding' : 'findings'}
                      {formatFindingIds(match.findingIds)} in{' '}
                      {match.reportTitle} ({match.auditor}).
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              meta.label
            )}
            {majorFinding &&
              match?.findingIds?.map((id) => (
                <span
                  key={id}
                  className="ml-1 rounded border border-negative px-1 font-mono text-[10px] text-negative"
                >
                  {id}
                </span>
              ))}
            {match && match.origin !== 'own' && (
              <Tooltip>
                <TooltipTrigger className="text-secondary">
                  {' '}
                  · {match.collectionName}
                </TooltipTrigger>
                <TooltipContent>
                  Evidence from the {match.origin} collection{' '}
                  {match.collectionName} ({match.relation}).
                </TooltipContent>
              </Tooltip>
            )}
            {match?.renamed && (
              <span className="text-secondary"> · as {match.auditedName}</span>
            )}
            {unit.diffStats?.ignoredOnly && (
              <span className="text-secondary"> · ignored changes only</span>
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
                <div className="font-medium">Matched audit</div>
                <div className="font-medium">{match.reportTitle}</div>
                <div className="text-secondary">
                  {match.auditor} · commit {match.commit.slice(0, 8)}
                </div>
                <div>
                  Matched by {match.matchedBy}, similarity{' '}
                  {Math.round(match.similarity * 100)}%
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </span>
        <span className="justify-self-end whitespace-nowrap font-mono">
          {unit.diffStats && (
            <Tooltip>
              <TooltipTrigger>
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
        </span>
        <span className="flex items-center justify-end gap-1.5 whitespace-nowrap max-md:col-span-2">
          {match?.reportUrl ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={match.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    ACTION_BUTTON,
                    majorFinding
                      ? 'border-negative text-negative'
                      : 'border-divider',
                  )}
                >
                  Audit
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Open the audit report that covered the matched audited revision:{' '}
                {match.reportTitle}
                {majorFinding &&
                  match.findingIds &&
                  match.findingIds.length > 0 &&
                  `. Search it for ${match.findingIds.join(', ')}.`}
              </TooltipContent>
            </Tooltip>
          ) : (
            <DisabledAction label="Audit" reason="No audited source matched." />
          )}
          <button
            type="button"
            aria-pressed={view === 'source'}
            onClick={() => toggle('source')}
            className={cn(
              ACTION_BUTTON,
              'border-divider',
              view === 'source' && 'bg-surface-secondary',
            )}
          >
            Deployed
          </button>
          {unit.diffStats ? (
            <button
              type="button"
              aria-pressed={view === 'diff'}
              onClick={() => toggle('diff')}
              className={cn(
                ACTION_BUTTON,
                'border-divider',
                view === 'diff' && 'bg-surface-secondary',
              )}
            >
              Diff
            </button>
          ) : (
            <DisabledAction
              label="Diff"
              reason={
                match
                  ? 'The deployed unit is identical to the audited one.'
                  : 'No audited source to compare with.'
              }
            />
          )}
        </span>
      </div>
      {view && (
        <UnitDetails
          unit={unit}
          view={view}
          hideIgnoredChanges={hideIgnoredChanges}
        />
      )}
    </div>
  )
}
