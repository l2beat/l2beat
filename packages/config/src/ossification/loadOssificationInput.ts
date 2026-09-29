import {
  type ColorConfig,
  type ColorContract,
  type ConfigReader,
  type CriticalFlag,
  type DiffHistoryChange,
  DiffHistoryParser,
  type DiscoveryOutput,
  type EntryParameters,
  getDiffHistoryChanges,
  getDiscoveryPaths,
  makeEntryColorConfig,
  TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress, type UnixTime } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import {
  type CriticalOverride,
  getOssificationInput,
  type OssificationJudgement,
} from './getOssificationInput'
import type { OssificationInput } from './OssificationInput'
import {
  EMPTY_OSSIFICATION_PATCH,
  OssificationPatch,
} from './OssificationPatch'

let templateService: TemplateService | undefined

export function loadOssificationInput(
  discovery: DiscoveryOutput,
  reachable: ReadonlySet<ChainSpecificAddress>,
  configReader: ConfigReader,
  now: UnixTime,
  projectStart?: number,
): OssificationInput | undefined {
  const outOfReach = new Set(
    discovery.entries
      .filter((e) => !reachable.has(e.address))
      .map((e) => e.address.toLowerCase()),
  )
  const withinReach = (address: string) =>
    !outOfReach.has(address.toLowerCase())

  const entries = discovery.entries.filter((e) => withinReach(e.address))
  const color = configReader.readConfig(discovery.name).color
  const overrides = getCriticalOverrides(color).filter((o) =>
    withinReach(o.address),
  )
  if (
    overrides.length === 0 &&
    !entries.some((e) => e.critical !== undefined)
  ) {
    return undefined
  }

  const projectPath = configReader.getProjectPath(discovery.name)
  const patch = readPatch(join(projectPath, 'ossification.json'))
  return getOssificationInput({
    now,
    projectStart,
    entries,
    overrides,
    changes: readDiffHistory(join(projectPath, 'diffHistory.md')),
    judgement: new DiscoveryJudgement(
      getTemplateService(),
      color,
      discovery.entries,
    ),
    patch: {
      ...patch,
      events: patch.events.filter((e) => withinReach(e.contract)),
    },
  })
}

function getTemplateService(): TemplateService {
  templateService ??= new TemplateService(getDiscoveryPaths().discovery)
  return templateService
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
