import * as fs from 'fs'
import * as dotenv from 'dotenv'
import { ethers } from 'ethers'
import pLimit from 'p-limit'

dotenv.config()

const ETHERSCAN_API_KEY: string | undefined =
  process.env.ETHEREUM_ETHERSCAN_API_KEY
const RPC_URL: string | undefined = process.env.ETHEREUM_RPC_URL

if (!ETHERSCAN_API_KEY || !RPC_URL) {
  throw new Error('Missing environment variables')
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
const limit = pLimit(2)

const plugs: string[] = [
  '0x7a6Edde81cdD9d75BC10D87C490b132c08bD426D',
  '0x200AF8FCdD5246D70B369A98143Ac8930A077B7A',
  '0x22d8360eB04F46195c7B02A66658C375948d8A99',
  '0xA621Bc5A9d13D39eb098865B723CEee71BB5C181',
  '0xceA535B2a0A690ebA76ac6A4AF2A1ee7B9Fed1aa',
  '0xCf814e58f1649F94d37E51f730D6bF72409fA09c',
  '0xf71A92D4bEFc2e18671c3b20377d45729790e880',
  '0x1Eb392Aba52a2D933e58f7E86Ca96b9A3e2D8166',
  '0x5Afa7ddBcE8EE8862FDf5fD8c546BF32615d2D9B',
  '0x02D53793b18d032Cd94d745F7586C6F66F83f8e3',
  '0x3553c0102684c20e2f8192d6F013c7242710b4b3',
  '0x280D208f0eE2f053A0441099bcBFf298bc8b9444',
  '0x37091ade7C4E1A914D3155449e25eE91DA08EbE4',
  '0x68411d61adF1341A6392C87A93941FdD3EE7DF8E',
  '0x8F4e67C61232167584333e23D7d67BD73d80a4F5',
  '0x4ab7B94BA3f3CF69354Eb2f6b5E856DC61e13660',
  '0x727aD65db6aE99DB5Dbee8F202846DD6009bf6D5',
  '0xdCcFb24f983586144c085426dbfa3414045E19a3',
  '0x6A769e25081396a49a6702758d0830920ac1163A',
  '0x2Dba37E679358125BaB2132dDF5133d7d66F7D06',
  '0xaaDd94438f511aC22D35Ba7FC50849a9CD3e6AeF',
  '0x998d7C2257591cC38383B4F91474c5346111f2E6',
  '0x223033E1F905eEd161a7B2EBeb786a158156fb8D',
  '0x7E6dA87FE69306CaAED675fFe4e7dC0FfE3bFe4D',
  '0xCc958F84DaF36d3eC20BcBee7E99C073B882efc3',
  '0xF15d420bE7b27F1fA0D9487105658EdC3C0EA508',
  '0x3f66F272d33B764960779a301c4183306ae50e10',
  '0xB49b8AAcD8396C49d9045f6bAb101aB32c59643D',
  '0xb1178803A726e2077947754de9f2f0cbdA29A60F',
  '0xE7ADE6Dda067c501A3d4C938c36c310c55FBcc27',
  '0xAc00056920EfF02831CAf0baF116ADf6B42D9ad1',
  '0x83C6d6597891Ad48cF5e0BA901De55120C37C6bE',
  '0xe987a57DA7Ab112B1bDc7AA704E6EA943760d252',
  '0x935f1C29Db1155c3E0f39F644DF78DDDBD4757Ff',
  '0x266abd77Da7F877cdf93c0dd5782cC61Fa29ac96',
  '0x73E0d4953c356a5Ca3A3D172739128776B2920b5',
  '0x642c4c33301EF5837ADa6E74F15Aa939f3951Fff',
  '0x170fFDe318B514B029E1B1eC4F096C7e1bDeaeA8',
  '0xF5992B6A0dEa32dCF6BE7bfAf762A4D94f139Ea7',
  '0xE274dB6b891159547FbDC18b07412EE7F4B8d767',
  '0xC331BEeC6e36c8Df4FDD7e432de95863E7f80d67',
  '0xE2c2291B80BFC8Bd0e4fc8Af196Ae5fc9136aeE0',
  '0xdE9D8c2d465669c661672d7945D4d4f5407d22E2',
  '0x32295769ea702BA9337EE5B65c6b42aFF75FEC62',
]

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
  957: 'Lyra',
  1024: 'Parallel',
  1729: 'Reya Cronos Testnet',
  2999: 'Aevo',
  4665: 'Hook',
  5000: 'Mantle',
  7887: 'Kinto',
  8453: 'Base',
  34443: 'Mode',
  42161: 'Arbitrum',
  80001: 'Polygon Mumbai testnet',
  421613: 'Arbitrum Goerli',
  421614: 'Arbitrum Sepolia',
  11155111: 'Sepolia',
  11155112: 'Aevo testnet',
  11155420: 'Optimism Sepolia',
  46658378: 'Hook testnet',
  686669576: 'SX Network Testnet',
  28122024: 'Ancient8 testnet2',
  1324967486: 'Reya',
  1399904803: 'XAI Testnet',
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

    // Define the expected response type
    interface EtherscanResponse {
      status: string
      result: { tokenName: string; tokenSymbol: string }[]
    }

    const data: unknown = await response.json()

    // Check if data is of type EtherscanResponse
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
    'scripts/socket/outfiles/socket-crawl-result.json',
    JSON.stringify(groupedResults, null, 2),
  )
  console.log('Results written to socket-crawl-result.json')

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
            escrowsByProject[slugName].push(
              `discovery.getEscrowDetails({
                address: EthereumAddress('${hubOrBridge}'),
                name: '${name}',
                description: 'Socket Vault associated with ${slugName}.',
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
    'scripts/socket/outfiles/socket-crawl-copypasta.txt',
    copypasta.join('\n\n'),
  )
  console.log('Results written to socket-crawl-copypasta.txt')

  provider.removeAllListeners()
  console.log('Exiting script')
  process.exit(0)
}

main().catch(console.error)
