import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import type { Partners } from '../getDonateData'

interface Props {
  partners: Partners
}

export function PartnersSection({ partners }: Props) {
  return (
    <PrimaryCard className="space-y-8 border-divider border-t md:mt-6 md:border-t-0">
      <h2 className="font-bold text-xl">Partners</h2>
      <div>
        <h3 className="font-medium text-secondary text-xs">ECOSYSTEMS TIER</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {partners.ecosystem.map((partner) => (
            <EcosystemTierCard key={partner.slug} partner={partner} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-secondary text-xs">INNOVATORS TIER</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {partners.innovator.map((partner) => (
            <InnovatorTierCard key={partner.slug} partner={partner} />
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
      key={partner.slug}
      style={
        {
          '--ecosystem-primary': partner.project.colors.primary,
          '--ecosystem-secondary': partner.project.colors.secondary,
        } as React.CSSProperties
      }
      className="group hover:-translate-y-1 transform transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
    >
      <a href={`/ecosystems/${partner.slug}`} className="block">
        <div
          className={`relative h-[260px] cursor-pointer overflow-hidden rounded bg-gradient-radial from-[--ecosystem-secondary] to-[--ecosystem-primary] shadow-lg transition-shadow duration-300 group-hover:shadow-xl`}
        >
          {/* Background pattern/texture overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-white">
            <img
              src={partner.ecosystemLogo.dark}
              alt={partner.project.name}
              className="mb-6 h-[50px] w-max"
            />
            <HorizontalSeparator className="border-pure-white/40" />
            <div className="mt-4 text-center">
              <p className="mb-2 text-2xs text-pure-white/70">PARTNER:</p>
              <img
                src={partner.mainPartnerLogo.src}
                width={partner.mainPartnerLogo.width / 2}
                height={partner.mainPartnerLogo.height / 2}
                alt={partner.project.name}
              />
            </div>
            <div className="-translate-x-full pointer-events-none absolute inset-0 transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/25 text-center font-medium text-sm text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              View ecosystem page
            </div>
          </div>

          {/* Subtle shine effect on hover */}
          <div className="-translate-x-full absolute inset-0 transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
        </div>
      </a>
    </div>
  )
}

export function InnovatorTierCard({
  partner,
}: { partner: Partners['innovator'][number] }) {
  return (
    <a
      href={`/innovators/${partner.slug}`}
      style={{
        backgroundImage: `url(${partner.backgroundImage.src})`,
      }}
      className="group relative flex h-14 items-center rounded border border-divider bg-center bg-cover px-6"
    >
      <img
        src={partner.logo.src}
        alt={partner.project.name}
        className="h-8 w-fit"
      />
      <div className="absolute right-6 flex size-8 items-center justify-center rounded-full bg-pure-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <ChevronIcon className="-rotate-90 h-4 w-4 text-black" />
      </div>
    </a>
  )
}
