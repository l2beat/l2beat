import { CustomLink } from '~/components/link/CustomLink'
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

export function StagesPage({ content, lastUpdated, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Stages Framework</MainPageHeader>
        <PrimaryCard>
          <p className="font-medium text-brand-deep text-label-value-13">
            Last updated on {lastUpdated}
          </p>
          <h1 className="mt-2 mb-4 font-semibold text-heading-32 tracking-[-0.01em] md:text-heading-40">
            The Stages Framework
          </h1>
          <p className="mb-4 font-inter text-paragraph-18 md:text-[22px] md:leading-[1.5] dark:text-primary/88">
            This page is to be considered an extended explainer for the latest
            version of the Stages Framework, whose precise specification can be
            found{' '}
            <CustomLink href="https://forum.ethbeat.org/t/the-stages-framework/291">
              here
            </CustomLink>
            .
          </p>
          <main>
            <Article className="[&>*:last-child]:mb-0 [&>h2:first-child]:mt-[2em]">
              {content.content}
            </Article>
          </main>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
