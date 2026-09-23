import { useQueryParam } from '~/hooks/useQueryParam'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import type { ChartRange } from '~/utils/range/range'
import {
  DEFAULT_PRIVACY_SUMMARY_VIEW,
  toPrivacySummaryView,
} from '../privacySummaryViews'
import { PrivacySummaryChartsSection } from './PrivacySummaryChartsSection'
import { PrivacySummaryGrid } from './PrivacySummaryGrid'
import { PrivacySummaryTabs } from './PrivacySummaryTabs'
import { PrivacyViewSwitch } from './PrivacyViewSwitch'

/** The view switch at the top, then the charts and the chosen layout. */
export function PrivacySummaryBody({
  entries,
  defaultChartRange,
}: {
  entries: PrivacySummaryEntry[]
  defaultChartRange: ChartRange
}) {
  const [rawView, setView] = useQueryParam(
    'view',
    DEFAULT_PRIVACY_SUMMARY_VIEW,
    { replaceState: true },
  )
  const view = toPrivacySummaryView(rawView)

  return (
    <>
      <div className="mb-4">
        <PrivacyViewSwitch view={view} onChange={setView} />
      </div>
      <PrivacySummaryChartsSection
        projects={entries
          .filter((e) => e.isTracked || e.hasTvl)
          .map((e) => ({ id: e.id, name: e.name, hasTvl: e.hasTvl }))}
        defaultRange={defaultChartRange}
      />
      {view === 'grid' ? (
        <PrivacySummaryGrid entries={entries} />
      ) : (
        <PrivacySummaryTabs entries={entries} view={view} />
      )}
    </>
  )
}
