import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { FEATURES } from '../consts'
import { SectionHeading } from './SectionHeading'

export function FeaturesSection() {
  return (
    <section id="features" className="mt-8 md:mt-12">
      <SectionHeading
        title="Programmable where it matters, standard everywhere else"
        description="Native rollups keep the parts that make a chain distinctive configurable through smart contracts, while execution stays identical to Ethereum."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <PrimaryCard key={feature.title} className="flex flex-col md:p-6">
            <h3 className="font-bold text-heading-16 md:text-label-value-18">
              {feature.title}
            </h3>
            <p className="mt-2 text-paragraph-15 text-secondary">
              {feature.description}
            </p>
          </PrimaryCard>
        ))}
      </div>
    </section>
  )
}
