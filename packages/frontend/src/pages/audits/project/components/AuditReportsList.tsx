import { useState } from 'react'
import { reportDisplayTitle } from '~/components/audits/reportDisplayTitle'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { ChevronIcon } from '~/icons/Chevron'
import { CustomLinkIcon } from '~/icons/Outlink'
import type {
  AuditReportOrigin,
  AuditsReportEntry,
  AuditsReportScope,
  AuditsScopeShare,
} from '~/server/features/audits/types'
import { cn } from '~/utils/cn'
import { AuditScopeGraph } from './AuditScopeGraph'

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
  scope,
}: {
  reports: AuditsReportEntry[]
  stackCollectionName?: string
  /** Scope graphs of the project's own reports, by report id. */
  scope?: Record<string, AuditsReportScope>
}) {
  const [sharedOpen, setSharedOpen] = useState(false)
  const ownReports = reports.filter((r) => r.origin === 'own')
  const sharedReports = reports.filter((r) => r.origin !== 'own')
  return (
    <div className="flex flex-col gap-3">
      {scope ? (
        <ScopedReports reports={ownReports} scope={scope} />
      ) : (
        <>
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
        </>
      )}
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

const NO_GRAPH_REASON: Record<
  Exclude<AuditsReportScope['status'], 'graph'>,
  string
> = {
  partial: 'No dependency graph: the report reviews fixes or a diff only.',
  unpinned: 'No dependency graph: the report is not pinned to a commit.',
  unreviewed:
    'No dependency graph yet: its scope statements have not been reviewed.',
  'no-solidity': 'No dependency graph: no Solidity in scope.',
}

/**
 * The project's own reports. A report with a dependency graph is one row to
 * click: it opens the graph of what the report names and what that code
 * depends on. Reports that are evidence for deployed code come first.
 */
function ScopedReports({
  reports,
  scope,
}: {
  reports: AuditsReportEntry[]
  scope: Record<string, AuditsReportScope>
}) {
  const ordered = reports.toSorted(
    (a, b) => Number(b.matched) - Number(a.matched),
  )
  const [open, setOpen] = useState<string>()
  if (ordered.length === 0) {
    return (
      <p className="text-secondary text-sm">
        No audit of this project is in the dataset.
      </p>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-secondary text-sm">
        Audit reports rarely list every file their audited code depends on, so
        for the rest we can only guess what was reviewed.
      </p>
      <ul className="flex flex-col divide-y divide-divider border-divider border-y">
        {ordered.map((report) => {
          const reportScope = scope[report.id]
          const graph =
            reportScope?.status === 'graph'
              ? reportScope.snapshots.at(-1)
              : undefined
          const hasGraph = graph !== undefined
          const isOpen = hasGraph && open === report.id
          const panelId = `scope-${report.id}`
          const title = reportDisplayTitle(report.title, report.auditor)
          return (
            <li key={report.id}>
              <div
                className={cn(
                  'group relative flex flex-wrap items-center gap-x-5 gap-y-2 px-2 py-2.5',
                  hasGraph && 'hover:bg-surface-secondary',
                  isOpen && 'bg-surface-secondary',
                )}
              >
                {hasGraph && (
                  // Stretched over the row, so the whole entry opens the graph
                  // while the report link stays a link of its own.
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    aria-label={`${isOpen ? 'Close' : 'Open'} the dependency graph of ${title}`}
                    onClick={() => setOpen(isOpen ? undefined : report.id)}
                    className="absolute inset-0 rounded focus-visible:outline-2 focus-visible:outline-brand/50"
                  />
                )}
                <div className="min-w-0 flex-1 basis-64">
                  <div
                    className={cn(
                      'font-bold text-sm',
                      !hasGraph && 'text-secondary',
                    )}
                  >
                    {title}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-secondary text-xs">
                    <span>
                      {report.auditor}
                      {report.reportDate && ` · ${report.reportDate}`}
                    </span>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center gap-1 text-link underline"
                    >
                      Report
                      <CustomLinkIcon className="size-3 fill-current" />
                    </a>
                    {!report.matched && <span>No deployed unit matched</span>}
                  </div>
                  {!hasGraph && (
                    <div className="mt-0.5 text-secondary text-xs">
                      {reportScope && reportScope.status !== 'graph'
                        ? NO_GRAPH_REASON[reportScope.status]
                        : 'No dependency graph.'}
                    </div>
                  )}
                </div>
                {graph && (
                  <>
                    <ExplicitnessMeter share={graph.explicitness.own} />
                    <GraphCue isOpen={isOpen} />
                  </>
                )}
              </div>
              {isOpen && reportScope && (
                <div id={panelId} className="px-2 pt-1 pb-3">
                  <ReportScopePanel scope={reportScope} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const METER_CELLS = 10

/**
 * How much of the project's own code in its dependency graph the report
 * names, as ten cells shaped like the graph's units: teal for named, orange
 * for not mentioned.
 */
function ExplicitnessMeter({ share }: { share: AuditsScopeShare }) {
  const ratio = share.total === 0 ? 1 : share.named / share.total
  // Never all teal unless every unit is named, and never empty unless none is.
  const filled =
    ratio === 1
      ? METER_CELLS
      : ratio === 0
        ? 0
        : Math.min(
            METER_CELLS - 1,
            Math.max(1, Math.round(ratio * METER_CELLS)),
          )
  return (
    <div className="flex w-[196px] shrink-0 items-center gap-2.5">
      <div className="flex gap-[3px]" aria-hidden>
        {Array.from({ length: METER_CELLS }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-3.5 w-[7px] rounded-[2px] border',
              i < filled
                ? 'border-scope-named bg-scope-named'
                : 'border-not-counted/60 bg-not-counted/20',
            )}
          />
        ))}
      </div>
      <span className="whitespace-nowrap text-secondary text-xs">
        <span className="font-bold text-primary text-sm">
          {Math.round(100 * ratio)}%
        </span>{' '}
        explicit
      </span>
    </div>
  )
}

/** The invitation on the right of a row: its units and arrows wake up on hover. */
function GraphCue({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-full border py-1 pr-2.5 pl-2 font-medium text-xs transition-colors',
        isOpen
          ? 'border-brand bg-surface-primary text-primary'
          : 'border-divider bg-surface-primary text-secondary group-hover:border-brand group-hover:text-primary',
      )}
    >
      <svg
        width="26"
        height="18"
        viewBox="0 0 26 18"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M8 4.5h3.5c2 0 2 4.5 4 4.5H18M8 4.5h3.5c2 0 2 9 4 9H18"
          strokeWidth="1.2"
          className={cn(
            'transition-colors',
            isOpen
              ? 'stroke-brand'
              : 'stroke-secondary/60 group-hover:stroke-brand',
          )}
        />
        <rect
          x="1"
          y="2"
          width="7"
          height="5"
          rx="1.5"
          className="fill-scope-named"
        />
        <rect
          x="18"
          y="6.5"
          width="7"
          height="5"
          rx="1.5"
          className="fill-not-counted transition-transform group-hover:translate-x-px"
        />
        <rect
          x="18"
          y="12"
          width="7"
          height="5"
          rx="1.5"
          className="fill-scope-external transition-transform group-hover:translate-x-px"
        />
      </svg>
      {isOpen ? 'Fold the map' : 'Map its dependencies'}
      <ChevronIcon
        className={cn(
          'size-2.5 transition-transform',
          isOpen ? 'rotate-180' : 'rotate-0',
        )}
      />
    </span>
  )
}

function ReportScopePanel({ scope }: { scope: AuditsReportScope }) {
  const [index, setIndex] = useState(scope.snapshots.length - 1)
  const snapshot = scope.snapshots[index]
  if (!snapshot) return null
  return (
    <div className="flex flex-col gap-2">
      {scope.snapshots.length > 1 && (
        <div className="flex flex-wrap items-center gap-1.5 text-secondary text-xs">
          Audited commits
          {scope.snapshots.map((s, i) => (
            <button
              key={`${s.repository}@${s.commit}`}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                'rounded border px-1.5 py-0.5',
                i === index
                  ? 'border-brand bg-surface-primary text-primary'
                  : 'border-divider hover:text-primary',
              )}
            >
              {s.commit.slice(0, 8)}
            </button>
          ))}
        </div>
      )}
      <p className="text-secondary text-xs">
        <ScopeStatement scope={scope} snapshot={snapshot} /> Code at{' '}
        <a
          href={snapshot.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline"
        >
          {snapshot.repository}@{snapshot.commit.slice(0, 8)}
        </a>
        .
      </p>
      <AuditScopeGraph
        key={`${snapshot.repository}@${snapshot.commit}`}
        snapshot={snapshot}
      />
    </div>
  )
}

/** In full what the row's percentage sums up. */
function ScopeStatement({
  scope,
  snapshot,
}: {
  scope: AuditsReportScope
  snapshot: AuditsReportScope['snapshots'][number]
}) {
  const { own, external } = snapshot.explicitness
  const outOfScope = snapshot.nodes.filter(
    (node) => !node.external && node.state === 'excluded',
  ).length
  const silent = own.total - own.named + (external.total - external.named)
  return (
    <>
      The audited code and what it depends on come to{' '}
      <Strong>{units(own.total)}</Strong> of the project's own code. The report
      names <Strong>{own.named}</Strong> of them
      {outOfScope > 0 &&
        (outOfScope === own.named
          ? ', all as out of scope'
          : `, ${outOfScope} only to say ${outOfScope === 1 ? 'it is' : 'they are'} out of scope`)}
      {external.total > 0 ? (
        <>
          , and <Strong>{external.named}</Strong> of the{' '}
          <Strong>{units(external.total)}</Strong> from external dependencies.
        </>
      ) : (
        '. The code has no external dependencies.'
      )}{' '}
      {scope.unlisted === 'excluded'
        ? 'It states that code it does not list is out of scope.'
        : silent > 0
          ? `It says nothing about the other ${silent}, so whether they were reviewed is a guess.`
          : ''}
    </>
  )
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-primary">{children}</span>
}

function units(count: number): string {
  return `${count} ${count === 1 ? 'unit' : 'units'}`
}
