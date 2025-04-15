import type { Server } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import express, { type Request, type Response } from 'express'
import type { Config } from '../config/config'
import type { MessageService } from '../logic/MessageService'

export function createHttpServer(
  config: Config,
  messageService: MessageService,
  logger: Logger,
) {
  const app = express()

  app.get('/stream', handleSSE(messageService.listen))
  app.get('/transfers', (_req, res) => {
    res.json(messageService.transfers)
  })
  app.use(express.static('public'))

  return {
    start: (): Promise<Server> => {
      return new Promise<Server>((resolve) => {
        const server = app.listen(config.port, () => {
          logger.info(`Listening on http://localhost:${config.port}`)
          resolve(server)
        })
      })
    },
  }
}

function handleSSE(cb: (send: (value: unknown) => void) => () => void) {
  return function (_req: Request, res: Response) {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
    })

    const close = cb((value) => {
      res.write(`${JSON.stringify(value)}\n\n`)
    })

    res.on('close', () => {
      close()
      res.end()
    })
  }
}
