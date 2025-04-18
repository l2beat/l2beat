import type { Router } from 'express'
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
  return {
    head: {
      manifest,
      title: 'Activity - L2BEAT',
      description:
        'L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'ActivityPage',
      props: undefined,
    },
  }
}
