import { INTEGRATE_CROPS_PATH, SUBMIT_PROTOCOL_PATH } from '../paths'
import { CalloutCard } from './CalloutCard'

export function GardenCallouts() {
  return (
    <section className="mt-4 grid gap-4 max-md:px-4 md:mt-6 md:grid-cols-2">
      <CalloutCard
        tone="garden"
        title="Get your protocol reviewed"
        description="Check it against the criteria below before submitting."
        cta="Submit your protocol"
        href={SUBMIT_PROTOCOL_PATH}
      />
      <CalloutCard
        tone="brand"
        title="Show CROPS ratings in your app"
        description="A keyless JSON API, and a badge for protocols we have reviewed."
        cta="Integrate CROPS"
        href={INTEGRATE_CROPS_PATH}
      />
    </section>
  )
}
