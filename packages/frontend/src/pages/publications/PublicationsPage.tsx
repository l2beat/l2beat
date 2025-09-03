import { MainPageHeader } from '~/components/MainPageHeader'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { TableFilterContextProvider } from '~/components/table/filters/TableFilterContext'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { PublicationsList } from './components/PublicationsList'
import type { PublicationEntry } from './utils/getPublicationEntry'

interface Props extends AppLayoutProps {
  publications: PublicationEntry[]
}

export function PublicationsPage({ publications, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="Your hub for everything we publish: research-driven blog posts, must-read explainers, Medium essays, YouTube interviews, and curated social highlights. Stay current on Ethereum scaling with L2BEAT’s data, risk analysis, and commentary on the Layer 2 ecosystem. Use filters to view content by category.">
          Publications
        </MainPageHeader>
        <TableFilterContextProvider>
          <PublicationsList publications={publications} />
        </TableFilterContextProvider>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
