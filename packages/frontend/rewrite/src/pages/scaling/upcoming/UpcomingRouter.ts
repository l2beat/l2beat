import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/get-scaling-upcoming-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'

export function UpcomingRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/scaling/upcoming', async (req, res) => {
    const data = await getUpcomingData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getUpcomingData(manifest: Manifest): Promise<RenderData> {
  const [searchBarProjects, entries] = await Promise.all([
    getSearchBarProjects(),
    getScalingUpcomingEntries(),
  ])

  return {
    head: {
      manifest,
      title: 'Upcoming - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'UpcomingPage',
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
