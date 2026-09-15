import type {
  AuditMatchOrigin,
  AuditsContextEntry,
  AuditsReportEntry,
} from '~/server/features/audits/types'

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
      {ORIGIN_ORDER.map((origin) => {
        const group = reports.filter((r) => r.origin === origin)
        if (group.length === 0 && origin !== 'own') return null
        return (
          <ReportGroup
            key={origin}
            title={ORIGIN_TITLE[origin]}
            reports={group}
            showCollection={origin !== 'own'}
            empty="No project audit matched a deployed unit."
          />
        )
      })}
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
