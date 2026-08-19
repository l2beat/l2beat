import { INTEGRATE_CROPS_PATH, SUBMIT_PROTOCOL_PATH } from '../submit/links'
import { CalloutCard } from './CalloutCard'

/**
 * The two ways out of the garden, side by side: get reviewed, or show the
 * reviews. They are a pair rather than a stack because neither is a follow-up
 * to the other - a reader is one audience or the other, and stacking made the
 * second look like a footnote to the first.
 */
export function GardenCallouts() {
  return (
    <section className="mt-4 grid gap-4 max-md:px-4 md:mt-6 md:grid-cols-2">
      <CalloutCard
        tone="garden"
        title="Want your protocol in the garden?"
        description="See what we look for in each crop, then send it in."
        cta="Submit your protocol"
        href={SUBMIT_PROTOCOL_PATH}
      />
      <CalloutCard
        tone="brand"
        title="Want to show the CROPS to your users?"
        description="A keyless JSON API, and a badge for protocols we have reviewed."
        cta="Integrate CROPS"
        href={INTEGRATE_CROPS_PATH}
      />
    </section>
  )
}
