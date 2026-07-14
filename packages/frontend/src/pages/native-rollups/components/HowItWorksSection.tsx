import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { HOW_IT_WORKS } from '../consts'
import { SectionHeading } from './WhyNativeSection'

export function HowItWorksSection() {
  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        eyebrow="How it works"
        title="From an L2 block to an L1-verified state root"
        description="A native rollup proves its blocks against Ethereum's own execution program, submits the proof to L1, and lets its settlement contract advance the chain."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {HOW_IT_WORKS.map((step, index) => (
          <div key={step.number} className="relative">
            <PrimaryCard className="relative h-full overflow-hidden md:p-6">
              <span className="font-bold text-purple-100 text-xs uppercase tracking-[0.14px] dark:text-pink-200">
                Step {step.number}
              </span>
              <h3 className="mt-3 font-bold text-heading-18">{step.title}</h3>
              <p className="mt-2 text-paragraph-15 text-secondary">
                {step.description}
              </p>
            </PrimaryCard>
            {index < HOW_IT_WORKS.length - 1 && (
              <span className="-right-3 -translate-y-1/2 absolute top-1/2 z-10 hidden size-6 items-center justify-center rounded-full bg-linear-to-br from-purple-100 to-pink-100 text-white xl:flex">
                <ArrowRightIcon className="size-3 fill-current" />
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
