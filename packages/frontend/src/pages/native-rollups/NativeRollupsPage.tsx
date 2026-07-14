import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { ContributorsSection } from './components/ContributorsSection'
import { CoreProtocolSection } from './components/CoreProtocolSection'
import { FeaturesSection } from './components/FeaturesSection'
import { Hero } from './components/Hero'
import { HowItWorksSection } from './components/HowItWorksSection'
import { MaterialsSection } from './components/MaterialsSection'
import { NativeProofVerificationSection } from './components/NativeProofVerificationSection'
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
          <HowItWorksSection />
          <NativeProofVerificationSection />
          <FeaturesSection />
          <RoadmapSection />
          <CoreProtocolSection />
          <MaterialsSection />
          <ContributorsSection />
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}
