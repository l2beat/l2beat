import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { ethers } from 'ethers'
import fs from 'fs'

interface CommentsMap {
  [key: string]: string
}

interface RollupTypeNamesMap {
  [key: string]: string
}

interface RollupData {
  rollupContract: string
  chainID: ethers.BigNumber
  verifier: string
  forkID: ethers.BigNumber
  lastLocalExitRoot: string
  lastBatchSequenced: ethers.BigNumber
  lastVerifiedBatch: ethers.BigNumber
  lastVerifiedBatchBeforeUpgrade: ethers.BigNumber
  rollupTypeID: ethers.BigNumber
  rollupVerifierType: number
  lastPessimisticRoot: string
  programVKey: string
}

interface RollupDataExtended extends RollupData {
  rollupID: number
  name: string
  networkName?: string
  gasTokenAddress?: string
  comments?: string
}

interface ErrorWithMessage {
  message: string
}

export class AgglayerDataFetcher {
  private provider: ethers.providers.JsonRpcProvider
  private agglayerManagerAddress = '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'
  private outputFilePath: string
  private readonly zeroAddress = '0x0000000000000000000000000000000000000000'

  // Manual comments per rollupID (user-editable)
  private comments: CommentsMap = {
    '4': 'dead',
    '5': 'dead',
    '6': 'dead',
    '7': 'lumia.org',
    '8': 'wirexpaychain.com',
    '9': 'testnet',
    '10': 'mainnet',
    '11': 'testnet',
    '12': 'testnet?',
    '14': 'cdk-sov test',
    '15': 'testnet?',
    '16': 'pentagon.games/pentagon-chain',
    '17': 'wallet',
    '20': 'op stack cdk sov',
    '21': 'Forknet.io',
    '22': 'testnet?',
    '23': 'mainnet?',
  }

  // Rollup type ID descriptions
  private rollupTypeNames: RollupTypeNamesMap = {
    '6': 'zk rollup',
    '4': 'validiumV1',
    '7': 'validiumV2',
    '8': 'okx validium',
    '9': 'pessimistic test',
    '10': 'pessimistic 2',
    '11': 'pessimistic 3',
    '12': 'aggchainFEP',
  }

  // map rollupVerifierType to string
  private getRollupVerifierTypeString(verifierType: number): string {
    switch (verifierType) {
      case 0:
        return 'statetransition (0)'
      case 1:
        return 'pessimistic (1)'
      case 2:
        return 'algateway-pp (2)'
      default:
        return `unknown (${verifierType})`
    }
  }

  private agglayerManagerAbi = [
    'function rollupIDToRollupDataV2(uint32 rollupID) view returns (tuple(address rollupContract, uint64 chainID, address verifier, uint64 forkID, bytes32 lastLocalExitRoot, uint64 lastBatchSequenced, uint64 lastVerifiedBatch, uint64 lastVerifiedBatchBeforeUpgrade, uint64 rollupTypeID, uint8 rollupVerifierType, bytes32 lastPessimisticRoot, bytes32 programVKey) rollupData)',
  ]

  private rollupContractAbi = [
    'function networkName() view returns (string)',
    'function gasTokenAddress() view returns (address)',
  ]

  constructor(providerUrl: string, outputFilePath: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.outputFilePath = outputFilePath
  }

  // Helper function to safely access string map with fallback
  private getFromStringMap(
    map: CommentsMap | RollupTypeNamesMap,
    key: string,
    fallback: string,
  ): string {
    return map[key] !== undefined ? map[key] : fallback
  }

  public async fetchAndDisplayRollupData(): Promise<void> {
    // Create contract instance
    const agglayerManager = new ethers.Contract(
      this.agglayerManagerAddress,
      this.agglayerManagerAbi,
      this.provider,
    )

    // Batched fetch of rollup base data
    console.log('Fetching rollup data (batched)...')
    const rollupDataList: RollupDataExtended[] = []
    const batchSize = 50
    let nextStart = 1
    let foundEnd = false

    while (!foundEnd) {
      const ids = Array.from({ length: batchSize }, (_, i) => nextStart + i)
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const data: RollupData =
              await agglayerManager.rollupIDToRollupDataV2(id)
            return { id, data }
          } catch (error: unknown) {
            const errorWithMessage = error as ErrorWithMessage
            console.log(
              `Error fetching rollupID ${id}: ${errorWithMessage.message}`,
            )
            return { id, data: undefined as unknown as RollupData }
          }
        }),
      )

      for (const r of results) {
        const id = r.id
        const data = r.data
        if (!data || data.rollupContract === this.zeroAddress) {
          console.log(`No more rollups found after ID ${id - 1}`)
          foundEnd = true
          break
        }
        rollupDataList.push({
          ...data,
          rollupID: id,
          name: 'Unknown',
          comments: this.getFromStringMap(this.comments, id.toString(), ''),
        })
      }

      if (!foundEnd) {
        nextStart += batchSize
      }
    }

    // Fetch per-rollup extras concurrently (no bounds per provider guidance)
    await Promise.all(
      rollupDataList.map(async (item) => {
        const rollupContract = new ethers.Contract(
          item.rollupContract,
          this.rollupContractAbi,
          this.provider,
        )
        try {
          const [nn, gta] = await Promise.allSettled([
            rollupContract.networkName(),
            rollupContract.gasTokenAddress(),
          ])
          if (nn.status === 'fulfilled') {
            item.networkName = nn.value
            item.name = nn.value ?? 'Unknown'
          }
          if (gta.status === 'fulfilled') {
            item.gasTokenAddress = gta.value
          }
        } catch (_e) {
          // ignore per-rollup errors
        }
      }),
    )

    // Save complete data to file
    const formattedData = rollupDataList.map((data) => {
      const rollupTypeID = data.rollupTypeID.toString()
      const rollupTypeName = this.getFromStringMap(
        this.rollupTypeNames,
        rollupTypeID,
        'Unknown',
      )

      return {
        rollupID: data.rollupID,
        name: data.name,
        gasTokenAddress: data.gasTokenAddress,
        comments: data.comments,
        rollupContract: data.rollupContract,
        chainID: data.chainID.toString(),
        verifier: data.verifier,
        forkID: data.forkID.toString(),
        lastLocalExitRoot: data.lastLocalExitRoot,
        lastBatchSequenced: data.lastBatchSequenced.toString(),
        lastVerifiedBatch: data.lastVerifiedBatch.toString(),
        lastVerifiedBatchBeforeUpgrade:
          data.lastVerifiedBatchBeforeUpgrade.toString(),
        rollupTypeID: `${rollupTypeID} (${rollupTypeName})`,
        rollupVerifierType: this.getRollupVerifierTypeString(
          data.rollupVerifierType,
        ),
        lastPessimisticRoot: data.lastPessimisticRoot,
        programVKey: data.programVKey,
      }
    })

    // Create directory if it doesn't exist
    const outputDir = this.outputFilePath.substring(
      0,
      this.outputFilePath.lastIndexOf('/'),
    )
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    fs.writeFileSync(
      this.outputFilePath,
      JSON.stringify(formattedData, null, 2),
    )
    console.log(`Full data saved to ${this.outputFilePath}`)

    // Display table with selected fields
    const headers = [
      'RollupID',
      'Name',
      'Comments',
      'GasToken',
      'ChainID',
      'ForkID',
      'RollupTypeID',
      'VerifierType',
    ]
    const rows: string[][] = []

    rollupDataList.forEach((data) => {
      const rollupVerifierTypeString = this.getRollupVerifierTypeString(
        data.rollupVerifierType,
      )
      const rollupTypeID = data.rollupTypeID.toString()
      const rollupTypeName = this.getFromStringMap(
        this.rollupTypeNames,
        rollupTypeID,
        'Unknown',
      )
      const rollupTypeString = `${rollupTypeID} (${rollupTypeName})`

      const gasTokenDisplay = data.gasTokenAddress
        ? data.gasTokenAddress.toLowerCase() !==
          '0x0000000000000000000000000000000000000000'
          ? 'custom'
          : 'ETH'
        : '?'

      rows.push([
        data.rollupID.toString(),
        data.name,
        data.comments ?? '',
        gasTokenDisplay,
        data.chainID.toString(),
        data.forkID.toString(),
        rollupTypeString,
        rollupVerifierTypeString,
      ])
    })

    console.log('Rollup Data Summary:')
    console.log(formatAsAsciiTable(headers, rows))
  }
}
