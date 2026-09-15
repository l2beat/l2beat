import { expect } from 'earl'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import type { ProjectAuditCoverage, UnitRecord } from '../contract/schema.js'
import { readDataset } from '../dataset/read.js'
import { ancestors } from '../dataset/registry.js'
import { Formatter } from '../deployed/format.js'
import { readDeployedProject } from '../deployed/read.js'
import {
  commonSuffixLength,
  EvidenceIndex,
  pathKey,
} from '../evidence/index.js'
import { PreparedUnitCache, prepareFile } from '../evidence/units.js'
import { generateProject } from '../generate.js'
import { buildContext } from '../resolve/context.js'
import { resolveUnit } from '../resolve/resolve.js'
import { UnitStore } from '../store/store.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(here, 'fixtures')
const DATASET = path.join(FIXTURES, 'dataset')
const PROJECTS = path.join(FIXTURES, 'projects')

function tmp(): string {
  return mkdtempSync(path.join(os.tmpdir(), 'audit-diff-test-'))
}

function evidence(cacheDir: string) {
  return new EvidenceIndex(
    readDataset(DATASET),
    new PreparedUnitCache(cacheDir),
  )
}

const noop = () => {}

describe('dataset', () => {
  it('reads projects and _libs as collections', () => {
    const dataset = readDataset(DATASET)
    expect(dataset.collections.map((c) => [c.id, c.kind])).toEqual([
      ['lib', 'library'],
      ['fork', 'project'],
      ['upstream', 'project'],
    ])
    expect(dataset.registry.repositories['forker/core']?.fork_of).toEqual(
      'acme/core',
    )
  })

  it('follows fork lineage transitively and stops on unknown repositories', () => {
    const { registry } = readDataset(DATASET)
    expect(ancestors(registry, 'forker/core')).toEqual(['acme/core'])
    expect(ancestors(registry, 'acme/core')).toEqual([])
    expect(ancestors(registry, 'nobody/nothing')).toEqual([])
  })
})

describe('deployed', () => {
  it('reads discovered contracts and locates flat files', () => {
    const project = readDeployedProject(PROJECTS, 'forkchain')
    expect(project.contractSelection).toEqual('all')
    expect(project.templates).toEqual(['acmestack/Vault'])
    const vault = project.contracts.find((c) => c.name === 'Vault')
    expect(vault?.sourceFiles.map((f) => f.role)).toEqual([
      'proxy',
      'implementation',
    ])
    const treasury = project.contracts.find((c) => c.name === 'Treasury')
    expect(treasury?.sourceFiles.length).toEqual(1)
    // EOAs are not contracts
    expect(project.contracts.length).toEqual(4)
  })
})

describe(EvidenceIndex.name, () => {
  const cache = tmp()
  after(() => rmSync(cache, { recursive: true, force: true }))

  it('indexes units by name, hash and repository', () => {
    const index = evidence(cache)
    expect(index.collectionsDeclaring('Vault')).toEqual(['upstream'])
    expect(index.collectionsDeclaring('Ownable')).toEqual(['lib'])
    expect(index.collectionsReferencing('acme/core')).toEqual(['upstream'])
    expect(index.hashIndex.size).toEqual(3)
  })

  it('caches prepared units by file hash', () => {
    evidence(cache)
    const dataset = readDataset(DATASET)
    const file = dataset.collections.find((c) => c.id === 'upstream')?.manifest
      .sources[0]?.files[0]
    expect(file?.sha256).not.toEqual(undefined)
    expect(existsSync(path.join(cache, `${file?.sha256}.json`))).toEqual(true)
  })

  it('computes path keys and common suffixes', () => {
    expect(pathKey('crates/prover/src/verify.rs')).toEqual('src/verify.rs')
    expect(
      commonSuffixLength(
        'a/crates/prover/src/verify.rs',
        'b/prover/src/verify.rs',
      ),
    ).toEqual(3)
    expect(commonSuffixLength('x/lib.rs', 'y/main.rs')).toEqual(0)
  })
})

describe('ranking context', () => {
  const cache = tmp()
  after(() => rmSync(cache, { recursive: true, force: true }))

  it('ranks own, upstream via lineage, stack via hints and libraries', () => {
    const index = evidence(cache)
    const context = buildContext(index, {
      projectId: 'fork',
      templates: ['acmestack/Vault'],
      collectionHints: { acmestack: 'upstream' },
    })
    expect(context.ranked.get('fork')?.origin).toEqual('own')
    expect(context.ranked.get('upstream')?.origin).toEqual('upstream')
    expect(context.ranked.get('upstream')?.relation).toEqual({
      type: 'fork_of',
      repository: 'acme/core',
    })
    expect(context.ranked.get('lib')?.origin).toEqual('library')
    expect(context.searchSet).toEqual(['fork', 'upstream'])
  })

  it('uses the stack hint when there is no own collection, and defaults to same-name vendors', () => {
    const index = evidence(cache)
    const hinted = buildContext(index, {
      projectId: 'nowhere',
      templates: ['acmestack/Vault'],
      collectionHints: { acmestack: 'upstream' },
    })
    expect(hinted.ranked.get('upstream')?.origin).toEqual('stack')
    const byName = buildContext(index, {
      projectId: 'nowhere',
      templates: ['upstream/Vault'],
      collectionHints: {},
    })
    expect(byName.ranked.get('upstream')?.origin).toEqual('stack')
    // The key depends on the ranked collections only, not on how they got there.
    expect(hinted.key).toEqual(byName.key)
  })
})

describe(resolveUnit.name, () => {
  const cache = tmp()
  after(() => rmSync(cache, { recursive: true, force: true }))

  function unitsOf(file: string) {
    return prepareFile(
      path.basename(file),
      readFileSync(path.join(PROJECTS, 'forkchain', '.flat', file), 'utf8'),
    )
  }

  it('matches identical code from any collection, comments and messages ignored', () => {
    const index = evidence(cache)
    const context = buildContext(index, {
      projectId: 'fork',
      templates: [],
      collectionHints: {},
    })
    const vault = unitsOf('Vault/Vault.sol').find((u) => u.name === 'Vault')
    const resolution = vault && resolveUnit(vault, index, context)
    expect(resolution?.matchedBy).toEqual('identity')
    expect(resolution?.collection).toEqual('upstream')
    expect(resolution?.selection.identical).toEqual(true)
  })

  it('matches a library unit by identity', () => {
    const index = evidence(cache)
    const context = buildContext(index, {
      projectId: 'fork',
      templates: [],
      collectionHints: {},
    })
    const ownable = unitsOf('Treasury.sol').find((u) => u.name === 'Ownable')
    const resolution = ownable && resolveUnit(ownable, index, context)
    expect(resolution?.collection).toEqual('lib')
    expect(resolution?.matchedBy).toEqual('identity')
  })

  it('finds a renamed unit in an upstream collection through the search set', () => {
    const index = evidence(cache)
    const context = buildContext(index, {
      projectId: 'fork',
      templates: [],
      collectionHints: {},
    })
    const treasury = unitsOf('Treasury.sol').find((u) => u.name === 'Treasury')
    const resolution = treasury && resolveUnit(treasury, index, context)
    expect(resolution?.matchedBy).toEqual('similarity')
    expect(resolution?.auditedName).toEqual('Vault')
    expect(resolution?.collection).toEqual('upstream')
    expect(resolution?.selection.identical).toEqual(false)
  })

  it('does not run the rename search outside the search set', () => {
    const index = evidence(cache)
    // No own collection and no hints: upstream is rank "other".
    const context = buildContext(index, {
      projectId: 'nowhere',
      templates: [],
      collectionHints: {},
    })
    const treasury = unitsOf('Treasury.sol').find((u) => u.name === 'Treasury')
    expect(treasury && resolveUnit(treasury, index, context)).toEqual(undefined)
  })

  it('returns nothing for unknown code', () => {
    const index = evidence(cache)
    const context = buildContext(index, {
      projectId: 'fork',
      templates: [],
      collectionHints: {},
    })
    const unknown = unitsOf('Unknown.sol').find((u) => u.name === 'Unknown')
    expect(unknown && resolveUnit(unknown, index, context)).toEqual(undefined)
  })
})

describe(generateProject.name, () => {
  const cache = tmp()
  const out = tmp()
  after(() => {
    rmSync(cache, { recursive: true, force: true })
    rmSync(out, { recursive: true, force: true })
  })

  function run(store: UnitStore) {
    const index = evidence(path.join(cache, 'units'))
    return generateProject({
      projectId: 'forkchain',
      projectsDir: PROJECTS,
      zkCacheDir: path.join(cache, 'zk'),
      evidence: index,
      store,
      // A forge binary that does not exist: sources are used as they are.
      formatter: new Formatter(
        DATASET,
        path.join(cache, 'fmt'),
        noop,
        'forge-missing',
      ),
      collectionHints: { acmestack: 'upstream' },
      config: { collection: 'fork' },
      datasetRevision: 'rev1',
      log: noop,
    })
  }

  it('writes a content-addressed store with provenance', () => {
    const store = new UnitStore(out, 'rev1')
    const project = run(store)
    store.writeProject(project)
    store.flush([{ id: 'fork', name: 'fork', kind: 'project' }])

    expect(project.schemaVersion).toEqual(2)
    expect(project.summary.units).toEqual({
      identical: 2, // Vault (ignored changes only), Extra
      library: 1, // Ownable
      differs: 1, // Treasury vs Vault
      unaudited: 2, // Proxy, Unknown
    })
    const byName = new Map(
      project.contracts
        .flatMap((c) => c.files.flatMap((f) => f.units))
        .map((u) => [u.name, u]),
    )
    expect(byName.get('Vault')?.match?.origin).toEqual('upstream')
    expect(byName.get('Vault')?.diffStats?.ignoredOnly).toEqual(true)
    expect(byName.get('Extra')?.match?.origin).toEqual('own')
    expect(byName.get('Ownable')?.status).toEqual('library')
    expect(byName.get('Treasury')?.match?.matchedBy).toEqual('similarity')
    expect(project.reportIds).toEqual([
      'fork/fork-audit',
      'lib/lib-audit',
      'upstream/upstream-audit',
    ])

    const written = JSON.parse(
      readFileSync(path.join(out, 'projects', 'forkchain.json'), 'utf8'),
    ) as ProjectAuditCoverage
    expect(written.slug).toEqual('forkchain')
    const vaultHash = byName.get('Vault')?.unitHash ?? ''
    const record = JSON.parse(
      readFileSync(path.join(out, 'units', `${vaultHash}.json`), 'utf8'),
    ) as UnitRecord
    expect(record.resolutions[project.context.key]?.status).toEqual('identical')
    expect(existsSync(path.join(out, 'reports.json'))).toEqual(true)
    expect(existsSync(path.join(out, 'collections.json'))).toEqual(true)
  })

  it('reuses stored resolutions for the same dataset revision and garbage collects', () => {
    const store = new UnitStore(out, 'rev1')
    const project = run(store)
    const vault = project.contracts
      .flatMap((c) => c.files.flatMap((f) => f.units))
      .find((u) => u.name === 'Vault')
    expect(
      store.getResolution(vault?.unitHash ?? '', project.context.key)?.status,
    ).toEqual('identical')
    expect(UnitStore.gc(out)).toEqual(0)
  })
})
