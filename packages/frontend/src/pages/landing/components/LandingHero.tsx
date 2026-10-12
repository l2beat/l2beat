import { ChevronIcon } from '~/icons/Chevron'
import { LANDING_CONTAINER_CLASS } from '../landingStyles'

// TODO: point at the mandate once it is published; About Us, with our
// mission, stands in until then.
const MANDATE_HREF = '/about-us'

/**
 * The tagline, centred and in the serif the garden speaks in, a plain line
 * under it for someone who has never heard of us, and the mandate as one
 * underlined link: part of the hero, not a banner.
 */
export function LandingHero() {
  return (
    <section
      className={`${LANDING_CONTAINER_CLASS} flex flex-col items-center gap-4 pt-12 pb-10 text-center md:pt-16 md:pb-14`}
    >
      <h1 className="max-w-[720px] text-balance font-light font-roboto-serif text-[30px] leading-[1.15] tracking-[-0.02em] md:text-[36px] lg:text-[40px]">
        Placeholder for the L2BEAT tagline
      </h1>
      <p className="max-w-[560px] text-pretty text-base text-secondary leading-snug md:text-lg">
        A second line that says what we do, for someone who has never heard of
        us.
      </p>
      <a
        href={MANDATE_HREF}
        className="group mt-1 inline-flex items-center gap-2 border-chart-pink border-b pb-0.5 font-medium text-label-value-15 transition-colors hover:text-chart-pink"
      >
        Read our mandate
        <ChevronIcon className="-rotate-90 size-2.5 fill-chart-pink transition-transform group-hover:translate-x-0.5" />
      </a>
    </section>
  )
}
