import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChevronIcon } from '~/icons/Chevron'
import type {
  AuditReportOrigin,
  AuditsReportEntry,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'

const ORIGIN_ORDER: AuditReportOrigin[] = ['own', 'stack', 'library', 'other']

const ORIGIN_TITLE: Record<AuditReportOrigin, string> = {
  own: 'Project audits',
  stack: 'Stack audits',
  library: 'Audited standard libraries',
  other: 'Audits of other projects with identical or similar code',
}

export function AuditReportsList({
  reports,
  stackCollectionName,
}: {
  reports: AuditsReportEntry[]
  stackCollectionName?: string
}) {
  const [sharedOpen, setSharedOpen] = useState(false)
  const ownReports = reports.filter((r) => r.origin === 'own')
  const sharedReports = reports.filter((r) => r.origin !== 'own')
  return (
    <div className="flex flex-col gap-3">
      <p className="text-secondary text-xs">
        Every deployed unit is compared with every audited source in the
        dataset, whichever project or library it was audited for.
        {stackCollectionName && (
          <>
            {' '}
            Audits of{' '}
            <span className="font-medium text-primary">
              {stackCollectionName}
            </span>{' '}
            that matched deployed code count as the project's stack audits.
          </>
        )}
      </p>
      <ReportGroup
        title={ORIGIN_TITLE.own}
        reports={ownReports}
        showCollection={false}
        empty="No audit of this project is in the dataset."
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
            {sharedReports.length === 1 ? 'audit' : 'audits'} that matched
            deployed code (stack, standard libraries and other projects)
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
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-link hover:underline"
              >
                {report.title}
              </a>
              <span className="text-secondary">
                {report.auditor}
                {report.reportDate && ` · ${report.reportDate}`}
                {showCollection && ` · ${report.collectionName}`}
                {report.origin === 'own' &&
                  !report.matched &&
                  ' · no deployed unit matched'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
