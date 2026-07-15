import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { HOW_IT_WORKS } from '../consts'
import { SectionHeading } from './SectionHeading'

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mt-8 md:mt-12">
      <SectionHeading
        title="From an L2 block to an L1-verified state root"
        description="A native rollup proves its blocks against Ethereum's own execution program, submits the proof to L1, and lets its settlement contract advance the chain."
      />
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {HOW_IT_WORKS.map((step, index) => (
          <li key={step.title}>
            <PrimaryCard className="h-full md:p-6">
              <span className="font-medium text-secondary text-xs">
                Step {index + 1}
              </span>
              <h3 className="mt-3 font-bold text-heading-18">{step.title}</h3>
              <p className="mt-2 text-paragraph-15 text-secondary">
                {step.description}
              </p>
            </PrimaryCard>
          </li>
        ))}
      </ol>
    </section>
  )
}
