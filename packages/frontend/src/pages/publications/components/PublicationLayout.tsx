import type { ReactNode } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import type { OtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import { PublicationHeader } from './PublicationHeader'

interface Props extends AppLayoutProps {
  publication: OtherPublicationEntry | GovernancePublicationEntry
  children: ReactNode
}

export function PublicationLayout({ publication, children, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Publication</MainPageHeader>
        {/* Header and body span the card, so it has one left and
            one right edge, like the tables and figures on other cards. */}
        <PrimaryCard className="md:p-8">
          <PublicationHeader publication={publication} />
          <div className="mt-8">
            <img
              {...publication.thumbnail}
              alt={`${publication.title} publication thumbnail`}
              className="mb-12 w-full max-w-[720px] rounded-lg"
            />
            {children}
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
