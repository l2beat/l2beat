import { writeFileSync } from 'fs'
import path, { join } from 'path'
import { ConfigReader } from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
  EoaParameters,
  ReceivedPermission,
} from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'

export type Permission = ReceivedPermission & { to: EthereumAddress }

export class ClingoExporter {
  private readonly discoveries: DiscoveryOutput[]
  private addressToNameMap: Record<EthereumAddress, string> = {}
  private contracts: ContractParameters[] = []
  private eoas: EoaParameters[] = []

  constructor(
    public readonly projectName: string,
    public readonly chain: string = 'ethereum',
    private readonly rootPath = join(process.cwd(), '../config'),
  ) {
    const configReader = new ConfigReader(rootPath)
    const discovery = configReader.readDiscovery(projectName, chain)
    this.discoveries = [
      discovery,
      ...(discovery.sharedModules ?? []).map((module) =>
        configReader.readDiscovery(module, chain),
      ),
    ]
    this.contracts = this.discoveries.flatMap(
      (discovery) => discovery.contracts,
    )
    this.eoas = this.discoveries.flatMap((discovery) => discovery.eoas)
    this.addressToNameMap = this.buildAddressToNameMap()
  }

  private buildAddressToNameMap(): Record<EthereumAddress, string> {
    const result: Record<EthereumAddress, string> = {}
    const allNames = new Set<string>()
    for (const contract of this.contracts) {
      const name = !allNames.has(contract.name)
        ? contract.name
        : contract.name + '_' + contract.address.substring(0, 6)
      result[contract.address] = decapitalizeFirstLetter(name)
      allNames.add(result[contract.address])
    }
    for (const eoa of this.eoas) {
      result[eoa.address] = eoa.name ?? 'eoa_' + eoa.address.substring(0, 6)
    }
    return result
  }

  generateClingo(): string {
    const result = ['#include "../../../clingo/common.lp".', '']
    const directPermissionsPerContract: Record<EthereumAddress, Permission[]> =
      {}
    for (const contract of this.contracts) {
      for (const permission of contract.directlyReceivedPermissions ?? []) {
        directPermissionsPerContract[permission.from] ??= []
        directPermissionsPerContract[permission.from].push({
          ...permission,
          to: contract.address,
        })
      }
      for (const permission of contract.receivedPermissions ?? []) {
        if ((permission.via ?? []).length === 0) {
          directPermissionsPerContract[permission.from] ??= []
          directPermissionsPerContract[permission.from].push({
            ...permission,
            to: contract.address,
          })
        }
      }
    }
    for (const contract of this.contracts) {
      const template = contract.template
      if (template) {
        result.push(`% template: ${template}`)
      } else {
        result.push('% no template')
      }
      const threshold = contract.values?.['$threshold']
      if (threshold !== undefined) {
        const owners =
          (contract.values?.['$members'] as EthereumAddress[]) ?? []
        result.push(
          `msig(${this.addressToNameMap[contract.address]}, ${threshold}).`,
        )
        result.push(
          `member(${this.addressToNameMap[contract.address]}, (\n  ${owners.map((a) => this.addressToNameMap[a]).join(';\n  ')}\n)).`,
        )
      } else {
        result.push(`contract(${this.addressToNameMap[contract.address]}).`)
      }
      const directlyReceivedPermissions =
        directPermissionsPerContract[contract.address] ?? []
      for (const permission of directlyReceivedPermissions) {
        result.push(
          `permission(${this.addressToNameMap[permission.to]}, ${permission.permission}, ${this.addressToNameMap[permission.from]}, ${permission.delay ?? 0}, nil).`,
        )
      }
      result.push('')
    }
    for (const eoa of this.eoas) {
      result.push(`eoa(${this.addressToNameMap[eoa.address]}).`)
    }
    return result.join('\n')
  }

  saveClingo() {
    const filePath = path.join(
      this.rootPath,
      'discovery',
      this.projectName,
      this.chain,
      'relations.lp',
    )
    writeFileSync(filePath, this.generateClingo())
    console.log(`Saved clingo file to ${filePath}`)
  }
}

function decapitalizeFirstLetter(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}
