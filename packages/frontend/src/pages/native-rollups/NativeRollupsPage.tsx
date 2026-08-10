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
import type { Contributor } from './contributors'
import type { Talk } from './materials'

interface Props extends AppLayoutProps {
  talks: Talk[]
  contributors: Contributor[]
}

export function NativeRollupsPage({ talks, contributors, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout variant="wide">
        <MainPageHeader>Native Rollups</MainPageHeader>
        <main className="[--accent:var(--color-purple-100)] dark:[--accent:var(--color-pink-200)]">
          <Hero />
          <WhyNativeSection />
          <HowItWorksSection />
          <NativeProofVerificationSection />
          <FeaturesSection />
          <RoadmapSection />
          <CoreProtocolSection />
          <MaterialsSection talks={talks} />
          <ContributorsSection contributors={contributors} />
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}
