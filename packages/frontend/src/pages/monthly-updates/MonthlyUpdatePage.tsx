import type { UnixTime } from '@l2beat/shared-pure'
import { MainPageHeader } from '~/components/MainPageHeader'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout.tsx'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { EcosystemUpdateSection } from './components/EcosystemUpdateSection'
import type { EcosystemMonthlyUpdateEntry } from './utils/getEcosystemEntries'

interface Props extends AppLayoutProps {
  publishedOn: string
  title: string
  from: UnixTime
  to: UnixTime
  ecosystemsUpdatesEntries: EcosystemMonthlyUpdateEntry[]
}

export function MonthlyUpdatePage({
  publishedOn,
  title,
  from,
  to,
  ecosystemsUpdatesEntries,
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
            <div className="mb-12 flex flex-col">
              {[...ecosystemsUpdatesEntries].map((e, i) => (
                <a
                  href={`#${e.name}`}
                  key={`#${e.name}`}
                  className="font-normal font-roboto-serif text-[17px] text-link leading-[160%] underline"
                >
                  {i + 1}. {e.name}
                </a>
              ))}
            </div>
            {ecosystemsUpdatesEntries.map((ecosystem) => (
              <EcosystemUpdateSection
                key={ecosystem.ecosystemId}
                ecosystem={ecosystem}
                from={from}
                to={to}
              />
            ))}
          </div>
        </PrimaryCard>
      </SideNavLayout>
    </AppLayout>
  )
}
