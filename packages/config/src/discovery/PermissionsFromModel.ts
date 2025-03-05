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
import { notUndefined } from '@l2beat/shared-pure'
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

  getPermissionedContracts(): ContractParameters[] {
    const chain = this.projectDiscovery.chain
    const getContractByAddress =
      this.projectDiscovery.getContractByAddress.bind(this.projectDiscovery)
    const getAddressData = this.modelIdRegistry.getAddressData.bind(
      this.modelIdRegistry,
    )
    return this.knowledgeBase
      .getFacts('showContractInPermissionsSection') // TODO: simply use permission facts
      .map((fact) => getAddressData(fact.params[0] as string))
      .filter((data) => data.chain === chain)
      .map((data) => getContractByAddress(data.address))
      .filter(notUndefined)
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return (b.category?.priority ?? 0) - (a.category?.priority ?? 0)
        // return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })
  }

  getPermissionedEoas(): EoaParameters[] {
    const chain = this.projectDiscovery.chain
    const getEOAByAddress = this.projectDiscovery.getEOAByAddress.bind(
      this.projectDiscovery,
    )
    const getAddressData = this.modelIdRegistry.getAddressData.bind(
      this.modelIdRegistry,
    )
    return this.knowledgeBase
      .getFacts('showEoaInPermissionsSection')
      .map((fact) => getAddressData(fact.params[0] as string))
      .filter((data) => data.chain === chain)
      .map((data) => getEOAByAddress(data.address))
      .filter(notUndefined)
      .filter((e) => (e.category?.priority ?? 0) >= 0)
      .sort((a, b) => {
        return (b.category?.priority ?? 0) - (a.category?.priority ?? 0)
        // return this.getPermissionPriority(b) - this.getPermissionPriority(a)
      })
  }

  describePermissions(
    contractOrEoa: ContractParameters | EoaParameters,
    _includeDirectPermissions: boolean = true, // TODO: do we need this?
  ): string[] {
    const id = this.modelIdRegistry.getModelId(
      this.projectDiscovery.chain,
      contractOrEoa.address,
    )
    const transitivePermissionFacts = this.knowledgeBase.getFacts(
      'filteredTransitivePermission',
      [id],
    )
    const grouped = groupFacts(transitivePermissionFacts, 2)
    const result: string[] = []
    for (const fact of grouped) {
      const rendered = this.renderGroupedTransitivePermissionFact(
        fact as GroupedTransitivePermissionFact,
      )
      result.push(this.modelIdRegistry.replaceIdsWithNames(rendered))
    }
    return result
  }

  renderGroupedTransitivePermissionFact(
    fact: GroupedTransitivePermissionFact,
  ): string {
    const result: string[] = []
    const permission = fact.params[1] as Permission
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
      result.push(fact.params[2].map((x) => `@@${x}`).join(', '))
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
}

function renderTransitivePermissionVia(via: TransitivePermissionVia): string {
  const delay = Number(via.params[2])
  if (delay === 0) {
    return `@@${via.params[0]}`
  }
  return `@@${via.params[0]} ${formatPermissionDelay(delay)}`
}
