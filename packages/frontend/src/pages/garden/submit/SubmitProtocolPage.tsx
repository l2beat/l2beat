import { MainPageHeader } from '~/components/MainPageHeader'
import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { GARDEN_ANIMATIONS_CSS, GARDEN_SURFACES_CSS } from '../gardenCss'
import { PlotBackground } from './assets/PlotBackground'
import { ClosingSection } from './components/ClosingSection'
import { HeroSection } from './components/HeroSection'
import { ProcessSection } from './components/ProcessSection'

export function SubmitProtocolPage(props: AppLayoutProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <style>{PAGE_CSS}</style>
        <div className="relative flex grow flex-col pb-24">
          <PlotBackground />
          <div className="relative">
            <h1 className="pt-5 font-bold text-2xl max-md:px-4 lg:hidden">
              Submit your protocol
            </h1>
            <MainPageHeader>Submit your protocol</MainPageHeader>
            <main>
              <HeroSection />
              <ProcessSection />
              <ClosingSection />
            </main>
          </div>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}

const PAGE_CSS =
  GARDEN_SURFACES_CSS +
  GARDEN_ANIMATIONS_CSS +
  `
@keyframes plot-drift{0%,100%{transform:translateX(-20px)}50%{transform:translateX(20px)}}
@keyframes plot-float{0%{transform:translateY(0);opacity:0}25%{opacity:.8}100%{transform:translateY(-90px);opacity:0}}
`
