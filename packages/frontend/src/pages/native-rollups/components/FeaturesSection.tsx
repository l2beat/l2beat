import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CodeIcon } from '~/icons/Code'
import { GlobeIcon } from '~/icons/Globe'
import { SwapIcon } from '~/icons/Swap'
import { UserIcon } from '~/icons/User'
import { SectionHeading } from './SectionHeading'

const FEATURES = [
  {
    title: 'Custom sequencing',
    description:
      'Define sequencing policy in the rollup contract — centralized sequencing with fast preconfirmations, based sequencing, or a staked network.',
    icon: SwapIcon,
  },
  {
    title: 'Custom governance',
    description:
      "The programmable settlement contract lets a rollup keep its own configuration, such as a DAO-controlled fee recipient or opinionated gas limits, around L1's shared execution rules.",
    icon: UserIcon,
  },
  {
    title: 'Custom gas tokens',
    description:
      'Choose a token other than ETH for transaction fees. Ethereum-native messaging can bridge it from L1 and make it available as the gas token on L2.',
    icon: GlobeIcon,
  },
  {
    title: 'Custom fee collection',
    description:
      'Instead of automatically burning the base fee, direct it to a rollup treasury, sequencer, or another funding mechanism.',
    icon: CodeIcon,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="mt-8 md:mt-12">
      <SectionHeading
        title="Programmable where it matters, standard everywhere else"
        description="Native rollups keep the parts that make a chain distinctive configurable through smart contracts, while execution stays identical to Ethereum."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        <div className="grid gap-px bg-divider sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="bg-surface-primary p-5 md:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-100/10 text-purple-100 dark:bg-pink-200/10 dark:text-pink-200">
                    <Icon aria-hidden className="size-4" />
                  </div>
                  <h3 className="font-bold text-heading-16 md:text-label-value-18">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-3 text-paragraph-15 text-secondary">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </PrimaryCard>
    </section>
  )
}
