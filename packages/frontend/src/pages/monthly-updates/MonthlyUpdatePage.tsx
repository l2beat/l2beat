import { MainPageHeader } from '~/components/MainPageHeader'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { EcosystemUpdate } from '~/content/monthly-updates'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { EcosystemUpdateSection } from './components/EcosystemUpdateSection'

interface Props extends AppLayoutProps {
  publishedOn: string
  title: string
  ecosystemUpdates: EcosystemUpdate[]
}

export function MonthlyUpdatePage({
  publishedOn,
  title,
  ecosystemUpdates,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <MainPageHeader>Monthly Updates</MainPageHeader>
        <PrimaryCard className="md:p-8">
          <div>
            <p className="subtitle-12 text-brand uppercase">
              Published on {publishedOn}
            </p>
            <h1 className="md:heading-32 heading-24 mt-2">{title}</h1>
          </div>
          <HorizontalSeparator className="my-8" />
          <div className="mx-auto mt-8 max-w-[960px] md:pt-8">
            {ecosystemUpdates.map((ecosystem) => (
              <EcosystemUpdateSection
                key={ecosystem.ecosystemId}
                ecosystem={ecosystem}
              />
            ))}
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
