import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingRiskEntries } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'

export function RiskRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/scaling/risk', async (req, res) => {
    const data = await getRiskData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getRiskData(manifest: Manifest): Promise<RenderData> {
  const searchBarProjects = await getSearchBarProjects()

  const entries = await getScalingRiskEntries()
  return {
    head: {
      manifest,
      title: 'Risk - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'RiskPage',
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
