import { externalLinks } from '~/consts/externalLinks'
import { CustomLinkIcon } from '~/icons/Outlink'
import type { HomeResearchItem } from '~/pages/home/getHomeResearch'
import { HOME_THUMBNAIL_CLASS } from '~/pages/home/homeStyles'
import { formatPublicationDate } from '~/utils/dates'
import {
  LANDING_CONTAINER_CLASS,
  LANDING_SECTION_LABEL_CLASS,
} from '../landingStyles'
import { LandingSectionHeader } from './LandingSectionHeader'

/**
 * The written half of the page: our latest research as a plain list, and
 * where to talk to us. Two columns from md, stacked below.
 */
export function LandingTextSections({
  research,
}: {
  research: HomeResearchItem[]
}) {
  return (
    <section
      className={`${LANDING_CONTAINER_CLASS} grid grid-cols-1 gap-x-12 gap-y-12 pt-12 pb-14 md:grid-cols-2 md:pt-16 md:pb-20`}
    >
      <div className="min-w-0">
        <LandingSectionHeader
          title="Research"
          link={{ title: 'All publications', href: '/publications' }}
          labelClassName={LANDING_SECTION_LABEL_CLASS}
        />
        <Research items={research} />
      </div>
      <div className="min-w-0">
        <LandingSectionHeader
          title="Community"
          labelClassName={LANDING_SECTION_LABEL_CLASS}
        />
        <ul className="flex flex-col gap-3">
          <li>
            <CommunityBox
              title="Have a question?"
              description="Ask about our data, give feedback on our frameworks, or request research into a new project on the forum."
              href={externalLinks.forum}
            />
          </li>
          <li>
            <CommunityBox
              title="Governance newsletter"
              description="Weekly, on Substack."
              href={externalLinks.substackSubscribe}
            />
          </li>
        </ul>
      </div>
    </section>
  )
}

function Research({ items }: { items: HomeResearchItem[] }) {
  if (items.length === 0) {
    return null
  }
  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const isExternal = !item.url.startsWith('/')
        return (
          <li key={item.id} className="border-divider border-t">
            <a
              href={item.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer noopener' : undefined}
              className="group flex items-center gap-3 py-3"
            >
              <img
                src={item.thumbnail.src}
                alt=""
                loading="lazy"
                className={HOME_THUMBNAIL_CLASS}
              />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="line-clamp-2 text-pretty font-medium text-label-value-15 leading-snug underline-offset-4 group-hover:underline">
                  {item.shortTitle ?? item.title}
                </span>
                <span className="font-normal text-label-value-12 text-secondary">
                  {formatPublicationDate(new Date(item.publishedOn * 1000))}
                </span>
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function CommunityBox({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-center justify-between gap-4 rounded-xl border border-divider px-5 py-4 transition-colors hover:border-link-stroke"
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-semibold text-label-value-16 leading-tight">
          {title}
        </span>
        <span className="text-pretty text-label-value-13 text-secondary leading-snug">
          {description}
        </span>
      </span>
      <CustomLinkIcon className="size-3.5 shrink-0 fill-secondary transition-colors group-hover:fill-primary" />
    </a>
  )
}
