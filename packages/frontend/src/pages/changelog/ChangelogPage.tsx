import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'

interface ChangelogPageEntry {
  id: string
  title: string
  summary: string | undefined
  publishedOn: string
  content: string
}

interface Props extends AppLayoutProps {
  entries: ChangelogPageEntry[]
}

export function ChangelogPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader description="A running list of product and content updates shipped on L2BEAT.">
          Changelog
        </MainPageHeader>
        <PrimaryCard className="md:p-8">
          {entries.length === 0 ? (
            <p className="text-base text-secondary">
              No changelog entries yet.
            </p>
          ) : (
            <ol className="relative space-y-6 before:absolute before:top-0 before:bottom-0 before:left-[7px] before:w-px before:bg-divider before:content-['']">
              {entries.map((entry) => (
                <li
                  className="relative flex scroll-mt-24 gap-4"
                  id={entry.id}
                  key={entry.id}
                >
                  <span className="mt-2 size-[14px] shrink-0 rounded-full border-2 border-surface-primary bg-brand" />
                  <article className="w-full rounded-lg border border-divider bg-surface-secondary p-4 md:p-6">
                    <p className="font-semibold text-brand text-subtitle-12 uppercase">
                      {entry.publishedOn}
                    </p>
                    <h2 className="mt-2 font-bold text-heading-24 text-primary leading-tight">
                      {entry.title}
                    </h2>
                    {entry.summary && (
                      <p className="mt-3 text-base text-secondary leading-7">
                        {entry.summary}
                      </p>
                    )}
                    {entry.content && (
                      <Article className="mt-4 font-normal text-base text-primary leading-7">
                        {entry.content}
                      </Article>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          )}
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
