import type { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'
import { type RawData, WebSocket } from 'ws'
import { NewHeadsEvent } from '../../tools/types'

export class WsBlockNumberIndexer extends RootIndexer {
  private blockNumber = 0
  private reconnectTimeout: NodeJS.Timeout | undefined = undefined

  constructor(
    url: string,
    source: string,
    logger: Logger,
    // we need to be able to mock WebSocket in tests
    private readonly createdWebSocket: () => WebSocket = () =>
      new WebSocket(url),
  ) {
    super(logger.tag({ chain: source, project: source }))
  }

  override initialize() {
    const ws = this.createdWebSocket()

    ws.on('open', () => {
      this.logger.info('WebSocket connection opened.')

      // Clear any pending reconnect timeouts
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout)
        this.reconnectTimeout = undefined
      }

      this.sendSubscriptionRequest(ws)
    })

    ws.on('message', (data) => {
      this.processEvent(data)
    })

    ws.on('error', (error) => {
      this.logger.error('WebSocket error', error)
    })

    ws.on('close', (code, reason) => {
      this.logger.info(`WebSocket closed. Code: ${code}, reason: ${reason}`)

      // Schedule reconnect
      this.reconnectTimeout = setTimeout(() => {
        this.logger.info('Attempting to reconnect...')
        this.initialize()
      }, 5000)
    })

    return Promise.resolve(undefined)
  }

  tick(): Promise<number> {
    return Promise.resolve(this.blockNumber)
  }

  private sendSubscriptionRequest(ws: WebSocket) {
    const subscriptionRequest = {
      id: 1,
      method: 'eth_subscribe',
      params: ['newHeads'],
      jsonrpc: '2.0',
    }

    ws.send(JSON.stringify(subscriptionRequest), undefined)
  }

  private processEvent(data: RawData) {
    try {
      const result = NewHeadsEvent.safeParse(JSON.parse(data.toString('utf8')))

      if (!result.success) {
        return
      }

      this.logger.info('New block detected', {
        number: result.data.params.result.number,
        timestamp: result.data.params.result.timestamp,
      })

      this.blockNumber = result.data.params.result.number
      this.requestTick()
    } catch (error) {
      this.logger.error('Error parsing event:', error)
    }
  }
}
