import { MainPageHeader } from '~/components/MainPageHeader'
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
        <MainPageHeader description="Paste an Ethereum address or ENS name to see which tokens it holds, who issues each of them and which bridges mint them. A proof of concept: Ethereum only, and only tokens in our token database.">
          Insight
        </MainPageHeader>
        <div className="flex flex-col gap-4">
          <HolderSearchForm initialValue={holder ?? ''} />
          {holder !== null && <InsightReportView addressOrName={holder} />}
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
