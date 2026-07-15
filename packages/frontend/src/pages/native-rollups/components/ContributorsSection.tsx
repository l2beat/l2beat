import { XIcon } from '~/icons/products/X'
import type { ImageParams } from '~/utils/project/getImageParams'
import { SectionHeading } from './SectionHeading'

export interface ContributorImages {
  lucaDonno: ImageParams
  justinDrake: ImageParams
}

const CONTRIBUTORS = [
  {
    name: 'Luca Donno',
    org: 'L2BEAT',
    image: 'lucaDonno',
    href: 'https://x.com/donnoh_eth',
  },
  {
    name: 'Justin Drake',
    org: 'Ethereum Foundation',
    image: 'justinDrake',
    href: 'https://x.com/drakefjustin',
  },
] as const

export function ContributorsSection({ images }: { images: ContributorImages }) {
  return (
    <section id="contributors" className="mt-8 mb-4 md:mt-12 md:mb-8">
      <SectionHeading title="Core contributors" />
      <div className="flex flex-wrap gap-8 max-md:px-4 md:gap-12">
        {CONTRIBUTORS.map((contributor) => (
          <a
            key={contributor.name}
            href={contributor.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex w-40 flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-brand md:w-48"
          >
            <div className="relative">
              <img
                {...images[contributor.image]}
                alt={contributor.name}
                className="size-28 rounded-full border border-divider object-cover md:size-36"
              />
              <span className="absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full border border-divider bg-surface-primary text-primary shadow-sm md:right-2 md:bottom-2">
                <XIcon className="size-3.5 fill-current" />
              </span>
            </div>
            <p className="mt-4 font-bold text-label-value-16 group-hover:underline md:text-label-value-18">
              {contributor.name}
            </p>
            <p className="mt-0.5 text-2xs text-secondary">{contributor.org}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
