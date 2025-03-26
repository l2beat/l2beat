import type { Router } from 'express'
import type { Manifest } from '../../common/manifest'
import type { Render } from '../../ssr/types'
import type { SsrData } from '../App'

export function HomeRouter(app: Router, manifest: Manifest, render: Render) {
  app.get('/', (_req, res) => {
    const ssrData = getHomeProps(manifest)
    const html = render(ssrData)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getHomeProps(manifest: Manifest): SsrData {
  return {
    page: 'HomePage',
    manifest,
    props: {
      city: 'Warsaw',
      letter: 'A',
      products: [1, 2, 3],
    },
  }
}
