import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { AbiCoder } from 'ethers/lib/utils'
import { z } from 'zod'
import type { Transaction } from '../../../utils/IEtherscanClient'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import {
  type ReferenceInput,
  generateReferenceInput,
  getReferencedName,
  resolveReference,
} from '../reference'
import { valueToAddress } from '../utils/valueToAddress'

export type OpStackDAHandlerDefinition = z.infer<
  typeof OpStackDAHandlerDefinition
>
export const OpStackDAHandlerDefinition = z.strictObject({
  type: z.literal('opStackDA'),
  sequencerAddress: z.string(),
  inboxAddress: z.string(),
})

/**
 * This is an example of transaction data that is posted on Ethereum
 * when a project is using the OP Stack, but it is not posting the
 * transaction data on Ethereum.
 *
 * It is posted by Lyra sequencer, it's posting data to Celestia.
 * https://etherscan.io/tx/0xfd45a6ec27489c7d38957f6b17ad94b845605549e8d7bcf466ac436a7060eb81
 */
const OP_STACK_CELESTIA_DA_EXAMPLE_INPUT =
  '0xce62ae09000000000098e29cf2952f1f2de47a587994a1ab8eeacbe6e5725251873117fb675f63ac7c'

/**
 * https://eips.ethereum.org/EIPS/eip-4844#parameters
 */
const BLOB_TX_TYPE = 3

/**
 * https://specs.optimism.io/experimental/alt-da.html#input-commitment-submission
 * These versioning prefixes are super weird.
 *
 * aevo: 		  0x01 01 00  	(EIGEN)
 * soma: 		  0x01 00 00 		(EIGEN)
 * donatuz: 	0x01 01 00		(EIGEN)
 * automata: 	0x01 00 a5 		(challenges)
 * syndicate: 0x01 00 9c		(keccak256)
 */
const EIGEN_DA_CONSTANTS = {
  COMMITMENT_PREFIX: '0x01',
  COMMITMENT_THIRD_BYTE: '00',
  VERIFICATION_THRESHOLD: 0.8, // 80% success rate required
  CONFIRM_BATCH_ADDRESS: EthereumAddress(
    '0x454Ef2f69f91527856E06659f92a66f464C1ca4e',
  ),
  REFERENCE_LENGTH: 1090,
  BATCH_ROOT_OFFSET: 208,
  BATCH_ROOT_HASH_LENGTH: 64,
} as const

/**
 * This is a OP Stack specific handler that is used to check if
 * the OP Stack project is still posting the transaction data on Ethereum.
 */
export class OpStackDAHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    readonly definition: OpStackDAHandlerDefinition,
  ) {
    const dependencies = [
      getReferencedName(this.definition.sequencerAddress),
      getReferencedName(this.definition.inboxAddress),
    ].filter((d) => d !== undefined)

    if (dependencies.length > 0) {
      this.dependencies.push(...dependencies)
    }
  }

  async execute(
    provider: IProvider,
    currentContractAddress: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const referenceInput = generateReferenceInput(
      previousResults,
      provider,
      currentContractAddress,
    )
    const resolved = resolveReference(
      this.definition.sequencerAddress,
      referenceInput,
    )
    const sequencerAddress = valueToAddress(resolved)
    const lastTxs = await provider.raw(
      `optimism_sequencer_100.${sequencerAddress}.${provider.blockNumber}`,
      ({ etherscanClient }) =>
        etherscanClient.getAtMost10RecentOutgoingTxs(
          sequencerAddress,
          provider.blockNumber,
        ),
    )

    const hasTxs = lastTxs.length > 0

    const isSomeTxsLengthEqualToCelestiaDAExample =
      hasTxs &&
      lastTxs.some(
        (tx) => tx.input.length === OP_STACK_CELESTIA_DA_EXAMPLE_INPUT.length,
      )

    const rpcTxs = await Promise.all(
      lastTxs.map((tx) => provider.getTransaction(tx.hash)),
    )
    const missingIndex = rpcTxs.findIndex((x) => x === undefined)
    if (missingIndex !== -1) {
      throw new Error(`Transaction ${lastTxs[missingIndex]?.hash} is missing`)
    }
    const isSequencerSendingBlobTx =
      hasTxs && rpcTxs.some((tx) => tx?.type === BLOB_TX_TYPE)

    const isUsingEigenDA = await this.checkForEigenDA(
      provider,
      referenceInput,
      lastTxs,
    )

    return {
      field: this.field,
      value: {
        isSomeTxsLengthEqualToCelestiaDAExample,
        isSequencerSendingBlobTx,
        isUsingEigenDA,
      },
    }
  }

  private async checkForEigenDA(
    provider: IProvider,
    referenceInput: ReferenceInput,
    sequencerTxs: Transaction[],
  ) {
    const isUsingEigenLikeCommitments =
      sequencerTxs.length > 0 &&
      sequencerTxs.some((tx) => {
        const thirdByte = tx.input.slice(6, 8)

        const prefixMatch = tx.input.startsWith(
          EIGEN_DA_CONSTANTS.COMMITMENT_PREFIX,
        )
        const thirdByteMatch =
          thirdByte === EIGEN_DA_CONSTANTS.COMMITMENT_THIRD_BYTE

        return prefixMatch && thirdByteMatch
      })

    if (!isUsingEigenLikeCommitments) {
      return false
    }

    const resolvedInbox = resolveReference(
      this.definition.inboxAddress,
      referenceInput,
    )
    const inboxAddress = valueToAddress(resolvedInbox)

    const { confirmBatchTxs, inboxTxs } = await fetchEigenDAVerificationData(
      provider,
      inboxAddress,
    )
    const successfulVerifications = countSuccessfulVerifications(
      inboxTxs,
      confirmBatchTxs,
    )
    const successRate = (successfulVerifications / inboxTxs.length) * 100

    return successRate >= EIGEN_DA_CONSTANTS.VERIFICATION_THRESHOLD
  }
}

async function fetchEigenDAVerificationData(
  provider: IProvider,
  inboxAddress: EthereumAddress,
) {
  const latestBlockNumber = provider.blockNumber
  const latestBlock = await provider.getBlock(latestBlockNumber)
  assert(latestBlock?.timestamp, 'Missing block timestamp')

  const oneDayBefore = new UnixTime(latestBlock.timestamp).add(-1, 'days')

  const blockNumberDayBefore = await provider.raw(
    `optimism_eigen_reference_block_${oneDayBefore.toNumber()}_${provider.chain}`,
    ({ etherscanClient }) =>
      etherscanClient.getBlockNumberAtOrBefore(oneDayBefore),
  )

  const fromBlock = {
    number: blockNumberDayBefore,
    timestamp: oneDayBefore.toNumber(),
  }
  const toBlock = {
    number: latestBlockNumber,
    timestamp: latestBlock.timestamp,
  }

  const confirmBatchTxs = await getBatchConfirmTransactions(
    provider,
    fromBlock,
    toBlock,
  )

  const inboxTxs = await provider.raw(
    `optimism_eigen_inbox_tx_${inboxAddress}_${blockNumberDayBefore}_${latestBlockNumber}`,
    ({ etherscanClient }) =>
      etherscanClient.getTransactions(
        inboxAddress,
        blockNumberDayBefore,
        latestBlockNumber,
      ),
  )
  return { confirmBatchTxs, inboxTxs }
}

async function getBatchConfirmTransactions(
  provider: IProvider,
  fromBlock: {
    number: number
    timestamp: number
  },
  toBlock: {
    number: number
    timestamp: number
  },
) {
  const {
    fromBlock: fromBlockEthereum,
    toBlock: toBlockEthereum,
    provider: ethereumProvider,
  } = await translateToEthereum(provider, fromBlock, toBlock)

  const confirmBatchTxs = await ethereumProvider.raw(
    `optimism_eigen_confirm_batch_${EIGEN_DA_CONSTANTS.CONFIRM_BATCH_ADDRESS}_${fromBlockEthereum}_${toBlockEthereum}`,
    ({ etherscanClient }) =>
      etherscanClient.getTransactions(
        EIGEN_DA_CONSTANTS.CONFIRM_BATCH_ADDRESS,
        fromBlockEthereum,
        toBlockEthereum,
      ),
  )

  return confirmBatchTxs
}

// We need to align block ranges across different chains is applicable
// since Eigen AVS lives on Ethereum
async function translateToEthereum(
  provider: IProvider,
  fromBlock: {
    number: number
    timestamp: number
  },
  toBlock: {
    number: number
    timestamp: number
  },
) {
  const ethereumProvider = provider.switchChain('ethereum', fromBlock.number)

  const [ethereumFromBlock, ethereumToBlock] = await Promise.all([
    ethereumProvider.raw(
      `optimism_eigen_translate_block_${fromBlock.timestamp}_${provider.chain}`,
      ({ etherscanClient }) =>
        etherscanClient.getBlockNumberAtOrBefore(
          new UnixTime(fromBlock.timestamp),
        ),
    ),
    ethereumProvider.raw(
      `optimism_eigen_translate_block_${toBlock.timestamp}_${provider.chain}`,
      ({ etherscanClient }) =>
        etherscanClient.getBlockNumberAtOrBefore(
          new UnixTime(toBlock.timestamp),
        ),
    ),
  ])

  assert(ethereumFromBlock, 'Missing ethereum from block')
  assert(ethereumToBlock, 'Missing ethereum to block')

  return {
    provider: ethereumProvider,
    fromBlock: ethereumFromBlock,
    toBlock: ethereumToBlock,
  }
}

function countSuccessfulVerifications(
  inboxTxs: Transaction[],
  confirmBatchTxs: Transaction[],
) {
  let successes = 0

  for (const tx of inboxTxs) {
    try {
      const blobInfo = parseEigenDACommitment(tx.input)
      const hasMatch = findMatchingConfirmation(blobInfo, confirmBatchTxs)

      if (hasMatch) {
        successes++
      }
    } catch {
      // Invalid commitment format, skip
    }
  }

  return successes
}

function parseStandardCommitment(hexData: string) {
  const batchRootStart =
    hexData.length -
    EIGEN_DA_CONSTANTS.REFERENCE_LENGTH +
    EIGEN_DA_CONSTANTS.BATCH_ROOT_OFFSET

  return {
    batchRootHash: `0x${hexData.slice(
      batchRootStart,
      batchRootStart + EIGEN_DA_CONSTANTS.BATCH_ROOT_HASH_LENGTH,
    )}`,
    possibleBatchRoots: undefined,
  }
}

function parseExtendedCommitment(hexData: string) {
  const possibleBatchRoots = Array.from(
    { length: hexData.length - EIGEN_DA_CONSTANTS.BATCH_ROOT_HASH_LENGTH - 1 },
    (_, i) => ({
      hash: `0x${hexData.slice(i, i + EIGEN_DA_CONSTANTS.BATCH_ROOT_HASH_LENGTH)}`,
      position: i,
    }),
  )

  return {
    batchRootHash: `0x${hexData.slice(-64)}`,
    possibleBatchRoots,
  }
}

function getConfirmationRoots(confirmBatchTxs: Transaction[]): Set<string> {
  const roots = new Set<string>()
  for (const tx of confirmBatchTxs) {
    try {
      const blobHeadersRoot = decodeBatchConfirmation(tx.input)
      if (blobHeadersRoot) {
        roots.add(blobHeadersRoot.toLowerCase()) // Normalize case
      }
    } catch {
      // Skip invalid confirmations
    }
  }
  return roots
}

function findMatchingConfirmation(
  blobInfo: ReturnType<typeof parseEigenDACommitment>,
  confirmBatchTxs: Transaction[],
) {
  const confirmationRoots = getConfirmationRoots(confirmBatchTxs)

  if (blobInfo.possibleBatchRoots?.length) {
    return blobInfo.possibleBatchRoots.some(({ hash }) =>
      confirmationRoots.has(hash.toLowerCase()),
    )
  }

  // Check standard single root format
  return confirmationRoots.has(blobInfo.batchRootHash.toLowerCase())
}

function parseEigenDACommitment(inputData: string) {
  const hexData = inputData.startsWith('0x') ? inputData.slice(2) : inputData

  // 1150 is arbitrary, we treat anything longer than that as extended
  if (hexData.length > 1150) {
    return parseExtendedCommitment(hexData)
  }

  return parseStandardCommitment(hexData)
}

function decodeBatchConfirmation(inputData: string): string | undefined {
  if (!inputData.startsWith('0x7794965a')) {
    // Skip invalid selectors
    return
  }

  // Remove '0x' and function selector
  const data = inputData.slice(10)
  const abiCoder = new AbiCoder()

  const batchHeaderType =
    'tuple(bytes32 blobHeadersRoot, bytes quorumNumbers, bytes signedStakeForQuorums, uint32 referenceBlockNumber)'
  const nonSignerStakesType =
    'tuple(uint32[] nonSignerQuorumBitmapIndices, tuple(uint256,uint256)[] nonSignerPubkeys, tuple(uint256,uint256)[] quorumApks, tuple(uint256,uint256,uint256,uint256) apkG2, tuple(uint256,uint256) sigma, uint32[] quorumApkIndices, uint32[] totalStakeIndices, uint32[][] nonSignerStakeIndices)'

  const decoded = abiCoder.decode(
    [batchHeaderType, nonSignerStakesType],
    '0x' + data,
  )

  return decoded[0].blobHeadersRoot
}
