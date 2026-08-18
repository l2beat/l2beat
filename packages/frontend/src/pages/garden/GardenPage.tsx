import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { GardenBackground } from './assets/GardenBackground'
import { GardenTable } from './components/GardenTable'
import { PlantLegendSection } from './components/PlantLegendSection'
import { SubmitProtocolCallout } from './components/SubmitProtocolCallout'
import { GARDEN_ANIMATIONS_CSS, GARDEN_SURFACES_CSS } from './gardenCss'
import type { GardenEntry } from './getGardenData'

interface Props extends AppLayoutProps {
  entries: GardenEntry[]
}

export function GardenPage({ entries, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <style>{PAGE_CSS}</style>
        <div className="relative flex grow flex-col pb-24">
          <GardenBackground />
          <div className="relative">
            <h1 className="pt-5 font-bold text-2xl max-md:px-4 lg:hidden">
              The Infinite Garden
            </h1>
            <MainPageHeader description="Each project is evaluated across the CROPS framework: Censorship Resistance, Open source, Privacy, and Security. Hover a plant for the reasoning behind its evaluation.">
              The Infinite Garden
            </MainPageHeader>
            <div className="mt-4 overflow-hidden rounded-xl bg-surface-primary max-md:mx-4 md:px-6">
              <GardenTable entries={entries} />
            </div>
            <SubmitProtocolCallout />
            <PlantLegendSection />
          </div>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}

const PAGE_CSS = GARDEN_SURFACES_CSS + GARDEN_ANIMATIONS_CSS
