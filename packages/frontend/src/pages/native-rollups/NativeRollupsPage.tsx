import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ContributorsSection } from './components/ContributorsSection'
import { CoreProtocolSection } from './components/CoreProtocolSection'
import { FeaturesSection } from './components/FeaturesSection'
import { Hero } from './components/Hero'
import { MaterialsSection } from './components/MaterialsSection'
import { RoadmapSection } from './components/RoadmapSection'
import { WhyNativeSection } from './components/WhyNativeSection'

export function NativeRollupsPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout maxWidth="wide">
        <MainPageHeader>Native Rollups</MainPageHeader>
        <Hero />
        <main>
          <WhyNativeSection />
          <FeaturesSection />
          <MaterialsSection />
          <RoadmapSection />
          <CoreProtocolSection />
          <ContributorsSection />
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}
