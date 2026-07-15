import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from './SectionHeading'

const STEPS = [
  {
    title: 'Build and prove an L2 block',
    description:
      "The operator executes an L2 block and proves Ethereum's stateless payload-validation program with one or more supported zkVM backends.",
  },
  {
    title: 'Submit a proof-carrying transaction',
    description:
      'A new L1 transaction type commits to the L2 data in blobs, the proof backends and program identity, and a hash of the proof’s public values.',
  },
  {
    title: 'Ethereum verifies the proofs',
    description:
      'Raw proofs travel in ephemeral sidecars. Ethereum clients validate them through a program-agnostic proof engine, while recursive aggregation keeps verification efficient at scale.',
  },
  {
    title: 'The rollup advances its state',
    description:
      'The rollup contract confirms that Ethereum verified the right program and block data, then accepts the new L2 state root.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mt-8 md:mt-12">
      <SectionHeading
        title="From an L2 block to an L1-verified state root"
        description="A native rollup proves its blocks against Ethereum's own execution program, submits the proof to L1, and lets its settlement contract advance the chain."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <ol className="grid gap-px bg-divider md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="bg-surface-primary p-5 md:p-6">
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
