import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { FEATURES } from '../consts'
import { SectionHeading } from './WhyNativeSection'

export function FeaturesSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        eyebrow="Features"
        title="Programmable where it matters, standard everywhere else"
        description="Native rollups keep the parts that make a chain distinctive configurable through smart contracts, while execution stays identical to Ethereum."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <PrimaryCard
              key={feature.title}
              className="group hover:-translate-y-1 relative flex flex-col overflow-hidden transition-transform duration-300 ease-out md:p-6"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-divider bg-surface-secondary text-purple-100 transition-colors duration-300 group-hover:border-transparent group-hover:bg-linear-to-br group-hover:from-purple-100 group-hover:to-pink-100 group-hover:text-white dark:text-pink-200">
                <Icon className="size-5 fill-current" />
              </div>
              <h3 className="font-bold text-heading-16 md:text-label-value-18">
                {feature.title}
              </h3>
              <p className="mt-2 text-paragraph-15 text-secondary">
                {feature.description}
              </p>
            </PrimaryCard>
          )
        })}
      </div>
    </section>
  )
}
