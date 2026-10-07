import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from './SectionHeading'

const STEPS = [
  {
    title: 'Build and prove an L2 block',
    description:
      "The operator executes an L2 block and proves it with Ethereum's stateless validation program, the same program that proves L1's own blocks.",
  },
  {
    title: 'Post a frame transaction',
    description:
      'An EIP-8141 frame transaction carries the block data in blobs, declares the proof as an EIP-8288 dependency, and calls the rollup contract.',
  },
  {
    title: 'Ethereum covers the proof',
    description:
      "Proofs travel through the mempool and never enter the block. Mempool nodes and the builder aggregate them recursively, and Ethereum's mandatory block proof covers the aggregate.",
  },
  {
    title: 'The rollup advances its state',
    description:
      'The rollup contract rebuilds what the proof must commit to, checks the program against the EIP-8357 registry, and accepts the new L2 state root.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mt-8 md:mt-12">
      <SectionHeading
        title="From an L2 block to an L1-verified state root"
        description="A native rollup proves its blocks with Ethereum's own execution program, declares each proof in an L1 transaction, and lets its rollup contract advance the chain."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <ol className="grid gap-px bg-divider md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="bg-surface-primary p-5 md:p-6">
              <span className="font-bold text-(--accent) text-heading-32">
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
