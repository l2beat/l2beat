import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import { PublicationTag } from '../components/PublicationsList'

interface Props extends AppLayoutProps {
  publication: GovernancePublicationEntry
}

export function GovernancePublicationPage({ publication, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Publication</MainPageHeader>
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
}: {
  publication: GovernancePublicationEntry
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <PublicationTag tag="governance" />
        <p className="text-brand text-subtitle-12 uppercase">
          {publication.readTimeInMinutes} min read • Published on{' '}
          {publication.publishedOn}
        </p>
      </div>
      <h1 className="mt-2 text-heading-24 md:text-heading-32">
        {publication.title}
      </h1>
      <div className="mt-6 flex items-center justify-start">
        <img
          {...publication.author.avatar}
          alt={`Avatar of ${publication.author.firstName} ${publication.author.lastName}`}
          className="mr-2 size-10 rounded-full"
        />
        <div>
          <p className="font-bold text-label-value-16">
            {publication.author.firstName} {publication.author.lastName}
          </p>
          <p className="mt-1 font-bold text-label-value-12 text-zinc-500 dark:text-gray-50">
            {publication.author.role}
          </p>
        </div>
      </div>
    </div>
  )
}
