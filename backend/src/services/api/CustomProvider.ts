import { providers } from 'ethers'

export class CustomProvider extends providers.StaticJsonRpcProvider {
  constructor(url: string, network: string) {
    super(url, network)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prepareRequest(method: string, params: any): [string, Array<any>] {
    if (method === 'getLogs') {
      if (params.filter && params.filter.address != null) {
        if (typeof params.filter.address === 'string') {
          params.filter.address = params.filter.address.toLowerCase()
        } else if (Array.isArray(params.filter.address)) {
          params.filter.address = params.filter.address.map((x: string) =>
            x.toLowerCase()
          )
        }
      }
      return ['eth_getLogs', [params.filter]]
    } else {
      return super.prepareRequest(method, params)
    }
  }

  async _getFilter(filter: providers.Filter): Promise<providers.Filter> {
    const processed = await super._getFilter({
      ...filter,
      address: undefined,
    })
    if (filter.address) {
      if (Array.isArray(filter.address)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(processed as any).address = await Promise.all(
          filter.address.map((x) => this._getAddress(x))
        )
      } else {
        processed.address = await this._getAddress(filter.address)
      }
    }
    return processed
  }
}
