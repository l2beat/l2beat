import { readFileSync } from 'fs'
import { join } from 'path'
import {
  type EntryParameters,
  KnowledgeBase,
  ModelIdRegistry,
  type Permission,
  parseExportedFacts,
} from '@l2beat/discovery'
import { EthereumAddress, formatSeconds } from '@l2beat/shared-pure'
import { BulletListBuilder } from './BulletListBuilder'
import type { PermissionRegistry } from './PermissionRegistry'
import type { ProjectDiscovery } from './ProjectDiscovery'
import { formatPermissionDelay, trimTrailingDots } from './utils'
import { UltimatePermissionToPrefix } from './descriptions'

export interface TransitivePermissionFact {
  atom: 'transitivePermission'
  params: [
    string,
    string,
    string,
    number,
    string | undefined,
    number,
    TransitivePermissionVia[] | undefined,
    'isFinal' | 'nonFinal',
  ]
}

type ParsedTransitivePermissionFact = ReturnType<
  typeof parseTransitivePermissionFact
>

function orUndefined<V, C>(
  caster: (value: V) => C,
  value: V | undefined,
): C | undefined {
  return value === undefined ? undefined : caster(value)
}

export function parseTransitivePermissionFact(fact: TransitivePermissionFact) {
  return {
    from: String(fact.params[0]),
    permission: String(fact.params[1]) as Permission,
    giver: String(fact.params[2]),
    delay: Number(fact.params[3]),
    description: orUndefined(String, fact.params[4]),
    totalDelay: Number(fact.params[5]),
    viaList: fact.params[6]?.map(parseTransitivePermissionVia) ?? undefined,
    isFinal: fact.params[7] === 'isFinal',
  }
}

interface TransitivePermissionVia {
  atom: 'tuple'
  params: [string, string, number]
}

type ParsedTransitivePermissionVia = ReturnType<
  typeof parseTransitivePermissionVia
>

export function parseTransitivePermissionVia(via: TransitivePermissionVia) {
  return {
    contract: String(via.params[0]),
    permission: String(via.params[1]),
    delay: Number(via.params[2]),
  }
}

export interface GroupedTransitivePermissionFact {
  atom: 'transitivePermission'
  params: [
    string,
    string,
    string[],
    number,
    string | undefined,
    number,
    TransitivePermissionVia[] | undefined,
    'isFinal' | 'nonFinal',
  ]
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

  describePermissions(contractOrEoa: EntryParameters): string[] {
    const id = this.modelIdRegistry.getModelId(
      this.projectDiscovery.chain,
      contractOrEoa.address,
    )
    const upgradeFacts = this.knowledgeBase.getFacts(
      'filteredTransitivePermission',
      [id],
    ) as TransitivePermissionFact[]
    const result =
      upgradeFacts.length > 0
        ? this.renderNonInteractPermission(
            upgradeFacts.map(parseTransitivePermissionFact),
          )
        : ''
    return [this.modelIdRegistry.replaceIdsWithNames(result).slice(1)]
  }

  renderNonInteractPermission(facts: ParsedTransitivePermissionFact[]): string {
    // sort by permission, then by total delay
    facts.sort((a, b) => {
      if (a.permission !== b.permission) {
        return a.permission.localeCompare(b.permission)
      }
      return a.totalDelay - b.totalDelay
    })
    const result = new BulletListBuilder()
    let currentPermission: Permission | undefined
    let currentDelay: number | undefined

    for (const fact of facts) {
      // Check if we have a new permission type
      if (fact.permission !== currentPermission) {
        currentPermission = fact.permission
        currentDelay = undefined
        result.resetIndent(0)
        result.addItem(
          UltimatePermissionToPrefix[currentPermission] ??
            `has ${currentPermission} permission`,
        )
        result.indent()
      }

      // Check if we have a new delay
      if (fact.totalDelay !== currentDelay) {
        currentDelay = fact.totalDelay
        result.resetIndent(1)
        result.addItem(
          currentDelay === 0
            ? '(with no delay)'
            : `**(${formatPermissionDelay(currentDelay)})**`,
        )
        result.indent()
      }

      let value = `@@${fact.giver}`
      if (fact.description !== undefined) {
        value += ' ' + trimTrailingDots(fact.description)
      }
      if (fact.viaList !== undefined && fact.viaList?.length > 0) {
        value += ` [via: - acting via ${fact.viaList.map(renderTransitivePermissionVia).join(', ')}]`
      }
      result.addItem(value)
    }

    return result.renderMd({ mergeSingleSubpoints: true })
    // return result.renderMd()
  }

  getUpgradableBy(
    contract: EntryParameters,
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

function renderTransitivePermissionVia(
  via: ParsedTransitivePermissionVia,
): string {
  if (via.delay === 0) {
    return `@@${via.contract}`
  }
  return `@@${via.contract} ${formatPermissionDelay(via.delay)}`
}
