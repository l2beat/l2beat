'use client'
import { CountBadge } from '~/components/badge/count-badge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/directory-tabs'
import { MainPageCard } from '~/components/main-page-card'
import { type ScalingRiskEntry } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import { type RecategorisedScalingEntry } from '~/utils/group-by-main-categories'
import { useScalingFilter } from '../../_components/scaling-filter-context'
import { ScalingFilters } from '../../_components/scaling-filters'
import { ScalingRiskTable } from './table/scaling-risk-table'

type Props = RecategorisedScalingEntry<ScalingRiskEntry>

export function ScalingRiskTables(props: Props) {
  const includeFilters = useScalingFilter()

  if (props.type === 'recategorised') {
    const filteredEntries = {
      rollups: props.entries.rollups.filter(includeFilters),
      validiumsAndOptimiums:
        props.entries.validiumsAndOptimiums.filter(includeFilters),
    }
    return (
      <>
        <ScalingFilters
          items={[
            ...filteredEntries.rollups,
            ...filteredEntries.validiumsAndOptimiums,
          ]}
        />
        <DirectoryTabs defaultValue="rollups">
          <DirectoryTabsList>
            <DirectoryTabsTrigger value="rollups">
              Rollups <CountBadge>{filteredEntries.rollups.length}</CountBadge>
            </DirectoryTabsTrigger>
            <DirectoryTabsTrigger value="validiums-and-optimiums">
              Validiums & Optimiums{' '}
              <CountBadge>
                {filteredEntries.validiumsAndOptimiums.length}
              </CountBadge>
            </DirectoryTabsTrigger>
          </DirectoryTabsList>
          <DirectoryTabsContent value="rollups">
            <ScalingRiskTable entries={filteredEntries.rollups} rollups />
          </DirectoryTabsContent>
          <DirectoryTabsContent value="validiums-and-optimiums">
            <ScalingRiskTable entries={filteredEntries.validiumsAndOptimiums} />
          </DirectoryTabsContent>
        </DirectoryTabs>
      </>
    )
  }

  const filteredEntries = props.entries.filter(includeFilters)

  return (
    <MainPageCard className="space-y-3 md:space-y-6">
      <ScalingFilters items={filteredEntries} />
      <ScalingRiskTable entries={filteredEntries} />
    </MainPageCard>
  )
}
