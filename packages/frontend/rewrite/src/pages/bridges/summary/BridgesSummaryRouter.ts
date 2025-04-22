import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'

export function BridgesSummaryRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/bridges', async (req, res) => {
    res.redirect('/bridges/summary')
  })

  app.get('/bridges/summary', async (req, res) => {
    const data = await getBridgesSummaryData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getBridgesSummaryData(manifest: Manifest): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getBridgesSummaryEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Bridges - L2BEAT',
      description:
        'L2BEAT - the leading analytics and research website about Ethereum bridges.',
    },
    ssr: {
      page: 'BridgesSummaryPage',
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
