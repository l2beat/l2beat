import { readFileSync } from 'fs'
import { join } from 'path'
import {
  type ContractParameters,
  type EoaParameters,
  KnowledgeBase,
  ModelIdRegistry,
  type Permission,
  parseExportedFacts,
} from '@l2beat/discovery'
import { groupFacts } from '@l2beat/discovery/dist/discovery/modelling/KnowledgeBase'
import { EthereumAddress, formatSeconds } from '@l2beat/shared-pure'
import type { PermissionRegistry } from './PermissionRegistry'
import type { ProjectDiscovery } from './ProjectDiscovery'
import {
  DirectPermissionToPrefix,
  UltimatePermissionToPrefix,
} from './descriptions'
import { formatPermissionDelay, trimTrailingDots } from './utils'

export interface GroupedTransitivePermissionFact {
  atom: 'transitivePermission'
  params: [
    string,
    string,
    string[],
    number,
    string | undefined,
    number,
    TransitivePermissionVia[],
    'isFinal' | 'nonFinal',
  ]
}

interface TransitivePermissionVia {
  atom: 'tuple'
  params: [string, string, number]
}

export const PermissionsRequiringTarget: Permission[] = [
  'interact',
  'upgrade',
  'act',
]

export class PermissionsFromModel implements PermissionRegistry {
  private knowledgeBase: KnowledgeBase
  private modelIdRegistry: ModelIdRegistry

  constructor(private readonly projectDiscovery: ProjectDiscovery) {
    const projectPath = this.projectDiscovery.configReader.getProjectPath(
      this.projectDiscovery.projectName,
    )
    const projectPageFactsPath = join(projectPath, 'projectPageFacts.json')
    const factsFile = readFileSync(projectPageFactsPath, 'utf8')
    this.knowledgeBase = new KnowledgeBase(parseExportedFacts(factsFile).facts)
    this.modelIdRegistry = new ModelIdRegistry(this.knowledgeBase)
  }

  getPermissionedContracts(): EthereumAddress[] {
    const chain = this.projectDiscovery.chain
    return this.knowledgeBase
      .getFacts('showContractInPermissionsSection')
      .map((fact) =>
        this.modelIdRegistry.getAddressData(fact.params[0] as string),
      )
      .filter((data) => data.chain === chain)
      .map((data) => EthereumAddress.from(data.address))
  }

  getPermissionedEoas(): EthereumAddress[] {
    const chain = this.projectDiscovery.chain
    return this.knowledgeBase
      .getFacts('showEoaInPermissionsSection')
      .map((fact) =>
        this.modelIdRegistry.getAddressData(fact.params[0] as string),
      )
      .filter((data) => data.chain === chain)
      .map((data) => EthereumAddress.from(data.address))
  }

  describePermissions(
    contractOrEoa: ContractParameters | EoaParameters,
    includeDirectPermissions: boolean = true,
  ): string[] {
    const id = this.modelIdRegistry.getModelId(
      this.projectDiscovery.chain,
      contractOrEoa.address,
    )
    const transitivePermissionFacts = this.knowledgeBase.getFacts(
      'filteredTransitivePermission',
      [id],
    )
    const grouped = groupFacts(
      transitivePermissionFacts,
      2,
    ) as GroupedTransitivePermissionFact[]
    const result: string[] = []
    for (const fact of grouped) {
      if (fact.params[7] === 'nonFinal' && !includeDirectPermissions) {
        continue
      }
      const rendered = this.renderGroupedTransitivePermissionFact(fact)
      result.push(this.modelIdRegistry.replaceIdsWithNames(rendered))
    }
    return result
  }

  renderGroupedTransitivePermissionFact(
    fact: GroupedTransitivePermissionFact,
  ): string {
    const result: string[] = []
    const permission = fact.params[1] as Permission
    const giver = fact.params[2]
    const delay = Number(fact.params[3])
    const description = fact.params[4]
    const _totalDelay = fact.params[5]
    const viaList = fact.params[6]
    const isFinal = fact.params[7]

    const permissionToPrefixMapping =
      isFinal === 'isFinal'
        ? UltimatePermissionToPrefix
        : DirectPermissionToPrefix

    result.push(
      permissionToPrefixMapping[permission] ??
        `has permission ${permission} from`,
    )
    if (PermissionsRequiringTarget.includes(permission)) {
      result.push(giver.map((x) => `@@${x}`).join(', '))
    }
    if (delay > 0) {
      result.push(formatPermissionDelay(delay))
    }
    if (description) {
      result.push('- ' + trimTrailingDots(description))
    }
    if (viaList !== null && viaList.length > 0) {
      const reversedViaList = [...viaList].reverse()
      result.push(
        `- acting via ${reversedViaList.map(renderTransitivePermissionVia).join(', ')}`,
      )
    }
    return result.join(' ') + '.'
  }

  getUpgradableBy(
    contract: ContractParameters,
  ): { name: string; delay: string }[] {
    const id = this.modelIdRegistry.getModelId(
      this.projectDiscovery.chain,
      contract.address,
    )
    const facts = this.knowledgeBase.getFacts('filteredTransitivePermission', [
      undefined,
      'upgrade',
      id,
    ])
    if (facts.length === 0) {
      return []
    }
    const upgradersWithDelay = facts
      .filter((fact) => fact.params[7] === 'isFinal')
      .map((fact) => {
        const name = this.modelIdRegistry.getAddressData(
          fact.params[0] as string,
        ).name as string
        const totalDelay = fact.params[5] as number
        return {
          name,
          delay: totalDelay === 0 ? 'no' : formatSeconds(totalDelay),
        }
      })
    return upgradersWithDelay
  }
}

function renderTransitivePermissionVia(via: TransitivePermissionVia): string {
  const delay = Number(via.params[2])
  if (delay === 0) {
    return `@@${via.params[0]}`
  }
  return `@@${via.params[0]} ${formatPermissionDelay(delay)}`
}
