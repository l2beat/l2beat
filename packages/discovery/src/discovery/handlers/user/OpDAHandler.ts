import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { AbiCoder } from 'ethers/lib/utils'
import { z } from 'zod'
import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import {
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
const EIGEN_DA_COMMITMENT_PREFIX = '0x01'
const EIGEN_DA_COMMITMENT_THIRD_BYTE = '00'

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

    const isUsingEigenDA =
      hasTxs &&
      lastTxs.some((tx) => {
        const thirdByte = tx.input.slice(6, 8)

        const prefixMatch = tx.input.startsWith(EIGEN_DA_COMMITMENT_PREFIX)
        const thirdByteMatch = thirdByte === EIGEN_DA_COMMITMENT_THIRD_BYTE

        return prefixMatch && thirdByteMatch
      })

    // EIGEN
    const resolvedInbox = resolveReference(
      this.definition.inboxAddress,
      referenceInput,
    )
    const inboxAddress = valueToAddress(resolvedInbox)

    const latestBlock = await provider.getBlock(provider.blockNumber)

    const latestBlockTimestamp = latestBlock?.timestamp

    // Should not happen
    assert(latestBlockTimestamp, 'not yet mined')

    const oneDayBefore = new UnixTime(latestBlockTimestamp).add(-1, 'days')

    const blockDayBefore = await provider.raw(
      `optimism_eigen_reference_block_${oneDayBefore.toNumber()}`,
      ({ etherscanClient }) =>
        etherscanClient.getBlockNumberAtOrBefore(oneDayBefore),
    )

    const CONFIRM_BATCH_ADDRESS = EthereumAddress(
      '0x454Ef2f69f91527856E06659f92a66f464C1ca4e',
    )

    const confirmBatchTxs = await provider.raw(
      `optimism_eigen_confirm_batch_${CONFIRM_BATCH_ADDRESS}_${blockDayBefore}_${provider.blockNumber}`,
      ({ etherscanClient }) =>
        etherscanClient.getTransactions(
          CONFIRM_BATCH_ADDRESS,
          blockDayBefore,
          provider.blockNumber,
        ),
    )

    const inboxTxs = await provider.raw(
      `optimism_eigen_inbox_tx_${inboxAddress}_${blockDayBefore}_${provider.blockNumber}`,
      ({ etherscanClient }) =>
        etherscanClient.getTransactions(
          inboxAddress,
          blockDayBefore,
          provider.blockNumber,
        ),
    )

    // TODO: refine readability and optimize? it takes a bit
    const verificationResult = inboxTxs.map((tx) => {
      const blobInformation = parseEigenDACommitment(tx.input)
      let isVerified = false

      if (
        blobInformation.possibleBatchRoots &&
        blobInformation.possibleBatchRoots.length > 0
      ) {
        // Try each possible batch root
        for (const batchRoot of blobInformation.possibleBatchRoots) {
          const hasMatchingConfirmation = confirmBatchTxs.find((confirmTx) => {
            const batchConfirmation = decodeBatchConfirmation(confirmTx.input)

            return (
              batchConfirmation &&
              batchConfirmation.blobHeadersRoot === batchRoot.hash
            )
          })

          if (hasMatchingConfirmation) {
            isVerified = true
            break
          }
        }
      }

      // Legacy
      const matchingConfirmTx = confirmBatchTxs.find((confirmTx) => {
        const batchConfirmation = decodeBatchConfirmation(confirmTx.input)
        return (
          batchConfirmation &&
          batchConfirmation.blobHeadersRoot === blobInformation.batchRootHash
        )
      })

      if (matchingConfirmTx) {
        isVerified = true
      }

      return {
        isVerified,
      }
    })

    const verified = verificationResult.filter((x) => x?.isVerified).length

    const successRate = (verified / inboxTxs.length) * 100

    const EIGEN_DA_VERIFICATION_THRESHOLD = 0.8

    const isUsingEigenDAPercent = successRate >= EIGEN_DA_VERIFICATION_THRESHOLD

    return {
      field: this.field,
      value: {
        isSomeTxsLengthEqualToCelestiaDAExample,
        isSequencerSendingBlobTx,
        isUsingEigenDA,
        isUsingEigenDAPercent,
        successRate,
      },
    }
  }
}

export function parseEigenDACommitment(inputData: string) {
  const hexData = inputData.startsWith('0x') ? inputData.slice(2) : inputData

  const REFERENCE_LENGTH = 1090
  const BATCH_ROOT_OFFSET = 208
  const BATCH_ROOT_HASH_LENGTH = 64

  // For long inputs, scan for possible batch roots
  if (hexData.length > 1150) {
    const possibleBatchRoots = []

    for (let i = 0; i <= hexData.length - 64; i++) {
      possibleBatchRoots.push({
        hash: '0x' + hexData.slice(i, i + 64),
        position: i,
      })
    }

    return {
      batchRootHash: '0x' + hexData.slice(-64),
      possibleBatchRoots,
    }
  }

  // For standard length inputs, use fixed offset
  const batchRootStart = hexData.length - REFERENCE_LENGTH + BATCH_ROOT_OFFSET

  return {
    batchRootHash:
      '0x' +
      hexData.slice(batchRootStart, batchRootStart + BATCH_ROOT_HASH_LENGTH),
    possibleBatchRoots: undefined,
  }
}

function decodeBatchConfirmation(inputData: string) {
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

  return {
    blobHeadersRoot: decoded[0].blobHeadersRoot,
    quorumNumbers: decoded[0].quorumNumbers,
    signedStakeForQuorums: decoded[0].signedStakeForQuorums,
    referenceBlockNumber: decoded[0].referenceBlockNumber,
  }
}
