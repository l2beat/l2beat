import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Router } from 'express'
import { getSearchBarProjects } from '~/components/search-bar/search-bar-projects'
import { getCollection } from '~/content/get-collection'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import type { Manifest } from '../../../common/Manifest'
import type { RenderData, RenderFunction } from '../../../ssr/server'

export function ActivityRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/scaling/activity', async (req, res) => {
    const data = await getActivityData(manifest)
    const html = render(data, req.originalUrl)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

async function getActivityData(manifest: Manifest): Promise<RenderData> {
  const searchBarProjects = await getSearchBarProjects()
  const entries = await getScalingActivityEntries()
  return {
    head: {
      manifest,
      title: 'Activity - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'ActivityPage',
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
        milestones: HOMEPAGE_MILESTONES,
        showHiringBadge: false,
        ecosystemsEnabled: false,
      },
    },
  }
}
