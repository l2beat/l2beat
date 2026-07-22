import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type {
  Layer2sRiskStateValidationNoProofsEntry,
  Layer2sRiskStateValidationOptimisticEntry,
  Layer2sRiskStateValidationValidityEntry,
} from '~/server/features/layer2s/risks/state-validation/getLayer2sRiskStateValidationEntries'
import { Layer2sRiskStateValidationTabs } from './components/Layer2sRiskStateValidationTabs'

interface Props extends AppLayoutProps {
  validity: Layer2sRiskStateValidationValidityEntry[]
  optimistic: Layer2sRiskStateValidationOptimisticEntry[]
  noProofs: Layer2sRiskStateValidationNoProofsEntry[]
}

export function Layer2sRiskStateValidationPage({
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
          <Layer2sRiskStateValidationTabs
            validity={validity}
            optimistic={optimistic}
            noProofs={noProofs}
          />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
