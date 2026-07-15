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
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <ul className="grid gap-px bg-divider md:grid-cols-2">
          {CORE_PROTOCOL_NEEDS.map((need) => (
            <li key={need.title} className="bg-surface-primary p-5 md:p-6">
              <h3 className="font-bold text-label-value-16 md:text-label-value-18">
                {need.title}
              </h3>
              <p className="mt-1.5 text-paragraph-15 text-secondary md:text-paragraph-16">
                {need.description}
              </p>
            </li>
          ))}
        </ul>
      </PrimaryCard>
    </section>
  )
}
