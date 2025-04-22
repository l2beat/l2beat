import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { getDaThroughputSummary } from '~/server/features/data-availability/throughput/get-da-throughput-summary'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'

export function DataAvailabilitySummaryRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/data-availability/summary', async (req, res) => {
    const data = await getDataAvailabilitySummaryData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getDataAvailabilitySummaryData(
  manifest: Manifest,
): Promise<RenderData> {
  const [
    searchBarProjects,
    { publicSystems, customSystems },
    throughputSummaryData,
  ] = await Promise.all([
    getSearchBarProjects(),
    getDaSummaryEntries(),
    getDaThroughputSummary(),
  ])

  return {
    head: {
      manifest,
      title: 'Data Availability Summary - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'DataAvailabilitySummaryPage',
      props: {
        publicSystems,
        customSystems,
        throughputSummaryData,
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
