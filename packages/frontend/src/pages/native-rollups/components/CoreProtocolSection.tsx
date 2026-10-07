import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from './SectionHeading'

const NEEDS = [
  {
    title: 'Mandatory execution proofs',
    description:
      'One L1 block proof that validators verify instead of re-executing, and that also covers the rollups’ proofs. Expected in K* at the earliest under the current strawmap.',
  },
  {
    title: 'Frame transactions (EIP-8141)',
    description:
      'The transaction envelope that carries an L2 block and declares its proof. Scheduled for Hegotá.',
  },
  {
    title: 'Proof dependencies (EIP-8288)',
    description:
      'Proofs declared by transactions and aggregated recursively in the mempool and by the builder. A Draft, with open questions on mempool proving costs and on how the aggregate enters the block proof.',
  },
  {
    title: 'EVM verification key registry (EIP-8357)',
    description:
      'Records which verification key is Ethereum’s EVM program at each fork, so rollups follow L1 upgrades without their own governance. Under review.',
  },
  {
    title: 'A zkVM for arbitrary programs',
    description:
      'The zkVM shared by L1 and EIP-8288 must prove the stateless validation program and verify proofs of any program under its key. leanVM is moving to RISC-V toward this.',
  },
  {
    title: 'Block data availability',
    description:
      'Block-in-Blobs (EIP-8142) binds L2 transactions and block access lists to data that Ethereum makes available. It was declined for Hegotá.',
  },
]

export function CoreProtocolSection() {
  return (
    <section id="dependencies" className="mt-8 md:mt-12">
      <SectionHeading
        title="What Ethereum still needs"
        description="Native rollups depend on several unfinished L1 components and open protocol questions."
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
