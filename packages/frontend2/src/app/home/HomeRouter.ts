import type { Application } from 'express'
import type { SsrData } from '../App'
import type { Render } from '../../ssr/types'

export function HomeRouter(app: Application, render: Render) {
  app.get('/', async (req, res) => {
    const ssrData = getHomeProps()
    const html = await render(req.originalUrl, ssrData)
    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  })
}

function getHomeProps(): SsrData {
  return {
    page: 'HomePage',
    props: {
      city: 'Warsaw',
      letter: 'A',
      products: [1, 2, 3],
    },
  }
}
