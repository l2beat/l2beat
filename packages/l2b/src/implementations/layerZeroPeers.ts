import { ChainId, EthereumAddress } from '@l2beat/shared-pure'
import * as dotenv from 'dotenv'
import { ethers } from 'ethers'

dotenv.config()

const lzChainData: Record<
  string,
  {
    name: string
    nativeId: number
    rpc: string
    eid: number
    v1eid?: number
  }
> = {
  ethereum: {
    name: 'Ethereum',
    eid: 30101,
    v1eid: 101,
    nativeId: 1,
    rpc: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com',
  },
  'bnb-smart-chain': {
    name: 'BNB Smart Chain',
    eid: 30102,
    v1eid: 102,
    nativeId: 56,
    rpc: process.env.BNB_SMART_CHAIN_RPC_URL || 'https://bsc-dataseed.binance.org/',
  },
  avalanche: {
    name: 'Avalanche',
    eid: 30106,
    v1eid: 106,
    nativeId: 43114,
    rpc: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
  },
  polygon: {
    name: 'Polygon',
    eid: 30109,
    v1eid: 109,
    nativeId: 137,
    rpc: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com/',
  },
  arbitrum: {
    name: 'Arbitrum',
    eid: 30110,
    v1eid: 110,
    nativeId: 42161,
    rpc: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  },
  optimism: {
    name: 'Optimism',
    eid: 30111,
    v1eid: 111,
    nativeId: 10,
    rpc: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
  },
  fantom: {
    name: 'Fantom',
    eid: 30112,
    v1eid: 112,
    nativeId: 250,
    rpc: process.env.FANTOM_RPC_URL || 'https://rpc.ftm.tools',
  },
  celo: {
    name: 'Celo',
    eid: 30125,
    v1eid: 125,
    nativeId: 42220,
    rpc: process.env.CELO_RPC_URL || 'https://forno.celo.org',
  },
  moonbeam: {
    name: 'Moonbeam',
    eid: 30126,
    v1eid: 126,
    nativeId: 1284,
    rpc: process.env.MOONBEAM_RPC_URL || 'https://rpc.api.moonbeam.network',
  },
  gnosis: {
    name: 'Gnosis',
    eid: 30145,
    v1eid: 145,
    nativeId: 100,
    rpc: process.env.GNOSIS_RPC_URL || 'https://rpc.gnosischain.com',
  },
  'klaytn-kaia': {
    name: 'Klaytn / Kaia',
    eid: 30150,
    v1eid: 150,
    nativeId: 8217,
    rpc: process.env.KLAYTN_KAIA_RPC_URL || 'https://public-node-api.klaytnapi.com/v1/cypress',
  },
  metis: {
    name: 'Metis',
    eid: 30151,
    v1eid: 151,
    nativeId: 1088,
    rpc: process.env.METIS_RPC_URL || 'https://andromeda.metis.io/?owner=1088',
  },
  coredao: {
    name: 'CoreDAO',
    eid: 30153,
    v1eid: 153,
    nativeId: 1116,
    rpc: process.env.COREDAO_RPC_URL || 'https://rpc.coredao.org',
  },
  'polygon-zkevm': {
    name: 'Polygon zkEVM',
    eid: 30158,
    v1eid: 158,
    nativeId: 1101,
    rpc: process.env.POLYGON_ZKEVM_RPC_URL || 'https://zkevm-rpc.com',
  },
  moonriver: {
    name: 'Moonriver',
    eid: 30167,
    v1eid: 167,
    nativeId: 1285,
    rpc: process.env.MOONRIVER_RPC_URL || 'https://rpc.api.moonriver.moonbeam.network',
  },
  'arbitrum-nova': {
    name: 'Arbitrum Nova',
    eid: 30175,
    v1eid: 175,
    nativeId: 42170,
    rpc: process.env.ARBITRUM_NOVA_RPC_URL || 'https://nova.arbitrum.io/rpc',
  },
  mantle: {
    name: 'Mantle',
    eid: 30181,
    v1eid: 181,
    nativeId: 5000,
    rpc: process.env.MANTLE_RPC_URL || 'https://rpc.mantle.xyz',
  },
  base: {
    name: 'Base',
    eid: 30184,
    v1eid: 184,
    nativeId: 8453,
    rpc: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  },
  linea: {
    name: 'Linea',
    eid: 30183,
    v1eid: 183,
    nativeId: 59144,
    rpc: process.env.LINEA_RPC_URL || 'https://rpc.linea.build',
  },
  harmony: {
    name: 'Harmony',
    eid: 30116,
    v1eid: 116,
    nativeId: 1666600000,
    rpc: process.env.HARMONY_RPC_URL || 'https://api.harmony.one',
  },
  scroll: {
    name: 'Scroll',
    eid: 30214,
    v1eid: 214,
    nativeId: 534352,
    rpc: process.env.SCROLL_RPC_URL || 'https://rpc.scroll.io',
  },
  'manta-pacific': {
    name: 'Manta Pacific',
    eid: 30217,
    v1eid: 217,
    nativeId: 169,
    rpc: process.env.MANTA_PACIFIC_RPC_URL || 'https://pacific-rpc.manta.network/http',
  },
  viction: {
    name: 'Viction',
    eid: 30196,
    v1eid: 196,
    nativeId: 88,
    rpc: process.env.VICTION_RPC_URL || 'https://rpc.viction.xyz',
  },
  'telos-evm': {
    name: 'Telos EVM',
    eid: 30199,
    v1eid: 199,
    nativeId: 40,
    rpc: process.env.TELOS_EVM_RPC_URL || 'https://mainnet.telos.net/evm',
  },
  opbnb: {
    name: 'opBNB',
    eid: 30202,
    v1eid: 202,
    nativeId: 204,
    rpc: process.env.OPBNB_RPC_URL || 'https://opbnb-mainnet-rpc.bnbchain.org',
  },
  aurora: {
    name: 'Aurora',
    eid: 30211,
    v1eid: 211,
    nativeId: 1313161554,
    rpc: process.env.AURORA_RPC_URL || 'https://mainnet.aurora.dev',
  },
  'conflux-espace': {
    name: 'Conflux eSpace',
    eid: 30212,
    v1eid: 212,
    nativeId: 1030,
    rpc: process.env.CONFLUX_ESPACE_RPC_URL || 'https://evm.confluxrpc.com',
  },
  zora: {
    name: 'Zora',
    eid: 30195,
    v1eid: 195,
    nativeId: 7777777,
    rpc: process.env.ZORA_RPC_URL || 'https://rpc.zora.energy',
  },
  fraxtal: {
    name: 'Fraxtal',
    eid: 30238,
    nativeId: 252,
    rpc: process.env.FRAXTAL_RPC_URL || 'https://rpc.frax.com',
  },
  'zksync-era': {
    name: 'zkSync Era',
    eid: 30265,
    nativeId: 324,
    rpc: process.env.ZKSYNC_ERA_RPC_URL || 'https://mainnet.era.zksync.io',
  },
  bob: {
    name: 'Bob',
    eid: 30279,
    nativeId: 60808,
    rpc: process.env.BOB_RPC_URL || 'https://rpc.gobob.xyz',
  },
  sei: {
    name: 'Sei',
    eid: 30280,
    nativeId: 1329,
    rpc: process.env.SEI_RPC_URL || 'https://evm-rpc.sei-apis.com',
  },
  taiko: {
    name: 'Taiko',
    eid: 30290,
    nativeId: 167000,
    rpc: process.env.TAIKO_RPC_URL || 'https://rpc.mainnet.taiko.xyz',
  },
  zircuit: {
    name: 'Zircuit',
    eid: 30303,
    nativeId: 48900,
    rpc: process.env.ZIRCUIT_RPC_URL || 'https://mainnet.zircuit.com',
  },
  bitlayer: {
    name: 'Bitlayer',
    eid: 30314,
    nativeId: 200901,
    rpc: process.env.BITLAYER_RPC_URL || 'https://rpc.bitlayer.org',
  },
  morph: {
    name: 'Morph',
    eid: 30322,
    nativeId: 2818,
    rpc: process.env.MORPH_RPC_URL || 'https://rpc-mainnet.morphl2.io',
  },
  movement: {
    name: 'Movement',
    eid: 30325,
    nativeId: 3073,
    rpc: process.env.MOVEMENT_RPC_URL || 'https://movement.lava.build/',
  },
  corn: {
    name: 'Corn',
    eid: 30331,
    nativeId: 21000000,
    rpc: process.env.CORN_RPC_URL || 'https://mainnet.corn-rpc.com',
  },
  sonic: {
    name: 'Sonic',
    eid: 30332,
    nativeId: 146,
    rpc: process.env.SONIC_RPC_URL || 'https://rpc.soniclabs.com',
  },
  berachain: {
    name: 'Berachain',
    eid: 30362,
    nativeId: 80094,
    rpc: process.env.BERACHAIN_RPC_URL || 'https://rpc.berachain.com',
  },
  nibiru: {
    name: 'Nibiru',
    eid: 30369,
    nativeId: 6900,
    rpc: process.env.NIBIRU_RPC_URL || 'https://evm-rpc.nibiru.fi',
  },
  plume: {
    name: 'Plume',
    eid: 30370,
    nativeId: 98866,
    rpc: process.env.PLUME_RPC_URL || 'https://rpc.plume.org',
  },
  unichain: {
    name: 'Unichain',
    eid: 30320,
    nativeId: 130,
    rpc: process.env.UNICHAIN_RPC_URL || 'https://mainnet.unichain.org',
  },
  hyperliquid: {
    name: 'Hyperliquid',
    eid: 30367,
    nativeId: 999,
    rpc: process.env.HYPERLIQUID_RPC_URL || 'https://rpc.hyperliquid.xyz/evm',
  },
}

const OFT_V1_VERSION_SIG = '0x02e49c2c'
const OFT_V2_VERSION_SIG = '0x1731da6a'

const OFT_V1_ABI = ["function oftVersion() external view returns (bytes4)"];
const OFT_V2_ABI = ["function oftVersion() external view returns (bytes4 interfaceId, uint64 version)"];

const OFT_SHARED_ABI = [
    "function sharedDecimals() external view returns (uint8)",
    "function decimals() external view returns (uint8)",
    "function peer(uint32 _eid) external view returns (bytes32)",
    "function peers(uint32 _eid) external view returns (bytes32)",
    "function totalSupply() external view returns (uint256)",
    "function token() external view returns (address)",
];

interface EtherscanApiResponse {
  status: string
  message: string
  result: Array<{
    ABI: string
    ContractName?: string
    Implementation?: string
  }>
}

function getApiKey(chainName: string): string | null {
  const envKey = `${chainName.toUpperCase()}_ETHERSCAN_API_KEY`
  const apiKey = process.env[envKey]
  return apiKey || null
}

function getEtherscanUrl(
  contractAddress: string,
  chainName: string,
  apiKey: string,
): string | null {
  const baseUrls: { [key: string]: string } = {
    ethereum: 'https://api.etherscan.io',
    arbitrum: 'https://api.arbiscan.io',
    base: 'https://api.basescan.org',
    fraxtal: 'https://api.fraxtal.io',
    optimism: 'https://api-optimistic.etherscan.io',
  }

  const baseUrl = baseUrls[chainName.toLowerCase()]
  if (!baseUrl) {
    console.error(`No Etherscan API support for ${chainName}`)
    return null
  }

  return `${baseUrl}/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`
}

let lastCallTime = 0
async function rateLimitedFetch(url: string) {
  const now = Date.now()
  const timeSinceLastCall = now - lastCallTime
  const minDelay = 1000 // 1 second

  if (timeSinceLastCall < minDelay) {
    await new Promise((resolve) =>
      setTimeout(resolve, minDelay - timeSinceLastCall),
    )
  }

  lastCallTime = Date.now()
  return fetch(url)
}

async function getContractABIAndName(
  address: EthereumAddress,
  chainName: string,
): Promise<
  { Implementation?: string; ContractName?: string; ABI?: string } | undefined
> {
  const apiKey = getApiKey(chainName)
  if (!apiKey) {
    console.error(`Missing API key for ${chainName}`)
    return undefined
  }
  const url = getEtherscanUrl(address.toString(), chainName, apiKey)
  try {
    if (!url) {
      throw new Error(`Invalid chain name: ${chainName}`)
    }
    const response = await rateLimitedFetch(url)
    const rawData: unknown = await response.json()

    function isEtherscanApiResponse(
      data: unknown,
    ): data is EtherscanApiResponse {
      return (
        typeof data === 'object' &&
        data !== null &&
        'status' in data &&
        'message' in data &&
        'result' in data &&
        Array.isArray((data as { result: unknown[] }).result) &&
        (data as { result: unknown[] }).result.length > 0 &&
        typeof (data as { result: Array<{ ABI: unknown }> }).result[0]?.ABI ===
          'string'
      )
    }

    if (!isEtherscanApiResponse(rawData)) {
      const message = (rawData as { result?: string }).result
      if (typeof message === 'string') {
        console.error(
          `Etherscan API error for ${address.toString()} on ${chainName}: ${message}`,
        )
      } else {
        console.error(
          `Invalid API response format from Etherscan for ${address.toString()} on ${chainName}`,
        )
      }
      return undefined
    }

    const data = rawData
    if (data?.status === '1' && data?.message === 'OK') {
      const result = data.result[0]
      return result
    } else {
      console.error(
        `ABI not found for ${address.toString()} on ${chainName}: ${
          data.result
        }`,
      )
      return undefined
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(
      `Error fetching contract info for ${address.toString()} on ${chainName}: ${message}`,
    )
    return undefined
  }
}

export async function getLayerZeroPeers(address: EthereumAddress) {
  console.log('Starting LayerZero OFT analysis for', address.toString())
  const oft = await checkIsOft(address, 'Ethereum')
  console.log('OFT check result:', oft)
  if (oft.isOft && oft.version) {
    const oftDetails = await getOftDetails(address, 'Ethereum', oft.version)

    if (oftDetails.error) {
      console.error('Could not get OFT details:', oftDetails.error)
      return
    }

    if (oftDetails.supplyBreakdown) {
      console.log('\nOFT Supply Breakdown:')
      const tableData = Object.entries(oftDetails.supplyBreakdown).map(
        ([chain, data]) => ({
          Chain: chain,
          Supply: parseFloat(data.formatted).toLocaleString(),
          'L2 Address': data.address || 'N/A',
        }),
      )
      console.table(tableData)
    }

    if (oftDetails.peerCount) {
      console.log(
        `Peers Found: ${oftDetails.peerCount.found} / ${oftDetails.peerCount.total}`,
      )

      const stats = oftDetails.peerCount.stats
      const reasons = []
      if (stats.no_rpc > 0) reasons.push(`${stats.no_rpc} RPC not found`)
      if (stats.no_peer_address > 0)
        reasons.push(`${stats.no_peer_address} peers not present`)
      if (stats.rpc_error > 0) reasons.push(`${stats.rpc_error} RPC errors`)
      if (stats.no_eid > 0) reasons.push(`${stats.no_eid} no EID`)

      if (reasons.length > 0) {
        console.log(`Reasons for missing peers: ${reasons.join(', ')}`)
      }
    }

    // Get peer network for each chain if any peers were found
    if (oftDetails.peerCount && oftDetails.peerCount.found > 0) {
      console.log('\nPeer Network Analysis:')
      const peerNetworkResults = await getFullPeerNetwork(
        address,
        oft.version,
      )

      for (const [chainName, peers] of Object.entries(peerNetworkResults)) {
        const peerNames = peers.join(', ')
        console.log(`${chainName} -> ${peers.length} peers (${peerNames})`)
      }
    }
  }
}

async function getPeerChainAddress(mainChainRpc: string, tokenAddress: EthereumAddress, chainData: {
  name: string
  nativeId: number
  rpc: string
  eid: number
  v1eid?: number
}): Promise<string> {
    const provider = new ethers.providers.JsonRpcProvider(mainChainRpc)
    const contract = new ethers.Contract(
      tokenAddress.toString(),
      OFT_SHARED_ABI,
      provider,
    )
    const peerAddressBytes32 = await contract.peers(chainData.eid)
    return ethers.utils.getAddress('0x' + peerAddressBytes32.slice(26))
}

async function getFullPeerNetwork(
  tokenAddress: EthereumAddress,
  oftVersion: 'V1' | 'V2',
): Promise<Record<string, string[]>> {
  const allResults: Record<string, string[]> = {}
  const processedChains = new Set<string>()
  const chainsToProcess = ['Ethereum'] // Start with Ethereum

  while (chainsToProcess.length > 0) {
    const currentChain = chainsToProcess.shift()!
    
    if (processedChains.has(currentChain)) {
      continue
    }

    processedChains.add(currentChain)
    
    const chainData = Object.values(lzChainData).find(
      (c) => c.name === currentChain,
    )

    if (!chainData || !chainData.rpc) {
      allResults[currentChain] = []
      continue
    }
    try {
        let peerChainAddress = tokenAddress.toString()
        if (chainData.name !== 'Ethereum') {
            peerChainAddress = await getPeerChainAddress(lzChainData.ethereum.rpc, tokenAddress, chainData)
        }

        const peers = await getDirectPeersForChain(
            EthereumAddress(peerChainAddress),
            chainData,
            oftVersion,
        )
      
        allResults[currentChain] = peers
        // Add newly discovered peers to the processing queue
        for (const peer of peers) {
            if (!processedChains.has(peer) && !chainsToProcess.includes(peer)) {
            chainsToProcess.push(peer)
            }
        }
    } catch (e) {
      allResults[currentChain] = []
    }
  }

  return allResults
}

async function getPeerNetworkForChains(
  tokenAddress: EthereumAddress,
  chainNames: string[],
  oftVersion: 'V1' | 'V2',
): Promise<Record<string, string[]>> {
  const results: Record<string, string[]> = {}

  for (const chainName of chainNames) {
    try {
      const chainData = Object.values(lzChainData).find(
        (c) => c.name === chainName,
      )
      if (!chainData || !chainData.rpc) {
        results[chainName] = []
        continue
      }

      const peers = await getDirectPeersForChain(
        tokenAddress,
        chainData,
        oftVersion,
      )
      results[chainName] = peers
    } catch (e) {
      results[chainName] = []
    }
  }

  return results
}

async function getDirectPeersForChain(
  tokenAddress: EthereumAddress,
  chainData: {
    name: string
    nativeId: number
    rpc: string
    eid: number
    v1eid?: number
  },
  oftVersion: 'V1' | 'V2',
): Promise<string[]> {
  const isV1 = oftVersion === 'V1'
  const peers: string[] = []

  try {
    const provider = new ethers.providers.JsonRpcProvider(chainData.rpc)
    const contract = new ethers.Contract(
      tokenAddress.toString(),
      OFT_SHARED_ABI,
      provider,
    )
    const peerPromises = Object.values(lzChainData).map(async (peerChain) => {
      if (peerChain.nativeId === chainData.nativeId) return null

      try {
        const peerEid = peerChain.eid
        if (peerEid === undefined) return null

        let peerAddressBytes32
        if (isV1) {
          peerAddressBytes32 = await contract.peers(peerEid)
        } else {
          peerAddressBytes32 = await contract.peer(peerEid)
        }

        if (peerAddressBytes32 && peerAddressBytes32 !== ethers.constants.HashZero) {
          return peerChain.name
        }
      } catch (e) {
        // Ignore errors for individual peer checks
      }
      return null
    })

    const peerResults = await Promise.all(peerPromises)
    peers.push(...peerResults.filter((peer): peer is string => peer !== null))
  } catch (e) {
    // Return empty array if we can't check peers for this chain
  }

  return peers
}

export async function getOftDetails(
  tokenAddress: EthereumAddress,
  chain: string,
  oftVersion: 'V1' | 'V2',
) {
  const chainData = Object.values(lzChainData).find(
    (c) => c.name.toLowerCase() === chain.toLowerCase(),
  )
  if (!chainData) {
    throw new Error(`Unsupported chain: ${chain}`)
  }
  const nativeChainId = chainData.nativeId

  const isV1 = oftVersion === 'V1'

  try {
    const mainChain = Object.values(lzChainData).find(
      (c) => c.nativeId === nativeChainId,
    )
    if (!mainChain) throw new Error(`Unsupported chain ID: ${nativeChainId}`)

    const provider = new ethers.providers.JsonRpcProvider(mainChain.rpc)
    const contractInfo = await getContractABIAndName(tokenAddress, mainChain.name)
    const implementationAddress =
      contractInfo?.Implementation || tokenAddress.toString()

    const mainnetTokenContract = new ethers.Contract(
      tokenAddress.toString(),
      OFT_SHARED_ABI,
      provider,
    )

    let decimals
    let mainnetSupply
    try {
      decimals = await mainnetTokenContract.decimals()
      mainnetSupply = await mainnetTokenContract.totalSupply()
    } catch (e) {
      decimals = await mainnetTokenContract.sharedDecimals()
      const adaptedTokenAddress = await mainnetTokenContract.token()
      const adaptedTokenContract = new ethers.Contract(
        adaptedTokenAddress,
        OFT_SHARED_ABI,
        provider,
      )
      mainnetSupply = await adaptedTokenContract.totalSupply()
    }
    let total = 0n
    const breakdown: Record<string, { supply: bigint; address: string }> = {}
    total += mainnetSupply
    breakdown[mainChain.name] = { 
      supply: mainnetSupply, 
      address: tokenAddress.toString() 
    }

    const peerPromises = Object.values(lzChainData).map(async (peerChain) => {
      if (peerChain.nativeId === nativeChainId) return { type: 'skip', reason: 'same_chain' }
      if (!peerChain.rpc) return { type: 'skip', reason: 'no_rpc' }

      try {
        let peerAddressBytes32
        const peerEid = peerChain.eid
        if (peerEid === undefined) return { type: 'skip', reason: 'no_eid' }

        if (isV1) {
          peerAddressBytes32 = await mainnetTokenContract.peers(peerEid)
        } else {
          peerAddressBytes32 = await mainnetTokenContract.peer(peerEid)
        }

        if (peerAddressBytes32 && peerAddressBytes32 !== ethers.constants.HashZero) {
          const peerAddress = ethers.utils.getAddress(
            '0x' + peerAddressBytes32.slice(26),
          )
          const peerProvider = new ethers.providers.JsonRpcProvider(peerChain.rpc)
          const peerContract = new ethers.Contract(
            peerAddress,
            OFT_SHARED_ABI,
            peerProvider,
          )
          const adaptedTokenAddress = await peerContract.token()
          const adaptedTokenContract = new ethers.Contract(
            adaptedTokenAddress,
            OFT_SHARED_ABI,
            peerProvider,
          )
          const supply = await adaptedTokenContract.totalSupply()
          return { 
            type: 'success', 
            name: peerChain.name, 
            supply, 
            address: peerAddress 
          }
        } else {
          return { type: 'skip', reason: 'no_peer_address' }
        }
      } catch (e) {
        return { type: 'skip', reason: 'rpc_error' }
      }
    })

    const peerResults = await Promise.all(peerPromises)

    // Count different failure reasons
    const stats = {
      found: 0,
      no_rpc: 0,
      no_peer_address: 0,
      rpc_error: 0,
      no_eid: 0,
      same_chain: 0,
    }

    peerResults.forEach((result) => {
      if (result.type === 'success' && result.name) {
        stats.found++
        total += result.supply
        breakdown[result.name] = { 
          supply: result.supply, 
          address: result.address 
        }
      } else if (result.type === 'skip') {
        stats[result.reason as keyof typeof stats]++
      }
    })

    const peerCount = {
      found: stats.found,
      total: Object.keys(lzChainData).length - 1,
      stats,
    }

    const formattedBreakdown = Object.entries(breakdown).reduce(
      (acc, [name, data]) => {
        acc[name] = {
          formatted: ethers.utils.formatUnits(data.supply, Number(decimals)),
          address: data.address,
        }
        return acc
      },
      {} as Record<string, { address: string; formatted: string }>,
    )

    const totalSupply = {
      raw: total,
      formatted: ethers.utils.formatUnits(total, Number(decimals)),
      decimals: Number(decimals),
    }

    return { totalSupply, supplyBreakdown: formattedBreakdown, peerCount }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
      return { error: e.message }
    }
    return { error: 'An unknown error occurred' }
  }
}

export async function checkIsOft(
  tokenAddress: EthereumAddress,
  chain: string,
): Promise<{ isOft: boolean; version?: 'V1' | 'V2'; error?: string }> {
  const chainData = Object.values(lzChainData).find(
    (c) => c.name.toLowerCase() === chain.toLowerCase(),
  )
  if (!tokenAddress || !chain) return { isOft: false }
  const nativeChainId = chainData?.nativeId
  if (nativeChainId === undefined) {
    return { isOft: false, error: 'Chain not found in lzChainData' }
  }

  try {
    const mainChain = Object.values(lzChainData).find(
      (c) => c.nativeId === nativeChainId,
    )
    if (!mainChain || !mainChain.rpc)
      return { isOft: false, error: 'Unsupported chain for OFT check' }

    const provider = new ethers.providers.JsonRpcProvider(mainChain.rpc)
    const contractInfo = await getContractABIAndName(tokenAddress, chain)

    const implementationAddress =
      contractInfo?.Implementation || tokenAddress.toString()
    const implementationInfo =
      implementationAddress === tokenAddress.toString()
        ? contractInfo
        : await getContractABIAndName(
            EthereumAddress(implementationAddress),
            chain,
          )

    if (!implementationInfo?.ABI) {
      return { isOft: false, error: 'No implementation ABI found' }
    }

    try {
      const contract = new ethers.Contract(
        implementationAddress,
        OFT_V2_ABI,
        provider,
      )
      const versionResult = await contract.oftVersion()
      if (versionResult[0] === OFT_V2_VERSION_SIG) {
        return { isOft: true, version: 'V2' }
      }
    } catch (e) {
      // Not a V2, proceed to check V1
    }

    try {
      const contract = new ethers.Contract(
        implementationAddress,
        OFT_V1_ABI,
        provider,
      )
      const versionResult = await contract.oftVersion()
      if (versionResult === OFT_V1_VERSION_SIG) {
        return { isOft: true, version: 'V1' }
      }
    } catch (e) {
      // Not a V1 either
    }

    return { isOft: false }
  } catch (error) {
    console.error('Error in checkIsOft:', error)
    const message = error instanceof Error ? error.message : String(error)
    return { isOft: false, error: message }
  }
}