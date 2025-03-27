import type { Router } from 'express'
import type { Manifest } from '../../common/Manifest'
import type { Render, RenderData } from '../../ssr/types'

export function HomeRouter(app: Router, manifest: Manifest, render: Render) {
  app.get('/', (_req, res) => {
    const data = getHomeData(manifest)
    const html = render(data)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getHomeData(manifest: Manifest): RenderData {
  return {
    head: {
      manifest,
      title: 'Home',
      description: 'Sweet Home Alabama',
    },
    ssr: {
      page: 'HomePage',
      props: {
        logoImg: manifest.getImage('/static/logo.png'),
        city: 'Warsaw',
        letter: 'A',
        products: [1, 2, 3],
      },
    },
  }
}
