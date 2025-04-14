import type { Server } from 'http'
import type { Logger } from '@l2beat/backend-tools'
import express, { type Request, type Response } from 'express'
import { formatUnits } from 'viem'
import type { TxService } from './TxService'
import type { Config } from './config'
import { getToken } from './tokens'

export function createRouter(
  config: Config,
  txService: TxService,
  logger: Logger,
) {
  const app = express()

  app.get(
    '/stream',
    handleSSE((send) => {
      return txService.listen((tx) => {
        const token = getToken(tx.source.token)
        const amount = formatUnits(tx.source.amount, token.decimals)
        send({
          timestamp: new Date(tx.timestamp * 1000).toISOString(),
          protocol: tx.protocol,
          source: tx.source.chain,
          destination: tx.destination.chain,
          token: token.name,
          amount,
        })
      })
    }),
  )

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

    const close = cb(function (value) {
      res.write(`${JSON.stringify(value)}\n\n`)
    })

    res.on('close', () => {
      close()
      res.end()
    })
  }
}
