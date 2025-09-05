import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type {
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationValidityEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import { ScalingRiskStateValidationTabs } from './components/ScalingRiskStateValidationTabs'

interface Props extends AppLayoutProps {
  validity: TabbedScalingEntries<ScalingRiskStateValidationValidityEntry>
  optimistic: TabbedScalingEntries<ScalingRiskStateValidationOptimisticEntry>
}

export function ScalingRiskStateValidationPage({
  validity,
  optimistic,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>State Validation</MainPageHeader>
        <TableFilterContextProvider>
          <ScalingRiskStateValidationTabs
            validity={validity}
            optimistic={optimistic}
          />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
