import { LinkWithThumbnail } from '~/components/LinkWithThumbnail'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { AppLayoutProps } from '~/layouts/AppLayout'
import { AppLayout } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GovernancePublicationEntry } from '~/pages/governance/utils/getGovernancePublicationEntry'

interface Props extends AppLayoutProps {
  publications: GovernancePublicationEntry[]
}

export function GovernancePublicationsPage({ publications, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Governance Publications</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <h1 className="mb-4 font-bold text-3xl md:hidden">
            Governance Publications
          </h1>
          <p className="text-paragraph-16 md:text-paragraph-18">
            Explore the L2BEAT Governance publications, and discover the latest
            insights, analyses, and updates on Layer 2 project governance,
            curated by our L2BEAT Governance Team. Empower your blockchain
            decisions with our focused research and discussions on decentralized
            governance.
          </p>
          <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {publications.map((publication) => (
              <PublicationCard publication={publication} key={publication.id} />
            ))}
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}

function PublicationCard({
  publication,
}: {
  publication: GovernancePublicationEntry
}) {
  return (
    <LinkWithThumbnail
      {...publication.thumbnail}
      href={`/governance/publications/${publication.id}`}
      title={publication.shortTitle ?? publication.title}
      topAccessory={
        <p className="text-purple-100 text-subtitle-12 uppercase dark:text-pink-200">
          {publication.readTimeInMinutes} min read • Published on{' '}
          {publication.publishedOn}
        </p>
      }
      description={publication.description ?? publication.excerpt}
      orientation="vertical"
      className="justify-self-center hover:bg-surface-tertiary"
    />
  )
}
