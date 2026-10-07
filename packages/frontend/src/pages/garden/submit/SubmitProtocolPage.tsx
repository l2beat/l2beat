import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { GardenPageHeader } from '../components/GardenPageHeader'
import { PlotBackground } from './assets/PlotBackground'
import { ClosingSection } from './components/ClosingSection'
import { HeroSection } from './components/HeroSection'
import { ProcessSection } from './components/ProcessSection'

export function SubmitProtocolPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout backdrop={<PlotBackground />}>
        <div className="flex grow flex-col pb-24">
          <GardenPageHeader title="Submit your protocol" />
          <main>
            <HeroSection />
            <ProcessSection />
            <ClosingSection />
          </main>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
