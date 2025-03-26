import type { Render } from '../../ssr/types'
import type { SsrData } from '../App'
import type { Manifest } from '../../common/manifest'
import type { Router } from 'express'

export function ProductRouter(app: Router, manifest: Manifest, render: Render) {
  app.get('/product/:id', (req, res) => {
    const ssrData = getProductProps(+req.params.id, manifest)
    const html = render(ssrData)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getProductProps(id: number, manifest: Manifest): SsrData {
  return {
    page: 'ProductPage',
    manifest,
    props: {
      id,
      name: ['Vaccum Cleaner', 'Toy', 'Plane'][id - 1] ?? 'Unknown',
    },
  }
}
