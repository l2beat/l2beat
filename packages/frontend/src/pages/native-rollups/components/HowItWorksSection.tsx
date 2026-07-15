import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { HOW_IT_WORKS } from '../consts'
import { SectionHeading } from './SectionHeading'

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mt-8 md:mt-12">
      <SectionHeading
        title="From an L2 block to an L1-verified state root"
        description="A native rollup proves its blocks against Ethereum's own execution program, submits the proof to L1, and lets its settlement contract advance the chain."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <ol className="grid md:grid-cols-2 xl:grid-cols-4">
          {HOW_IT_WORKS.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                'border-divider p-5 md:p-6',
                index < HOW_IT_WORKS.length - 1 && 'border-b',
                index % 2 === 0 && 'md:border-r',
                index < 2 ? 'md:border-b' : 'md:border-b-0',
                'xl:border-b-0',
                index < HOW_IT_WORKS.length - 1
                  ? 'xl:border-r'
                  : 'xl:border-r-0',
              )}
            >
              <span className="font-bold text-heading-32 text-purple-100 dark:text-pink-200">
                <span className="sr-only">Step </span>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-bold text-heading-18">{step.title}</h3>
              <p className="mt-2 text-paragraph-15 text-secondary">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </PrimaryCard>
    </section>
  )
}
