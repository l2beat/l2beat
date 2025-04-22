import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'

export function TvsRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/scaling/tvs', async (req, res) => {
    const data = await getTvsData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getTvsData(manifest: Manifest): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getScalingTvsEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Value Secured - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'TvsPage',
      props: {
        entries,
        milestones: HOMEPAGE_MILESTONES,
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
