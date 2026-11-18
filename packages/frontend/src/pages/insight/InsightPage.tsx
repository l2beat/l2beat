import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { HolderSearchForm } from './components/HolderSearchForm'
import { InsightReportView } from './components/InsightReportView'

interface Props extends AppLayoutProps {
  /** The path segment as typed; the report endpoint parses it. */
  holder: string | null
}

export function InsightPage({ holder, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="See which tokens an Ethereum address holds, who issues them and which bridges they rely on. Ethereum only, and only tokens in our token database.">
          Insight
        </MainPageHeader>
        {holder === null ? (
          <PrimaryCard className="max-w-xl">
            <HolderSearchForm initialValue="" />
          </PrimaryCard>
        ) : (
          <InsightReportView
            addressOrName={holder}
            searchForm={<HolderSearchForm initialValue={holder} />}
          />
        )}
      </SideNavLayout>
    </AppLayout>
  )
}
