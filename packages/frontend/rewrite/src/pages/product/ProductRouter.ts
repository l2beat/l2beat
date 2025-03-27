import type { Router } from 'express'
import type { Manifest } from '../../common/Manifest'
import type { RenderData, RenderFunction } from '../../ssr/server'

export function ProductRouter(
  app: Router,
  manifest: Manifest,
  render: RenderFunction,
) {
  app.get('/product/:id', (req, res) => {
    const data = getProductData(+req.params.id, manifest)
    const html = render(data)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getProductData(id: number, manifest: Manifest): RenderData {
  const name = ['Vaccum Cleaner', 'Toy', 'Plane'][id - 1] ?? 'Unknown'

  return {
    head: {
      manifest,
      title: `${name} - Product Page`,
      description: 'Best product best price',
    },
    ssr: {
      page: 'ProductPage',
      props: {
        id,
        name,
      },
    },
  }
}
