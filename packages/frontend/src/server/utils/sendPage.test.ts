import type { AddressInfo } from 'node:net'
import { expect } from 'earl'
import express from 'express'
import { sendPage } from './sendPage'

describe(sendPage.name, () => {
  it('sends the html with the page cache header', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/page`)
      expect(response.status).toEqual(200)
      expect(await response.text()).toEqual('<html/>')
      expect(response.headers.get('cache-control')).toEqual(
        'public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600',
      )
    })
  })

  it('sends the page cache header on HEAD', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/page`, { method: 'HEAD' })
      expect(response.headers.get('cache-control')).toEqual(
        'public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600',
      )
    })
  })
})

async function withServer(test: (baseUrl: string) => Promise<void>) {
  const app = express()
  app.get('/page', (_, res) => {
    sendPage(res, '<html/>')
  })

  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address() as AddressInfo

  try {
    await test(`http://localhost:${port}`)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}
