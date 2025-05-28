import type { Milestone } from '@l2beat/config'
import type { ScalingTvsEntry } from 'rewrite/src/server/features/scaling/tvs/get-scaling-tvs-entries'
import { MainPageHeader } from '~/components/main-page-header'
import { TableFilterContextProvider } from '~/components/table/filters/table-filter-context'
import { ScalingAssociatedTokensContextProvider } from '../_components/scaling-associated-tokens-context'
import type { TabbedScalingEntries } from '../_utils/group-by-scaling-tabs'
import { ScalingTvsTabs } from './_components/scaling-tvs-tabs'

interface Props {
  entries: TabbedScalingEntries<ScalingTvsEntry>
  milestones: Milestone[]
}

export function ScalingTvsPage({ entries, milestones }: Props) {
  return (
    <>
      <MainPageHeader>Value Secured</MainPageHeader>
      <TableFilterContextProvider>
        <ScalingAssociatedTokensContextProvider>
          <ScalingTvsTabs {...entries} milestones={milestones} />
        </ScalingAssociatedTokensContextProvider>
      </TableFilterContextProvider>
    </>
  )
}
