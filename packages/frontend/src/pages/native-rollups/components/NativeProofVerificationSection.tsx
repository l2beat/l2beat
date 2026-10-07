import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { NativeProofVerificationDiagram } from '../assets/NativeProofVerificationDiagram'
import { SectionHeading } from './SectionHeading'

const CAPABILITIES = [
  {
    title: 'Program-agnostic',
    description:
      "A transaction can depend on a proof of any program, under that program's verification key, making the primitive useful to custom-VM rollups and other ZK applications too.",
  },
  {
    title: 'Aggregated, not verified one by one',
    description:
      "Proofs never enter the block. Mempool nodes and the builder fold them into one recursive proof, which Ethereum's block proof covers.",
  },
  {
    title: 'Protocol-managed verification',
    description:
      'Verifier fixes ship with Ethereum upgrades instead of every project separately upgrading onchain verifier contracts.',
  },
]

export function NativeProofVerificationSection() {
  return (
    <section id="native-proof-verification" className="mt-8 md:mt-12">
      <SectionHeading
        title="Native rollups are a special case of generalized proof verification"
        description="EIP-8288 lets any transaction depend on proofs that Ethereum verifies. Native rollups are the minimal case: they use Ethereum's own EVM program."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <div className="grid lg:grid-cols-[1fr_1.4fr]">
          <div className="flex items-center justify-center border-divider border-b p-6 lg:border-r lg:border-b-0">
            <NativeProofVerificationDiagram className="h-auto w-full max-w-[360px]" />
          </div>
          <div>
            {CAPABILITIES.map((capability, index) => (
              <div
                key={capability.title}
                className={cn(
                  'border-divider p-5 md:p-6',
                  index < CAPABILITIES.length - 1 && 'border-b',
                )}
              >
                <h3 className="font-bold text-label-value-16">
                  {capability.title}
                </h3>
                <p className="mt-1.5 text-paragraph-15 text-secondary">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-divider border-t p-5 md:p-6">
          <h3 className="font-bold text-heading-20">Native or custom?</h3>
          <dl className="mt-4 grid gap-3 md:grid-cols-2 md:gap-4">
            <div className="rounded-lg bg-(--accent)/5 p-4">
              <dt className="font-bold text-(--accent) text-label-value-16">
                Native EVM program
              </dt>
              <dd className="mt-1 text-paragraph-15 text-secondary">
                Refers to the EVM program that Ethereum records in the EIP-8357
                registry, following the current entry to inherit L1 execution
                upgrades, or pinning an earlier one.
              </dd>
            </div>
            <div className="rounded-lg bg-surface-secondary p-4">
              <dt className="font-bold text-label-value-16">
                Custom guest program
              </dt>
              <dd className="mt-1 text-paragraph-15 text-secondary">
                Uses project-chosen verification keys and can implement another
                VM or application, but does not automatically inherit
                Ethereum&apos;s execution semantics.
              </dd>
            </div>
          </dl>
        </div>
      </PrimaryCard>
    </section>
  )
}
