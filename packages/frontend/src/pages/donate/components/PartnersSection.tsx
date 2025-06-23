import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
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
        <div className="mt-3 grid gap-3 md:grid-cols-3">
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
          className={`relative h-[135px] cursor-pointer overflow-hidden rounded bg-gradient-radial from-[--ecosystem-secondary] to-[--ecosystem-primary] shadow-lg transition-shadow duration-300 group-hover:shadow-xl md:h-[260px]`}
        >
          {/* Background pattern/texture overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

          {/* Content */}
          <div className="max-md:-translate-y-5 md:group-hover:-translate-y-6 relative z-10 h-full items-center justify-center justify-items-center p-6 text-white transition-transform ease-in-out max-md:grid max-md:grid-cols-[1fr_56px_1fr] md:flex md:flex-col">
            <div className="h-[50px] max-md:h-12">
              <img
                src={partner.ecosystemLogo.dark}
                alt={partner.project.name}
                className="h-full object-contain"
              />
            </div>
            <HorizontalSeparator className="mt-6 mb-4 border-pure-white/40 max-md:hidden" />
            <div className="flex items-center justify-center md:hidden">
              <VerticalSeparator className="h-12 border-pure-white/40 border-t-0" />
            </div>
            <div className="h-16 text-center">
              <p
                className={cn(
                  'text-2xs text-pure-white/70',
                  partner.project.id !== 'arbitrum-orbit' && 'mb-2',
                )}
              >
                PARTNER:
              </p>
              <img
                src={partner.mainPartnerLogo.src}
                width={partner.mainPartnerLogo.width / 2}
                height={partner.mainPartnerLogo.height / 2}
                alt={partner.project.name}
              />
            </div>
            <div className="-translate-x-full pointer-events-none absolute inset-0 transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          </div>

          <div className="ease absolute inset-x-6 bottom-4 flex translate-y-full items-center justify-center rounded border border-link-stroke bg-surface-primary p-3 font-medium text-link text-xs leading-none transition-[opacity,transform] duration-200 ease-in-out max-md:translate-y-0 md:bottom-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            Go to ecosystem page
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
      className="group relative flex h-14 items-center justify-between rounded border border-divider bg-center bg-cover px-6 max-md:pr-4 md:h-20"
    >
      <img
        src={partner.logo.src}
        alt={partner.slug}
        className="h-[42px] w-fit md:h-[52px]"
      />
      <div className="hidden rounded border border-link-stroke bg-surface-primary px-3 py-2 font-medium text-link text-xs leading-none max-md:block">
        Go to Project Details
      </div>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="absolute right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-md:hidden"
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
    <div className="overflow-hidden rounded">
      <table className="w-full">
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.slug} className="h-14 border-divider border-t">
              <td className="pl-7">
                <div className="flex items-center gap-1.5">
                  <img
                    src={partner.logo.src}
                    alt={partner.name}
                    className="size-6 object-contain"
                  />
                  <span className="font-medium text-sm">{partner.name}</span>
                </div>
              </td>
              <td className="p-4">
                <a
                  href={partner.link}
                  className="flex items-center gap-1 font-medium text-link text-xs underline max-md:justify-end"
                >
                  Go to project page <ArrowRightIcon className="size-[14px]" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
