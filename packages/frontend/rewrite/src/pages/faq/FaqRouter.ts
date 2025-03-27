import type { Router } from 'express'
import type { Manifest } from '../../common/Manifest'
import type { RenderData, RenderFunction } from '../../ssr/server'

export function FaqRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/faq', (_req, res) => {
    const data = getFaqData(manifest)
    const html = render(data)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getFaqData(manifest: Manifest): RenderData {
  return {
    head: {
      manifest,
      title: 'FAQ - L2BEAT',
      description:
        'Frequently Asked Questions about L2BEAT - an analytics and research website about Ethereum layer 2 scaling.',
    },
    ssr: {
      page: 'FaqPage',
      props: undefined,
    },
  }
}
