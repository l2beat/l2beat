import {
  type ColorConfig,
  type ColorContract,
  ConfigReader,
  type CriticalFlag,
  type DiffHistoryChange,
  DiffHistoryParser,
  type EntryParameters,
  getDiffHistoryChanges,
  getDiscoveryPaths,
  makeEntryColorConfig,
  TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress, type UnixTime } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { ProjectOssification } from '../types'
import {
  type CriticalOverride,
  getOssificationInput,
  type OssificationJudgement,
} from './getOssificationInput'
import { measureOssification } from './measureOssification'
import type { OssificationInput } from './OssificationInput'
import {
  EMPTY_OSSIFICATION_PATCH,
  OssificationPatch,
} from './OssificationPatch'

interface DiscoveryServices {
  root: string
  configReader: ConfigReader
  templateService: TemplateService
}

let services: DiscoveryServices | undefined

export function loadOssification(
  projectId: string,
  now: UnixTime,
  projectStart?: number,
): ProjectOssification | undefined {
  const input = loadOssificationInput(projectId, now, projectStart)
  return input === undefined ? undefined : measureOssification(input)
}

export function loadOssificationInput(
  projectId: string,
  now: UnixTime,
  projectStart?: number,
): OssificationInput | undefined {
  const { root, configReader, templateService } = getServices()
  const projectPath = join(root, projectId)
  if (!existsSync(join(projectPath, 'discovered.json'))) return undefined

  const entries = configReader.readDiscovery(projectId).entries
  const color = configReader.readConfig(projectId).color
  const overrides = getCriticalOverrides(color)
  if (
    overrides.length === 0 &&
    !entries.some((e) => e.critical !== undefined)
  ) {
    return undefined
  }

  return getOssificationInput({
    now,
    projectStart,
    entries,
    overrides,
    changes: readDiffHistory(join(projectPath, 'diffHistory.md')),
    judgement: new DiscoveryJudgement(templateService, color, entries),
    patch: readPatch(join(projectPath, 'ossification.json')),
  })
}

function getServices(): DiscoveryServices {
  if (services === undefined) {
    const root = getDiscoveryPaths().discovery
    services = {
      root,
      configReader: new ConfigReader(root),
      templateService: new TemplateService(root),
    }
  }
  return services
}

function getCriticalOverrides(color: ColorConfig): CriticalOverride[] {
  return Object.entries(color.overrides ?? {}).flatMap(([address, contract]) =>
    contract.critical === undefined
      ? []
      : [
          {
            address,
            name: color.names?.[address] ?? contract.displayName,
            critical: contract.critical,
          },
        ],
  )
}

export function readPatch(file: string): OssificationPatch {
  if (!existsSync(file)) return EMPTY_OSSIFICATION_PATCH
  return OssificationPatch.parse(JSON.parse(readFileSync(file, 'utf-8')))
}

export function readDiffHistory(file: string): DiffHistoryChange[] {
  if (!existsSync(file)) return []
  return new DiffHistoryParser()
    .parse(readFileSync(file, 'utf-8'))
    .flatMap(getDiffHistoryChanges)
}

class DiscoveryJudgement implements OssificationJudgement {
  private readonly byAddress = new Map<string, EntryParameters>()

  constructor(
    private readonly templateService: TemplateService,
    private readonly color: ColorConfig,
    entries: EntryParameters[],
  ) {
    for (const entry of entries) {
      this.byAddress.set(entry.address.toString().toLowerCase(), entry)
    }
  }

  critical(
    address: string,
    template: string | undefined,
  ): CriticalFlag | undefined {
    const entry = this.byAddress.get(address.toLowerCase())
    if (entry !== undefined) return entry.critical
    return this.colorFor(address, template).critical
  }

  highSeverityFields(
    address: string,
    template: string | undefined,
  ): ReadonlySet<string> {
    const entry = this.byAddress.get(address.toLowerCase())
    const fields =
      entry !== undefined
        ? (entry.fieldMeta ?? {})
        : this.colorFor(address, template).fields
    return new Set(
      Object.entries(fields)
        .filter(([, field]) => field.severity === 'HIGH')
        .map(([name]) => name),
    )
  }

  private colorFor(
    address: string,
    template: string | undefined,
  ): ColorContract {
    const known =
      template !== undefined && this.templateService.exists(template)
    return makeEntryColorConfig(
      this.color,
      ChainSpecificAddress(address),
      this.templateService.loadContractTemplateColor(
        known ? template : undefined,
      ),
    )
  }
}
