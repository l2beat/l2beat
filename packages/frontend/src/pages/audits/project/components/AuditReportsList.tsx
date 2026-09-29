import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChevronIcon } from '~/icons/Chevron'
import type {
  AuditMatchOrigin,
  AuditsContextEntry,
  AuditsReportEntry,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'

const ORIGIN_ORDER: AuditMatchOrigin[] = [
  'own',
  'upstream',
  'stack',
  'library',
  'other',
]

const ORIGIN_TITLE: Record<AuditMatchOrigin, string> = {
  own: 'Project audits',
  upstream: 'Upstream audits (forked code)',
  stack: 'Stack and shared component audits',
  library: 'Audited standard libraries',
  other: 'Audits of other projects with identical or similar code',
}

export function AuditReportsList({
  reports,
  context,
}: {
  reports: AuditsReportEntry[]
  context: AuditsContextEntry[]
}) {
  const [sharedOpen, setSharedOpen] = useState(false)
  const ownReports = reports.filter((r) => r.origin === 'own')
  const sharedReports = reports.filter((r) => r.origin !== 'own')
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-lg">Audit reports used</h2>
      {context.length > 0 && (
        <p className="text-secondary text-xs">
          Evidence searched with priority:{' '}
          {context.map((c, i) => (
            <span key={c.collection}>
              {i > 0 && ', '}
              <span className="font-medium text-primary">
                {c.collectionName}
              </span>{' '}
              ({c.origin}, {c.relation})
            </span>
          ))}
          . Identical code is accepted from any collection in the dataset.
        </p>
      )}
      <ReportGroup
        title={ORIGIN_TITLE.own}
        reports={ownReports}
        showCollection={false}
        empty="No project audit matched a deployed unit."
      />
      {sharedReports.length > 0 && (
        <Collapsible open={sharedOpen} onOpenChange={setSharedOpen}>
          <CollapsibleTrigger className="flex items-center gap-1.5 font-medium text-secondary text-xs hover:text-primary">
            <ChevronIcon
              className={cn(
                'size-3 transition-transform',
                sharedOpen ? 'rotate-0' : '-rotate-90',
              )}
            />
            {sharedOpen ? 'Hide' : 'Show'} {sharedReports.length} other{' '}
            {sharedReports.length === 1 ? 'audit' : 'audits'} used as evidence
            (upstream code, stacks, standard libraries and other projects)
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-3 pt-3">
            {ORIGIN_ORDER.filter((origin) => origin !== 'own').map((origin) => {
              const group = reports.filter((r) => r.origin === origin)
              if (group.length === 0) return null
              return (
                <ReportGroup
                  key={origin}
                  title={ORIGIN_TITLE[origin]}
                  reports={group}
                  showCollection
                />
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

function ReportGroup({
  title,
  reports,
  showCollection,
  empty,
}: {
  title: string
  reports: AuditsReportEntry[]
  showCollection: boolean
  empty?: string
}) {
  return (
    <div>
      <h3 className="mb-1 font-medium text-secondary text-xs uppercase">
        {title}
      </h3>
      {reports.length === 0 ? (
        <p className="text-secondary text-sm">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {reports.map((report) => (
            <li key={report.id} className="flex flex-wrap gap-x-2 text-sm">
              {report.url ? (
                <a
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-link hover:underline"
                >
                  {report.title}
                </a>
              ) : (
                <span className="font-medium">{report.title}</span>
              )}
              <span className="text-secondary">
                {report.auditor}
                {report.reportDate && ` · ${report.reportDate}`}
                {showCollection && ` · ${report.collectionName}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
