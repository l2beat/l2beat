import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { NativeProofVerificationDiagram } from '../assets/NativeProofVerificationDiagram'
import { SectionHeading } from './SectionHeading'

const CAPABILITIES = [
  {
    title: 'Program-agnostic',
    description:
      'The proof engine can verify arbitrary guest programs, making the primitive useful to custom-VM rollups and other ZK applications too.',
  },
  {
    title: 'Protocol-level multi-proof',
    description:
      'A transaction can require distinct zkVM backends to prove the same statement, without a rollup deploying its own proof router.',
  },
  {
    title: 'Client-managed verification',
    description:
      'zkVM verification fixes can ship in Ethereum client releases instead of every project separately upgrading onchain verifier contracts.',
  },
]

export function NativeProofVerificationSection() {
  return (
    <section id="native-proof-verification" className="mt-8 md:mt-12">
      <SectionHeading
        title="Native proof verification is the more general primitive"
        description="Native rollups are one use of a broader proposal: let any smart contract consume proofs already verified by Ethereum's consensus infrastructure."
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
            <div className="rounded-lg bg-purple-100/5 p-4 dark:bg-pink-200/5">
              <dt className="font-bold text-label-value-16 text-purple-100 dark:text-pink-200">
                Native EVM program
              </dt>
              <dd className="mt-1 text-paragraph-15 text-secondary">
                Always refers to the EVM program recognized by Ethereum, so the
                rollup automatically follows L1 execution upgrades.
              </dd>
            </div>
            <div className="rounded-lg bg-surface-secondary p-4">
              <dt className="font-bold text-label-value-16">
                Custom guest program
              </dt>
              <dd className="mt-1 text-paragraph-15 text-secondary">
                Uses project-chosen program hashes and can implement another VM
                or application, but does not automatically inherit
                Ethereum&apos;s execution semantics.
              </dd>
            </div>
          </dl>
        </div>
      </PrimaryCard>
    </section>
  )
}
