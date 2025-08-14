import { CustomLink } from '~/components/link/CustomLink'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import type { ImageParams } from '~/utils/project/getImageParams'
import { EcosystemWidget } from './EcosystemWidget'

export interface EcosystemGovernanceLinks {
  review: string
  delegateToL2BEAT: string
  proposals: string
  bankImage: ImageParams
}

interface Props {
  links: EcosystemGovernanceLinks
  delegateToL2BEATBackgroundImage: string
  className?: string
}

export function EcosystemGovernanceLinks({
  links,
  delegateToL2BEATBackgroundImage,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'grid gap-(--ecosystem-spacing) sm:grid-cols-2 sm:grid-rows-2',
        className,
      )}
    >
      <GovernanceLink
        href={links.review}
        bankImage={links.bankImage}
        className="sm:row-span-2"
      />
      <DelegateToL2BEATLink
        href={links.delegateToL2BEAT}
        backgroundImage={delegateToL2BEATBackgroundImage}
      />
      <ProposalsLink href={links.proposals} />
    </div>
  )
}

function GovernanceLink({
  href,
  bankImage,
  className,
}: {
  href: string
  bankImage: ImageParams
  className?: string
}) {
  return (
    <EcosystemWidget
      className={cn('flex flex-col overflow-hidden pt-0!', className)}
    >
      <div className="relative flex h-full select-none items-center justify-between gap-2 text-primary">
        <div className="flex flex-col justify-center whitespace-nowrap">
          <div className="font-medium text-2xs uppercase">Governance</div>
          <div className="font-bold text-xl">L2BEAT Review</div>
        </div>
        <img
          {...bankImage}
          width={bankImage.width / 3}
          height={bankImage.height / 3}
          alt="Governance Bank"
          className="py-4"
        />
      </div>

      <a
        className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke bg-link/[0.07] px-3 py-2 font-bold text-[13px] text-link leading-none"
        href={href}
      >
        Governance Review
        <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
      </a>
    </EcosystemWidget>
  )
}

function DelegateToL2BEATLink({
  href,
  backgroundImage,
  className,
}: {
  href: string
  backgroundImage: string
  className?: string
}) {
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
          className="absolute inset-0 origin-left rounded-lg bg-cover transition-[scale] ease-in-out group-hover:scale-125"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-black" />
        <div className="relative flex h-full flex-col justify-center">
          <div className="font-medium text-2xs uppercase transition-opacity group-hover:opacity-0">
            Governance
          </div>
          <div className="group-hover:-translate-y-2 origin-left font-bold text-xl transition-[translate,scale] ease-in-out group-hover:translate-x-4 group-hover:scale-125">
            Delegate to L2BEAT
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}

function ProposalsLink({
  href,
  className,
}: {
  href: string
  className?: string
}) {
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
          <div className="font-medium text-2xs uppercase transition-opacity group-hover:opacity-0">
            Governance
          </div>
          <div className="group-hover:-translate-y-2 origin-left font-bold text-xl transition-[translate,scale] ease-in-out group-hover:translate-x-4 group-hover:scale-125">
            Proposals
          </div>
        </div>
      </CustomLink>
    </EcosystemWidget>
  )
}
