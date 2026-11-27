import { expect } from 'earl'
import express from 'express'
import { LlmsLinkHeaderMiddleware } from '~/server/middlewares/LlmsLinkHeaderMiddleware'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import { createPublicApiRouter } from '.'
import { DeprecationHeadersMiddleware } from './deprecationHeaders'

// Why: the callers of the old API are scripts we cannot contact, so the
// headers are the notice. A client or a proxy that understands RFC 9745 and
// RFC 8594 must be able to parse them.
// Method: mount the middleware in front of a stub route and read the real
// HTTP response, with a Link header already set the way the llms.txt
// middleware sets one in the app.
describe(DeprecationHeadersMiddleware.name, () => {
  it('sends Deprecation as an RFC 9745 date and Sunset as a later HTTP date', async () => {
    const response = await fetchDeprecated()

    const deprecation = response.headers.get('deprecation') ?? ''
    expect(deprecation).toMatchRegex(/^@\d{10}$/)
    const sunset = response.headers.get('sunset') ?? ''
    expect(sunset).toMatchRegex(
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/,
    )
    expect(Date.parse(sunset) / 1000).toBeGreaterThan(
      Number(deprecation.slice(1)),
    )
  })

  it('links the migration guide and the new API, keeping the Link that was already set', async () => {
    const response = await fetchDeprecated()

    const links = (response.headers.get('link') ?? '').split(', ')
    expect(links).toEqual([
      '<https://ethbeat.org/llms.txt>; rel="describedby"',
      '<https://ethbeat.org/api-migration>; rel="deprecation"; type="text/html"',
      '<https://ethbeat.org/api-migration>; rel="sunset"; type="text/html"',
      '<https://api.ethbeat.org>; rel="successor-version"',
    ])
  })

  it('lets browser scripts on other origins read the headers', async () => {
    const response = await fetchDeprecated()

    expect(response.headers.get('access-control-expose-headers')).toEqual(
      'Deprecation, Sunset, Link',
    )
  })

  // Why: an error is when a caller reads the response closely, and the
  // llms.txt middleware used to reset Link on every error.
  // Method: the real routers in the order the app mounts them, asked with
  // a parameter the old API rejects before it reads any data.
  it('keeps the links on a validation error of the old API', async () => {
    const router = express.Router()
    router.use(LlmsLinkHeaderMiddleware())
    router.use(createPublicApiRouter())

    const response = await fetchFromRouter(
      router,
      '/api/scaling/tvs?range=invalid',
    )

    expect(response.status).toEqual(400)
    expect(response.headers.get('link') ?? '').toInclude(
      'rel="deprecation"',
      'rel="successor-version"',
    )
    expect(response.headers.get('sunset')).not.toEqual(null)
  })
})

function fetchDeprecated() {
  const router = express.Router()
  router.use((_req, res, next) => {
    res.header('Link', '<https://ethbeat.org/llms.txt>; rel="describedby"')
    next()
  })
  router.use(DeprecationHeadersMiddleware())
  router.get('/data', (_req, res) => {
    res.json({ ok: true })
  })
  return fetchFromRouter(router, '/data')
}
