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
            title="The CROPS guide"
            description="A curated list of distinguished projects that follow the CROPS values: censorship resistance, open source, privacy and security."
          />
          <main>
            {/* The right padding makes room for the table's mobile bleed, which this inset card would otherwise clip, hiding the scroll hint. */}
            <div className="mt-4 overflow-clip rounded-xl bg-surface-primary max-md:mx-4 max-md:pr-4 md:px-5">
              <GardenTable entries={entries} />
            </div>
            <AttestationNotice attestation={attestation} />
            <GardenCallouts />
            <PlantLegendSection />
            <CropsSection />
          </main>
        </div>
      </SideNavLayout>
    </AppLayout>
  )
}
