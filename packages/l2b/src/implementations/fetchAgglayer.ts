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
  private rollupManagerAddress = '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2'
  private outputFilePath: string

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
    '12': 'mainnet',
    '14': 'cdk-sov test',
    '15': 'testnet?',
    '16': 'pentagon.games/pentagon-chain',
    '17': 'wallet',
    '20': 'op stack cdk sov',
    '21': 'Forknet.io',
    '22': 'testnet?',
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

  private rollupManagerAbi = [
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
    const rollupManager = new ethers.Contract(
      this.rollupManagerAddress,
      this.rollupManagerAbi,
      this.provider,
    )

    // Fetch rollup data
    const rollupDataList: RollupDataExtended[] = []
    let rollupID = 1
    let continueLoop = true

    console.log('Fetching rollup data...')

    while (continueLoop) {
      try {
        const data: RollupData =
          await rollupManager.rollupIDToRollupDataV2(rollupID)

        // Check if rollupContract is the zero address
        if (
          data.rollupContract === '0x0000000000000000000000000000000000000000'
        ) {
          console.log(`No more rollups found after ID ${rollupID - 1}`)
          continueLoop = false
        } else {
          // Query per-rollup contract for extras: networkName + gasTokenAddress
          let networkName: string | undefined
          let gasTokenAddress: string | undefined
          try {
            const rollupContract = new ethers.Contract(
              data.rollupContract,
              this.rollupContractAbi,
              this.provider,
            )
            networkName = await rollupContract.networkName()
          } catch (_e) {
            // ignore; fallback will be used
          }
          try {
            const rollupContract = new ethers.Contract(
              data.rollupContract,
              this.rollupContractAbi,
              this.provider,
            )
            gasTokenAddress = await rollupContract.gasTokenAddress()
          } catch (_e) {
            // ignore; may be undefined
          }

          // Add to our list with extended information
          rollupDataList.push({
            ...data,
            rollupID,
            name: networkName ?? 'Unknown',
            networkName,
            gasTokenAddress,
            comments: this.getFromStringMap(
              this.comments,
              rollupID.toString(),
              '',
            ),
          })

          console.log(`Fetched data for rollupID: ${rollupID}`)
          rollupID++
        }
      } catch (error: unknown) {
        const errorWithMessage = error as ErrorWithMessage
        console.log(
          `Error fetching rollupID ${rollupID}: ${errorWithMessage.message}`,
        )
        continueLoop = false
      }
    }

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
        networkName: data.networkName,
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
