import * as fs from 'fs'

/**
 *
 * Converts socket superbridge .json's to a usable format
 * Fill input.json with a file like  https://github.com/SocketDotTech/socket-plugs/blob/main/deployments/superbridge/prod_lyra_addresses.json
 * run with `pnpm socket-convert` from config/
 *
 */

// Define the input JSON structure
interface InputTokenData {
  isAppChain: boolean
  NonMintableToken?: string
  Vault: string
  connectors: Record<string, undefined>
  LyraTSAShareHandlerDepositHook?: string
  LyraTSADepositHook?: string
}

interface InputChainData {
  [token: string]: InputTokenData
}

interface InputData {
  [chainId: string]: InputChainData
}

// Define the output format
interface OutputData {
  address: string
  sinceTimestamp: string
  includeInTotal?: boolean
  source: string
  bridge: {
    name: string
    slug: string
  }
  tokens: string[]
  chain: string
}

const chainIdToName: Record<string, string> = {
  '1': 'ethereum',
  '5': 'Goerli',
  '10': 'optimism',
  '56': 'BNB Chain',
  '89': 'Viction testnet',
  '137': 'Polygon',
  '420': 'Optimism Goerli',
  '647': 'Stavanger testnet',
  '901': 'Lyra testnet',
  '919': 'Mode testnet',
  '957': 'lyra',
  '1024': 'parallel',
  '1729': 'Reya Cronos Testnet',
  '2999': 'aevo',
  '4665': 'hook',
  '5000': 'mantle',
  '7887': 'kinto',
  '8453': 'base',
  '8008': 'polynomial',
  '34443': 'mode',
  '42161': 'arbitrum',
  '80001': 'Polygon Mumbai testnet',
  '81457': 'blast',
  '421613': 'Arbitrum Goerli',
  '421614': 'Arbitrum Sepolia',
  '777777': 'winr',
  '11155111': 'Sepolia',
  '11155112': 'Aevo testnet',
  '11155420': 'Optimism Sepolia',
  '46658378': 'Hook testnet',
  '686669576': 'SX Network Testnet',
  '28122024': 'Ancient8 testnet2',
  '1324967486': 'reya',
  '1399904803': 'XAI Testnet',
}

// Function to convert the input data to the desired output format
function convertData(inputData: InputData): OutputData[] {
  const outputData: OutputData[] = []

  for (const [chainId, tokensData] of Object.entries(inputData)) {
    const chainName = chainIdToName[chainId]

    if (!chainName) continue // Skip unknown chains

    for (const [token, data] of Object.entries(tokensData)) {
      if (data.isAppChain) continue // Ignore entries with isAppChain: true

      const outputEntry: OutputData = {
        address: `EthereumAddress('${data.Vault}')`,
        sinceTimestamp: 'new UnixTime()', // Always left empty
        source: 'external',
        bridge: {
          name: 'Socket bridge',
          slug: 'socket',
        },
        tokens: [token],
        chain: chainName,
      }

      // Add includeInTotal: false for all chains except Ethereum
      if (chainName !== 'ethereum') {
        outputEntry.includeInTotal = false
      }

      outputData.push(outputEntry)
    }
  }

  return outputData
}

// Function to manually format the output data as a string
function formatOutputData(data: OutputData[]): string {
  return data
    .map((entry) => {
      const includeInTotalStr =
        entry.includeInTotal !== undefined
          ? `\n      includeInTotal: ${entry.includeInTotal},`
          : ''
      return `{
    address: ${entry.address},
    sinceTimestamp: ${entry.sinceTimestamp},
    source: '${entry.source}',
    bridgedUsing: {
        bridges: [
          {
            name: '${entry.bridge.name}',
            slug: '${entry.bridge.slug}',
          },
        ],
      },
    tokens: ['${entry.tokens[0]}'],
    chain: '${entry.chain}',${includeInTotalStr}
  }`
    })
    .join(',\n')
}

// Read the input file
const inputFile = 'scripts/socketconvert/input.json'
const rawData = fs.readFileSync(inputFile, 'utf-8')
const inputData: InputData = JSON.parse(rawData)

// Convert the data
const outputData = convertData(inputData)

// Format the output data as a string
const outputString = formatOutputData(outputData)

// Write the output to a .txt file
const outputFile = 'scripts/socketconvert/convertedVaults.txt'
fs.writeFileSync(outputFile, outputString)

console.log('Data conversion complete. Output saved to convertedVaults.txt')
