import { type providers, utils } from 'ethers'

import { getAllLogs, type LogFilter } from './getAllLogs'

const ULTRA_LIGHT_NODE_V2 = '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2'
const INBOUND_PROOF_TOPIC =
  '0x802d55279d51813cb7a9a98e8fd2d7bec5346cb830901c11b85d1650cb857e9a'
const CONTRACT_CREATION_BLOCK = 15416271

const abi = new utils.Interface([
  'function defaultAppConfig(uint16 chainId) external view returns (ApplicationConfiguration)',
  'function inboundProofLibrary(uint16 chainId, uint16 libraryId) external view returns (string)',
])

interface DefaultAppConfig {
  chainId: number
  inboundProofLibraryVersion: number
  inboundBlockConfirmations: number
  relayer: string
  outboundProofType: number
  outboundBlockConfirmations: number
  oracle: string
  inboundProofLibrary?: string
}

export async function getInboundLibraries(
  provider: providers.AlchemyProvider,
): Promise<{
  libraries: string[]
  configs: DefaultAppConfig[]
}> {
  const filter: LogFilter = {
    address: ULTRA_LIGHT_NODE_V2,
    topics: [INBOUND_PROOF_TOPIC],
    fromBlock: CONTRACT_CREATION_BLOCK,
    toBlock: await provider.getBlockNumber(),
  }

  console.log('Fetching logs of config update...')
  const logs = await getAllLogs(provider, filter)
  console.log('Logs fetched.')

  const unique = new Set<string>()

  logs.map((l) => {
    unique.add(l.topics[1])
  })

  const chainIds: number[] = []
  for (const chainId of unique.keys()) {
    chainIds.push(Number.parseInt(chainId.slice(26), 16))
  }

  const defaultAppConfigs: DefaultAppConfig[] = []

  console.log('Fetching default app configs...')
  for (const chainId of chainIds) {
    const call = await provider.call({
      to: ULTRA_LIGHT_NODE_V2,
      data: abi.encodeFunctionData('defaultAppConfig', [chainId]),
    })
    const data = cutData(call)

    defaultAppConfigs.push({
      inboundProofLibraryVersion: Number.parseInt(data[0], 16),
      inboundBlockConfirmations: Number.parseInt(data[1], 16),
      relayer: data[2],
      outboundProofType: Number.parseInt(data[3], 16),
      outboundBlockConfirmations: Number.parseInt(data[4], 16),
      oracle: data[5],
      chainId,
    })
  }
  console.log('Default app configs fetched.')

  const result: DefaultAppConfig[] = []

  console.log('Fetching inbound proof libraries...')
  for (const config of defaultAppConfigs) {
    const call = await provider.call({
      to: ULTRA_LIGHT_NODE_V2,
      data: abi.encodeFunctionData('inboundProofLibrary', [
        config.chainId,
        config.inboundProofLibraryVersion,
      ]),
    })
    const data = cutData(call)
    result.push({
      ...config,
      inboundProofLibrary: `0x${data[0].slice(24)}`,
    })
  }
  console.log('Inbound proof libraries fetched.')

  //get only unique libraries
  const uniqueLibraries = new Set<string>()
  result.map((r) => {
    uniqueLibraries.add(r.inboundProofLibrary ?? '')
  })

  return {
    configs: result,
    libraries: uniqueLibraries.size > 0 ? [...uniqueLibraries] : [],
  }
}

function cutData(data: string): string[] {
  const result: string[] = []

  let id = 2

  while (id + 64 <= data.length) {
    result.push(data.slice(id, id + 64))
    id += 64
  }

  return result
}
