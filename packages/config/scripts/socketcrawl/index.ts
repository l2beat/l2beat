import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { ethers } from 'ethers'
import pLimit from 'p-limit'
import { ProjectDiscovery } from '../../src/discovery/ProjectDiscovery'
/**
 *
 * TLDR: Run socket discovery, then this with 'pnpm socket-crawl' and copy the results to the config.jsonc and socket.ts files.
 *
 * This script reads the socket plugs list from discovery and creates two files of the discovery results:
 * 1) socket-crawl-result.json: The discovery results grouped by sibling chain slug and ranked by TVL, including non-standard plugs and vaults and vault owners
 * 2) socket-crawl-copypasta.txt: A copy-paste suggestion for the config.jsonc and socket.ts files. This file excludes 0 TVL vaults and nonstandard plugs
 * The script should be easily extendable when functions on the plugs or vaults change, like they have done in the past.
 *
 */

dotenv.config()

const ETHERSCAN_API_KEY: string | undefined =
  process.env.ETHEREUM_ETHERSCAN_API_KEY
const RPC_URL: string | undefined = process.env.ETHEREUM_RPC_URL

if (!ETHERSCAN_API_KEY || !RPC_URL) {
  throw new Error('Missing environment variables')
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const limit = pLimit(2) // concurrency: X calls at a time

const chainSlugToName: Record<string, string> = {
  1: 'Ethereum',
  5: 'Goerli',
  10: 'Optimism',
  56: 'BNB Chain',
  89: 'Viction testnet',
  137: 'Polygon',
  420: 'Optimism Goerli',
  647: 'Stavanger testnet',
  901: 'Lyra testnet',
  919: 'Mode testnet',
  957: 'Derive',
  1024: 'Parallel',
  1729: 'Reya Cronos Testnet',
  2999: 'Aevo',
  4665: 'Hook',
  5000: 'Mantle',
  7887: 'Kinto',
  8453: 'Base',
  8008: 'Polynomial', // polynomial.fi
  34443: 'Mode',
  42161: 'Arbitrum',
  80001: 'Polygon Mumbai testnet',
  81457: 'Blast',
  421613: 'Arbitrum Goerli',
  421614: 'Arbitrum Sepolia',
  777777: 'Zora',
  11155111: 'Sepolia',
  11155112: 'Aevo testnet',
  11155420: 'Optimism Sepolia',
  46658378: 'Hook testnet',
  686669576: 'SX Network Testnet',
  28122024: 'Ancient8 testnet2',
  1324967486: 'Reya',
  1399904803: 'XAI Testnet',
}

const ownerAddressToName: Record<string, string> = {
  '0x246d38588b16Dd877c558b245e6D5a711C649fCF': 'LyraMultisig',
  '0xf152Abda9E4ce8b134eF22Dc3C6aCe19C4895D82': 'KintoMultisig',
  '0x660ad4B5A74130a4796B4d54BC6750Ae93C86e6c': 'KintoEOA',
  '0x3B88D6a4CCBD93c22c211C7f6e3ea8b1D30f81BF': 'HookOwnerEOA',
  '0x5fD7D0d6b91CC4787Bcb86ca47e0Bd4ea0346d34': 'socketadmin.eth EOA',
  '0xC8C57e4C73c71f72cA0a7e043E5D2D144F98ef13': 'LooksRareMultisig',
  '0xAeBF1Bc19Ed4Fdf509c456ab6c28D25C9Ca3B332': 'PolynomialEOA',
  '0xB0BBff6311B7F245761A7846d3Ce7B1b100C1836': 'Socket EOA',
  '0xeeF6520437A6545b4F325F6675C4CD49812d457b': 'Socket EOA 2',
  // Add more owner addresses and their corresponding names here to get them integrated in the output
}

interface TokenInfo {
  token: string
  tokenName?: string
  tokenSymbol?: string
  tvl: number
}

interface Result {
  address: string
  hubOrBridge: string | null
  siblingChainSlug: number | string | null
  tokens: TokenInfo[]
  owner: string | null
  tags?: string[]
}

async function getContractValue(
  contract: ethers.Contract,
  functionName: string,
  ...args: unknown[]
): Promise<unknown> {
  try {
    console.log(`Fetching ${functionName} from ${contract.address}`)
    return await contract[functionName](...args)
  } catch (error) {
    console.error(
      `Failed to fetch ${functionName} from ${contract.address}: ${
        error instanceof Error ? error.message : error
      }`,
    )
    return null
  }
}

// this is a hacky way to get the token ticker from etherscan
async function getTokenInfoFromEtherscan(
  contractAddress: string,
): Promise<{ tokenName: string; tokenSymbol: string } | null> {
  try {
    console.log(
      `Fetching token transactions for ${contractAddress} from Etherscan`,
    )
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=5&apikey=${ETHERSCAN_API_KEY}`,
    )

    interface EtherscanResponse {
      status: string
      result: { tokenName: string; tokenSymbol: string }[]
    }

    const data: unknown = await response.json()

    if (
      typeof data === 'object' &&
      data !== null &&
      'status' in data &&
      'result' in data &&
      Array.isArray((data as EtherscanResponse).result)
    ) {
      const typedData = data as EtherscanResponse

      if (typedData.status === '1' && typedData.result.length > 0) {
        const { tokenName, tokenSymbol } = typedData.result[0]
        return { tokenName, tokenSymbol }
      } else {
        console.error(`No token transactions found for ${contractAddress}`)
        return null
      }
    } else {
      console.error(`Unexpected response format for ${contractAddress}`)
      return null
    }
  } catch (error) {
    console.error(
      `Failed to fetch token transactions for ${contractAddress} from Etherscan: ${
        error instanceof Error ? error.message : error
      }`,
    )
    return null
  }
}

async function getTokenTVL(token: string, account: string): Promise<number> {
  try {
    const tokenAbi = [
      'function balanceOf(address account) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ]
    const tokenContract = new ethers.Contract(token, tokenAbi, provider)
    const [balance, decimals] = await Promise.all([
      getContractValue(tokenContract, 'balanceOf', account),
      getContractValue(tokenContract, 'decimals'),
    ])
    return balance ? Number(balance) / Math.pow(10, Number(decimals)) : 0
  } catch (error) {
    console.error(
      `Failed to fetch TVL for token ${token}: ${
        error instanceof Error ? error.message : error
      }`,
    )
    return 0
  }
}

function getOwner(contract: ethers.Contract): Promise<string | null> {
  return getContractValue(contract, 'owner') as Promise<string | null>
}

async function exploreContract(address: string): Promise<Result> {
  console.log(`Exploring contract at ${address}`)
  const abi = [
    'function hub__() view returns (address)',
    'function bridge__() view returns (address)',
    'function siblingChainSlug() view returns (uint32)',
    'function token__() view returns (address)',
    'function token() view returns (address)',
    'function owner() view returns (address)',
  ]

  const contract = new ethers.Contract(address, abi, provider)
  const [hub, bridge, siblingChainSlugRaw, owner] = await Promise.all([
    getContractValue(contract, 'hub__'),
    getContractValue(contract, 'bridge__'),
    getContractValue(contract, 'siblingChainSlug'),
    getOwner(contract),
  ])

  const siblingChainSlug =
    typeof siblingChainSlugRaw === 'number' ? siblingChainSlugRaw : 'unknown'

  const result: Result = {
    address,
    hubOrBridge: (hub as string) || (bridge as string) || null,
    siblingChainSlug,
    tokens: [],
    owner: owner as string | null,
  }

  const hubOrBridgeAddress = hub || bridge
  if (hubOrBridgeAddress) {
    const hubOrBridgeContract = new ethers.Contract(
      hubOrBridgeAddress as string,
      abi,
      provider,
    )
    const token =
      (await getContractValue(hubOrBridgeContract, 'token__')) ||
      (await getContractValue(hubOrBridgeContract, 'token'))
    if (token) {
      const tokenInfo = await getTokenInfoFromEtherscan(token as string)
      const tvl = await getTokenTVL(
        token as string,
        hubOrBridgeAddress as string,
      )
      if (tokenInfo) {
        result.tokens.push({ token: token as string, ...tokenInfo, tvl })
      } else {
        result.tokens.push({ token: token as string, tvl })
      }
    }
  }

  return result
}

async function main(): Promise<void> {
  console.log('Starting contract exploration')

  const discovery = new ProjectDiscovery('socket')
  const plugs: string[] = discovery.getContractValue<string[]>(
    'Socket',
    'plugs',
  )

  const results = await Promise.all(
    plugs.map((address) => limit(() => exploreContract(address))),
  )
  console.log('Exploration completed')

  const groupedResults = results.reduce<{ [key: string]: Result[] }>(
    (acc, result) => {
      const slug = result.siblingChainSlug?.toString() || 'unknown'
      if (!acc[slug]) acc[slug] = []
      acc[slug].push(result)
      return acc
    },
    {},
  )

  Object.keys(groupedResults).forEach((key) => {
    groupedResults[key].sort((a, b) => {
      const aTVL = a.tokens.reduce((sum, token) => sum + (token.tvl || 0), 0)
      const bTVL = b.tokens.reduce((sum, token) => sum + (token.tvl || 0), 0)
      return bTVL - aTVL
    })
  })

  const addressMap = new Map<string, { count: number; slugs: Set<string> }>()

  results.forEach((result) => {
    const hubOrBridge = result.hubOrBridge
    if (hubOrBridge) {
      if (!addressMap.has(hubOrBridge)) {
        addressMap.set(hubOrBridge, { count: 0, slugs: new Set<string>() })
      }
      const entry = addressMap.get(hubOrBridge)
      if (entry) {
        entry.count++
        entry.slugs.add(result.siblingChainSlug as string)
      }
    }
  })

  results.forEach((result) => {
    const hubOrBridge = result.hubOrBridge
    if (hubOrBridge) {
      const entry = addressMap.get(hubOrBridge)
      if (entry) {
        result.tags = result.tags || []
        if (entry.count > 1) result.tags.push('multiplug')
        if (entry.slugs.size > 1) result.tags.push('multiproject')
      }
    }
  })

  console.log('Writing results to socket-crawl-result.json')
  fs.writeFileSync(
    'scripts/socketcrawl/outfiles/socket-crawl-result.json',
    JSON.stringify(groupedResults, null, 2),
  )
  console.log('Results written to socket-crawl-result.json')

  // The rest below is for the copy-paste suggestion file for config.jsonc and socket.ts
  const copypasta: string[] = []
  const initialAddressesByProject: { [key: string]: string[] } = {}
  const namesByProject: { [key: string]: { [address: string]: string } } = {}
  const ignoreMethodsByProject: {
    [key: string]: { [name: string]: { ignoreMethods: string[] } }
  } = {}
  const escrowsByProject: { [key: string]: string[] } = {}

  for (const [slug, results] of Object.entries(groupedResults)) {
    const slugName = chainSlugToName[slug] || slug
    initialAddressesByProject[slugName] = []
    namesByProject[slugName] = {}
    ignoreMethodsByProject[slugName] = {}
    escrowsByProject[slugName] = []

    results.forEach((result) => {
      const hubOrBridge = result.hubOrBridge
      if (hubOrBridge && result.tokens.length > 0) {
        result.tokens.forEach((token) => {
          if (token.tvl > 0) {
            initialAddressesByProject[slugName].push(hubOrBridge)
            const name = `${token.tokenSymbol} Vault ${slugName}`
            namesByProject[slugName][hubOrBridge] = name
            ignoreMethodsByProject[slugName][name] = {
              ignoreMethods: ['token', 'token__', 'hook__'],
            }
            const ownerName =
              ownerAddressToName[result.owner || ''] || 'Unknown Owner'
            escrowsByProject[slugName].push(
              `discovery.getEscrowDetails({
                address: EthereumAddress('${hubOrBridge}'),
                name: '${name}',
                description: 'Socket Vault associated with ${slugName} and owned by ${ownerName}.',
                tokens: ['${token.tokenSymbol}'],
              }),`,
            )
          }
        })
      }
    })
  }

  const projectKeys = Object.keys(initialAddressesByProject).filter(
    (key) => initialAddressesByProject[key].length > 0,
  )

  const deduplicateArray = (arr: string[]) => Array.from(new Set(arr))
  projectKeys.forEach((key) => {
    initialAddressesByProject[key] = deduplicateArray(
      initialAddressesByProject[key],
    )
    escrowsByProject[key] = deduplicateArray(escrowsByProject[key])
  })

  const initialAddressesSection = projectKeys
    .map(
      (project) =>
        `// ${project}\n${initialAddressesByProject[project]
          .map((addr) => `    "${addr}"`)
          .join(',\n')}`,
    )
    .join(',\n')
  copypasta.push(`"initialAddresses": [\n${initialAddressesSection}\n],`)

  const namesSection = projectKeys
    .map(
      (project) =>
        `// ${project}\n${Object.entries(namesByProject[project])
          .map(([addr, name]) => `    "${addr}": "${name}"`)
          .join(',\n')}`,
    )
    .join(',\n')
  copypasta.push(`"names": {\n${namesSection}\n},`)

  const ignoreMethodsSection = projectKeys
    .map(
      (project) =>
        `// ${project}\n${Object.entries(ignoreMethodsByProject[project])
          .map(([name, methods]) => `    "${name}": ${JSON.stringify(methods)}`)
          .join(',\n')}`,
    )
    .join(',\n')
  copypasta.push(`"ignoreMethods": {\n${ignoreMethodsSection}\n},`)

  const escrowsSection = projectKeys
    .map((project) => `// ${project}\n${escrowsByProject[project].join('\n')}`)
    .join('\n')
  copypasta.push(`escrows: [\n${escrowsSection}\n],`)

  fs.writeFileSync(
    'scripts/socketcrawl/outfiles/socket-crawl-copypasta.txt',
    copypasta.join('\n\n'),
  )
  console.log('Results written to socket-crawl-copypasta.txt')

  provider.removeAllListeners()
  console.log('Exiting script')
  process.exit(0)
}

main().catch(console.error)
