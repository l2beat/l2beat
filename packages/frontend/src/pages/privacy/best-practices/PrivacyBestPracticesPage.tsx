import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { CollectionEntry } from '~/content/getCollection'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {
  content: CollectionEntry<'pages'>
}

export function PrivacyBestPracticesPage({ content, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Onchain privacy best practices</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <main className="mx-auto">
            <Article className="extended-char-set privacy-best-practices">
              {content.content}
            </Article>
          </main>
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
