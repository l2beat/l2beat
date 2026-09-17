import { Fragment, type ReactNode } from 'react'
import type { BadgeVariant } from '../badge'
import { BadgeHtml } from './BadgeHtml'
import { WalletMock } from './WalletMock'

export function AudiencePicker({
  consumersId,
  protocolsId,
}: {
  consumersId: string
  protocolsId: string
}) {
  return (
    <section className="mt-6 grid gap-4 max-md:px-4 md:mt-8 md:grid-cols-2 md:gap-6">
      <AudienceCard
        href={`#${consumersId}`}
        eyebrow="For wallets, explorers and interfaces"
        title="Show the crops"
        description="Get the crops for a protocol based on id or a contract address."
        cta="Read the API"
        art={<WalletMock />}
      />
      <AudienceCard
        href={`#${protocolsId}`}
        eyebrow="For reviewed protocols"
        title="Wear the badge"
        description="If we have reviewed you and named you in the onchain set, you can say so on your own site."
        cta="Get the badge"
        art={<BadgeArt />}
      />
    </section>
  )
}

function AudienceCard({
  href,
  eyebrow,
  title,
  description,
  cta,
  art,
}: {
  href: string
  eyebrow: string
  title: string
  description: string
  cta: string
  art: ReactNode
}) {
  return (
    <a
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface-primary transition-colors hover:border-garden-accent/60"
    >
      <div className="flex min-h-[220px] items-center justify-center bg-gradient-to-b from-garden-tint to-surface-primary px-6 py-8">
        {art}
      </div>
      <div className="flex grow flex-col border-divider border-t p-5 md:p-6">
        <span className="font-semibold text-garden-accent text-subtitle-12 uppercase tracking-wider">
          {eyebrow}
        </span>
        <h2 className="mt-1.5 font-bold text-heading-20 md:text-heading-24">
          {title}
        </h2>
        <p className="mt-2 grow text-paragraph-14 text-secondary md:text-paragraph-15">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-paragraph-14 group-hover:underline">
          {cta}
          <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </a>
  )
}

const ART_VARIANTS: BadgeVariant[] = ['full', 'compact']

/** The real badges, without a link since the card around them is one. */
function BadgeArt() {
  return (
    <div className="flex flex-col items-center gap-3">
      {ART_VARIANTS.map((variant) => (
        <Fragment key={variant}>
          <BadgeHtml
            options={{ variant, theme: 'light' }}
            className="dark:hidden"
          />
          <BadgeHtml
            options={{ variant, theme: 'dark' }}
            className="hidden dark:block"
          />
        </Fragment>
      ))}
    </div>
  )
}
