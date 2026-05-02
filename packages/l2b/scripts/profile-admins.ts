/* eslint-disable */
import { ConfigReader, TemplateService, type DiscoveryPaths } from '@l2beat/discovery'
import * as path from 'path'
import { ProjectAnalysis } from '../src/implementations/discovery-ui/defidisco/projectAnalysis'
import { CapitalAnalysisCalculator } from '../src/implementations/discovery-ui/defidisco/capitalAnalysis'

function ms(start: bigint): string {
  return (Number(process.hrtime.bigint() - start) / 1e6).toFixed(1)
}

const project = process.argv[2] ?? 'aave-v3'
const repoRoot = path.resolve(__dirname, '../../..')
const paths: DiscoveryPaths = {
  root: repoRoot,
  discovery: path.join(repoRoot, 'packages/config/src/projects'),
} as DiscoveryPaths

const configReader = new ConfigReader(paths.discovery)
const templateService = new TemplateService(paths.discovery)
const analysis = new ProjectAnalysis(paths, configReader, templateService, project)

// Monkey-patch CapitalAnalysisCalculator.analyzeFunctionCapital to time each call
const origFn = CapitalAnalysisCalculator.prototype.analyzeFunctionCapital
const stats: Array<{ contract: string; fn: string; ms: number; reachCount: number; isUpgrade: boolean }> = []
;(CapitalAnalysisCalculator.prototype as any).analyzeFunctionCapital = function (
  contract: string,
  contractName: string,
  fn: string,
  impact: any,
  owner?: string,
) {
  const t = process.hrtime.bigint()
  const result = origFn.call(this, contract, contractName, fn, impact, owner)
  const took = Number(process.hrtime.bigint() - t) / 1e6
  stats.push({
    contract,
    fn,
    ms: took,
    reachCount: result.reachableContracts?.length ?? 0,
    isUpgrade: result.isUpgrade ?? false,
  })
  return result
}

const t0 = process.hrtime.bigint()
const admins = analysis.getAdmins()
const total = ms(t0)

console.log('total getAdmins        ', total, 'ms')
console.log('total BFS calls         ', stats.length)
console.log('sum of BFS times        ', stats.reduce((s, x) => s + x.ms, 0).toFixed(1), 'ms')
console.log()

// Top 20 slowest BFS calls
stats.sort((a, b) => b.ms - a.ms)
console.log('--- top 20 slowest BFS calls ---')
for (const s of stats.slice(0, 20)) {
  console.log(`  ${s.ms.toFixed(1).padStart(8)} ms  reach=${s.reachCount.toString().padStart(4)} ${s.isUpgrade ? '[UPGR]' : '      '} ${s.fn} on ${s.contract}`)
}

console.log()
const upgrades = stats.filter(s => s.isUpgrade)
const nonUpgrades = stats.filter(s => !s.isUpgrade)
console.log(`upgrade BFS: ${upgrades.length} calls, sum=${upgrades.reduce((s, x) => s + x.ms, 0).toFixed(0)}ms, avg=${(upgrades.reduce((s, x) => s + x.ms, 0) / Math.max(1, upgrades.length)).toFixed(1)}ms`)
console.log(`other BFS:   ${nonUpgrades.length} calls, sum=${nonUpgrades.reduce((s, x) => s + x.ms, 0).toFixed(0)}ms, avg=${(nonUpgrades.reduce((s, x) => s + x.ms, 0) / Math.max(1, nonUpgrades.length)).toFixed(1)}ms`)

// Group by (contract, fn) — how much repetition is there?
const byKey = new Map<string, { count: number; totalMs: number }>()
for (const s of stats) {
  const k = `${s.contract}::${s.fn}`
  const e = byKey.get(k) ?? { count: 0, totalMs: 0 }
  e.count++
  e.totalMs += s.ms
  byKey.set(k, e)
}
const dups = [...byKey.values()].filter(e => e.count > 1)
console.log()
console.log(`unique (contract,fn) keys: ${byKey.size}`)
console.log(`keys called multiple times: ${dups.length}`)
console.log(`time spent on duplicate calls: ${dups.reduce((s, e) => s + e.totalMs * (e.count - 1) / e.count, 0).toFixed(0)}ms (could be cached)`)
