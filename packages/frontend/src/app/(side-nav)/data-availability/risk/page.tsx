import { MainPageCard } from '~/components/main-page-card'
import { MainPageHeader } from '~/components/main-page-header'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'
import { DaFilterContextProvider } from '../_components/filters/da-filter-context'
import { DaRiskTable } from './_components/table/da-risk-table'

export default async function Page() {
  const items = await getDaRiskEntries()

  return (
    <div>
      <DaFilterContextProvider>
        <MainPageHeader>Risk Analysis</MainPageHeader>
        <MainPageCard>
          <DaRiskTable items={items} />
        </MainPageCard>
      </DaFilterContextProvider>
    </div>
  )
}
