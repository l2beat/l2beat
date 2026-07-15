import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { WHY_NATIVE } from '../consts'
import { SectionHeading } from './SectionHeading'

export function WhyNativeSection() {
  return (
    <section id="why-native" className="mt-4 md:mt-6">
      <SectionHeading title="Security and upgrades, inherited from Ethereum" />
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {WHY_NATIVE.map((feature) => (
          <PrimaryCard key={feature.title} className="md:p-8">
            <h3 className="font-bold text-heading-20 md:text-heading-24">
              {feature.title}
            </h3>
            <p className="mt-3 text-paragraph-15 text-secondary md:text-paragraph-16">
              {feature.description}
            </p>
          </PrimaryCard>
        ))}
      </div>
    </section>
  )
}
