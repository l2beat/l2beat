import type { Application } from 'express'
import type { Render } from '../../ssr/types'
import type { SsrData } from '../App'

export function HomeRouter(app: Application, render: Render) {
  app.get('/', (_req, res) => {
    const ssrData = getHomeProps()
    const html = render(ssrData)
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
