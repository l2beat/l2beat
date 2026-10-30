import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { CropsAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { GardenPageHeader } from '../components/GardenPageHeader'
import { GARDEN_PATH } from '../paths'
import type { CropsBadgeAsset } from './badges'
import { AttestationsSection } from './components/AttestationsSection'
import { BadgeSection } from './components/BadgeSection'
import { EndpointsSection } from './components/EndpointsSection'
import type { CropsApiEndpoint } from './content'
import type { IntegrateExamples } from './getIntegrateExamples'

export interface IntegrateCropsPageProps extends AppLayoutProps {
  attestations: CropsAttestationsMeta
  badges: CropsBadgeAsset[]
  endpoints: CropsApiEndpoint[]
  examples: IntegrateExamples
}

// Pasted into other sites, so it must link to production even from a preview.
const BADGE_HREF = `${PRODUCTION_ORIGIN}${GARDEN_PATH}`

export function IntegrateCropsPage({
  attestations,
  badges,
  endpoints,
  examples,
  ...props
}: IntegrateCropsPageProps) {
  return (
    <AppLayout {...props}>
      <SideNavLayout>
        <div className="flex grow flex-col pb-24">
          <GardenPageHeader title="Integrate CROPS" />
          <main>
            <BadgeSection badges={badges} href={BADGE_HREF} />
            <SectionDivider id="api" label="For wallets and interfaces" />
            <EndpointsSection endpoints={endpoints} examples={examples} />
            <AttestationsSection attestations={attestations} />
          </main>
        </div>
        <ScrollToTopButton />
      </SideNavLayout>
    </AppLayout>
  )
}

function SectionDivider({ id, label }: { id: string; label: string }) {
  return (
    <div id={id} className="mt-12 flex items-center gap-4 max-md:px-4 md:mt-16">
      <span className="h-px grow bg-divider" />
      <span className="font-semibold text-secondary text-subtitle-12 uppercase tracking-[0.14em]">
        {label}
      </span>
      <span className="h-px grow bg-divider" />
    </div>
  )
}
