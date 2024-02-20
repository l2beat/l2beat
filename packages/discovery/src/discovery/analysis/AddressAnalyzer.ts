import { assert } from '@l2beat/backend-tools'
import {
  ContractParameters,
  ContractValue,
  UpgradeabilityParameters,
} from '@l2beat/discovery-types'
import { isEqual } from 'lodash'

import { EthereumAddress } from '../../utils/EthereumAddress'
import { UnixTime } from '../../utils/UnixTime'
import { ContractOverrides } from '../config/DiscoveryOverrides'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { HandlerExecutor } from '../handlers/HandlerExecutor'
import { DiscoveryProvider } from '../provider/DiscoveryProvider'
import { ProxyDetector } from '../proxies/ProxyDetector'
import {
  PerContractSource,
  SourceCodeService,
} from '../source/SourceCodeService'
import { getRelatives } from './getRelatives'

export type Analysis = AnalyzedContract | AnalyzedEOA

export interface AnalyzedContract {
  type: 'Contract'
  address: EthereumAddress
  name: string
  deploymentTimestamp?: UnixTime
  deploymentBlockNumber?: number
  derivedName: string | undefined
  isVerified: boolean
  upgradeability: UpgradeabilityParameters
  implementations: EthereumAddress[]
  values: Record<string, ContractValue>
  errors: Record<string, string>
  abis: Record<string, string[]>
  source: PerContractSource[]
}

export interface AnalyzedEOA {
  type: 'EOA'
  address: EthereumAddress
}

export class AddressAnalyzer {
  constructor(
    private readonly provider: DiscoveryProvider,
    private readonly proxyDetector: ProxyDetector,
    private readonly sourceCodeService: SourceCodeService,
    private readonly handlerExecutor: HandlerExecutor,
    private readonly logger: DiscoveryLogger,
  ) {}

  async analyze(
    address: EthereumAddress,
    overrides: ContractOverrides | undefined,
    blockNumber: number,
    logger: DiscoveryLogger,
  ): Promise<{ analysis: Analysis; relatives: EthereumAddress[] }> {
    const code = await this.provider.getCode(address, blockNumber)
    if (code.length === 0) {
      logger.logEoa()
      return { analysis: { type: 'EOA', address }, relatives: [] }
    }

    const deployment = await this.provider.getDeploymentInfo(address)

    const proxy = await this.proxyDetector.detectProxy(
      address,
      blockNumber,
      logger,
      overrides?.proxyType,
    )

    const sources = await this.sourceCodeService.getSources(
      address,
      proxy?.implementations,
    )

    logger.logName(sources.name)

    const { results, values, errors } = await this.handlerExecutor.execute(
      address,
      sources.abi,
      overrides,
      blockNumber,
      logger,
    )

    return {
      analysis: {
        type: 'Contract',
        name: overrides?.name ?? sources.name,
        derivedName: overrides?.name !== undefined ? sources.name : undefined,
        isVerified: sources.isVerified,
        address,
        deploymentTimestamp: deployment?.timestamp,
        deploymentBlockNumber: deployment?.blockNumber,
        upgradeability: proxy?.upgradeability ?? { type: 'immutable' },
        implementations: proxy?.implementations ?? [],
        values: values ?? {},
        errors: errors ?? {},
        abis: sources.abis,
        source: sources.sources,
      },
      relatives: getRelatives(
        results,
        overrides?.ignoreRelatives,
        proxy?.relatives,
        proxy?.implementations,
      ),
    }
  }

  async hasContractChanged(
    contract: ContractParameters,
    overrides: ContractOverrides,
    blockNumber: number,
    abis: Record<string, string[]>,
  ): Promise<boolean> {
    if (contract.unverified) {
      // Check if the contract is verified now
      const { isVerified } = await this.sourceCodeService.getSources(
        contract.address,
        contract.implementations,
      )
      return isVerified
    }

    const abi = this.sourceCodeService.getRelevantAbi(
      abis,
      contract.address,
      contract.implementations,
      overrides.ignoreInWatchMode,
    )

    const { values: newValues, errors } = await this.handlerExecutor.execute(
      contract.address,
      abi,
      overrides,
      blockNumber,
      this.logger,
    )

    assert(
      errors === undefined || Object.keys(errors).length === 0,
      'Errors during watch mode',
    )

    const prevRelevantValues = getRelevantValues(
      contract.values ?? {},
      overrides.ignoreInWatchMode ?? [],
    )

    if (!isEqual(newValues, prevRelevantValues)) {
      this.logger.log(
        `Some values changed on contract ${
          contract.name
        }(${contract.address.toString()})`,
      )
      return true
    }

    return false
  }

  async hasEoaBecomeContract(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<boolean> {
    const code = await this.provider.getCode(address, blockNumber)
    if (code.length > 0) {
      this.logger.log(`EOA ${address.toString()} became a contract`)
      return true
    }

    return false
  }
}

function getRelevantValues(
  contractValues: Record<string, ContractValue | undefined>,
  ignoreInWatchMode: string[],
): Record<string, ContractValue | undefined> {
  return Object.keys(contractValues)
    .filter((key) => !ignoreInWatchMode.includes(key))
    .reduce((obj: Record<string, ContractValue | undefined>, key: string) => {
      obj[key] = contractValues[key]
      return obj
    }, {})
}
