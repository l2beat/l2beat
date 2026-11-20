import express, { type Request, type Response } from 'express'
import { getProjectPage } from '~/server/features/projects/getProjectPage'
import { ps } from '~/server/projects'
import {
  getProjectPath,
  getProjectTvsBreakdownPath,
  OLD_PROJECT_PATH_PREFIXES as OLD,
} from '~/utils/project/getProjectPath'
import { redirectToProjectPage } from './redirectToProjectPage'

/**
 * The section URLs projects had before `/projects/{slug}`, moved there.
 *
 * Browsers hold a permanent redirect from `/projects/{slug}` to
 * `/layer2s/projects/{slug}` that this site sent for years, for every slug.
 * Sending them back to `/projects/{slug}` would loop, so the L2 URLs go to
 * `?migration=1`, a URL no browser has cached. The page drops the marker from
 * the address bar without navigating.
 */
export function createProjectRedirectsRouter() {
  const router = express.Router()

  const redirect =
    (
      getPath: (slug: string) => string,
      options: { migration?: boolean } = {},
    ) =>
    async (req: Request<{ slug: string }>, res: Response, next: () => void) => {
      const { slug } = req.params
      if (!(await getProjectPage(slug))) {
        next()
        return
      }
      redirectToProjectPage(req, res, getPath(slug), {
        addQuery: options.migration ? { migration: '1' } : undefined,
      })
    }

  const toPage = getProjectPath
  const toMarkdown = (slug: string) => `${getProjectPath(slug)}.md`

  router.get(
    `${OLD.layer2s}/:slug.md`,
    redirect(toMarkdown, { migration: true }),
  )
  router.get(`${OLD.layer2s}/:slug`, redirect(toPage, { migration: true }))
  router.get(
    `${OLD.layer2s}/:slug/tvs-breakdown`,
    redirect(getProjectTvsBreakdownPath),
  )

  for (const prefix of [OLD.privacy, OLD.zkCatalog, OLD.defi]) {
    router.get(`${prefix}/:slug.md`, redirect(toMarkdown))
    router.get(`${prefix}/:slug`, redirect(toPage))
  }

  router.get(`${OLD.interop}/:slug.md`, redirect(toMarkdown))
  router.get(
    `${OLD.interop}/:slug`,
    async (req: Request<{ slug: string }>, res, next) => {
      const project = await ps.getProject({
        slug: req.params.slug,
        optional: ['scalingInfo', 'interopConfig'],
      })
      // A scaling project with a canonical bridge shows its flows on its page.
      // Links to a protocol name this URL, not the page, so that the bridge
      // opens there with its flows selected.
      if (project?.scalingInfo && project.interopConfig) {
        redirectToProjectPage(req, res, getProjectPath(project.slug), {
          addQuery: { protocols: project.id },
          hash: '#interop-flows',
        })
        return
      }
      await redirect(toPage)(req, res, next)
    },
  )

  return router
}
