import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'

export function DataAvailabilityRiskRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/data-availability/risk', async (req, res) => {
    const data = await getDataAvailabilityRiskData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getDataAvailabilityRiskData(
  manifest: Manifest,
): Promise<RenderData> {
  const [searchBarProjects, { publicSystems, customSystems }] =
    await Promise.all([getSearchBarProjects(), getDaRiskEntries()])
  return {
    head: {
      manifest,
      title: 'Activity - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'DataAvailabilityRiskPage',
      props: {
        publicSystems,
        customSystems,
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
