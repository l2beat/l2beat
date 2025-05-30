import express from 'express'
import { z } from 'zod'
import { env } from '~/env'
import { PlausibleEvents } from '~/hooks/use-tracking'
import { validateRoute } from '~/utils/validateRoute'

// This is a proxy for Plausible.io events.
// It is used to prevent adblockers from blocking the script and the events.
export function createPlausibleRouter() {
  const router = express.Router()
  const plausibleEventsShape = PlausibleEvents.shape

  router.use(express.json())

  router.get('/script.js', async (_, res) => {
    if (env.NODE_ENV !== 'production') {
      res.send()
    }

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

  router.post(
    '/event',
    validateRoute({
      body: z.object({
        name: z.string(),
        props: z.unknown().optional(),
      }),
    }),
    async (req, res) => {
      if (env.NODE_ENV !== 'production') {
        res.sendStatus(202)
        return
      }

      if (!(req.body.name in plausibleEventsShape)) {
        res.status(400).json({ error: `Invalid event name: ${req.body.name}` })
        return
      }

      const eventShape =
        plausibleEventsShape[req.body.name as keyof typeof plausibleEventsShape]

      const event = eventShape.safeParse(req.body.props)
      if (!event.success) {
        res.status(400).json({ error: event.error })
        return
      }

      try {
        const eventPayload = {
          name: req.body.name,
          props: event.data,
          url: req.get('referer'),
          domain: req.hostname,
        }
        console.log(eventPayload)

        const upstreamRes = await fetch('https://plausible.io/api/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': req.get('User-Agent') || '',
          },
          body: JSON.stringify(eventPayload),
        })

        const text = await upstreamRes.text()
        res.status(upstreamRes.status).send(text)
      } catch (error) {
        console.error('Error proxying Plausible event:', error)
        res.sendStatus(500)
      }
    },
  )

  return router
}
