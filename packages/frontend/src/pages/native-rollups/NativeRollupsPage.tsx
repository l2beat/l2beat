import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { Talk } from './articles'
import {
  type ContributorImages,
  ContributorsSection,
} from './components/ContributorsSection'
import { CoreProtocolSection } from './components/CoreProtocolSection'
import { FeaturesSection } from './components/FeaturesSection'
import { Hero } from './components/Hero'
import { HowItWorksSection } from './components/HowItWorksSection'
import { MaterialsSection } from './components/MaterialsSection'
import { NativeProofVerificationSection } from './components/NativeProofVerificationSection'
import { RoadmapSection } from './components/RoadmapSection'
import { WhyNativeSection } from './components/WhyNativeSection'

interface Props extends AppLayoutProps {
  talks: Talk[]
  contributorImages: ContributorImages
}

export function NativeRollupsPage({
  talks,
  contributorImages,
  ...props
}: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout maxWidth="wide">
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
          <ContributorsSection images={contributorImages} />
        </main>
      </SideNavLayout>
    </AppLayout>
  )
}
