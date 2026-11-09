import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { INTEROP_CHAINS, type Project } from '@l2beat/config'
import type { OpengraphKit } from '~/components/opengraph-image/heartbeat/render'
import { renderOpengraphPng } from '~/components/opengraph-image/heartbeat/render'
import { ProjectOpengraphImage } from '~/components/opengraph-image/Project'
import { getChainProjectSlug } from '~/server/features/chains/getChainProjects'
import { PROJECT_PAGE_SECTION_FIELDS } from '~/server/features/projects/getProjectPage'
import { ps } from '~/server/projects'
import { writeIfMissing } from './writeIfMissing'

export async function generateProjectOgImages(kit: OpengraphKit) {
  for (const page of await getProjectOgImagePages()) {
    await writeIfMissing(
      'PROJECT DETAILS',
      // `getProjectOgImagePath` without the `/meta-images/` and file name
      `projects/${page.slug}`,
      page.name,
      () =>
        renderOpengraphPng(
          <ProjectOpengraphImage
            measure={kit.measure}
            name={page.name}
            shortName={page.shortName}
            logo={getLogo(page.slug)}
          />,
          kit,
        ),
    )
  }
}

/**
 * Every page at `/projects/{slug}`, in any deployment: projects in a section,
 * Ethereum, and chain pages without a project. Each has one image, whatever
 * sections it is in.
 */
export async function getProjectOgImagePages() {
  const projects = await ps.getProjects({
    optional: [...PROJECT_PAGE_SECTION_FIELDS],
  })
  const pages: { slug: string; name: string; shortName?: string }[] = [
    { slug: 'ethereum', name: 'Ethereum' },
  ]
  for (const project of projects) {
    if (!PROJECT_PAGE_SECTION_FIELDS.some((field) => project[field])) continue
    pages.push({
      slug: project.slug,
      name: isInteropPage(project)
        ? (project.interopConfig?.name ?? project.name)
        : project.name,
      shortName: project.shortName,
    })
  }
  const l2ProjectIds = new Set(
    projects.filter((p) => p.scalingInfo).map((p) => p.id),
  )
  for (const chain of INTEROP_CHAINS) {
    const slug = getChainProjectSlug(chain, l2ProjectIds)
    if (slug && !pages.some((page) => page.slug === slug)) {
      pages.push({ slug, name: chain.name })
    }
  }
  return pages
}

/** An interop protocol's page shows the protocol's name. */
function isInteropPage(
  project: Project<never, (typeof PROJECT_PAGE_SECTION_FIELDS)[number]>,
) {
  return (
    !!project.interopConfig &&
    !project.scalingInfo &&
    !project.zkCatalogInfo &&
    !project.privacyInfo
  )
}

/** The project's icon as a data URI, if it has one. */
function getLogo(slug: string) {
  const file = path.join(process.cwd(), 'static/icons', `${slug}.png`)
  if (!existsSync(file)) return undefined
  return `data:image/png;base64,${readFileSync(file).toString('base64')}`
}
