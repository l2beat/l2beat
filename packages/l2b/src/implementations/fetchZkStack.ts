import fs from 'fs'
import { formatAsAsciiTable } from '@l2beat/shared-pure'
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

interface DAValidatorMap {
  [key: string]: string
}

interface L2Data {
  chainAddress: string
  chainID: ethers.BigNumber
  chainAdmin: string
  baseToken: string
  pubdataPricingMode: number
  daValidatorType: string
  protocolVersion: {
    major: number
    minor: number
    patch: number
  }
  totalBlocksExecuted: ethers.BigNumber
  txFilterer: string
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
  daValidatorType: string
  protocolVersion: string
  totalBlocksExecuted: string
  txFilterer: string
}

// Table field configuration
interface TableField {
  key: keyof FormattedL2Data
  header: string
}

export class ZkStackDataFetcher {
  private provider: ethers.providers.JsonRpcProvider
  private bridgeHubAddress = '0x303a465B659cBB0ab36eE643eA362c509EEb5213'
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

  private daValidatorMapping: DAValidatorMap = {
    '0x72213dfe8CA61B0A782970dCFebFb877778f9119': 'Rollup',
    '0x907b30407249949521Bf0c89A43558dae200146A': 'Validium',
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
    '1345': 'OpenZK',
    '9637': 'Lumoz',
    '320': 'ZKcandy',
    '232': 'Lens',
  }

  // Default table display configuration
  private tableFields: TableField[] = [
    { key: 'chainID', header: 'chain ID' },
    { key: 'name', header: 'name' },
    { key: 'baseTokenName', header: 'gas token' },
    { key: 'daValidatorType', header: 'DA' },
    { key: 'txFilterer', header: 'txfilterer' },
    { key: 'protocolVersion', header: 'v' },
    { key: 'totalBlocksExecuted', header: 'executed' },
  ]

  // ABIs - separated for easy maintenance
  private bridgeHubAbi = [
    'function getAllZKChains() view returns (address[] chainAddresses)',
    'function getAllZKChainChainIDs() view returns (uint256[])',
    'function chainTypeManager(uint256 chainId) view returns (address)',
    'function baseToken(uint256 _chainId) view returns (address)',
  ]

  private chainTypeManagerAbi = [
    'function getChainAdmin(uint256 _chainId) view returns (address)',
    'function getProtocolVersion(uint256 _chainId) view returns (uint256)',
    'function getSemverProtocolVersion() view returns (uint32, uint32, uint32)',
  ]

  private diamondAbi = [
    'function getBaseToken() view returns (address)',
    'function getPubdataPricingMode() view returns (uint8)',
    'function getSemverProtocolVersion() view returns (uint32, uint32, uint32)',
    'function getTotalBlocksExecuted() view returns (uint256)',
    'function getDAValidatorPair() view returns (address, address)',
    'function getTransactionFilterer() view returns (address)', // Added transaction filterer function
  ]

  constructor(providerUrl: string, outputFilePath: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.outputFilePath = outputFilePath
  }

  // Function to create a formatted console table
  private createConsoleTable(data: FormattedL2Data[]): string {
    // Extract headers from tableFields
    const headers = this.tableFields.map((field) => field.header)

    // Create rows of data
    const rows = data.map((item) =>
      this.tableFields.map((field) => {
        const value = item[field.key]
        return value !== undefined ? String(value) : 'N/A'
      }),
    )

    // Use the imported formatAsAsciiTable function
    return formatAsAsciiTable(headers, rows)
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
    // Create contract instance for BridgeHub
    const bridgeHub = new ethers.Contract(
      this.bridgeHubAddress,
      this.bridgeHubAbi,
      this.provider,
    )

    console.log('fetching L2 data...')

    try {
      // Fetch all ZK chain addresses and chain IDs
      const chainAddresses: string[] = await bridgeHub.getAllZKChains()
      const chainIDs: ethers.BigNumber[] =
        await bridgeHub.getAllZKChainChainIDs()

      // Check if we have data
      if (chainAddresses.length === 0 || chainIDs.length === 0) {
        console.log('no ZK chains found')
        return
      }

      // Collect data for each ZK chain
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
          // Get chain type manager and base token from BridgeHub
          const chainTypeManagerAddress =
            await bridgeHub.chainTypeManager(chainID)
          const baseTokenAddress = await bridgeHub.baseToken(chainID)

          // Create contract instance for the ChainTypeManager
          const chainTypeManager = new ethers.Contract(
            chainTypeManagerAddress,
            this.chainTypeManagerAbi,
            this.provider,
          )

          // Get chain admin from ChainTypeManager
          const chainAdmin = await chainTypeManager.getChainAdmin(chainID)

          // Create contract instance for the diamond (L2)
          const diamond = new ethers.Contract(
            chainAddresses[i],
            this.diamondAbi,
            this.provider,
          )

          // Fetch L2 specific data with safe calls
          const pubdataPricingMode = await this.safeContractCall(
            () => diamond.getPubdataPricingMode(),
            0,
            `failed to get pubdata pricing mode for chain ${chainID.toString()}`,
          )

          // Get transaction filterer
          let txFilterer = 'No'
          try {
            // Call the getTransactionFilterer function using the function selector
            const txFiltererAddress = await this.provider.call({
              to: chainAddresses[i],
              data: '0x22c5cf23', // Function selector for getTransactionFilterer()
            })

            // Parse the result (it's a bytes32 value that needs to be converted to address)
            const decodedAddress = ethers.utils.defaultAbiCoder.decode(['address'], txFiltererAddress)[0]

            // Check if the address is non-zero
            if (decodedAddress !== '0x0000000000000000000000000000000000000000') {
              txFilterer = 'Yes'
            }
          } catch (_error) {
            console.warn(
              `failed to get transaction filterer for chain ${chainID.toString()}`,
            )
          }

          // Get DA validator pair
          let daValidatorType = 'Unknown'
          try {
            const [daValidator, _] = await diamond.getDAValidatorPair()
            daValidatorType = this.daValidatorMapping[daValidator] || 'Unknown'

            // Cross-check with pubdata pricing mode
            if (
              (daValidatorType === 'Rollup' && pubdataPricingMode !== 0) ||
              (daValidatorType === 'Validium' && pubdataPricingMode !== 1)
            ) {
              daValidatorType = 'Inconsistent'
            }
          } catch (_error) {
            console.warn(
              `failed to get DA validator pair for chain ${chainID.toString()}`,
            )
          }

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
            baseToken: baseTokenAddress,
            pubdataPricingMode,
            daValidatorType,
            protocolVersion: {
              major,
              minor,
              patch,
            },
            totalBlocksExecuted,
            txFilterer,
          })
        } catch (error: unknown) {
          console.error(
            `error processing chain ${chainID.toString()}: ${
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
          daValidatorType: data.daValidatorType,
          protocolVersion: this.formatProtocolVersion(data.protocolVersion),
          totalBlocksExecuted: data.totalBlocksExecuted.toString(),
          txFilterer: data.txFilterer,
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

  public addDAValidatorMapping(address: string, type: string): void {
    this.daValidatorMapping[address] = type
  }
}
