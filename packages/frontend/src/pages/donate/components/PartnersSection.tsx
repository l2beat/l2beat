import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowButtonIcon } from '~/icons/ArrowButton'
import type { Partners } from '../getDonateData'

interface Props {
  partners: Partners
}

export function PartnersSection({ partners }: Props) {
  return (
    <PrimaryCard className="space-y-4 border-divider border-t md:mt-6 md:space-y-8 md:border-t-0">
      <h2 className="font-bold text-xl">Partners</h2>
      <div>
        <h3 className="font-medium text-secondary text-xs">ECOSYSTEMS TIER</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 [@media(min-width:1000px)]:grid-cols-4">
          {partners.ecosystem.map((partner) => (
            <EcosystemTierCard key={partner.slug} partner={partner} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-secondary text-xs">INNOVATORS TIER</h3>
        <div className="mt-3 flex flex-col gap-2">
          {partners.innovator.map((partner) => (
            <InnovatorTierCard key={partner.slug} partner={partner} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium text-secondary text-xs">SUPPORTERS TIER</h3>
        <div className="mt-3 flex flex-col gap-2">
          {partners.supporter.map((partner) => (
            <SupporterTierCard key={partner.slug} partner={partner} />
          ))}
        </div>
      </div>
    </PrimaryCard>
  )
}

export function EcosystemTierCard({
  partner,
}: {
  partner: Partners['ecosystem'][number]
}) {
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
        <div className="relative h-40 cursor-pointer overflow-hidden rounded bg-radial-[closest-side] from-branding-secondary to-branding-primary shadow-lg transition-shadow duration-300 group-hover:shadow-xl md:h-[260px] lg:h-[272px]">
          {/* Background pattern/texture overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

          {/* Content */}
          <div className="md:group-hover:-translate-y-8 relative z-10 h-[104px] items-center justify-center justify-items-center p-6 text-white transition-transform ease-in-out max-md:grid max-md:grid-cols-[1fr_56px_1fr] max-md:pb-4 md:flex md:h-full md:flex-col md:justify-center">
            <div className="flex h-14 items-center justify-center md:h-18">
              <img
                src={
                  partner.ecosystemLogo.alternative ??
                  partner.ecosystemLogo.dark
                }
                alt={partner.project.name}
                className="h-full max-w-full xs:max-w-36 object-contain md:max-w-[180px]"
              />
            </div>
            <HorizontalSeparator className="mt-6 mb-4 border-pure-white/40 max-md:hidden" />
            <div className="flex items-center justify-center md:hidden">
              <VerticalSeparator className="h-12 border-pure-white/40 border-t-0" />
            </div>
            <div className="h-12 text-center">
              <p className="text-2xs text-pure-white/70">PARTNER:</p>
              <img
                className="max-md:max-w-[120px]"
                src={partner.mainPartnerLogo.src}
                width={partner.mainPartnerLogo.width / 2}
                height={partner.mainPartnerLogo.height / 2}
                alt={partner.project.name}
              />
            </div>
            <div className="-translate-x-full pointer-events-none absolute inset-0 transform bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          </div>

          <div className="ease absolute inset-x-6 bottom-4 flex translate-y-full items-center justify-center rounded border border-link-stroke bg-surface-primary p-3 font-medium text-primary text-xs leading-none transition-[opacity,transform] duration-200 ease-in-out max-md:translate-y-0 md:bottom-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            Go to ecosystem page
          </div>

          {/* Subtle shine effect on hover */}
          <div className="-translate-x-full absolute inset-0 transform bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
        </div>
      </a>
    </div>
  )
}

export function InnovatorTierCard({
  partner,
}: {
  partner: Partners['innovator'][number]
}) {
  return (
    <a
      href={partner.link}
      style={{
        backgroundImage: `url(${partner.backgroundImage.src})`,
      }}
      className="group relative flex h-20 items-center justify-between rounded border border-divider bg-center bg-cover px-6 max-md:pr-4 lg:h-24"
    >
      <img
        src={partner.logo.src}
        alt={partner.slug}
        className="h-[42px] w-auto object-contain md:h-[52px]"
      />
      <ArrowButtonIcon className="absolute right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden" />
    </a>
  )
}

export function SupporterTierCard({
  partner,
}: {
  partner: Partners['supporter'][number]
}) {
  return (
    <a
      href={partner.link}
      style={{
        backgroundImage: `url(${partner.backgroundImage.src})`,
      }}
      className="group relative flex h-14 items-center justify-between rounded border border-divider bg-center bg-cover px-6 py-4 lg:h-16"
    >
      <img className="h-full" src={partner.logo.src} alt={partner.slug} />
      <ArrowButtonIcon className="absolute right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden" />
    </a>
  )
}
