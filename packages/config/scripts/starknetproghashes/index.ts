import {
  http,
  Hash,
  PublicClient,
  createPublicClient,
  decodeFunctionData,
  keccak256,
  toHex,
} from 'viem'
import { mainnet } from 'viem/chains'

interface DecodedCalldata {
  proofParams: bigint[]
  proof: bigint[]
  taskMetadata: bigint[]
  cairoAuxInput: bigint[]
  cairoVerifierId: bigint
}

class EthereumTransactionAnalyzer {
  private client: PublicClient
  private knownProgramHashes: Record<string, string>

  constructor(
    providerUrl: string,
    knownProgramHashes: Record<string, string> = {},
  ) {
    this.client = createPublicClient({
      chain: mainnet,
      transport: http(providerUrl),
    })
    this.knownProgramHashes = knownProgramHashes
  }

  private async fetchTransactionCalldata(
    txHash: Hash,
  ): Promise<`0x${string}` | null> {
    try {
      const tx = await this.client.getTransaction({ hash: txHash })
      return tx.input
    } catch (error) {
      console.error(`Error fetching transaction ${txHash}:`, error)
      return null
    }
  }

  private decodeCalldata(calldata: `0x${string}`): DecodedCalldata {
    const funcSignature =
      'verifyProofAndRegister(uint256[],uint256[],uint256[],uint256[],uint256)'
    const selector = keccak256(toHex(funcSignature)).slice(0, 10)

    if (calldata.slice(0, 10) !== selector) {
      throw new Error('Calldata does not match the function signature')
    }

    const { args } = decodeFunctionData({
      abi: [
        {
          name: 'verifyProofAndRegister',
          type: 'function',
          inputs: [
            { type: 'uint256[]', name: 'proofParams' },
            { type: 'uint256[]', name: 'proof' },
            { type: 'uint256[]', name: 'taskMetadata' },
            { type: 'uint256[]', name: 'cairoAuxInput' },
            { type: 'uint256', name: 'cairoVerifierId' },
          ],
          outputs: [],
        },
      ],
      data: calldata,
    })

    if (!args || args.length !== 5) {
      throw new Error('Unexpected argument structure in decoded calldata')
    }

    return {
      proofParams: args[0] as bigint[],
      proof: args[1] as bigint[],
      taskMetadata: args[2] as bigint[],
      cairoAuxInput: args[3] as bigint[],
      cairoVerifierId: args[4] as bigint,
    }
  }

  private extractProgramHashes(taskMetadata: bigint[]): string[] {
    return taskMetadata
      .filter((x) => x.toString().length > 10)
      .map((x) => x.toString())
  }

  private countProgramHashes(programHashes: string[]): Map<string, number> {
    return programHashes.reduce((counter, hash) => {
      counter.set(hash, (counter.get(hash) || 0) + 1)
      return counter
    }, new Map<string, number>())
  }

  public async analyzeProgramHashes(txHash: Hash): Promise<void> {
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
    console.log('length of program_hashes:', programHashes.length)

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

// Usage
const providerUrl = 'https://eth.drpc.org'
const knownProgramHashes: Record<string, string> = {
  // '3383082961563516565935611087683915026448707331436034043529592588079494402084':
  //   'Known Program 1',
  // '3485280386001712778192330279103973322645241679001461923469191557000342180556':
  //   'Known Program 2',
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
  await analyzer.analyzeProgramHashes(txHash as Hash)
}

main().catch(console.error)
