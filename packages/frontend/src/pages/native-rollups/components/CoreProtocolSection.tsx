import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CORE_PROTOCOL_NEEDS } from '../consts'
import { SectionHeading } from './SectionHeading'

export function CoreProtocolSection() {
  return (
    <section id="dependencies" className="mt-8 md:mt-12">
      <SectionHeading
        title="What Ethereum still needs"
        description="Native proof verification depends on several unfinished L1 components and unresolved protocol choices."
      />
      <PrimaryCard className="md:p-8">
        <ul className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {CORE_PROTOCOL_NEEDS.map((need) => (
            <li key={need.title}>
              <h3 className="font-bold text-label-value-15 md:text-label-value-16">
                {need.title}
              </h3>
              <p className="mt-1 text-paragraph-15 text-secondary">
                {need.description}
              </p>
            </li>
          ))}
        </ul>
      </PrimaryCard>
    </section>
  )
}
