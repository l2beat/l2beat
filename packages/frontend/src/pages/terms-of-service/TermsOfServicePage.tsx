import { ContentWrapper } from '~/components/content-wrapper'
import { FullPageHeader } from '~/components/full-page-header'
import { Article } from '~/components/markdown/article'
import { ScrollToTopButton } from '~/components/scroll-to-top-button'
import type { CollectionEntry } from '~/content/get-collection'
import { AppLayout, type AppLayoutProps } from '~/layouts/app-layout.tsx'
import { TopNavLayout } from '~/layouts/top-nav-layout'
import { cn } from '~/utils/cn'

interface Props extends AppLayoutProps {
  content: CollectionEntry<'pages'>
  lastUpdated: string
}

export function TermsOfServicePage({ content, lastUpdated, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <TopNavLayout>
        <Header lastUpdated={lastUpdated} />
        <ContentWrapper
          className={cn('mt-12 max-w-[816px] md:mt-16 lg:mt-20')}
          asChild
        >
          <main>
            <Article className="extended-char-set">{content.content}</Article>
          </main>
        </ContentWrapper>
        <ScrollToTopButton />
      </TopNavLayout>
    </AppLayout>
  )
}

function Header({ lastUpdated }: { lastUpdated: string }) {
  return (
    <FullPageHeader contentWrapperClassName="flex-col items-start gap-2 md:gap-6">
      <p className="font-medium text-2xs text-purple-100 uppercase dark:text-pink-200">
        Last updated on {lastUpdated}
      </p>
      <h1 className="font-bold text-2xl md:text-3xl lg:text-[44px] lg:leading-[1.2]">
        Terms of Service
      </h1>
    </FullPageHeader>
  )
}
