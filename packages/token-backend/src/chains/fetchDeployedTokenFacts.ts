import type { UnixTime } from '@l2beat/shared-pure'
import { formatError } from '../utils/formatError'
import type { Chain } from './Chain'
import { getDeploymentTimestampFromRpc } from './clients/rpc/getDeploymentTimestampFromRpc'

export interface DeployedTokenFacts {
  isContract: boolean | undefined
  decimals: number | undefined
  symbol: string | undefined
  symbolSource: 'rpc' | undefined
  deploymentTimestamp: UnixTime | undefined
  warnings: DeployedTokenFactWarning[]
}

export type DeployedTokenFactWarning = {
  field: 'symbol' | 'decimals' | 'deploymentTimestamp' | 'contractCode'
  message: string
}

export async function fetchDeployedTokenFacts(
  chain: Chain,
  address: string,
): Promise<DeployedTokenFacts> {
  const contractCodeStatus = await fetchContractCodeStatus(chain, address)
  if (contractCodeStatus.isContract === false) {
    return {
      isContract: false,
      decimals: undefined,
      symbol: undefined,
      symbolSource: undefined,
      deploymentTimestamp: undefined,
      warnings: contractCodeStatus.warnings,
    }
  }

  const [metadata, deploymentTimestampResult] = await Promise.all([
    fetchTokenMetadata(chain, address),
    fetchDeploymentTimestamp(chain, address),
  ])

  return {
    isContract: contractCodeStatus.isContract,
    decimals: metadata.decimals,
    symbol: metadata.symbol,
    symbolSource: metadata.symbolSource,
    deploymentTimestamp: deploymentTimestampResult.deploymentTimestamp,
    warnings: [
      ...contractCodeStatus.warnings,
      ...metadata.warnings,
      ...deploymentTimestampResult.warnings,
    ],
  }
}

async function fetchTokenMetadata(
  chain: Chain,
  address: string,
): Promise<{
  decimals: number | undefined
  symbol: string | undefined
  symbolSource: 'rpc' | undefined
  warnings: DeployedTokenFactWarning[]
}> {
  if (!chain.rpc) {
    return {
      decimals: undefined,
      symbol: undefined,
      symbolSource: undefined,
      warnings: [
        {
          field: 'decimals',
          message: `No RPC configured for ${chain.name}, so decimals were not autofilled.`,
        },
        {
          field: 'symbol',
          message: `No RPC configured for ${chain.name}, so symbol was not autofilled.`,
        },
      ],
    }
  }

  const warnings: DeployedTokenFactWarning[] = []
  const [decimalsResult, symbolResult] = await Promise.allSettled([
    chain.rpc.getDecimals(address),
    chain.rpc.getSymbol(address),
  ])

  const decimals =
    decimalsResult.status === 'fulfilled' ? decimalsResult.value : undefined
  if (decimalsResult.status === 'rejected') {
    warnings.push({
      field: 'decimals',
      message: `RPC decimals lookup failed: ${formatError(decimalsResult.reason)}.`,
    })
  }

  const symbol =
    symbolResult.status === 'fulfilled' ? symbolResult.value : undefined
  if (symbolResult.status === 'rejected') {
    warnings.push({
      field: 'symbol',
      message: `RPC symbol lookup failed: ${formatError(symbolResult.reason)}.`,
    })
  }

  return {
    decimals,
    symbol,
    symbolSource: symbol ? 'rpc' : undefined,
    warnings,
  }
}

async function fetchDeploymentTimestamp(
  chain: Chain,
  address: string,
): Promise<{
  deploymentTimestamp: UnixTime | undefined
  warnings: DeployedTokenFactWarning[]
}> {
  const failureMessages: string[] = []

  if (chain.etherscan) {
    try {
      const contractCreation =
        await chain.etherscan.getContractCreation(address)
      if (!contractCreation[0]) {
        throw new Error('contract creation response was empty')
      }
      if (contractCreation[0].timestamp === undefined) {
        throw new Error('contract creation timestamp was empty')
      }
      return {
        deploymentTimestamp: contractCreation[0].timestamp,
        warnings: [],
      }
    } catch (error) {
      failureMessages.push(`Etherscan lookup failed: ${formatError(error)}.`)
    }
  }

  if (chain.blockscout) {
    try {
      const contractCreation =
        await chain.blockscout.getContractCreation(address)
      if (!contractCreation[0]) {
        throw new Error('contract creation response was empty')
      }
      const txHash = contractCreation[0].txHash
      const txInfo = await chain.blockscout.getTransactionInfo(txHash)
      if (txInfo.timeStamp === undefined) {
        throw new Error('transaction timestamp was empty')
      }
      return { deploymentTimestamp: txInfo.timeStamp, warnings: [] }
    } catch (error) {
      failureMessages.push(`Blockscout lookup failed: ${formatError(error)}.`)
    }
  }

  if (chain.rpc) {
    try {
      const deploymentTimestamp = await getDeploymentTimestampFromRpc(
        chain.rpc,
        address,
      )
      if (deploymentTimestamp !== undefined) {
        return {
          deploymentTimestamp,
          warnings: [],
        }
      }
      failureMessages.push('RPC lookup returned no value.')
    } catch (error) {
      failureMessages.push(`RPC lookup failed: ${formatError(error)}.`)
    }
  }

  const message =
    failureMessages.length > 0
      ? failureMessages.join(' ')
      : `No Etherscan, Blockscout, or RPC configured for ${chain.name}.`

  return {
    deploymentTimestamp: undefined,
    warnings: [
      {
        field: 'deploymentTimestamp',
        message: `${message} Deployment timestamp was not autofilled.`,
      },
    ],
  }
}

async function fetchContractCodeStatus(
  chain: Chain,
  address: string,
): Promise<{
  isContract: boolean | undefined
  warnings: DeployedTokenFactWarning[]
}> {
  if (!chain.rpc) {
    return { isContract: undefined, warnings: [] }
  }

  try {
    const code = await chain.rpc.getCode(address, 'latest')
    return { isContract: code !== '0x', warnings: [] }
  } catch (error) {
    return {
      isContract: undefined,
      warnings: [
        {
          field: 'contractCode',
          message: `RPC contract code lookup failed: ${formatError(error)}.`,
        },
      ],
    }
  }
}
