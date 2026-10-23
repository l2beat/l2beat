import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { AuditsUnitEntry } from '~/server/features/audits/types'

/**
 * The units of a source that are identical to audited code, as a single
 * comma separated line. Each name links to the report that covers it; the
 * audited source and the other reports are in the tooltip.
 */
export function AuditedUnitsLine({ units }: { units: AuditsUnitEntry[] }) {
  if (units.length === 0) return null
  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 border-divider border-t bg-positive/5 px-3 py-1.5 text-xs">
      <span className="inline-flex shrink-0 items-center gap-1.5 font-medium text-secondary">
        <span className="size-2 shrink-0 rounded-sm bg-positive" />
        Audited ({units.length}):
      </span>
      <span className="min-w-0 text-secondary">
        {units.map((unit, i) => (
          <span key={unit.id}>
            {i > 0 && ', '}
            <AuditedUnitName unit={unit} />
          </span>
        ))}
      </span>
    </div>
  )
}

function AuditedUnitName({ unit }: { unit: AuditsUnitEntry }) {
  const match = unit.match
  if (!match) return <span>{unit.name}</span>
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={match.report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {unit.name}
        </a>
      </TooltipTrigger>
      <TooltipContent className="max-w-[360px] space-y-1">
        <div className="font-medium">
          {match.reports.length === 1
            ? 'Audited by'
            : `Audited by ${match.reports.length} reports`}
        </div>
        {match.reports.map((report) => (
          <div key={report.id}>
            {report.title}{' '}
            <span className="text-secondary">
              ({report.auditor}
              {report.origin !== 'own' && `, ${report.collectionName}`})
            </span>
          </div>
        ))}
        <div className="text-secondary">
          {unit.kind === 'interface' && 'Interface, not counted. '}
          {match.auditedName && `Audited as ${match.auditedName}. `}
          {match.repository}/{match.path}{' '}
          <span className="font-mono">@{match.commit.slice(0, 8)}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
