import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { CollectionEntry } from '~/content/getCollection'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface Props extends AppLayoutProps {
  content: CollectionEntry<'pages'>
  lastUpdated: string
}

export function TermsOfServicePage({ content, lastUpdated, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Terms of Service</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <p className="font-medium text-2xs text-purple-100 uppercase dark:text-pink-200">
            Last updated on {lastUpdated}
          </p>
          <main>
            <Article className="extended-char-set [&>h2:first-child]:mt-8">
              {content.content}
            </Article>
          </main>
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
