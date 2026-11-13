import { expect } from 'earl'
import express from 'express'
import { fetchFromRouter } from '~/test/fetchFromRouter'
import {
  getLinkHeader,
  LlmsLinkHeaderMiddleware,
} from './LlmsLinkHeaderMiddleware'

// Method: mount the middleware before a project route that answers with the
// status named in the slug, then read the Link header over HTTP. The URL
// always looks like a page with a markdown version; only the status tells
// whether that page was served.
describe(LlmsLinkHeaderMiddleware.name, () => {
  const LLMS_TXT_ONLY = '<https://ethbeat.org/llms.txt>; rel="describedby"'

  it('advertises the markdown alternate of a page that is served', async () => {
    const response = await fetchFromRouter(createRouter(), '/projects/200')

    expect(response.headers.get('link')).toEqual(
      `<https://ethbeat.org/projects/200.md>; rel="alternate"; type="text/markdown", ${LLMS_TXT_ONLY}`,
    )
  })

  it('advertises no alternate on a not found or failed response', async () => {
    for (const status of [404, 500]) {
      const response = await fetchFromRouter(
        createRouter(),
        `/projects/${status}`,
      )

      expect(response.status).toEqual(status)
      expect(response.headers.get('link')).toEqual(LLMS_TXT_ONLY)
    }
  })
})

function createRouter() {
  const router = express.Router()
  router.use(LlmsLinkHeaderMiddleware())
  router.get('/projects/:status', (req, res) => {
    res.status(Number(req.params.status)).send('body')
  })
  return router
}

// Method: compare the header string for a page with and without a markdown
// alternate against the link relations named in the llms.txt spec.
describe(getLinkHeader.name, () => {
  it('points every page at llms.txt', () => {
    expect(getLinkHeader('/faq')).toEqual(
      '<https://ethbeat.org/llms.txt>; rel="describedby"',
    )
  })

  it('adds the markdown alternate where one exists', () => {
    expect(getLinkHeader('/layer2s/summary')).toEqual(
      '<https://ethbeat.org/layer2s/summary.md>; rel="alternate"; type="text/markdown", <https://ethbeat.org/llms.txt>; rel="describedby"',
    )
  })

  it('adds the markdown alternate of project pages', () => {
    expect(getLinkHeader('/projects/arbitrum')).toEqual(
      '<https://ethbeat.org/projects/arbitrum.md>; rel="alternate"; type="text/markdown", <https://ethbeat.org/llms.txt>; rel="describedby"',
    )
  })

  it('finds the alternate for every path Express routes to the page', () => {
    expect(getLinkHeader('/Layer2s/Summary/')).toEqual(
      '<https://ethbeat.org/Layer2s/Summary.md>; rel="alternate"; type="text/markdown", <https://ethbeat.org/llms.txt>; rel="describedby"',
    )
  })
})
