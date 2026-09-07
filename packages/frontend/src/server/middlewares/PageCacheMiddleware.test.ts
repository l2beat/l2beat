import type { AddressInfo } from 'node:net'
import { expect } from 'earl'
import express from 'express'
import {
  ClearPageCacheMiddleware,
  PageCacheMiddleware,
} from './PageCacheMiddleware'

const PAGE_CACHE_CONTROL =
  'public, max-age=0, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600'

describe(PageCacheMiddleware.name, () => {
  it('sets the page cache header on GET', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/page`)
      expect(response.headers.get('cache-control')).toEqual(PAGE_CACHE_CONTROL)
    })
  })

  it('sets the page cache header on HEAD', async () => {
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

  it('lets a route override the header later in the chain', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/no-cache`)
      expect(response.headers.get('cache-control')).toEqual('no-cache')
    })
  })

  it('clears the header for requests no page route handled', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/not-a-page`)
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
  app.use(ClearPageCacheMiddleware())
  app.get('/api/not-a-page', (_, res) => {
    res.status(200).send('ok')
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
