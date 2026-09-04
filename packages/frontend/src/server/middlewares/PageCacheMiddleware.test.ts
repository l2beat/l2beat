import type { AddressInfo } from 'node:net'
import { expect } from 'earl'
import express from 'express'
import { PageCacheMiddleware } from './PageCacheMiddleware'

const PAGE_CACHE_CONTROL =
  'public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600'

describe(PageCacheMiddleware.name, () => {
  it('sets the page cache header on a 200 GET', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/page`)
      expect(response.headers.get('cache-control')).toEqual(PAGE_CACHE_CONTROL)
    })
  })

  it('sets the page cache header on a 200 HEAD', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/page`, { method: 'HEAD' })
      expect(response.headers.get('cache-control')).toEqual(PAGE_CACHE_CONTROL)
    })
  })

  it('does not set the header on other methods', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/page`, { method: 'POST' })
      expect(response.headers.get('cache-control')).toEqual(null)
    })
  })

  it('keeps a Cache-Control set by the route', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/no-cache`)
      expect(response.headers.get('cache-control')).toEqual('no-cache')
    })
  })

  it('does not set the header on a 404 sent by a route', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/unknown-slug`)
      expect(response.status).toEqual(404)
      expect(response.headers.get('cache-control')).toEqual(null)
    })
  })

  it('does not set the header on a redirect', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/redirect`, {
        redirect: 'manual',
      })
      expect(response.status).toEqual(301)
      expect(response.headers.get('cache-control')).toEqual(null)
    })
  })

  it('does not set the header on a path no route handled', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/does-not-exist`)
      expect(response.status).toEqual(404)
      expect(response.headers.get('cache-control')).toEqual(null)
    })
  })
})

async function withServer(test: (baseUrl: string) => Promise<void>) {
  const app = express()
  app.use(PageCacheMiddleware())
  app.all('/page', (_, res) => {
    res.status(200).send('ok')
  })
  app.get('/no-cache', (_, res) => {
    res.set('Cache-Control', 'no-cache')
    res.status(200).send('ok')
  })
  app.get('/unknown-slug', (_, res) => {
    res.status(404).send('Not found')
  })
  app.get('/redirect', (_, res) => {
    res.redirect(301, '/page')
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
