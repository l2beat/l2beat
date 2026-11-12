import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { OpengraphKit } from '~/components/opengraph-image/heartbeat/render'
import { renderOpengraphPng } from '~/components/opengraph-image/heartbeat/render'
import { ProjectOpengraphImage } from '~/components/opengraph-image/Project'
import {
  PROJECT_PAGE_FIELDS,
  selectProjectPages,
} from '~/server/features/projects/getProjectPage'
import { ps } from '~/server/projects'
import { getProjectOgImagePath } from '~/utils/project/getProjectPath'
import { writeIfMissing } from './writeIfMissing'

export async function generateProjectOgImages(kit: OpengraphKit) {
  for (const page of await getProjectOgImagePages()) {
    await writeIfMissing(
      'PROJECT DETAILS',
      path.relative(
        '/meta-images',
        path.dirname(getProjectOgImagePath(page.slug)),
      ),
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
 * Every page at `/projects/{slug}`, in any deployment. Each has one image,
 * whatever sections it is in.
 */
export async function getProjectOgImagePages(): Promise<
  { slug: string; name: string; shortName?: string }[]
> {
  const projects = await ps.getProjects({ optional: [...PROJECT_PAGE_FIELDS] })
  return selectProjectPages(projects, { anyDeployment: true }).map((page) => {
    if (page.kind === 'chain') {
      return { slug: page.slug, name: page.chain.name }
    }
    const { project } = page
    return {
      slug: page.slug,
      // An interop protocol's page shows the protocol's name.
      name:
        page.kind === 'interop'
          ? (project.interopConfig?.name ?? project.name)
          : project.name,
      shortName: project.shortName,
    }
  })
}

/** The project's icon as a data URI, if it has one. */
function getLogo(slug: string) {
  const file = path.join(process.cwd(), 'static/icons', `${slug}.png`)
  if (!existsSync(file)) return undefined
  return `data:image/png;base64,${readFileSync(file).toString('base64')}`
}
