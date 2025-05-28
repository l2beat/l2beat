import Image from 'next/image'
import { CustomLink } from '~/components/link/custom-link'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import type { ImageParams } from '~/utils/project/get-image-params'
import { EcosystemWidget } from './ecosystem-widget'

export interface EcosystemGovernanceLinks {
  review: string
  topDelegates: string
  proposals: string
  bankImage: ImageParams
}

interface Props {
  links: EcosystemGovernanceLinks
  topDelegatesBackgroundImage: string
  className?: string
}

export function EcosystemGovernanceLinks({
  links,
  topDelegatesBackgroundImage,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'grid gap-[--spacing] sm:grid-cols-2 sm:grid-rows-2',
        className,
      )}
    >
      <GovernanceLink
        href={links.review}
        bankImage={links.bankImage}
        className="sm:row-span-2"
      />
      <TopDelegatesLink
        href={links.topDelegates}
        backgroundImage={topDelegatesBackgroundImage}
      />
      <ProposalsLink href={links.proposals} />
    </div>
  )
}

function GovernanceLink({
  href,
  bankImage,
  className,
}: { href: string; bankImage: ImageParams; className?: string }) {
  return (
    <EcosystemWidget
      className={cn('flex flex-col overflow-hidden !pt-0', className)}
    >
      <div className="relative flex h-full select-none items-center justify-between gap-2 text-primary">
        <div className="flex flex-col justify-center whitespace-nowrap">
          <div className="text-2xs font-medium uppercase transition-opacity">
            Governance
          </div>
          <div className="origin-left text-xl font-bold transition-all will-change-transform">
            L2BEAT Review
          </div>
        </div>
        <Image
          {...bankImage}
          width={bankImage.width / 3}
          height={bankImage.height / 3}
          alt="Governance Bank"
          className="py-4"
        />
      </div>

      <a
        className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke bg-link/[0.07] px-3 py-2 text-[13px] font-bold leading-none text-link"
        href={href}
      >
        Governance Review
        <ChevronIcon className="size-2.5 -rotate-90 fill-current" />
      </a>
    </EcosystemWidget>
  )
}

function TopDelegatesLink({
  href,
  backgroundImage,
  className,
}: { href: string; backgroundImage: string; className?: string }) {
  return (
    <EcosystemWidget asChild>
      <CustomLink
        variant="plain"
        underline={false}
        href={href}
        className={cn(
          'group relative min-h-[100px] select-none overflow-hidden text-pure-white',
          className,
        )}
      >
        <div
          className="absolute inset-0 origin-left rounded-lg bg-cover transition-all ease-in-out group-hover:scale-125"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black"></div>
        <div className="relative flex h-full flex-col justify-center">
          <div className="text-2xs font-medium uppercase transition-opacity group-hover:opacity-0">
            Governance
          </div>
          <div className="origin-left text-xl font-bold transition-all ease-in-out will-change-transform group-hover:-translate-y-2 group-hover:translate-x-4 group-hover:scale-125">
            Top Delegates
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}

function ProposalsLink({
  href,
  className,
}: { href: string; className?: string }) {
  return (
    <EcosystemWidget asChild>
      <CustomLink
        variant="plain"
        underline={false}
        href={href}
        className={cn(
          'group relative min-h-[100px] select-none overflow-hidden text-primary',
          className,
        )}
      >
        <div className="relative flex h-full flex-col justify-center">
          <div className="text-2xs font-medium uppercase transition-opacity group-hover:opacity-0">
            Governance
          </div>
          <div className="origin-left text-xl font-bold transition-all will-change-transform group-hover:-translate-y-2 group-hover:translate-x-4 group-hover:scale-125">
            Proposals
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}
