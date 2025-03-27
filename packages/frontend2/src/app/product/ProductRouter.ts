import type { Render } from '../../ssr/types'
import type { SsrData } from '../App'
import type { Router } from 'express'

export function ProductRouter(app: Router, render: Render) {
  app.get('/product/:id', (req, res) => {
    const ssrData = getProductProps(+req.params.id)
    const html = render(ssrData)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getProductProps(id: number): SsrData {
  return {
    page: 'ProductPage',
    props: {
      id,
      name: ['Vaccum Cleaner', 'Toy', 'Plane'][id - 1] ?? 'Unknown',
    },
  }
}
