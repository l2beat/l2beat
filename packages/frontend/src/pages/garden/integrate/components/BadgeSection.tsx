import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { SectionHeading } from '../../components/SectionHeading'
import { SproutIcon } from '../../components/SproutIcon'
import { BADGE_RULES } from '../content'
import { BadgeStudio } from './BadgeStudio'
import { Markup } from './Markup'

export function BadgeSection({ href }: { href: string }) {
  return (
    <>
      <section className="mt-6 md:mt-8">
        <SectionHeading
          title="Wear the badge"
          description="If your project is in the attested set, the badge is yours to use. It is one anchor tag with inline styles - no script, no stylesheet, and no image served from our domain, so it cannot slow your page down or break when we deploy."
        />
        <div className="max-md:mx-4">
          <BadgeStudio href={href} />
        </div>
      </section>

      <section className="mt-8 md:mt-12">
        <SectionHeading title="Using it fairly" size="md" />
        <PrimaryCard className="max-md:mx-4 md:p-8">
          <ul className="flex flex-col gap-3">
            {BADGE_RULES.map((rule) => (
              <li
                key={rule}
                className="flex gap-3 text-paragraph-14 text-secondary md:text-paragraph-16"
              >
                <SproutIcon className="mt-1 size-4 shrink-0 text-garden-accent" />
                <span>
                  <Markup text={rule} />
                </span>
              </li>
            ))}
          </ul>
        </PrimaryCard>
      </section>
    </>
  )
}
