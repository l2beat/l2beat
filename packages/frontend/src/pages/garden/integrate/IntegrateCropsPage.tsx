import { ScrollToTopButton } from '~/components/ScrollToTopButton'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import type { CropsAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { GardenPageHeader } from '../components/GardenPageHeader'
import { GARDEN_PATH } from '../paths'
import { AttestationsSection } from './components/AttestationsSection'
import { AudiencePicker } from './components/AudiencePicker'
import { BadgeSection } from './components/BadgeSection'
import { EndpointsSection } from './components/EndpointsSection'
import type { CropsApiEndpoint } from './content'
import type { IntegrateExamples } from './getIntegrateExamples'

export interface IntegrateCropsPageProps extends AppLayoutProps {
  attestations: CropsAttestationsMeta
  endpoints: CropsApiEndpoint[]
  examples: IntegrateExamples
}

const CONSUMERS_ID = 'for-apps'
const PROTOCOLS_ID = 'for-protocols'

// Pasted into other sites, so it must link to production even from a preview.
const BADGE_HREF = `${PRODUCTION_ORIGIN}${GARDEN_PATH}`

export function IntegrateCropsPage({
  attestations,
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
            <AudiencePicker
              consumersId={CONSUMERS_ID}
              protocolsId={PROTOCOLS_ID}
            />
            <SectionDivider
              id={CONSUMERS_ID}
              label="For wallets and interfaces"
            />
            <EndpointsSection endpoints={endpoints} examples={examples} />
            <AttestationsSection attestations={attestations} />
            <SectionDivider id={PROTOCOLS_ID} label="For reviewed protocols" />
            <BadgeSection href={BADGE_HREF} />
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
