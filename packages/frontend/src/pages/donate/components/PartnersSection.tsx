import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
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
        <div className="mt-3 grid gap-3 sm:grid-cols-2 [@media(min-width:1440px)]:grid-cols-4">
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
      <div>
        <h3 className="mb-3 font-medium text-secondary text-xs">
          SUPPORTERS TIER
        </h3>
        <SupporterTierTable partners={partners.supporter} />
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
            <div className="h-[50px]">
              <img
                src={partner.ecosystemLogo.dark}
                alt={partner.project.name}
                className="h-full object-contain"
              />
            </div>
            <HorizontalSeparator className="mt-6 mb-4 border-pure-white/40" />
            <div className="h-16 text-center">
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
      href={partner.link}
      style={{
        backgroundImage: `url(${partner.backgroundImage.src})`,
      }}
      className="group relative flex h-14 items-center rounded border border-divider bg-center bg-cover px-6"
    >
      <img src={partner.logo.src} alt={partner.slug} className="h-8 w-fit" />
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="absolute right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <path
          d="M16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0ZM14.248 8.48438C13.7795 8.01635 13.0203 8.01628 12.5518 8.48438C12.0831 8.95298 12.0831 9.71294 12.5518 10.1816L18.3691 16L12.5518 21.8184C12.0831 22.287 12.0831 23.047 12.5518 23.5156C13.0203 23.9837 13.7795 23.9837 14.248 23.5156L20.8213 16.9424C21.3414 16.4218 21.3414 15.5782 20.8213 15.0576L14.248 8.48438Z"
          fill="white"
        />
      </svg>
    </a>
  )
}

export function SupporterTierTable({
  partners,
}: { partners: Partners['supporter'] }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {partners.map((partner) => (
        <a
          key={partner.slug}
          href={partner.link}
          className="flex items-center gap-1 rounded border border-divider bg-surface-secondary px-3 py-0.5"
        >
          <img src={partner.logo.src} alt={partner.name} className="size-5" />
          <p>{partner.name}</p>
        </a>
      ))}
    </div>
  )
}
