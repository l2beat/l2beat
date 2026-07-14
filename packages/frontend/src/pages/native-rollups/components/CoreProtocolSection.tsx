import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CORE_PROTOCOL_NEEDS } from '../consts'
import { SectionHeading } from './WhyNativeSection'

export function CoreProtocolSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        eyebrow="Dependencies"
        title="What Ethereum still needs"
        description="Native proof verification depends on several unfinished L1 components and unresolved protocol choices."
      />
      <PrimaryCard className="md:p-8">
        <ul className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {CORE_PROTOCOL_NEEDS.map((need) => (
            <li key={need.title} className="flex gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-100 to-pink-100 text-white">
                <ArrowRightIcon className="size-3 fill-current" />
              </span>
              <div>
                <h3 className="font-bold text-label-value-15 md:text-label-value-16">
                  {need.title}
                </h3>
                <p className="mt-1 text-paragraph-15 text-secondary">
                  {need.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </PrimaryCard>
    </section>
  )
}
