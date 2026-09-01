import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { MainPageHeader } from '~/components/MainPageHeader'
import { Article } from '~/components/markdown/Article'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import type { OtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import { PublicationHeader } from './components/PublicationHeader'

interface Props extends AppLayoutProps {
  publication: OtherPublicationEntry | GovernancePublicationEntry
}

export function PublicationPage({ publication, ...props }: Props) {
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
