import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from './SectionHeading'

const NEEDS = [
  {
    title: 'Proof-carrying transactions',
    description:
      'A new L1 transaction type that carries program and backend identities plus a public-values commitment, exposed through dedicated EVM opcodes.',
  },
  {
    title: 'A program-agnostic proof engine',
    description:
      'Generalize the EIP-8025-style consensus infrastructure so clients can verify arbitrary guest programs, not only L1 execution proofs.',
  },
  {
    title: 'L1 proof recursion and aggregation',
    description:
      'Recursive aggregation folds proof sidecars into an L1 block proof, avoiding one additional validator-side verification for every rollup update.',
  },
  {
    title: 'Block data availability',
    description:
      'EIP-8142-style Blocks-in-Blobs must bind L2 transactions and block access lists to data that Ethereum makes available.',
  },
  {
    title: 'Proof economics and resource limits',
    description:
      'Proof propagation needs pricing, size bounds, backend diversity rules, and protection against excessive builder and client workloads.',
  },
  {
    title: 'Stable program identity',
    description:
      'Custom guest programs need identifiers that survive zkVM patches. Native EVM rollups avoid this issue by always referring to the execution program recognized by Ethereum.',
  },
]

export function CoreProtocolSection() {
  return (
    <section id="dependencies" className="mt-8 md:mt-12">
      <SectionHeading
        title="What Ethereum still needs"
        description="Native proof verification depends on several unfinished L1 components and unresolved protocol choices."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <ul className="grid gap-px bg-divider md:grid-cols-2">
          {NEEDS.map((need) => (
            <li key={need.title} className="bg-surface-primary p-5 md:p-6">
              <h3 className="font-bold text-label-value-16 md:text-label-value-18">
                {need.title}
              </h3>
              <p className="mt-1.5 text-paragraph-15 text-secondary md:text-paragraph-16">
                {need.description}
              </p>
            </li>
          ))}
        </ul>
      </PrimaryCard>
    </section>
  )
}
