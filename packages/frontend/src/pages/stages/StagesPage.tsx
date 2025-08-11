import { CustomLink } from '~/components/link/CustomLink'
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

export function StagesPage({ content, lastUpdated, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Stages Framework</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <p className="text-brand text-subtitle-12 uppercase">
            Last updated on {lastUpdated}
          </p>
          <h1 className="mt-2 mb-4 text-heading-24 md:text-heading-32">
            The Stages Framework
          </h1>
          <p className="mb-4 font-light font-roboto-serif text-xl leading-[1.6] opacity-80">
            This page is to be considered an extended explainer for the latest
            version of the Stages Framework, whose precise specification can be
            found{' '}
            <CustomLink href="https://forum.l2beat.com/t/the-stages-framework/291">
              here
            </CustomLink>
            .
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
