import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { WHY_NATIVE } from '../consts'
import { SectionHeading } from './SectionHeading'

export function WhyNativeSection() {
  return (
    <section id="why-native" className="mt-4 md:mt-6">
      <SectionHeading title="Security and upgrades, inherited from Ethereum" />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <div className="h-1 bg-purple-100 dark:bg-pink-200" />
        <div className="grid md:grid-cols-2">
          {WHY_NATIVE.map((feature) => (
            <article
              key={feature.title}
              className="border-divider p-5 first:border-b md:p-8 md:first:border-r md:first:border-b-0"
            >
              <h3 className="font-bold text-heading-20 md:text-heading-24">
                {feature.title}
              </h3>
              <p className="mt-3 text-paragraph-15 text-secondary md:text-paragraph-16">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </PrimaryCard>
    </section>
  )
}
