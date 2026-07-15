import { XIcon } from '~/icons/products/X'
import { CONTRIBUTORS } from '../consts'
import { SectionHeading } from './SectionHeading'

export function ContributorsSection() {
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
                src={contributor.image}
                alt={contributor.name}
                width={144}
                height={144}
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
