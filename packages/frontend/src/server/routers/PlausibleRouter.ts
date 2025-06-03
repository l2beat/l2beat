import express from 'express'

// This is a proxy for Plausible.io events.
// It is used to prevent adblockers from blocking the script and the events.
export function createPlausibleRouter() {
  const router = express.Router()

  router.get('/script.js', async (_, res) => {
    try {
      const upstreamRes = await fetch(
        'https://plausible.io/js/script.hash.outbound-links.pageview-props.tagged-events.js',
      )
      const scriptText = await upstreamRes.text()

      res.set('Content-Type', 'application/javascript')
      res.send(scriptText)
    } catch (error) {
      console.error('Error proxying Plausible script.js:', error)
      res.sendStatus(500)
    }
  })

  router.post('/event', express.text(), async (req, res) => {
    try {
      const upstreamRes = await fetch('https://plausible.io/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': req.get('User-Agent') ?? '',
          'X-Forwarded-For': req.get('X-Forwarded-For') ?? '',
        },
        body: req.body,
      })

      const text = await upstreamRes.text()
      res.status(upstreamRes.status).send(text)
    } catch (error) {
      console.error('Error proxying Plausible event:', error)
      res.sendStatus(500)
    }
  })

  return router
}
