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
    const envKey = `${chainName.toUpperCase()}_ETHERSCAN_API_URL`
    const baseUrl = process.env[envKey]

    if (!baseUrl) {
      console.error(`No Etherscan API URL found for ${chainName}`)
      return null
    }

    return `${baseUrl}/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`
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
      const response = await fetch(url)
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
        throw new Error('Invalid API response format')
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
  type:
    | 'Canonical Token'
    | 'Non-canonical Token'
    | 'External Token'
    | 'Native Token'
  reason?: string
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
    const chains = ['arbitrum', 'optimism']

    // Load discovered.json files to get escrow addresses
    const escrows: { [key: string]: string[] } = {}
    for (const chain of chains) {
      const discoveredPath = `../../../config/discovery/${chain}/ethereum/discovered.json`
      const discovered = require(discoveredPath)
      escrows[chain] = [getCanonicalEscrow(discovered, chain)]
    }

    for (const tokenAddress of args.tokenAddresses) {
      console.log(`\nL1 Token: ${tokenAddress}`)
      for (const chain of chains) {
        // get L2 token address from escrow
        const l2Address = await getL2TokenAddress(
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
        let supplyInfo: TokenSupplyInfo = {
          l1Supply: '0',
          l2Supply: '0',
          escrowBalance: '0',
          type: 'Non-canonical Token',
          reason: 'No contract at L2 canonical address',
        }
        if (l2Address) {
          supplyInfo = await getTokenSupplyInfo(
            tokenAddress.toString(),
            l2Address,
            chain,
            escrows,
          )
          if (supplyInfo) {
            const l2Supply = Number(supplyInfo.l2Supply)
            const escrowBalance = Number(supplyInfo.escrowBalance)
            let canonical = '0%'
            let nonCanonical = '100%'

            if (l2Supply > 0) {
              const canonicalPct = Math.min(
                100,
                (l2Supply / escrowBalance) * 100,
              )
              const nonCanonicalPct = Math.max(0, 100 - canonicalPct)
              canonical = `${canonicalPct.toFixed(2)}%`
              nonCanonical = `${nonCanonicalPct.toFixed(2)}%`
            }

            // if non-canonical summary is printed later after classication attempt
            if (supplyInfo.type === 'Canonical Token') {
              console.table({
                'L1 Supply': Number(supplyInfo.l1Supply).toFixed(2),
                'L2 Supply': Number(supplyInfo.l2Supply).toFixed(2),
                'Escrow Balance': Number(supplyInfo.escrowBalance).toFixed(2),
                Type: supplyInfo.type,
                Canonical: canonical,
                'In Transit': nonCanonical,
              })
            }
          }
        }

        if (!l2Address || supplyInfo.type === 'Non-canonical Token') {
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
          const canonicalL2Supply = supplyInfo.l2Supply
          const newSupplyInfo = await getTokenSupplyInfo(
            tokenAddress,
            l2AddressFromCoingecko,
            chain,
            escrows,
          )
          if (newSupplyInfo) {
            supplyInfo.l1Supply = newSupplyInfo.l1Supply
            supplyInfo.l2Supply = newSupplyInfo.l2Supply
            let canonicalPct = 0
            let weirdPct = 0
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
              weirdPct = Number(Math.max(0, 100 - canonicalPct).toFixed(2))
            }
            console.table({
              'L1 Supply': Number(supplyInfo.l1Supply).toFixed(2),
              'L2 Supply': Number(supplyInfo.l2Supply).toFixed(2),
              'Escrow Balance': Number(supplyInfo.escrowBalance).toFixed(2),
              Type: supplyInfo.type,
              Canonical: `${canonicalPct}%`,
              [supplyInfo.type === 'Canonical Token'
                ? 'In Transit'
                : 'Non-canonical']: `${weirdPct}%`,
              ...(supplyInfo.type === 'Non-canonical Token'
                ? { Reason: supplyInfo.reason }
                : {}),
            })
          }
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
      const discoveredPath = `../../../config/discovery/${network}/ethereum/discovered.json`
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
      if (network === 'arbitrum') {
        const result =
          await escrowContract.calculateL2TokenAddress(l1TokenAddress)
        return result
      } else if (network === 'optimism') {
        const result = await escrowContract.getTokenWrappedAddress(
          1,
          l1TokenAddress,
        )
        return result
      }
    } catch {
      // Fallback to events if direct call fails
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
): Promise<TokenSupplyInfo> {
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
        type: 'Non-canonical Token',
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
        type: 'Non-canonical Token',
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
        type: 'Non-canonical Token',
        reason: 'L2 contract not ERC20 (totalSupply)',
      }
    }

    const adjustedL2Supply = ethersUtils.formatUnits(l2Supply, decimals)
    const adjustedEscrowBalance = ethersUtils.formatUnits(
      escrowBalance,
      decimals,
    )

    // Check if L2 supply is significantly more than escrow balance
    const l2SupplyNum = Number(adjustedL2Supply)
    const escrowBalanceNum = Number(adjustedEscrowBalance)

    if (l2SupplyNum > escrowBalanceNum * 2) {
      // x2 threshold
      return {
        l1Supply: ethersUtils.formatUnits(l1Supply, decimals),
        l2Supply: adjustedL2Supply,
        escrowBalance: adjustedEscrowBalance,
        type: 'Non-canonical Token',
        reason: 'L2 supply significantly greater than escrow balance',
      }
    }

    // sanity check for balance
    const tokenType =
      Number(adjustedL2Supply) > 1 ? 'Canonical Token' : 'Non-canonical Token'

    return {
      l1Supply: ethersUtils.formatUnits(l1Supply, decimals),
      l2Supply: adjustedL2Supply,
      escrowBalance: adjustedEscrowBalance,
      type: tokenType,
    }
  } catch {
    return {
      l1Supply: '0',
      l2Supply: '0',
      escrowBalance: '0',
      type: 'Non-canonical Token',
    }
  }
}

export { utils }
