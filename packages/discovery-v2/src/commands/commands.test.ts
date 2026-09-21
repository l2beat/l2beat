import { Logger } from '@l2beat/backend-tools'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import type { Executed } from '../execute/executePlan'
import { planHash } from '../plans/planHash'
import {
  fixtureBaseline,
  fixturePrepared,
  fixtureWorklist,
  SELF,
} from '../testing/fixture'
import { fixturePlan } from '../testing/fixturePlan'
import { createContext } from './context'
import { FILE_NAMES, parseAddress, readPlan, writeJson } from './files'
import { outputCommand } from './outputCommand'
import { providerTarget } from './prepareCommand'
import { worklistCommand } from './worklistCommand'

/**
 * Runs the file-to-file commands against fixture files in a temporary
 * directory, with a context whose provider factory throws: the pure
 * commands must never reach for RPC. What is checked is the contract the
 * CLI and the pipeline rely on: where files land, that they are parsed
 * through their schemas, and how the plan status is derived.
 */
describe('commands', () => {
  let directory: string
  const ctx = createContext({
    logger: Logger.SILENT,
    createProviders: () => {
      throw new Error('pure commands must not create providers')
    },
  })

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-v2-run-'))
    writeJson(path.join(directory, FILE_NAMES.prepared), fixturePrepared())
    writeJson(path.join(directory, FILE_NAMES.baseline), fixtureBaseline())
  })

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true })
  })

  describe(worklistCommand.name, () => {
    it('writes worklist.json next to prepared.json by default', () => {
      const preparedFile = path.join(directory, FILE_NAMES.prepared)
      const { worklist, file } = worklistCommand(ctx, { preparedFile })
      expect(file).toEqual(path.join(directory, FILE_NAMES.worklist))
      expect(worklist).toEqual(fixtureWorklist())
      expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual(
        fixtureWorklist(),
      )
    })

    it('rejects a prepared.json that does not match the schema', () => {
      const preparedFile = path.join(directory, 'broken.json')
      writeJson(preparedFile, { chain: 'ethereum' })
      expect(() => worklistCommand(ctx, { preparedFile })).toThrow()
    })
  })

  describe(outputCommand.name, () => {
    const preparedFile = () => path.join(directory, FILE_NAMES.prepared)
    const baselineFile = () => path.join(directory, FILE_NAMES.baseline)

    it('without values marks the plan missing and still carries proxy and baseline values', () => {
      const { output, entryFile, metaFile } = outputCommand(ctx, {
        preparedFile: preparedFile(),
        baselineFile: baselineFile(),
      })
      expect(entryFile).toEqual(path.join(directory, FILE_NAMES.entry))
      expect(metaFile).toEqual(path.join(directory, FILE_NAMES.entryMeta))
      expect(output.meta.planStatus).toEqual('missing')
      expect(output.meta.planHash).toEqual(undefined)
      expect(output.entry.values?.$implementation).toEqual(
        fixturePrepared().proxy.values.$implementation,
      )
      expect(output.entry.values?.owner).toEqual(
        fixtureBaseline().fields.owner?.value,
      )
      expect(output.entry.errors).toEqual({ paused: 'Execution reverted' })
    })

    it('with values and a plan takes the status from values.json and hashes the plan', () => {
      const executed: Executed = {
        fields: {
          validators: {
            value: ['eth:0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa'],
          },
          committeeThresholds: { error: 'boom' },
        },
        raw: {},
        status: 'partial',
      }
      const valuesFile = writeJson(
        path.join(directory, FILE_NAMES.values),
        executed,
      )
      const planFile = writeJson(
        path.join(directory, FILE_NAMES.plan),
        fixturePlan(),
      )
      const { output } = outputCommand(ctx, {
        preparedFile: preparedFile(),
        baselineFile: baselineFile(),
        valuesFile,
        planFile,
      })
      expect(output.meta.planStatus).toEqual('partial')
      expect(output.meta.planHash).toEqual(planHash(fixturePlan()))
      expect(output.meta.stepCount).toEqual(fixturePlan().steps.length)
      expect(output.meta.failedSteps).toEqual(['committeeThresholds'])
      expect(output.entry.values?.validators).toEqual([
        'eth:0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa',
      ])
    })

    it('lets the caller force a status, for the failed-validation case', () => {
      const planFile = writeJson(
        path.join(directory, FILE_NAMES.plan),
        fixturePlan(),
      )
      const { output } = outputCommand(ctx, {
        preparedFile: preparedFile(),
        baselineFile: baselineFile(),
        planFile,
        status: 'failed',
        out: path.join(directory, 'elsewhere'),
      })
      expect(output.meta.planStatus).toEqual('failed')
      expect(
        fs.existsSync(path.join(directory, 'elsewhere', FILE_NAMES.entry)),
      ).toEqual(true)
    })
  })

  describe(readPlan.name, () => {
    it('accepts a bare plan and a stored { plan, provenance } file alike', () => {
      const bare = writeJson(path.join(directory, 'bare.json'), fixturePlan())
      const stored = writeJson(path.join(directory, 'stored.json'), {
        plan: fixturePlan(),
        provenance: { source: 'manual', createdAt: '2026-09-21T00:00:00Z' },
      })
      expect(readPlan(bare)).toEqual(fixturePlan())
      expect(readPlan(stored)).toEqual(fixturePlan())
    })

    it('names the file when the plan fails the schema', () => {
      const file = writeJson(path.join(directory, 'bad.json'), { version: 2 })
      expect(() => readPlan(file)).toThrow(/bad\.json: invalid plan/)
    })
  })

  describe(parseAddress.name, () => {
    it('prefixes a bare address with the chain and accepts a matching prefixed one', () => {
      const raw = ChainSpecificAddress.address(SELF).toString()
      expect(parseAddress('ethereum', raw)).toEqual(SELF)
      expect(parseAddress('ethereum', SELF.toString())).toEqual(SELF)
    })

    it('refuses a prefixed address on another chain', () => {
      expect(() => parseAddress('arbitrum', SELF.toString())).toThrow(
        /is not on arbitrum/,
      )
    })
  })

  describe(providerTarget.name, () => {
    it('prefers the block, then the timestamp, then now', () => {
      expect(providerTarget({ blockNumber: 5, timestamp: 7 })).toEqual({
        blockNumber: 5,
      })
      expect(providerTarget({ timestamp: 7 })).toEqual({ timestamp: 7 })
      const now = providerTarget({})
      expect('timestamp' in now && now.timestamp > 1_700_000_000).toEqual(true)
    })
  })
})
