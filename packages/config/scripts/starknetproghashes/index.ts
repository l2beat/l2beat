import { ethers } from 'ethers'

const providerUrl = 'https://eth.drpc.org'
const knownProgramHashes: Record<string, string> = {
  // from our discovery: names are just project names that are using this progHash
  '3383082961563516565935611087683915026448707331436034043529592588079494402084':
    'StarkNet OS (Paradex, old StarkNet)',
  '3485280386001712778192330279103973322645241679001461923469191557000342180556':
    'StarkEx Spot v3.0 (ImutableX, Layer2FinanceZK)',
  '770346231394331402493200980986217737662224545740427952627288191358999988146':
    'ApeX-USDT',
  '3174901404014912024702042974619036870715605532092680335571201877913899936957':
    'StarkEx Spot v4.0 (RhinoFi, Sorare)',
  '16830627573509542901909952446321116535677491650708854009406762893086223513':
    'StarkEx Spot v4.5 (Brine, Canvasconnect, Myria, ReddioEX)',
  '3114724292040200590153042023978438629733352741898912919152162079752811928849':
    'StarkEx Perp v2.0 ApeX-USDC',
  '217719352201300445998518619904782191262194843262573339166404641663770051805':
    'StarkNet (old)',
  '3003515909324298587247571665454372831319437787162989623104387385306791861180':
    'StarkNet (old)',
  '1161178844461337253856226043908368523817098764221830529880464854589141231910':
    'StarkNet Aggregator',
  '1921772108187713503530008849184725638117898887391063185252422808224349294626':
    'StarkNet (old)',
  '3258367057337572248818716706664617507069572185152472699066582725377748079373':
    'StarkNet (old)',
  '407700941260678649793204927710478760533239334662847444187959202896452163393':
    'StarkNet (old)',
  '1865367024509426979036104162713508294334262484507712987283009063059134893433':
    'StarkNet (old)',
  '54878256403880350656938046611252303365750679698042371543935159963667935317':
    'StarkNet (old)',
  '2479841346739966073527450029179698923866252973805981504232089731754042431018':
    'StarkNet (old)',
  '109586309220455887239200613090920758778188956576212125550190099009305121410':
    'StarkNet (old)',
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
