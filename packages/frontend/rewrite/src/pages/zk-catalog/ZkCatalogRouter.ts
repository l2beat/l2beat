import type { Router } from 'express'
import { getZkCatalogEntries } from '~/app/(side-nav)/zk-catalog/_utils/get-zk-catalog-entries'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getVerifiers } from '~/server/features/zk-catalog/get-verifiers'
import { ps } from '~/server/projects'
import type { Manifest } from '../../common/Manifest'
import type { RenderData, RenderFunction } from '../../ssr/server'
import { ZkCatalogProjectRouter } from './project/ZkCatalogProjectRouter'

export function ZkCatalogRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/zk-catalog', async (req, res) => {
    const data = await getZkCatalogData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })

  ZkCatalogProjectRouter(app, manifest, render)
}

async function getZkCatalogData(manifest: Manifest): Promise<RenderData> {
  const [searchBarProjects, verifiers, projects] = await Promise.all([
    getSearchBarProjects(),
    getVerifiers(),
    ps.getProjects({
      select: ['proofVerification'],
      whereNot: ['archivedAt'],
    }),
  ])
  const entries = getZkCatalogEntries(projects, verifiers)

  return {
    head: {
      manifest,
      title: 'FAQ - L2BEAT',
      description:
        'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'ZkCatalogPage',
      props: {
        entries,
        terms: getCollection('glossary').map((term) => ({
          id: term.id,
          matches: [term.data.term, ...(term.data.match ?? [])],
        })),
        searchBarProjects: searchBarProjects.map((p) => ({
          ...p,
          iconUrl: manifest.getUrl(p.iconUrl),
        })),
      },
    },
  }
}
