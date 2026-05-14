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
            <Article className="extended-char-set [&>h2:first-child]:mt-0 [&_img]:my-8 [&_img]:w-full [&_img]:rounded-lg [&_img]:border [&_img]:border-divider [&_img]:bg-pure-black [&_img]:shadow-sm [&_li]:ml-0 [&_li]:rounded-lg [&_li]:border [&_li]:border-divider [&_li]:bg-surface-secondary [&_li]:p-4 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-3 [&_ul]:pl-0">
              {content.content}
            </Article>
          </main>
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
