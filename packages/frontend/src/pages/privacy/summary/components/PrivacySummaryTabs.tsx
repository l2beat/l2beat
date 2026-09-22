import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { TabInfoWithDrawer } from '~/components/TabInfoWithDrawer'
import type { PrivacySummaryEntry } from '~/server/features/privacy/getPrivacySummaryEntries'
import {
  groupByPrivacyType,
  PRIVACY_TYPES,
  type PrivacySummaryView,
} from '../privacySummaryViews'
import { PrivacySummaryCards } from './PrivacySummaryCards'
import { PrivacySummaryTable } from './PrivacySummaryTable'

/** V2-V5: a tab per kind of privacy, holding a table or cards. */
export function PrivacySummaryTabs({
  entries,
  view,
}: {
  entries: PrivacySummaryEntry[]
  view: Exclude<PrivacySummaryView, 'grid'>
}) {
  const groups = groupByPrivacyType(entries)

  return (
    <DirectoryTabs defaultValue={PRIVACY_TYPES[0].field} className="mt-4">
      <DirectoryTabsList>
        {groups.map((group) => (
          <DirectoryTabsTrigger key={group.field} value={group.field}>
            {group.label} <CountBadge>{group.entries.length}</CountBadge>
          </DirectoryTabsTrigger>
        ))}
      </DirectoryTabsList>
      {groups.map((group) => (
        <DirectoryTabsContent key={group.field} value={group.field}>
          <TabInfoWithDrawer title={group.title} content={group.description} />
          {view === 'cards' ? (
            <PrivacySummaryCards
              entries={group.entries}
              hiddenColumns={group.hiddenColumns}
            />
          ) : (
            <PrivacySummaryTable
              view={view}
              entries={group.entries}
              hiddenColumns={group.hiddenColumns}
            />
          )}
        </DirectoryTabsContent>
      ))}
    </DirectoryTabs>
  )
}
