import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type {
  ScalingRiskStateValidationNoProofsEntry,
  ScalingRiskStateValidationOptimisticEntry,
  ScalingRiskStateValidationValidityEntry,
} from '~/server/features/scaling/risks/state-validation/getScalingRiskStateValidationEntries'
import { ScalingRiskStateValidationTabs } from './components/ScalingRiskStateValidationTabs'

interface Props extends AppLayoutProps {
  validity: ScalingRiskStateValidationValidityEntry[]
  optimistic: ScalingRiskStateValidationOptimisticEntry[]
  noProofs: ScalingRiskStateValidationNoProofsEntry[]
}

export function ScalingRiskStateValidationPage({
  validity,
  optimistic,
  noProofs,
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
            noProofs={noProofs}
          />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
