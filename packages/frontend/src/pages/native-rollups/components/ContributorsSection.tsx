import { XIcon } from '~/icons/products/X'
import { CONTRIBUTORS } from '../consts'

export function ContributorsSection() {
  return (
    <section className="mt-10 mb-4 md:mt-16 md:mb-8">
      <div className="flex flex-col items-center text-center">
        <span className="font-medium text-purple-100 text-xs uppercase tracking-[0.14px] dark:text-pink-200">
          Team
        </span>
        <h2 className="mt-1.5 font-bold text-heading-24 md:text-heading-32">
          Core contributors
        </h2>
      </div>
      <div className="mx-auto mt-8 flex flex-wrap justify-center gap-6 md:gap-12">
        {CONTRIBUTORS.map((contributor) => (
          <a
            key={contributor.name}
            href={contributor.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex w-40 flex-col items-center md:w-48"
          >
            <div className="relative">
              {/* Gradient ring */}
              <div className="group-hover:-translate-y-1 rounded-full bg-linear-to-br from-purple-100 to-pink-100 p-[3px] transition-transform duration-300 ease-out">
                <img
                  src={contributor.image}
                  alt={contributor.name}
                  width={144}
                  height={144}
                  className="size-28 rounded-full border-4 border-surface-primary object-cover md:size-36"
                />
              </div>
              {/* X badge */}
              <span className="absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full border border-divider bg-surface-primary text-primary shadow-sm transition-colors duration-300 group-hover:bg-linear-to-br group-hover:from-purple-100 group-hover:to-pink-100 group-hover:text-white md:right-2 md:bottom-2">
                <XIcon className="size-3.5 fill-current" />
              </span>
            </div>
            <p className="mt-4 font-bold text-label-value-16 md:text-label-value-18">
              {contributor.name}
            </p>
            <p className="mt-0.5 text-2xs text-secondary uppercase tracking-[0.14px]">
              {contributor.org}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
