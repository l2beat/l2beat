import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { expect } from 'earl'
import { existsSync, readdirSync } from 'fs'
import path from 'path'
import {
  loadOssificationInfo,
  readOssificationJson,
} from './loadOssificationInfo'

const PROJECTS_ROOT = path.join(__dirname, '../projects')

/**
 * ossification.json is hand-curated evidence. A malformed entry is not an
 * error at runtime — an unresolvable contract or update id is silently
 * ignored — so its shape and every reference it makes are pinned here.
 */
describe('ossification.json', () => {
  const configReader = new ConfigReader(getDiscoveryPaths().discovery)
  const projects = readdirSync(PROJECTS_ROOT).filter((project) =>
    existsSync(path.join(PROJECTS_ROOT, project, 'ossification.json')),
  )

  it('is present for at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  for (const project of projects) {
    describe(project, () => {
      const ossification = readOssificationJson(project)
      if (ossification === undefined) throw new Error('unreachable')

      const currentCritical = new Set<string>()
      for (const id of [project, ...(ossification.includeProjects ?? [])]) {
        it(`includes an existing discovery project: ${id}`, () => {
          expect(
            existsSync(path.join(PROJECTS_ROOT, id, 'discovered.json')),
          ).toEqual(true)
        })
        if (!existsSync(path.join(PROJECTS_ROOT, id, 'discovered.json'))) {
          continue
        }
        for (const entry of configReader.readDiscovery(id).entries) {
          if (entry.type === 'Contract' && entry.critical === true) {
            currentCritical.add(entry.address.toString().toLowerCase())
          }
        }
      }
      const historicalCritical = new Set(
        (ossification.historicalContracts ?? [])
          .filter((contract) => contract.critical === true)
          .map((contract) => contract.address.toLowerCase()),
      )

      it('attributes every event to a contract in the perimeter it names', () => {
        const unresolved = (ossification.criticalEvents ?? [])
          .filter(
            (event) =>
              event.contract !== undefined &&
              !(event.historical ? historicalCritical : currentCritical).has(
                event.contract.toLowerCase(),
              ),
          )
          .map((event) => `${event.contract} (${event.source})`)
        expect(unresolved).toEqual([])
      })

      it('keeps historical contracts out of the current perimeter', () => {
        // a historical entry for a contract that is critical today is inert:
        // the runtime takes the live contract and ignores the ledger
        expect(
          [...historicalCritical].filter((address) =>
            currentCritical.has(address),
          ),
        ).toEqual([])
      })

      it('yields a perimeter with a known clock', () => {
        expect(loadOssificationInfo(project)).not.toEqual(undefined)
      })
    })
  }
})
