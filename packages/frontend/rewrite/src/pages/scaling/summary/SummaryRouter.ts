import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'

export function SummaryRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/scaling/summary', async (req, res) => {
    const data = await getSummaryData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getSummaryData(manifest: Manifest): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getScalingSummaryEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Summary - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'SummaryPage',
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
