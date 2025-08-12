import { ethers } from 'ethers'

interface DecodedCalldata {
  proofParams: ethers.BigNumber[]
  proof: ethers.BigNumber[]
  taskMetadata: ethers.BigNumber[]
  cairoAuxInput: ethers.BigNumber[]
  cairoVerifierId: ethers.BigNumber
}

export class EthereumTransactionAnalyzer {
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
    console.log('length of extracted program hashes:', programHashes.length)

    const counter = this.countProgramHashes(programHashes)
    console.log('programHash counts:')

    const sortedCounter = Array.from(counter.entries()).sort(
      (a, b) => b[1] - a[1],
    )

    for (const [key, value] of sortedCounter) {
      const name = this.knownProgramHashes[key] || key
      console.log(`${name.padStart(80)}: ${value.toString().padStart(4)}`)
    }
    console.log('number of unique program hashes:', counter.size)
  }
}
