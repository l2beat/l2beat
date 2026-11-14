import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
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
        <MainPageHeader>Terms of service</MainPageHeader>
        <PrimaryCard>
          <p className="text-label-value-13 text-secondary">
            Last updated on {lastUpdated}
          </p>
          <main>
            <Article className="text-base leading-7 [&>h2:first-child]:mt-8 [&_h2]:text-[22px] [&_h3]:text-lg">
              {content.content}
            </Article>
          </main>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
