import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { MainPageHeader } from '~/components/main-page-header'
import { Article } from '~/components/markdown/article'
import { PrimaryCard } from '~/components/primary-card/primary-card'
import type { AppLayoutProps } from '~/layouts/app-layout.tsx'
import { AppLayout } from '~/layouts/app-layout.tsx'
import { SideNavLayout } from '~/layouts/side-nav-layout'
import type { GovernancePublicationEntry } from '~/pages/governance/utils/get-governance-publication-entry'

interface Props extends AppLayoutProps {
  publication: GovernancePublicationEntry
}

export function GovernancePublicationPage({ publication, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Governance Article</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <PublicationHeader publication={publication} />
          <HorizontalSeparator className="my-8" />
          <div className="mx-auto mt-8 max-w-[720px] md:pt-8">
            {publication.description && (
              <p className="mb-12 font-light font-roboto-serif text-xl leading-[1.6] opacity-80">
                {publication.description}
              </p>
            )}
            <img
              {...publication.thumbnail}
              alt={`${publication.title} publication thumbnail`}
              className="mb-12 w-full rounded-lg"
            />
            <Article>{publication.content}</Article>
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}

function PublicationHeader({
  publication,
}: { publication: GovernancePublicationEntry }) {
  return (
    <div>
      <p className="subtitle-12 text-brand uppercase">
        {publication.readTimeInMinutes} min read • Published on{' '}
        {publication.publishedOn}
      </p>
      <h1 className="md:heading-32 heading-24 mt-2">{publication.title}</h1>
      <div className="mt-6 flex items-center justify-start">
        <img
          {...publication.author.avatar}
          alt={`Avatar of ${publication.author.firstName} ${publication.author.lastName}`}
          className="mr-2 size-10 rounded-full"
        />
        <div>
          <p className="label-value-16-bold">
            {publication.author.firstName} {publication.author.lastName}
          </p>
          <p className="label-value-12-bold mt-1 text-zinc-500 dark:text-gray-50">
            {publication.author.role}
          </p>
        </div>
      </div>
    </div>
  )
}
