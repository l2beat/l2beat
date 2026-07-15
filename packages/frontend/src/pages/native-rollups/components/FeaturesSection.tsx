import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { FEATURES } from '../consts'
import { SectionHeading } from './SectionHeading'

export function FeaturesSection() {
  return (
    <section id="features" className="mt-8 md:mt-12">
      <SectionHeading
        title="Programmable where it matters, standard everywhere else"
        description="Native rollups keep the parts that make a chain distinctive configurable through smart contracts, while execution stays identical to Ethereum."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className={cn(
                'border-divider p-5 md:p-6',
                index < FEATURES.length - 1 && 'border-b',
                index % 2 === 0 && 'sm:border-r',
                index < 2 ? 'sm:border-b' : 'sm:border-b-0',
                'lg:border-b-0',
                index < FEATURES.length - 1 ? 'lg:border-r' : 'lg:border-r-0',
              )}
            >
              <h3 className="font-bold text-heading-16 md:text-label-value-18">
                {feature.title}
              </h3>
              <p className="mt-2 text-paragraph-15 text-secondary">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </PrimaryCard>
    </section>
  )
}
