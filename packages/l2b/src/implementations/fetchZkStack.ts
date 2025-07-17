import { formatAsAsciiTable } from '@l2beat/shared-pure'
import { ethers } from 'ethers'
import fs from 'fs'

// Interface definitions remain the same
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
  protocolVersion: { major: number; minor: number; patch: number }
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
interface TableField {
  key: keyof FormattedL2Data
  header: string
}

export class ZkStackDataFetcher {
  private provider: ethers.providers.JsonRpcProvider
  private bridgeHubAddress = '0x303a465B659cBB0ab36eE643eA362c509EEb5213'
  private outputFilePath: string
  private bridgeHub: ethers.Contract

  // Mappings remain the same
  private tokenAddresses: TokenAddressMap = {
    '0x0000000000000000000000000000000000000001': 'ETH',
    '0x28Ff2E4dD1B58efEB0fC138602A28D5aE81e44e2': 'zkCRO',
    '0x6B7774CB12ed7573a7586E7D0e62a2A563dDd3f0': 'SOPH',
    '0xAB3B124052F0389D1cbED221d912026Ac995bb95': 'GBT',
    '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A': 'MAGIC',
    '0x03F5BE358fc2C4DF88723a63148bd829B8AA5c91': 'ozETH',
    '0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a': 'LGHO',
    '0x0Df3a853e4B604fC2ac0881E9Dc92db27fF7f51b': 'LAC',
    '0x66A5cFB2e9c529f14FE6364Ad1075dF3a649C0A5': 'ZK',
  }

  private pubdataModes: PubdataModeMap = {
    0: 'rollup',
    1: 'validium',
  }

  private daValidatorMapping: DAValidatorMap = {
    '0x72213dfe8CA61B0A782970dCFebFb877778f9119': 'Rollup',
    '0x907b30407249949521Bf0c89A43558dae200146A': 'Validium',
  }

  private chainIdToName: ChainIdNameMap = {
    '324': 'ZKsync Era',
    '388': 'Cronos zk EVM',
    '50104': 'Sophon',
    '543210': 'ZeroNetwork',
    '2741': 'Abstract',
    '325': 'GRVT',
    '61166': 'Treasure Chain',
    '1345': 'OpenZK',
    '9637': 'Wonder',
    '320': 'ZKcandy',
    '232': 'Lens',
    '2904': 'LaChain',
    '9075': 'Gateway',
    '1217': 'SxT',
  }

  private tableFields: TableField[] = [
    { key: 'chainID', header: 'chain ID' },
    { key: 'name', header: 'name' },
    { key: 'baseTokenName', header: 'gas token' },
    { key: 'daValidatorType', header: 'DA' },
    { key: 'txFilterer', header: 'txfilterer' },
    { key: 'protocolVersion', header: 'v' },
    { key: 'totalBlocksExecuted', header: 'executed' },
  ]

  // ABIs remain the same
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
    'function getTransactionFilterer() view returns (address)',
  ]

  constructor(providerUrl: string, outputFilePath: string) {
    this.provider = new ethers.providers.JsonRpcProvider(providerUrl)
    this.outputFilePath = outputFilePath
    this.bridgeHub = new ethers.Contract(
      this.bridgeHubAddress,
      this.bridgeHubAbi,
      this.provider,
    )
  }

  private createConsoleTable(data: FormattedL2Data[]): string {
    const headers = this.tableFields.map((field) => field.header)
    const rows = data.map((item) =>
      this.tableFields.map((field) => {
        const value = item[field.key]
        return value !== undefined ? String(value) : 'N/A'
      }),
    )
    return formatAsAsciiTable(headers, rows)
  }

  private getTokenName(address: string): string {
    return (
      this.tokenAddresses[address] ||
      `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
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

  // Optimized batch processing for a chain
  private async processChain(
    chainAddress: string,
    chainID: ethers.BigNumber,
  ): Promise<L2Data | null> {
    if (chainAddress === '0x0000000000000000000000000000000000000000') {
      return null
    }

    console.log(`fetching data for chain ID: ${chainID.toString()}`)

    try {
      // Create multicall arrays for parallel requests
      const chainTypeManagerAddress =
        await this.bridgeHub.chainTypeManager(chainID)
      const baseTokenAddress = await this.bridgeHub.baseToken(chainID)

      const chainTypeManager = new ethers.Contract(
        chainTypeManagerAddress,
        this.chainTypeManagerAbi,
        this.provider,
      )

      const diamond = new ethers.Contract(
        chainAddress,
        this.diamondAbi,
        this.provider,
      )

      // Batch all the contract calls to run in parallel
      const [
        chainAdmin,
        pubdataPricingModePromise,
        daValidatorPairPromise,
        protocolVersionPromise,
        totalBlocksExecutedPromise,
        txFiltererPromise,
      ] = await Promise.allSettled([
        chainTypeManager.getChainAdmin(chainID),
        this.safeContractCall(
          () => diamond.getPubdataPricingMode(),
          0,
          `failed to get pubdata pricing mode for chain ${chainID.toString()}`,
        ),
        diamond.getDAValidatorPair().catch(() => ['Unknown', 'Unknown']),
        diamond.getSemverProtocolVersion().catch(() => [0, 0, 0]),
        this.safeContractCall(
          () => diamond.getTotalBlocksExecuted(),
          ethers.BigNumber.from(0),
          `failed to get total blocks executed for chain ${chainID.toString()}`,
        ),
        this.provider
          .call({
            to: chainAddress,
            data: '0x22c5cf23', // Function selector for getTransactionFilterer()
          })
          .catch(() =>
            ethers.utils.defaultAbiCoder.encode(
              ['address'],
              ['0x0000000000000000000000000000000000000000'],
            ),
          ),
      ])

      // Process results
      const pubdataPricingMode =
        pubdataPricingModePromise.status === 'fulfilled'
          ? pubdataPricingModePromise.value
          : 0

      // Process DA validator
      let daValidatorType = 'Unknown'
      if (daValidatorPairPromise.status === 'fulfilled') {
        const [daValidator, _] = daValidatorPairPromise.value
        daValidatorType = this.daValidatorMapping[daValidator] || 'Unknown'

        // Cross-check with pubdata pricing mode
        if (
          (daValidatorType === 'Rollup' && pubdataPricingMode !== 0) ||
          (daValidatorType === 'Validium' && pubdataPricingMode !== 1)
        ) {
          daValidatorType = 'Inconsistent'
        }
      }

      // Process protocol version
      let major = 0
      let minor = 0
      let patch = 0
      if (protocolVersionPromise.status === 'fulfilled') {
        ;[major, minor, patch] = protocolVersionPromise.value
      }

      // Process total blocks executed
      const totalBlocksExecuted =
        totalBlocksExecutedPromise.status === 'fulfilled'
          ? totalBlocksExecutedPromise.value
          : ethers.BigNumber.from(0)

      // Process transaction filterer
      let txFilterer = 'No'
      if (txFiltererPromise.status === 'fulfilled') {
        const decodedAddress = ethers.utils.defaultAbiCoder.decode(
          ['address'],
          txFiltererPromise.value,
        )[0]
        if (decodedAddress !== '0x0000000000000000000000000000000000000000') {
          txFilterer = 'Yes'
        }
      }

      return {
        chainAddress,
        chainID,
        chainAdmin:
          chainAdmin.status === 'fulfilled' ? chainAdmin.value : 'Unknown',
        baseToken: baseTokenAddress,
        pubdataPricingMode,
        daValidatorType,
        protocolVersion: { major, minor, patch },
        totalBlocksExecuted,
        txFilterer,
      }
    } catch (error) {
      console.error(
        `error processing chain ${chainID.toString()}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
      return null
    }
  }

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

  public async fetchAndDisplayL2Data(): Promise<void> {
    console.log('fetching L2 data...')

    try {
      // Fetch all ZK chain addresses and chain IDs in parallel
      const [chainAddresses, chainIDs] = await Promise.all([
        this.bridgeHub.getAllZKChains(),
        this.bridgeHub.getAllZKChainChainIDs(),
      ])

      if (chainAddresses.length === 0 || chainIDs.length === 0) {
        console.log('no ZK chains found')
        return
      }

      // Process chains in batches to avoid overwhelming the RPC
      const batchSize = 5 // Adjust based on RPC capacity
      const l2DataList: L2Data[] = []

      for (let i = 0; i < chainAddresses.length; i += batchSize) {
        const batch = Array.from(
          { length: Math.min(batchSize, chainAddresses.length - i) },
          (_, j) => {
            const idx = i + j
            return this.processChain(chainAddresses[idx], chainIDs[idx])
          },
        )

        const results = await Promise.all(batch)
        l2DataList.push(
          ...results.filter((data): data is L2Data => data !== null),
        )
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
    } catch (error) {
      console.error(
        `error fetching data: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }

  // Configuration methods remain the same
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
