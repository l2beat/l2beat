import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ShieldIcon } from '~/icons/Shield'
import { SectionHeading } from './WhyNativeSection'

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
    <section className="mt-8 md:mt-12">
      <SectionHeading
        eyebrow="Beyond native rollups"
        title="Native proof verification is the more general primitive"
        description="Native rollups are one use of a broader proposal: let any smart contract consume proofs already verified by Ethereum's consensus infrastructure."
      />
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        <PrimaryCard className="md:p-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {CAPABILITIES.map((capability) => (
              <div key={capability.title}>
                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-purple-100 to-pink-100 text-white">
                  <ShieldIcon className="size-4.5 fill-current" />
                </div>
                <h3 className="font-bold text-label-value-16">
                  {capability.title}
                </h3>
                <p className="mt-1.5 text-paragraph-15 text-secondary">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </PrimaryCard>
        <PrimaryCard className="md:p-8">
          <h3 className="font-bold text-heading-20">Native or custom?</h3>
          <dl className="mt-5 space-y-5">
            <div>
              <dt className="font-bold text-label-value-16 text-purple-100 dark:text-pink-200">
                Native EVM program
              </dt>
              <dd className="mt-1 text-paragraph-15 text-secondary">
                Always refers to the EVM program recognized by Ethereum, so the
                rollup automatically follows L1 execution upgrades.
              </dd>
            </div>
            <div>
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
        </PrimaryCard>
      </div>
    </section>
  )
}
