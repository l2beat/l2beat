import { join } from 'path'
import { type DiscoveryPaths, getDiscoveryPaths } from '@l2beat/discovery'
import { command, restPositionals } from 'cmd-ts'
import dotenv from 'dotenv'
import { Contract, utils as ethersUtils, providers } from 'ethers'
import { rpcUrl } from './args'
import { EthereumAddressValue } from './types'

dotenv.config()

const utils = {
  getRpcUrl(chain: string): string {
    const envVar = `${chain.toUpperCase()}_RPC_URL`
    const rpcUrl = process.env[envVar]
    if (!rpcUrl) {
      throw new Error(`RPC URL for chain ${chain} not found in .env file`)
    }
    return rpcUrl
  },

  getEtherscanUrl(
    chainName: string,
    contractAddress: string,
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
  },

  // Add rate limiter
  lastCallTime: 0,
  async rateLimitedFetch(url: string) {
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCallTime
    const minDelay = 1000

    if (timeSinceLastCall < minDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, minDelay - timeSinceLastCall),
      )
    }

    this.lastCallTime = Date.now()
    return fetch(url)
  },

  async getContractABIAndName(contractAddress: string, chainName: string) {
    const apiKey = this.getApiKey(chainName)
    if (!apiKey) {
      throw new Error('Missing API key')
    }
    const url = this.getEtherscanUrl(chainName, contractAddress, apiKey)
    try {
      if (!url) {
        throw new Error('Invalid chain name')
      }
      const response = await this.rateLimitedFetch(url) // Use rate-limited fetch
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
          typeof (data as { result: Array<{ ABI: unknown }> }).result[0]
            ?.ABI === 'string'
        )
      }

      if (!isEtherscanApiResponse(rawData)) {
        console.log('Invalid API response format')
        return null
      }

      const data = rawData
      if (data?.status === '1' && data?.message === 'OK') {
        // const abi = JSON.parse(data.result[0].ABI);
        return data.result[0]
      } else {
        throw new Error('ABI not found.')
      }
    } catch (error) {
      console.error(error)
      return null
    }
  },

  getApiKey(chainName: string): string | null {
    const envKey = `${chainName.toUpperCase()}_ETHERSCAN_API_KEY`
    const apiKey = process.env[envKey]
    return apiKey || null
  },
}

interface DiscoveredContract {
  name: string
  address: string
}

interface DiscoveredJson {
  contracts: DiscoveredContract[]
}

// Add interface for Etherscan API response
interface EtherscanApiResponse {
  status: string
  message: string
  result: Array<{
    ABI: string
    ContractName?: string
    Implementation?: string
  }>
}

// Add interface for Coingecko API response
interface CoingeckoApiResponse {
  platforms: {
    [key: string]: string
  }
}

// Add interface for token supply information
interface TokenSupplyInfo {
  l1Supply: string
  l2Supply: string
  escrowBalance: string
  type: 'Canonical Token' | 'Non-standard Token'
  reason?: string
}

// Add interface for token supply breakdown
interface TokenSupplyBreakdown {
  canonicalPct: number
  nonCanonicalPct: number
  nativePct: number
  externalPct: number
}

export const TokenScreening = command({
  name: 'token-screening',
  description: 'Finds L2 token classification for L1 tokens',
  args: {
    tokenAddresses: restPositionals({
      type: EthereumAddressValue,
      displayName: 'tokenAddresses',
    }),
    rpcUrl,
  },
  handler: async (args) => {
    const chains = ['arbitrum', 'optimism', 'base']
    const paths = getDiscoveryPaths()

    // Load discovered.json files to get escrow addresses
    const escrows: { [key: string]: string[] } = {}
    for (const chain of chains) {
      const discoveredPath = join(
        paths.discovery,
        chain,
        'ethereum/discovered.json',
      )
      const discovered = require(discoveredPath)
      escrows[chain] = [getCanonicalEscrow(discovered, chain)]
    }

    for (const tokenAddress of args.tokenAddresses) {
      console.log(`\nL1 Token: ${tokenAddress}`)
      for (const chain of chains) {
        // get L2 token address from escrow
        const l2Address = await getL2TokenAddress(
          paths,
          tokenAddress.toString(),
          chain,
          escrows,
        )
        console.log(
          l2Address
            ? `${chain.charAt(0).toUpperCase() + chain.slice(1)} (canonical): ${l2Address}`
            : '',
        )

        // start classification screening
        let supplyInfo: TokenSupplyInfo & { breakdown?: TokenSupplyBreakdown } =
          {
            l1Supply: '0',
            l2Supply: '0',
            escrowBalance: '0',
            type: 'Non-standard Token',
            reason: 'No contract at L2 canonical address',
          }
        if (l2Address) {
          // split between canonical and non-standard
          supplyInfo = await getTokenSupplyInfo(
            tokenAddress.toString(),
            l2Address,
            chain,
            escrows,
          )
          if (supplyInfo) {
            const l2Supply = Number(supplyInfo.l2Supply)
            const escrowBalance = Number(supplyInfo.escrowBalance)
            let canonicalPct = 0
            let nonCanonicalPct = 100
            if (l2Supply > 0) {
              canonicalPct = Math.min(100, (l2Supply / escrowBalance) * 100)
              nonCanonicalPct = Math.max(0, 100 - canonicalPct)
            }

            const minters = await getL2Minters(l2Address, chain)
            const mintersType = await checkMintersType(
              paths,
              minters.map((m) => ({
                address: m.address,
                name: m.name || 'Unknown',
              })),
            )
            if (mintersType.type === 'Bridge Minter') {
              supplyInfo.type = 'Non-standard Token'
              supplyInfo.reason =
                mintersType.bridge +
                ' (' +
                (mintersType.matchingContracts ?? []).join(', ') +
                ')'
              supplyInfo.breakdown = {
                canonicalPct: 0,
                nonCanonicalPct: Number(nonCanonicalPct),
                nativePct: 0,
                externalPct: Number(nonCanonicalPct),
              }
            } else if (mintersType.type === 'Unknown') {
              const bridgeName = matchBridgeName(
                minters.map((m) => ({
                  address: m.address,
                  name: m.name || 'Unknown',
                })),
              )
              if (bridgeName.type === 'Native Minter') {
                supplyInfo.type = 'Non-standard Token'
                supplyInfo.reason = bridgeName.bridge
                supplyInfo.breakdown = {
                  canonicalPct: 0,
                  nonCanonicalPct: 0,
                  nativePct: Number(nonCanonicalPct),
                  externalPct: 0,
                }
              } else if (bridgeName.type === 'External Minter') {
                supplyInfo.type = 'Non-standard Token'
                supplyInfo.reason = bridgeName.bridge
                supplyInfo.breakdown = {
                  canonicalPct: 0,
                  nonCanonicalPct: 0,
                  nativePct: 0,
                  externalPct: Number(nonCanonicalPct),
                }
              }
            }
            // if non-standard summary is printed later after classification attempt
            if (supplyInfo.type === 'Canonical Token') {
              console.table({
                'L1 Supply': Number(supplyInfo.l1Supply).toFixed(2),
                'L2 Supply': Number(supplyInfo.l2Supply).toFixed(2),
                'Escrow Balance': Number(supplyInfo.escrowBalance).toFixed(2),
                Type: supplyInfo.type,
                Canonical: `${canonicalPct.toFixed(2)}%`,
                'Non-canonical or in transit': `${nonCanonicalPct.toFixed(2)}%`,
              })
            }
          }
        }
        // try to classify non-standard tokens
        if (!l2Address || supplyInfo.type === 'Non-standard Token') {
          // get L2 token address from coingecko
          const l2AddressFromCoingecko: string | null =
            await getL2TokenAddressFromCoingecko(tokenAddress, chain)
          if (!l2AddressFromCoingecko) {
            console.error(
              `No L2 token address found for ${tokenAddress} on ${chain}`,
            )
            continue
          } else {
            console.log(
              `${chain.charAt(0).toUpperCase() + chain.slice(1)} (coingecko): ${l2AddressFromCoingecko}`,
            )
          }
          let newSupplyInfo: TokenSupplyInfo | null = null
          let canonicalL2Supply = supplyInfo.l2Supply
          let canonicalPct = 0
          let nonCanonicalPct = 0
          if (
            l2AddressFromCoingecko?.toLowerCase() !== l2Address?.toLowerCase()
          ) {
            newSupplyInfo = await getTokenSupplyInfo(
              tokenAddress,
              l2AddressFromCoingecko,
              chain,
              escrows,
            )
            if (newSupplyInfo) {
              if (
                supplyInfo.type === 'Non-standard Token' &&
                newSupplyInfo.type === 'Canonical Token'
              ) {
                supplyInfo.type = 'Non-standard Token'
                supplyInfo.reason = 'Canonical address not found in escrow'
              }
              supplyInfo.l1Supply = newSupplyInfo.l1Supply
              supplyInfo.l2Supply = newSupplyInfo.l2Supply
              if (supplyInfo.escrowBalance === '0') {
                supplyInfo.escrowBalance = newSupplyInfo.escrowBalance
              }
              if (!l2Address) {
                canonicalL2Supply = supplyInfo.escrowBalance
              }
              if (Number(newSupplyInfo.l2Supply) > 0) {
                if (newSupplyInfo.type === 'Canonical Token') {
                  canonicalPct = Number(
                    Math.min(
                      100,
                      (Number(newSupplyInfo.l2Supply) /
                        Number(newSupplyInfo.escrowBalance)) *
                        100,
                    ).toFixed(2),
                  )
                } else {
                  canonicalPct = Number(
                    Math.min(
                      100,
                      (Number(canonicalL2Supply) /
                        Number(newSupplyInfo.l2Supply)) *
                        100,
                    ).toFixed(2),
                  )
                  supplyInfo.reason = supplyInfo.reason
                    ? `${supplyInfo.reason}`
                    : 'L2 supply significantly greater than escrow balance'
                }
                nonCanonicalPct = Number(
                  Math.max(0, 100 - canonicalPct).toFixed(2),
                )
              }
            }
          } else {
            // if L2 address is the same as coingeckos, supplyInfo.l2Supply is l2 total supply
            canonicalL2Supply = supplyInfo.escrowBalance // approximate canonical supply (+- in transit)
            canonicalPct = Number(
              Math.min(
                100,
                (Number(canonicalL2Supply) / Number(supplyInfo.l2Supply)) * 100,
              ).toFixed(2),
            )
            nonCanonicalPct = Number(Math.max(0, 100 - canonicalPct).toFixed(2))
          }
          // minter analysis
          const l2Minters = await getL2Minters(l2AddressFromCoingecko, chain)
          const mintersType = await checkMintersType(
            paths,
            l2Minters.map((m) => ({
              address: m.address,
              name: m.name || 'Unknown',
            })),
          )
          if (mintersType.type === 'Bridge Minter') {
            supplyInfo.reason =
              mintersType.bridge +
              ' (' +
              (mintersType.matchingContracts ?? []).join(', ') +
              ')'
          } else if (mintersType.type === 'Unknown') {
            const bridgeName = matchBridgeName(
              l2Minters.map((m) => ({
                address: m.address,
                name: m.name || 'Unknown',
              })),
            )
            if (bridgeName.type === 'Native Minter') {
              supplyInfo.reason = bridgeName.bridge
              supplyInfo.breakdown = {
                canonicalPct: 0,
                nonCanonicalPct: 0,
                nativePct: Number(nonCanonicalPct),
                externalPct: 0,
              }
            } else if (bridgeName.type === 'External Minter') {
              supplyInfo.reason = bridgeName.bridge
              supplyInfo.breakdown = {
                canonicalPct: 0,
                nonCanonicalPct: 0,
                nativePct: 0,
                externalPct: Number(nonCanonicalPct),
              }
            }
          }
          // print non-standard result summary
          const tableData: Record<string, string | number> = {
            'L1 Supply': Number(supplyInfo.l1Supply).toFixed(2),
            'L2 Supply': Number(supplyInfo.l2Supply).toFixed(2),
            'Escrow Balance': Number(supplyInfo.escrowBalance).toFixed(2),
            Type: supplyInfo.type,
            Reason: supplyInfo.reason || '',
            Canonical: `${canonicalPct}%`,
            'Non-canonical': `${nonCanonicalPct}%`,
          }

          // Only add Native and External percentages if at least one is non-zero
          if (
            (supplyInfo.breakdown?.nativePct || 0) > 0 ||
            (supplyInfo.breakdown?.externalPct || 0) > 0
          ) {
            tableData['of which Native'] = `${supplyInfo.breakdown?.nativePct}%`
            tableData['of which External'] =
              `${supplyInfo.breakdown?.externalPct}%`
          }

          console.table(tableData)
        }
      }
    }
  },
})

function getCanonicalEscrow(
  discovered: DiscoveredJson,
  network: string,
): string {
  // Find either L1ERC20Gateway or L1StandardBridge contract
  const gatewayContract = discovered.contracts.find(
    (contract: { name: string }) =>
      contract.name === 'L1ERC20Gateway' ||
      contract.name === 'L1StandardBridge',
  )

  if (!gatewayContract) {
    throw new Error(
      `No L1ERC20Gateway or L1StandardBridge contract found for ${network}`,
    )
  }

  return gatewayContract.address
}

async function getL2TokenAddress(
  paths: DiscoveryPaths,
  l1TokenAddress: string,
  network: string,
  escrows?: { [key: string]: string[] },
): Promise<string | null> {
  try {
    let canonicalEscrowAddress: string

    if (escrows && escrows[network]?.[0]) {
      canonicalEscrowAddress = escrows[network][0]
    } else {
      // Dynamically load the discovered.json file based on network
      const discoveredPath = join(
        paths.discovery,
        network,
        'ethereum/discovered.json',
      )
      const discovered = require(discoveredPath)
      canonicalEscrowAddress = getCanonicalEscrow(discovered, network)
    }

    const escrowInterface = new ethersUtils.Interface([
      'function calculateL2TokenAddress(address l1Token) view returns (address)',
      'function getTokenWrappedAddress(uint256 chainId, address l1Token) view returns (address)',
      'event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
    ])

    const provider = new providers.JsonRpcProvider(utils.getRpcUrl('ethereum'))
    const escrowContract = new Contract(
      canonicalEscrowAddress,
      escrowInterface,
      provider,
    )

    try {
      const result =
        await escrowContract.calculateL2TokenAddress(l1TokenAddress)
      return result
    } catch {
      try {
        const result = await escrowContract.getTokenWrappedAddress(
          1,
          l1TokenAddress,
        )
        return result
      } catch {
        console.error(
          'No L2 token address found from escrow ' +
            l1TokenAddress +
            ' on ' +
            network,
        )
      }
    }
    const filter = escrowContract.filters.ERC20DepositInitiated(
      l1TokenAddress,
      null,
      null,
      null,
      null,
      null,
    )
    const events = await escrowContract.queryFilter(filter)
    if (events && events.length > 0 && events[0].args) {
      return events[0].args[1]
    }

    throw new Error('Could not determine L2 token address')
  } catch {
    // console.error(`Error getting L2 token address: ${error}`)
    return null
  }
}

async function getL2TokenAddressFromCoingecko(
  tokenAddress: string,
  chain: string,
): Promise<string | null> {
  const chainMapping: { [key: string]: string } = {
    optimism: 'optimistic-ethereum',
    arbitrum: 'arbitrum-one',
    base: 'base',
  }

  try {
    const response = await fetch(
      `https://pro-api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`,
      {
        headers: {
          accept: 'application/json',
          'x-cg-pro-api-key': process.env.COINGECKO_API_KEY || '',
        },
      },
    )

    if (!response.ok) return null

    const data = (await response.json()) as CoingeckoApiResponse
    const platforms = data.platforms || {}
    const mappedChain = chainMapping[chain]

    return mappedChain ? platforms[mappedChain] || null : null
  } catch (error) {
    console.error(`Error fetching token address from Coingecko: ${error}`)
    return null
  }
}

async function getTokenSupplyInfo(
  l1Address: string,
  l2Address: string,
  network: string,
  escrows: { [key: string]: string[] },
): Promise<TokenSupplyInfo & { breakdown?: TokenSupplyBreakdown }> {
  try {
    const l1Provider = new providers.JsonRpcProvider(
      utils.getRpcUrl('ethereum'),
    )
    const l2Provider = new providers.JsonRpcProvider(utils.getRpcUrl(network))
    const tokenInterface = new ethersUtils.Interface([
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ])

    let l2Supply = ethersUtils.parseUnits('0', 18)
    let l1Supply = ethersUtils.parseUnits('0', 18)
    let decimals = 18
    let escrowBalance = ethersUtils.parseUnits('0', 18)

    try {
      const l1Token = new Contract(l1Address, tokenInterface, l1Provider)
      l1Supply = await l1Token.totalSupply()
      decimals = await l1Token.decimals()
      const escrowAddress = escrows[network]?.[0]
      escrowBalance = await l1Token.balanceOf(escrowAddress)
    } catch {
      return {
        l1Supply: '0',
        l2Supply: '0',
        escrowBalance: '0',
        type: 'Non-standard Token',
        reason: 'L1 Contract Not ERC20 (totalSupply)',
      }
    }

    // Check if there's code at the L2 address
    const l2Code = await l2Provider.getCode(l2Address)
    if (l2Code === '0x') {
      return {
        l1Supply: ethersUtils.formatUnits(l1Supply, decimals),
        l2Supply: '0',
        escrowBalance: ethersUtils.formatUnits(escrowBalance, decimals),
        type: 'Non-standard Token',
        reason: 'No contract at L2 canonical address',
      }
    }

    try {
      const l2Token = new Contract(l2Address, tokenInterface, l2Provider)
      l2Supply = await l2Token.totalSupply()
    } catch {
      return {
        l1Supply: '0',
        l2Supply: '0',
        escrowBalance: '0',
        type: 'Non-standard Token',
        reason: 'L2 contract not ERC20 (totalSupply)',
      }
    }

    const adjustedL2Supply = ethersUtils.formatUnits(l2Supply, decimals)
    const adjustedEscrowBalance = ethersUtils.formatUnits(
      escrowBalance,
      decimals,
    )

    // Calculate supply breakdown
    const l2SupplyNum = Number(adjustedL2Supply)
    const escrowBalanceNum = Number(adjustedEscrowBalance)

    const breakdown: TokenSupplyBreakdown = {
      canonicalPct: 0,
      nonCanonicalPct: 0,
      nativePct: 0,
      externalPct: 0,
    }

    if (l2SupplyNum > 0) {
      // First determine canonical vs non-canonical split
      breakdown.canonicalPct = Math.min(
        100,
        (escrowBalanceNum / l2SupplyNum) * 100,
      )
      breakdown.nonCanonicalPct = Math.max(0, 100 - breakdown.canonicalPct)
    }

    // Determine token type based on breakdown
    let tokenType = 'Non-standard Token'
    let reason = ''

    if (Number(adjustedL2Supply) <= 1) {
      tokenType = 'Non-standard Token'
      reason = 'L2 supply too low'
    } else if (breakdown.canonicalPct > 90) {
      tokenType = 'Canonical Token'
      reason = 'Canonical address found in escrow'
    } else {
      tokenType = 'Non-standard Token'
      reason = 'L2 supply significantly greater than escrow balance'
    }

    return {
      l1Supply: ethersUtils.formatUnits(l1Supply, decimals),
      l2Supply: adjustedL2Supply,
      escrowBalance: adjustedEscrowBalance,
      type: tokenType as 'Canonical Token' | 'Non-standard Token',
      reason,
      breakdown,
    }
  } catch {
    return {
      l1Supply: '0',
      l2Supply: '0',
      escrowBalance: '0',
      type: 'Non-standard Token',
      breakdown: {
        canonicalPct: 0,
        nonCanonicalPct: 0,
        nativePct: 0,
        externalPct: 0,
      },
    }
  }
}

async function getZeroAddressTransfers(tokenAddress: string, rpcUrl: string) {
  try {
    const provider = new providers.JsonRpcProvider(rpcUrl)
    const tokenInterface = new ethersUtils.Interface([
      'event Transfer(address indexed from, address indexed to, uint256 value)',
    ])
    const contract = new Contract(tokenAddress, tokenInterface, provider)

    // Get current block number and calculate range
    const currentBlock = await provider.getBlockNumber()
    const fromBlock = Math.max(0, currentBlock - 10000)

    // Get transfers from zero address (minting events)
    const filter = contract.filters.Transfer(
      '0x0000000000000000000000000000000000000000',
      null,
    )
    const events = await contract.queryFilter(filter, fromBlock, currentBlock)

    // Process events with additional details
    const transfers = await Promise.all(
      events.map(async (event) => {
        const tx = await provider.getTransaction(event.transactionHash)
        const block = await provider.getBlock(event.blockNumber)
        return {
          blockNumber: event.blockNumber,
          timestamp: block?.timestamp || null,
          transactionHash: event.transactionHash,
          minter: tx?.to || null,
          recipient: event.args?.to,
          amount: event.args?.value.toString(),
        }
      }),
    )

    return transfers
  } catch (error) {
    console.error('Error getting zero address transfers:', error)
    return []
  }
}

async function getL2Minters(l2Address: string, network: string) {
  try {
    // Get RPC URL for the network
    const providerUrl = utils.getRpcUrl(network)

    // Get transfers from zero address
    const zeroTransfers = await getZeroAddressTransfers(l2Address, providerUrl)
    // Extract unique minter addresses (from transaction.to)
    const minters = [
      ...new Set(zeroTransfers.map((transfer) => transfer.minter)),
    ]

    // Get contract names for each minter
    const mintersWithNames = await Promise.all(
      minters.map(async (minter) => {
        if (!minter) {
          return {
            address: null,
            name: 'Unknown',
          }
        }
        let contractInfo = await utils.getContractABIAndName(minter, network)
        if (contractInfo) {
          const implementation = contractInfo.Implementation
          if (
            implementation !== undefined &&
            implementation !== null &&
            implementation !== ''
          ) {
            contractInfo = await utils.getContractABIAndName(
              implementation,
              network,
            )
          }
        }
        return {
          address: minter,
          name: contractInfo ? contractInfo.ContractName : 'Unknown',
        }
      }),
    )

    return mintersWithNames
  } catch (error) {
    console.error('Error getting L2 minters:', error)
    return []
  }
}

async function checkMintersType(
  paths: DiscoveryPaths,
  l2Minters: Array<{ address: string | null; name: string }>,
) {
  try {
    // Define bridge names
    const bridgeNames = [
      'across-v3',
      'layerzerov2oft',
      'hyperlane',
      'connext',
      'socket',
      'transporter',
      'lzOmnichain',
      'fraxferry',
      'beamerbridgev2',
      'cBridge',
      'debridge',
      'davos',
      'gravity',
      'harmony',
      'chainport',
      'hop',
      'hyphen',
      'multichain',
      'near',
      'nomad',
      'omni',
      'opticsV1',
      'opticsV2',
      'orbit',
      'orbiter',
      'polynetwork',
      'pNetwork',
      'pulseChain',
      'ronin',
      'satellite',
      'skaleIMA',
      'sollet',
      'sonicgateway',
      'stargate',
      'stargatev2',
      'sygma',
      'synapse',
      'portal',
      'wormholeV1',
      'xdai',
      'symbiosis',
    ]

    // Extract minter addresses, filtering out null values
    const minterAddresses = l2Minters
      .map((m) => m.address?.toLowerCase())
      .filter((addr): addr is string => addr !== null && addr !== undefined)

    // Check each bridge's discovered.json
    for (const bridgeName of bridgeNames) {
      try {
        const discoveredPath = join(
          paths.discovery,
          bridgeName,
          'ethereum/discovered.json',
        )
        const discovered = require(discoveredPath)

        // Extract contract addresses from discovered.json
        const bridgeContracts =
          discovered.contracts?.map((c: { address: string }) =>
            c.address.toLowerCase(),
          ) || []

        const matchingContracts = minterAddresses.filter((minter) =>
          bridgeContracts.includes(minter),
        )

        if (matchingContracts.length > 0) {
          return {
            type: 'Bridge Minter',
            bridge: bridgeName,
            matchingContracts: matchingContracts,
          }
        }
      } catch {
        // Silently continue if bridge config not found
        continue
      }
    }

    // If no bridge matches found
    return {
      type: 'Unknown',
      reason: 'No matching bridge contracts found',
    }
  } catch (error) {
    console.error('Error in checkMintersType:', error)
    return {
      type: 'Unknown',
      reason: 'Error checking minter types',
    }
  }
}

function matchBridgeName(
  l2Minters: Array<{ address: string | null; name: string }>,
) {
  // Map bridge keywords to their official bridge names
  const bridgeKeywordMap: {
    [key: string]: { name: string; type: 'Native Minter' | 'External Minter' }
  } = {
    circle: { name: 'CCTP (Circle) minter', type: 'Native Minter' },
    mailbox: { name: 'Hyperlane (Mailbox) minter', type: 'External Minter' },
  }

  // Check if any minter name contains bridge-related keywords
  for (const minter of l2Minters) {
    const lowerName = minter.name.toLowerCase()
    for (const [keyword, bridge] of Object.entries(bridgeKeywordMap)) {
      if (lowerName.includes(keyword)) {
        return {
          type: bridge.type,
          bridge: bridge.name,
        }
      }
    }
  }

  return {
    type: 'Unknown',
    reason: 'No bridge pattern found in contract names',
  }
}
