import fetch from 'node-fetch'

import { RateLimiter } from './RateLimiter'

interface EtherscanSourceCodeResult {
  status: '0' | '1'
  result: {
    SourceCode: string
    ContractName: string
  }[]
}

export class EtherscanApi {
  private rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })

  constructor(private apiKey: string) {}

  async getContractName(address: string) {
    return this.rateLimiter.call(() => this.fetchContractName(address))
  }

  private async fetchContractName(address: string) {
    const url =
      'https://api.etherscan.io/api?module=contract&action=getsourcecode&address=' +
      address +
      `&apikey=${this.apiKey}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = (await res.json()) as EtherscanSourceCodeResult
    if (json.status !== '1') {
      throw new Error(`Etherscan error: ${JSON.stringify(json)}`)
    }
    if (json.result[0].SourceCode !== '') {
      return json.result[0].ContractName
    }
  }
}
