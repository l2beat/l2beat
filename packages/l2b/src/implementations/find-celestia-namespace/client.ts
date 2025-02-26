export class CelestiaClient {
  constructor(private readonly url: string) {}

  // Tendermint REST API via Quicknode API
  async getDecodedTransactions(height: number) {
    const response = await fetch(`${this.url}/block_results?height=${height}`)
    const json = (await response.json()) as GetBlockResultsResponse
    return json.result.txs_results
  }

  // RPC
  async getBlob(height: number, namespace: string, commitment: string) {
    const body = {
      id: '1',
      jsonrpc: '2.0',
      method: 'blob.Get',
      params: [height, namespace, commitment],
    }

    const response = await fetch(`${this.url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    const json = (await response.json()) as GetBlobResponse

    if ('error' in json) {
      return null
    }

    return json.result.data
  }
}

type GetBlobResponse = GetBlobSuccess | GetBlobError

type GetBlobSuccess = {
  id: number
  jsonrpc: string
  result: {
    namespace: string
    data: string
    share_version: number
    commitment: string
    index: number
  }
}

type GetBlobError = {
  id: number
  jsonrpc: string
  error: {
    code: number
    message: string
  }
}

interface GetBlockResultsResponse {
  jsonrpc: string
  id: number
  result: { txs_results: CelestiaTransactionResult[] }
}

export interface CelestiaTransactionResult {
  code: number
  data: string
  log: string
}
