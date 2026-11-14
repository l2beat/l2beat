import type { ReactNode } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { GovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import type { OtherPublicationEntry } from '~/pages/publications/other-publications/utils/getOtherPublicationEntry'
import { cn } from '~/utils/cn'
import { PublicationHeader } from './PublicationHeader'

interface Props extends AppLayoutProps {
  publication: OtherPublicationEntry | GovernancePublicationEntry
  /** Lets the body span the card; the thumbnail keeps the article column. */
  wide?: boolean
  children: ReactNode
}

export function PublicationLayout({
  publication,
  wide,
  children,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Publication</MainPageHeader>
        <PrimaryCard className="md:p-8">
          {/* The header shares the body's column, so the page has one left edge. */}
          <div className="mx-auto max-w-[720px]">
            <PublicationHeader publication={publication} />
          </div>
          <div className={wide ? 'mt-8' : 'mx-auto mt-8 max-w-[720px]'}>
            <img
              {...publication.thumbnail}
              alt={`${publication.title} publication thumbnail`}
              className={cn(
                'mb-12 w-full rounded-lg',
                wide && 'mx-auto max-w-[720px]',
              )}
            />
            {children}
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
