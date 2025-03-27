import type { Router } from 'express'
import type { Render, RenderData } from '../../ssr/types'

export function ProductRouter(app: Router, render: Render) {
  app.get('/product/:id', (req, res) => {
    const data = getProductData(+req.params.id)
    const html = render(data)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getProductData(id: number): RenderData {
  const name = ['Vaccum Cleaner', 'Toy', 'Plane'][id - 1] ?? 'Unknown'

  return {
    head: {
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
