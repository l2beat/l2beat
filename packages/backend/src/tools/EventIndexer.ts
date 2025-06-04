import type { Logger } from '@l2beat/backend-tools'
import { RootIndexer } from '@l2beat/uif'
import { type RawData, WebSocket } from 'ws'
import { NewHeadsEvent } from './types'

export class EventIndexer extends RootIndexer {
  private blockNumber: number = 0

  constructor(
    url: string,
    source: string,
    logger: Logger,
    private readonly ws = new WebSocket(url),
  ) {
    super(logger.tag({ chain: source, project: source }))
  }

  override async initialize() {
    this.ws.on('open', () => {
      this.logger.info('WebSocket connection opened.')
      this.sendSubscriptionRequest()
    })

    this.ws.on('message', (data) => {
      this.processEvent(data)
    })

    this.ws.on('error', (error) => {
      this.logger.error('WebSocket error', error)
    })

    this.ws.on('close', (code, reason) => {
      this.logger.info(`WebSocket closed. Code: ${code}, reason: ${reason}`)
    })

    return Promise.resolve(undefined)
  }

  tick(): Promise<number> {
    return Promise.resolve(this.blockNumber)
  }

  private sendSubscriptionRequest() {
    const subscriptionRequest = {
      id: 1,
      method: 'eth_subscribe',
      params: ['newHeads'],
      jsonrpc: '2.0',
    }

    this.ws.send(JSON.stringify(subscriptionRequest), undefined)
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
