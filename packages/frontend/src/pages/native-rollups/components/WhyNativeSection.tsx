import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { WHY_NATIVE } from '../consts'

export function WhyNativeSection() {
  return (
    <section className="mt-4 md:mt-6">
      <SectionHeading
        eyebrow="Why native"
        title="Security and upgrades, inherited from Ethereum"
      />
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {WHY_NATIVE.map((feature) => {
          const Icon = feature.icon
          return (
            <PrimaryCard
              key={feature.title}
              className="group relative overflow-hidden md:p-8"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-purple-100 to-pink-100" />
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-100 to-pink-100 text-white">
                <Icon className="size-6 fill-current" />
              </div>
              <h3 className="font-bold text-heading-20 md:text-heading-24">
                {feature.title}
              </h3>
              <p className="mt-3 text-paragraph-15 text-secondary md:text-paragraph-16">
                {feature.description}
              </p>
            </PrimaryCard>
          )
        })}
      </div>
    </section>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-4 max-md:px-4 md:mb-6">
      <span className="font-medium text-purple-100 text-xs uppercase tracking-[0.14px] dark:text-pink-200">
        {eyebrow}
      </span>
      <h2 className="mt-1.5 font-bold text-heading-24 md:text-heading-32">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-3xl text-paragraph-15 text-secondary md:text-paragraph-16">
          {description}
        </p>
      )}
    </div>
  )
}
