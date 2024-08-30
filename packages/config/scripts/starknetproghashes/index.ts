import { ethers } from 'ethers'

const providerUrl = 'https://eth.drpc.org'
const knownProgramHashes: Record<string, string> = {
  // from our discovery: names are just project names that are using this progHash
  '3383082961563516565935611087683915026448707331436034043529592588079494402084':
    'Paradex, Starknet',
  '3485280386001712778192330279103973322645241679001461923469191557000342180556':
    'ImutableX, Layer2FinanceZK',
  '770346231394331402493200980986217737662224545740427952627288191358999988146':
    'ApeX-USDT',
  '3174901404014912024702042974619036870715605532092680335571201877913899936957':
    'RhinoFi, Sorare',
  '16830627573509542901909952446321116535677491650708854009406762893086223513':
    'Brine, Canvasconnect, Myria, ReddioEX',
  '3114724292040200590153042023978438629733352741898912919152162079752811928849':
    'ApeX-USDC',
}

interface DecodedCalldata {
  proofParams: ethers.BigNumber[]
  proof: ethers.BigNumber[]
  taskMetadata: ethers.BigNumber[]
  cairoAuxInput: ethers.BigNumber[]
  cairoVerifierId: ethers.BigNumber
}

class EthereumTransactionAnalyzer {
  private provider: ethers.providers.JsonRpcProvider
  private knownProgramHashes: Record<string, string>

  constructor(
    providerUrl: string,
    knownProgramHashes: Record<string, string> = {},
  ) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.knownProgramHashes = knownProgramHashes
  }

  private async fetchTransactionCalldata(
    txHash: string,
  ): Promise<string | null> {
    try {
      const tx = await this.provider.getTransaction(txHash)
      return tx.data
    } catch (error) {
      console.error(`Error fetching transaction ${txHash}:`, error)
      return null
    }
  }

  private decodeCalldata(calldata: string): DecodedCalldata {
    const funcSignature =
      'verifyProofAndRegister(uint256[],uint256[],uint256[],uint256[],uint256)'
    const iface = new ethers.utils.Interface([`function ${funcSignature}`])
    const selector = iface.getSighash('verifyProofAndRegister')

    if (calldata.slice(0, 10) !== selector) {
      throw new Error('Calldata does not match the function signature')
    }

    const decoded = iface.decodeFunctionData('verifyProofAndRegister', calldata)

    return {
      proofParams: decoded[0],
      proof: decoded[1],
      taskMetadata: decoded[2],
      cairoAuxInput: decoded[3],
      cairoVerifierId: decoded[4],
    }
  }

  /**
   * taskMetadata structure:
   *
   * 270, 31, 168306275735...893086223513, 2, 2, 1, 0, 2, ...next task
   *  I    I         l                     l  -----I----
   *  I    l         task0programHash      nPairs  l
   *  l    task0Size                               Merkle tree structure
   *  number of all tasks in this call
   *
   */

  private extractProgramHashes(taskMetadata: ethers.BigNumber[]): string[] {
    return taskMetadata
      .filter((x) => x.toString().length > 10) // simply treat everything over 10 digits as a program hash
      .map((x) => x.toString())
  }

  private countProgramHashes(programHashes: string[]): Map<string, number> {
    return programHashes.reduce((counter, hash) => {
      counter.set(hash, (counter.get(hash) || 0) + 1)
      return counter
    }, new Map<string, number>())
  }

  public async analyzeProgramHashes(txHash: string): Promise<void> {
    const calldata = await this.fetchTransactionCalldata(txHash)
    if (!calldata) {
      console.error(`Transaction with hash ${txHash} not found.`)
      return
    }

    const decodedDict = this.decodeCalldata(calldata)
    console.log('verifierID:', Number(decodedDict.cairoVerifierId))
    console.log(
      'taskLength (from taskMetadata):',
      Number(decodedDict.taskMetadata[0]),
    )

    const programHashes = this.extractProgramHashes(decodedDict.taskMetadata)
    console.log('length of extracted programhashes:', programHashes.length)

    const counter = this.countProgramHashes(programHashes)
    console.log('programHash counts:')

    const sortedCounter = Array.from(counter.entries()).sort(
      (a, b) => b[1] - a[1],
    )

    for (const [key, value] of sortedCounter) {
      const name = this.knownProgramHashes[key] || key
      console.log(`${name.padStart(80)}: ${value.toString().padStart(4)}`)
    }
    console.log('number of unique programHashes:', counter.size)
  }
}

async function main() {
  const txHash = process.argv[2]
  if (!txHash) {
    console.error('Please provide a transaction hash as an argument.')
    process.exit(1)
  }

  const analyzer = new EthereumTransactionAnalyzer(
    providerUrl,
    knownProgramHashes,
  )
  await analyzer.analyzeProgramHashes(txHash)
}

main().catch(console.error)
