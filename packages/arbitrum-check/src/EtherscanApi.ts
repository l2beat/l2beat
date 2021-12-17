import fetch from 'node-fetch'

interface EtherscanSourceCodeResult {
  status: '0' | '1'
  result: {
    SourceCode: string
    ContractName: string
  }[]
}

export class EtherscanApi {
  constructor(private apiKey: string) {}

  async getContractName(contractAddress: string) {
    // gets contract name from Etherscan API
    const url =
      'https://api.etherscan.io/api?module=contract&action=getsourcecode&address=' +
      contractAddress +
      `&apikey=${this.apiKey}`
    let contractName = ''
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = (await res.json()) as EtherscanSourceCodeResult
    //console.log(json);
    if (json.status == '1') {
      if (json.result[0].SourceCode == '') {
        contractName = 'Not verified'
      } else {
        contractName = json.result[0].ContractName
      }
    }
    return contractName
  }
}
