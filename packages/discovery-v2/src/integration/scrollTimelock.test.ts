import { Logger } from '@l2beat/backend-tools'
import {
  type EntryParameters,
  getChainConfigs,
  getDiscoveryPaths,
  rewriteSolidityIdentifier,
} from '@l2beat/discovery'
import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { selectGetters } from '../baseline/buildBaseline'
import { createContext } from '../commands/context'
import { FILE_NAMES, packageDir, readPrepared } from '../commands/files'
import { pipelineCommand } from '../commands/pipelineCommand'
import { loadEnv } from '../env/loadEnv'

/**
 * End-to-end against Ethereum: runs the pipeline with the hand-written
 * L1Timelock plan on Scroll's `TimelockSCEmergency` at the block its
 * committed `discovered.json` was produced at, and compares field by field
 * with that V1 entry. The block is pinned so the comparison is stable, and
 * V1's SQLite cache answers most calls. Two things are asserted: every V1
 * value that is a plain 0-arg getter equals the V2 baseline value (the
 * deterministic 93%), and the plan's `accessControl` equals V1's handler
 * output exactly (the recipe path). Skipped, with a message, when no
 * Ethereum RPC is configured after `loadEnv()`.
 */
describe('integration: scroll TimelockSCEmergency at block 25789575', function () {
  this.timeout(180_000)

  const CHAIN = 'ethereum'
  const ADDRESS = 'eth:0x0CD4c0F24a0A9f3E2Fe80ed385D8AD5a2FfECA44'
  const BLOCK = 25_789_575
  const PLAN = path.join(
    packageDir(),
    'plans',
    'manual',
    'scroll-L1Timelock.plan.json',
  )

  let runDir: string
  let v1: EntryParameters
  let v2: EntryParameters
  let getterNames: string[]

  before(async function () {
    loadEnv()
    if (!getChainConfigs().some((config) => config.name === CHAIN)) {
      console.log(
        '    (skipping: ETHEREUM_RPC_URL is not set; see env/loadEnv.ts)',
      )
      this.skip()
    }
    v1 = readV1Entry()
    runDir = fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-v2-scroll-'))
    const result = await pipelineCommand(
      createContext({ logger: Logger.SILENT }),
      {
        chain: CHAIN,
        address: ADDRESS,
        blockNumber: BLOCK,
        planFile: PLAN,
        out: runDir,
      },
    )
    v2 = result.output.entry
    const prepared = readPrepared(path.join(runDir, FILE_NAMES.prepared))
    getterNames = selectGetters(prepared.abi).map((fragment) =>
      rewriteSolidityIdentifier(fragment.name),
    )
    expect(result.planStatus).toEqual('ok')
    expect(prepared.blockNumber).toEqual(BLOCK)
  })

  after(() => {
    if (runDir !== undefined) {
      fs.rmSync(runDir, { recursive: true, force: true })
    }
  })

  it('reproduces the V1 entry facts: source hash, proxy type, deployment, implementation names', () => {
    expect(v2.sourceHashes).toEqual(v1.sourceHashes)
    expect(v2.proxyType).toEqual(v1.proxyType)
    expect(v2.deployerAddress).toEqual(v1.deployerAddress)
    expect(v2.sinceTimestamp).toEqual(v1.sinceTimestamp)
    expect(v2.sinceBlock).toEqual(v1.sinceBlock)
    expect(v2.implementationNames).toEqual(v1.implementationNames)
    expect(v2.errors).toEqual(undefined)
  })

  it('equals V1 on every value that is a plain 0-arg getter, plus the proxy $ values', () => {
    const v1Values = v1.values ?? {}
    const compared = Object.keys(v1Values).filter(
      (field) => getterNames.includes(field) || field.startsWith('$'),
    )
    expect(compared.length).toBeGreaterThanOrEqual(7)
    for (const field of compared) {
      expect(v2.values?.[field]).toEqual(v1Values[field])
    }
  })

  it('reproduces the V1 accessControl handler output from RoleGranted/RoleRevoked/RoleAdminChanged logs', () => {
    expect(v2.values?.accessControl).toEqual(v1.values?.accessControl)
    expect(Object.keys(v2.values?.accessControl ?? {})).toEqual(
      Object.keys(v1.values?.accessControl ?? {}),
    )
  })

  it('leaves out only V1 template fields: derived role pickers and the formatted delay', () => {
    const v1Only = Object.keys(v1.values ?? {}).filter(
      (field) => !(field in (v2.values ?? {})),
    )
    expect(v1Only.sort()).toEqual([
      'Canceller',
      'Executor',
      'Proposer',
      'getMinDelayFormatted',
      'timelockAdminAC',
    ])
  })

  function readV1Entry(): EntryParameters {
    const file = path.join(
      getDiscoveryPaths().discovery,
      'scroll',
      'discovered.json',
    )
    const discovered = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      usedBlockNumbers: Record<string, number>
      entries: EntryParameters[]
    }
    expect(discovered.usedBlockNumbers[CHAIN]).toEqual(BLOCK)
    const entry = discovered.entries.find((e) => e.address === ADDRESS)
    if (entry === undefined) {
      throw new Error(`${ADDRESS} is not in ${file}`)
    }
    return entry
  }
})
