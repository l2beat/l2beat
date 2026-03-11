import React, { useEffect, useRef, useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { ArrowIcon } from '~/icons/Arrow'
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
  const [lastReadChangelogEntryId, setLastReadChangelogEntryId] =
    useLocalStorage<string | undefined>(
      'last-read-changelog-entry-id',
      undefined,
    )
  const [lastReadChangelogEntryIdOnLoad, setLastReadChangelogEntryIdOnLoad] =
    useState<string | undefined>(undefined)
  const hasCapturedLastReadChangelogEntryIdOnLoad = useRef(false)

  useEffect(() => {
    if (hasCapturedLastReadChangelogEntryIdOnLoad.current) return

    hasCapturedLastReadChangelogEntryIdOnLoad.current = true
    setLastReadChangelogEntryIdOnLoad(lastReadChangelogEntryId)
  }, [lastReadChangelogEntryId])

  useEffect(() => {
    const latestChangelogEntry = entries[0]
    if (!latestChangelogEntry) return

    setLastReadChangelogEntryId(latestChangelogEntry.id)
  }, [entries, setLastReadChangelogEntryId])

  const lastReadEntryIndex = lastReadChangelogEntryIdOnLoad
    ? entries.findIndex((entry) => entry.id === lastReadChangelogEntryIdOnLoad)
    : -1

  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader
          description="A running list of product and content updates shipped on L2BEAT."
          hideDescriptionOnMobile
        >
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
                <React.Fragment key={entry.id}>
                  {lastReadEntryIndex > 0 &&
                    entries[lastReadEntryIndex]?.id === entry.id && (
                      <li
                        className="relative flex scroll-mt-24 gap-4"
                        id={entry.id}
                      >
                        <ArrowIcon className="size-[15px] shrink-0 fill-brand text-brand" />
                        <div className="mx-2 flex w-full items-center gap-3">
                          <span className="h-px flex-1 bg-brand" />
                          <span className="font-semibold text-brand text-subtitle-12 uppercase leading-none">
                            Unread above
                          </span>
                          <span className="h-px flex-1 bg-brand" />
                        </div>
                      </li>
                    )}
                  <li
                    className="relative flex scroll-mt-24 gap-4"
                    id={entry.id}
                  >
                    <span className="mt-2 size-[15px] shrink-0 rounded-full border-2 border-surface-primary bg-brand" />
                    <article className="w-full rounded-lg border border-divider bg-surface-secondary p-4 md:p-6">
                      <div className="flex flex-wrap items-center gap-y-1">
                        <p className="font-semibold text-brand text-subtitle-12 uppercase">
                          {entry.publishedOn}
                        </p>
                      </div>
                      <h2 className="mt-2 font-bold text-heading-24 text-primary leading-tight">
                        {entry.title}
                      </h2>
                      {entry.summary && (
                        <p className="mt-3 text-base text-secondary leading-7">
                          {entry.summary}
                        </p>
                      )}
                      {entry.content && (
                        <Article className="changelog mt-4 font-normal text-base text-primary leading-7">
                          {entry.content}
                        </Article>
                      )}
                    </article>
                  </li>
                </React.Fragment>
              ))}
            </ol>
          )}
        </PrimaryCard>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
