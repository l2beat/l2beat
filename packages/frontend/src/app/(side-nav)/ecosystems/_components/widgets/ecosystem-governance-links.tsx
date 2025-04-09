import Image from 'next/image'
import Link from 'next/link'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'
import { EcosystemWidget } from './ecosystem-widget'

export interface EcosystemGovernanceLinks {
  review: string
  reviewThumbnail: string
  topDelegates: string
  proposals: string
}

interface Props {
  links: EcosystemGovernanceLinks
  className?: string
}

export function EcosystemGovernanceLinks({ links, className }: Props) {
  return (
    <div
      className={cn('grid grid-cols-2 grid-rows-2 gap-[--spacing]', className)}
    >
      <EcosystemWidget className="row-span-2 flex flex-col !p-0">
        <Image
          src={links.reviewThumbnail}
          alt="Governance Review"
          width={1200}
          height={674}
          className="w-full rounded-t-xl"
        />

        <div className="m-auto px-6 py-5">
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 text-[13px] font-bold leading-none text-link"
            href={links.review}
          >
            Governance Review
            <ChevronIcon className="size-2.5 -rotate-90 fill-current" />
          </Link>
        </div>
      </EcosystemWidget>
      <EcosystemWidget asChild>
        <a
          target="_blank"
          href={links.topDelegates}
          className="relative flex items-center bg-[url(/ecosystems/governance-delegates.png)] bg-cover text-xl font-bold text-primary-invert"
        >
          <div className="absolute inset-y-0 left-0 w-1/2 rounded-xl bg-gradient-to-r from-black"></div>
          <div className="relative z-10 text-pure-white">
            Governance
            <br />
            Top Delegates
          </div>
        </a>
      </EcosystemWidget>
      <EcosystemWidget asChild>
        <a
          target="_blank"
          href={links.proposals}
          className="flex items-center text-xl font-bold"
        >
          <div>
            Governance
            <br />
            Proposals
          </div>
        </a>
      </EcosystemWidget>
    </div>
  )
}
