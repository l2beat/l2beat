import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { Partners } from '../getDonateData'

interface Props {
  partners: Partners
}

export function PartnersSection({ partners }: Props) {
  return (
    <PrimaryCard className="border-divider border-t md:mt-6 md:border-t-0">
      <h2 className="mb-8 font-bold text-xl">Partners</h2>
      <div>
        <h3 className="font-medium text-secondary text-xs">ECOSYSTEMS TIER</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {partners.ecosystem.map((partner) => (
            <EcosystemTierCard key={partner.slug} partner={partner} />
          ))}
        </div>
      </div>
    </PrimaryCard>
  )
}

export function EcosystemTierCard({
  partner,
}: { partner: Partners['ecosystem'][number] }) {
  return (
    <div
      style={
        {
          '--ecosystem-primary': partner.project.colors.primary,
          '--ecosystem-secondary': partner.project.colors.secondary,
        } as React.CSSProperties
      }
      className={`flex flex-col items-center gap-4 rounded bg-gradient-radial from-[--ecosystem-secondary] to-[--ecosystem-primary] p-6`}
    >
      <img
        src={partner.ecosystemLogo.dark}
        alt={partner.project.name}
        className="h-[50px] w-max"
      />
      <HorizontalSeparator className="border-pure-white/40" />
      <div className="text-center">
        <p className="mb-2 text-2xs text-pure-white/70">PARTNER:</p>
        <img
          src={partner.mainPartnerLogo.src}
          width={partner.mainPartnerLogo.width / 2}
          height={partner.mainPartnerLogo.height / 2}
          alt={partner.project.name}
        />
      </div>
    </div>
  )
}
