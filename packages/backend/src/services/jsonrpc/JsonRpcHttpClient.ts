import { HttpClient } from '../HttpClient'
import { Logger } from '../Logger'
import { JsonRpcClient } from './JsonRpcClient'
import { JsonRpcRequest } from './types'

export class JsonRpcHttpClient extends JsonRpcClient {
  constructor(
    private url: string,
    private httpClient: HttpClient,
    private logger: Logger
  ) {
    super()
    this.logger = this.logger.for(this)
  }

  async execute(request: JsonRpcRequest | JsonRpcRequest[]): Promise<unknown> {
    const name = Array.isArray(request)
      ? `batch(${request.length})#${request[0].id}`
      : `${request.method}#${request.id}`
    this.logger.debug(`> ${name}`)
    const res = await this.httpClient.fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
    this.logger.debug(`< ${res.status} ${name}`)
    if (!res.ok) {
      throw new Error(`Http error ${res.status}: ${await res.text()}`)
    }
    try {
      return await res.json()
    } catch {
      throw new TypeError('Invalid JSON received')
    }
  }
}
