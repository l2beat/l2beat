import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import path from 'path'
import {
  type AuditReportRef,
  type CollectionRef,
  CollectionsFile,
  ProjectAuditCoverage,
  ReportsFile,
  type UnitRecord,
  UnitRecord as UnitRecordSchema,
  type UnitResolution,
} from '../contract/schema.js'

interface StoreMeta {
  datasetRevision?: string
  resolutionVersion?: number
}

/** Bump whenever resolver semantics change so stale matches are not reused. */
const RESOLUTION_VERSION = 4

/**
 * Content-addressed output store:
 *   units/<unitHash>.json   one record per unique deployed unit
 *   projects/<slug>.json    thin per-project files referencing unit hashes
 *   reports.json            report metadata by global id
 *   collections.json        collection metadata
 *   meta.json               dataset and resolver versions for unit resolutions
 *
 * Resolutions are reused while both the dataset and resolver version are unchanged.
 */
export class UnitStore {
  private readonly units = new Map<string, UnitRecord>()
  private readonly dirty = new Set<string>()
  private readonly reports = new Map<string, AuditReportRef>()
  private readonly reusable: boolean

  constructor(
    readonly dir: string,
    private readonly datasetRevision: string | undefined,
  ) {
    mkdirSync(path.join(dir, 'units'), { recursive: true })
    mkdirSync(path.join(dir, 'projects'), { recursive: true })
    const meta = this.readMeta()
    this.reusable =
      datasetRevision !== undefined &&
      !datasetRevision.endsWith('-dirty') &&
      meta.datasetRevision === datasetRevision &&
      meta.resolutionVersion === RESOLUTION_VERSION
    const reportsFile = path.join(dir, 'reports.json')
    if (existsSync(reportsFile)) {
      const parsed = JSON.parse(
        readFileSync(reportsFile, 'utf8'),
      ) as ReportsFile
      for (const [id, ref] of Object.entries(parsed.reports)) {
        this.reports.set(id, ref)
      }
    }
  }

  /** An existing resolution for this unit in this context, when reusable. */
  getResolution(
    unitHash: string,
    contextKey: string,
  ): UnitResolution | undefined {
    if (!this.reusable) return this.units.get(unitHash)?.resolutions[contextKey]
    return this.load(unitHash)?.resolutions[contextKey]
  }

  putResolution(
    record: Omit<UnitRecord, 'schemaVersion' | 'resolutions'>,
    contextKey: string,
    resolution: UnitResolution,
  ) {
    const existing = this.reusable
      ? this.load(record.unitHash)
      : this.units.get(record.unitHash)
    const merged: UnitRecord = existing ?? {
      schemaVersion: 2,
      ...record,
      resolutions: {},
    }
    merged.resolutions[contextKey] = resolution
    this.units.set(record.unitHash, merged)
    this.dirty.add(record.unitHash)
  }

  addReport(ref: AuditReportRef) {
    this.reports.set(ref.id, ref)
  }

  writeProject(project: ProjectAuditCoverage) {
    ProjectAuditCoverage.parse(JSON.parse(JSON.stringify(project)))
    writeFileSync(
      path.join(this.dir, 'projects', `${project.slug}.json`),
      JSON.stringify(project, null, 2),
    )
  }

  /** Flushes changed unit records and the shared metadata files. */
  flush(collections: CollectionRef[]) {
    for (const hash of this.dirty) {
      const record = this.units.get(hash)
      if (!record) continue
      UnitRecordSchema.parse(JSON.parse(JSON.stringify(record)))
      writeFileSync(this.unitPath(hash), JSON.stringify(record))
    }
    this.dirty.clear()
    const reports: ReportsFile = {
      schemaVersion: 2,
      reports: Object.fromEntries(
        [...this.reports.entries()].sort(([a], [b]) => a.localeCompare(b)),
      ),
    }
    ReportsFile.parse(reports)
    writeFileSync(
      path.join(this.dir, 'reports.json'),
      JSON.stringify(reports, null, 2),
    )
    const collectionsFile: CollectionsFile = {
      schemaVersion: 2,
      collections: Object.fromEntries(
        collections
          .slice()
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((c) => [c.id, c]),
      ),
    }
    CollectionsFile.parse(collectionsFile)
    writeFileSync(
      path.join(this.dir, 'collections.json'),
      JSON.stringify(collectionsFile, null, 2),
    )
    writeFileSync(
      path.join(this.dir, 'meta.json'),
      JSON.stringify(
        {
          datasetRevision: this.datasetRevision,
          resolutionVersion: RESOLUTION_VERSION,
        } satisfies StoreMeta,
        null,
        2,
      ),
    )
  }

  /** Removes unit records no project file references. Returns the count. */
  static gc(dir: string): number {
    const referenced = new Set<string>()
    const projectsDir = path.join(dir, 'projects')
    if (existsSync(projectsDir)) {
      for (const file of readdirSync(projectsDir)) {
        if (!file.endsWith('.json')) continue
        const project = JSON.parse(
          readFileSync(path.join(projectsDir, file), 'utf8'),
        ) as ProjectAuditCoverage
        for (const contract of project.contracts) {
          for (const source of contract.files) {
            for (const unit of source.units) referenced.add(unit.unitHash)
          }
        }
      }
    }
    let removed = 0
    const unitsDir = path.join(dir, 'units')
    if (existsSync(unitsDir)) {
      for (const file of readdirSync(unitsDir)) {
        const hash = file.replace(/\.json$/, '')
        if (!referenced.has(hash)) {
          rmSync(path.join(unitsDir, file))
          removed++
        }
      }
    }
    return removed
  }

  private load(unitHash: string): UnitRecord | undefined {
    const inMemory = this.units.get(unitHash)
    if (inMemory) return inMemory
    const file = this.unitPath(unitHash)
    if (!existsSync(file)) return undefined
    try {
      const record = JSON.parse(readFileSync(file, 'utf8')) as UnitRecord
      this.units.set(unitHash, record)
      return record
    } catch {
      return undefined
    }
  }

  private unitPath(unitHash: string) {
    return path.join(this.dir, 'units', `${unitHash}.json`)
  }

  private readMeta(): StoreMeta {
    const file = path.join(this.dir, 'meta.json')
    if (!existsSync(file)) return {}
    try {
      return JSON.parse(readFileSync(file, 'utf8')) as StoreMeta
    } catch {
      return {}
    }
  }
}
