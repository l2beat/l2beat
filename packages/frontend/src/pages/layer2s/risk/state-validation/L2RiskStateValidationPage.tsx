import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type {
  L2RiskStateValidationNoProofsEntry,
  L2RiskStateValidationOptimisticEntry,
  L2RiskStateValidationValidityEntry,
} from '~/server/features/layer2s/risks/state-validation/getL2RiskStateValidationEntries'
import { L2RiskStateValidationTabs } from './components/L2RiskStateValidationTabs'

interface Props extends AppLayoutProps {
  validity: L2RiskStateValidationValidityEntry[]
  optimistic: L2RiskStateValidationOptimisticEntry[]
  noProofs: L2RiskStateValidationNoProofsEntry[]
}

export function L2RiskStateValidationPage({
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
          <L2RiskStateValidationTabs
            validity={validity}
            optimistic={optimistic}
            noProofs={noProofs}
          />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
