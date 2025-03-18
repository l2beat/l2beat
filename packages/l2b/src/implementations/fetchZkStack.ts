import fs from 'fs'
import { ethers } from 'ethers'

// Interface definitions
interface TokenAddressMap {
  [key: string]: string
}

interface PubdataModeMap {
  [key: number]: string
}

interface ChainIdNameMap {
  [key: string]: string
}

interface L2Data {
  chainAddress: string
  chainID: ethers.BigNumber
  chainAdmin: string
  baseToken: string
  pubdataPricingMode: number
  protocolVersion: {
    major: number
    minor: number
    patch: number
  }
  totalBlocksExecuted: ethers.BigNumber
}

interface FormattedL2Data {
  chainAddress: string
  chainID: string
  name: string
  chainAdmin: string
  baseToken: string
  baseTokenName: string
  pubdataPricingMode: number
  pubdataModeName: string
  protocolVersion: string
  totalBlocksExecuted: string
}

// Table field configuration
interface TableField {
  key: keyof FormattedL2Data
  header: string
}

export class ZkStackDataFetcher {
  private provider: ethers.providers.JsonRpcProvider
  private stateTransitionManagerAddress =
    '0xc2eE6b6af7d616f6e27ce7F4A451Aedc2b0F5f5C'
  private outputFilePath: string

  private tokenAddresses: TokenAddressMap = {
    '0x0000000000000000000000000000000000000001': 'ETH',
    '0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2': 'zkCRO',
    '0x6B7774CB12ed7573a7586E7D0e62a2A563dDd3f0': 'SOPH',
    '0xAB3B124052F0389D1cbED221d912026Ac995bb95': 'GBT',
    '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A': 'MAGIC',
    '0x03F5BE358fc2C4DF88723a63148bd829B8AA5c91': 'ozETH',
    '0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a': 'LGHO',
  }

  private pubdataModes: PubdataModeMap = {
    0: 'rollup',
    1: 'validium',
  }

  // Chain ID to name mapping - manually fill as needed
  private chainIdToName: ChainIdNameMap = {
    '324': 'ZKsync Era',
    '388': 'Cronos zk EVM',
    '50104': 'Sophon',
    '543210': 'ZeroNetwork',
    '2741': 'Abstract',
    '325': 'GRVT',
    '61166': 'Treasure Chain',
    '1345': 'Unknown',
    '9637': 'Lumoz',
    '320': 'ZKcandy',
    '232': 'Lens',
  }

  // Default table display configuration
  private tableFields: TableField[] = [
    { key: 'chainID', header: 'chain ID' },
    { key: 'name', header: 'name' },
    { key: 'baseTokenName', header: 'gas token' },
    { key: 'pubdataModeName', header: 'DA' },
    { key: 'protocolVersion', header: 'v' },
    { key: 'totalBlocksExecuted', header: 'blocks executed' },
  ]

  // ABIs - separated for easy maintenance
  private stateTransitionManagerAbi = [
    'function getAllHyperchains() view returns (address[] chainAddresses)',
    'function getAllHyperchainChainIDs() view returns (uint256[])',
    'function getChainAdmin(uint256 _chainId) view returns (address)',
  ]

  private diamondAbi = [
    'function getBaseToken() view returns (address)',
    'function getPubdataPricingMode() view returns (uint8)',
    'function getSemverProtocolVersion() view returns (uint32, uint32, uint32)',
    'function getTotalBlocksExecuted() view returns (uint256)',
  ]

  constructor(providerUrl: string, outputFilePath: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.outputFilePath = outputFilePath
  }

  // Function to create a formatted console table
  private createConsoleTable(data: FormattedL2Data[]): string {
    // Extract headers from tableFields
    const headers = this.tableFields.map((field) => field.header)

    // Create table data with headers
    const tableData: string[][] = [headers]

    // Fill in rows based on configured fields
    data.forEach((item) => {
      const row = this.tableFields.map((field) => {
        const value = item[field.key]
        return value !== undefined ? String(value) : 'N/A'
      })
      tableData.push(row)
    })

    // Calculate column widths
    const columnWidths: number[] = []
    for (const row of tableData) {
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const cellLength = row[colIndex].length
        if (!columnWidths[colIndex] || cellLength > columnWidths[colIndex]) {
          columnWidths[colIndex] = cellLength
        }
      }
    }

    // Create the table
    let result = ''

    // Helper function to create a horizontal border
    const createBorder = (char: string): string => {
      let border = '+'
      for (const width of columnWidths) {
        border += char.repeat(width + 2) + '+'
      }
      return border + '\n'
    }

    // Top border
    result += createBorder('-')

    // Header row
    if (tableData.length > 0) {
      const headerRow = tableData[0]
      result += '| '
      for (let i = 0; i < headerRow.length; i++) {
        const cell = headerRow[i]
        result += cell.padEnd(columnWidths[i]) + ' | '
      }
      result = result.trimEnd() + '\n'

      // Header separator
      result += createBorder('=')
    }

    // Data rows
    for (let i = 1; i < tableData.length; i++) {
      result += '| '
      for (let j = 0; j < tableData[i].length; j++) {
        const cell = tableData[i][j]
        result += cell.padEnd(columnWidths[j]) + ' | '
      }
      result = result.trimEnd() + '\n'
    }

    // Bottom border
    result += createBorder('-')

    return result
  }

  // Helper functions
  private getTokenName(address: string): string {
    const key = address
    return (
      this.tokenAddresses[key] ||
      address.substring(0, 6) + '...' + address.substring(address.length - 4)
    )
  }

  private getPubdataModeName(mode: number): string {
    return this.pubdataModes[mode] || `mode ${mode}`
  }

  private getChainName(chainID: string): string {
    return this.chainIdToName[chainID] || `chain ${chainID}`
  }

  private formatProtocolVersion(version: {
    major: number
    minor: number
    patch: number
  }): string {
    return `${version.major}.${version.minor}.${version.patch}`
  }

  // Safe contract call helper with error handling
  private async safeContractCall<T>(
    contractCall: () => Promise<T>,
    errorValue: T,
    errorMessage: string,
  ): Promise<T> {
    try {
      return await contractCall()
    } catch (_error) {
      console.warn(errorMessage)
      return errorValue
    }
  }

  // Main function to fetch and display L2 data
  public async fetchAndDisplayL2Data(): Promise<void> {
    // Create contract instance for StateTransitionManager
    const stateTransitionManager = new ethers.Contract(
      this.stateTransitionManagerAddress,
      this.stateTransitionManagerAbi,
      this.provider,
    )

    console.log('fetching L2 data...')

    try {
      // Fetch all hyperchain addresses and chain IDs
      const chainAddresses: string[] =
        await stateTransitionManager.getAllHyperchains()
      const chainIDs: ethers.BigNumber[] =
        await stateTransitionManager.getAllHyperchainChainIDs()

      // Check if we have data
      if (chainAddresses.length === 0 || chainIDs.length === 0) {
        console.log('no hyperchains found')
        return
      }

      // Collect data for each hyperchain
      const l2DataList: L2Data[] = []

      for (let i = 0; i < chainAddresses.length; i++) {
        // Stop when we reach zero address
        if (
          chainAddresses[i] === '0x0000000000000000000000000000000000000000'
        ) {
          break
        }

        const chainID = chainIDs[i]
        console.log(`fetching data for chain ID: ${chainID.toString()}`)

        try {
          // Get chain admin
          const chainAdmin = await stateTransitionManager.getChainAdmin(chainID)

          // Create contract instance for the diamond (L2)
          const diamond = new ethers.Contract(
            chainAddresses[i],
            this.diamondAbi,
            this.provider,
          )

          // Fetch L2 specific data with safe calls
          const baseToken = await this.safeContractCall(
            () => diamond.getBaseToken(),
            '0x0000000000000000000000000000000000000000',
            `failed to get base token for chain ${chainID.toString()}`,
          )

          const pubdataPricingMode = await this.safeContractCall(
            () => diamond.getPubdataPricingMode(),
            0,
            `failed to get pubdata pricing mode for chain ${chainID.toString()}`,
          )

          let major = 0,
            minor = 0,
            patch = 0
          try {
            ;[major, minor, patch] = await diamond.getSemverProtocolVersion()
          } catch (_error) {
            console.warn(
              `failed to get protocol version for chain ${chainID.toString()}`,
            )
          }

          const totalBlocksExecuted = await this.safeContractCall(
            () => diamond.getTotalBlocksExecuted(),
            ethers.BigNumber.from(0),
            `failed to get total blocks executed for chain ${chainID.toString()}`,
          )

          // Add to our data list
          l2DataList.push({
            chainAddress: chainAddresses[i],
            chainID,
            chainAdmin,
            baseToken,
            pubdataPricingMode,
            protocolVersion: {
              major,
              minor,
              patch,
            },
            totalBlocksExecuted,
          })
        } catch (error: unknown) {
          console.error(
            `rrror processing chain ${chainID.toString()}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          )
        }
      }

      // Format data for display and saving
      const formattedData: FormattedL2Data[] = l2DataList.map((data) => {
        const chainIDString = data.chainID.toString()
        return {
          chainAddress: data.chainAddress,
          chainID: chainIDString,
          name: this.getChainName(chainIDString),
          chainAdmin: data.chainAdmin,
          baseToken: data.baseToken,
          baseTokenName: this.getTokenName(data.baseToken),
          pubdataPricingMode: data.pubdataPricingMode,
          pubdataModeName: this.getPubdataModeName(data.pubdataPricingMode),
          protocolVersion: this.formatProtocolVersion(data.protocolVersion),
          totalBlocksExecuted: data.totalBlocksExecuted.toString(),
        }
      })

      // Ensure directory exists
      const outputDir = this.outputFilePath.substring(
        0,
        this.outputFilePath.lastIndexOf('/'),
      )
      if (outputDir && !fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      // Write data to file
      fs.writeFileSync(
        this.outputFilePath,
        JSON.stringify(formattedData, null, 2),
      )
      console.log(`full data saved to ${this.outputFilePath}`)

      // Display table
      console.log('ZK stack summary:')
      console.log(this.createConsoleTable(formattedData))
    } catch (error: unknown) {
      console.error(
        `error fetching data: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }

  // Configuration methods
  public setTableFields(fields: TableField[]): void {
    this.tableFields = fields
  }

  public addTokenAddressMapping(address: string, name: string): void {
    this.tokenAddresses[address.toLowerCase()] = name
  }

  public addPubdataModeMapping(mode: number, description: string): void {
    this.pubdataModes[mode] = description
  }

  public addChainNameMapping(chainID: string, name: string): void {
    this.chainIdToName[chainID] = name
  }
}
