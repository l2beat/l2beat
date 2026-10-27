import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { CropsAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { GardenBackground } from './assets/GardenBackground'
import { AttestationNotice } from './components/AttestationNotice'
import { CropsSection } from './components/CropsSection'
import { GardenCallouts } from './components/GardenCallouts'
import { GardenPageHeader } from './components/GardenPageHeader'
import { GardenTable } from './components/GardenTable'
import { PlantLegendSection } from './components/PlantLegendSection'
import type { GardenEntry } from './getGardenData'

interface Props extends AppLayoutProps {
  entries: GardenEntry[]
  /** Null until the set has been attested for the first time. */
  attestation: CropsAttestationsMeta['current']
}

export function GardenPage({ entries, attestation, ...props }: Props) {
  return (
    <AppLayout {...props}>
      <SideNavLayout backdrop={<GardenBackground />}>
        <div className="flex grow flex-col pb-24">
          <GardenPageHeader
            title="The Infinite Garden"
            description="The four CROPS properties count as a whole: a project is listed only if none is rated bad and it has an ossification score."
          />
          <main>
            <div className="mt-4 overflow-hidden rounded-xl bg-surface-primary max-md:mx-4 md:px-6">
              <GardenTable entries={entries} />
            </div>
            <AttestationNotice attestation={attestation} />
            <GardenCallouts />
            <PlantLegendSection />
            <CropsSection />
          </main>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}
