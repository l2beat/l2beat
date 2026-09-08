import type { AuditsReportEntry } from '~/server/features/audits/types'

export function AuditReportsList({
  reports,
}: {
  reports: AuditsReportEntry[]
}) {
  const own = reports.filter((r) => r.origin === 'project')
  const libs = reports.filter((r) => r.origin === 'library')
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-bold text-lg">Audit reports used</h2>
      <ReportGroup
        title="Project audits"
        reports={own}
        empty="No project audit matched a deployed unit."
      />
      {libs.length > 0 && (
        <ReportGroup title="Audited standard libraries" reports={libs} />
      )}
    </div>
  )
}

function ReportGroup({
  title,
  reports,
  empty,
}: {
  title: string
  reports: AuditsReportEntry[]
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
                {report.libraryName && ` · ${report.libraryName}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
