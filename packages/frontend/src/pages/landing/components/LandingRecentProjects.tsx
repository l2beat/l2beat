import type { HomeRecentProject } from '~/pages/home/getHomeData'
import {
  LANDING_CONTAINER_CLASS,
  LANDING_SECTION_LABEL_CLASS,
} from '../landingStyles'
import { LandingSectionHeader } from './LandingSectionHeader'

const CATEGORY_LABEL: Record<HomeRecentProject['category'], string> = {
  l2: 'Scaling project',
  da: 'Data Availability',
  interop: 'Interoperability',
  zkCatalog: 'ZK Catalog',
  ecosystems: 'Ecosystem',
  privacy: 'Privacy',
}

/**
 * The newest projects as a slow marquee of pills, fading at both edges. The
 * list is drawn twice so the loop never shows a seam; with reduced motion it
 * stands still and scrolls by hand.
 */
export function LandingRecentProjects({
  projects,
}: {
  projects: HomeRecentProject[]
}) {
  if (projects.length === 0) {
    return null
  }
  return (
    <section className={`${LANDING_CONTAINER_CLASS} pt-12 md:pt-16`}>
      <LandingSectionHeader
        title="Recently added"
        labelClassName={LANDING_SECTION_LABEL_CLASS}
      />
      <div className="group/marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
        <div className="flex w-max animate-marquee gap-2.5 motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]">
          <Pills projects={projects} />
          <Pills projects={projects} ariaHidden />
        </div>
      </div>
    </section>
  )
}

function Pills({
  projects,
  ariaHidden,
}: {
  projects: HomeRecentProject[]
  ariaHidden?: boolean
}) {
  return (
    <ul className="flex gap-2.5" aria-hidden={ariaHidden}>
      {projects.map((project) => (
        <li key={project.id}>
          <a
            href={project.href}
            tabIndex={ariaHidden ? -1 : undefined}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-divider py-1.5 pr-3 pl-1.5 transition-colors hover:border-link-stroke"
          >
            <img
              src={project.iconUrl}
              alt=""
              className="size-5 shrink-0 rounded-full"
            />
            <span className="font-medium text-label-value-13">
              {project.name}
            </span>
            <span className="font-normal text-label-value-12 text-secondary">
              {project.category === 'l2' && project.l2Category
                ? project.l2Category
                : CATEGORY_LABEL[project.category]}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
