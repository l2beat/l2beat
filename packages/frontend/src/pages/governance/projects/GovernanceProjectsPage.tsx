import { MainPageHeader } from '~/components/MainPageHeader'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { TabbedScalingEntries } from '~/pages/scaling/utils/groupByScalingTabs'
import type { GovernanceProjectEntry } from '~/server/features/governance/getGovernanceProjectsEntries'
import { GovernanceProjectsTables } from './components/GovernanceProjectsTables'

interface Props extends AppLayoutProps {
  entries: TabbedScalingEntries<GovernanceProjectEntry>
}

export function GovernanceProjectsPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Governance</MainPageHeader>
        <p className="mb-4 max-w-3xl text-paragraph-15 text-secondary">
          A per-project view of who holds the keys: funds custody, who
          processes transactions, whether users can be censored, how much
          notice before an unwanted upgrade, and whether transactions are
          private.
        </p>
        <TableFilterContextProvider>
          <GovernanceProjectsTables {...entries} />
        </TableFilterContextProvider>
      </SideNavLayout>
    </AppLayout>
  )
}
