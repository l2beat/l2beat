/* eslint-disable */
import { ConfigReader, TemplateService, type DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import { ProjectAnalysis } from '../src/implementations/discovery-ui/defidisco/projectAnalysis'

const project = process.argv[2] ?? 'aave-v3'
const repoRoot = path.resolve(__dirname, '../../..')
const paths: DiscoveryPaths = {
  root: repoRoot,
  discovery: path.join(repoRoot, 'packages/config/src/projects'),
} as DiscoveryPaths

const configReader = new ConfigReader(paths.discovery)
const templateService = new TemplateService(paths.discovery)
const analysis = new ProjectAnalysis(paths, configReader, templateService, project)

const a = analysis.getAdmins()

// Headline stats
const sumDirect = a.admins.reduce((s, x) => s + x.totalDirectCapital, 0)
const sumReach = a.admins.reduce((s, x) => s + x.totalReachableCapital, 0)
const sumDirectTok = a.admins.reduce((s, x) => s + x.totalDirectTokenValue, 0)
const sumReachTok = a.admins.reduce((s, x) => s + x.totalReachableTokenValue, 0)
const totalFns = a.admins.reduce((s, x) => s + x.functions.length, 0)
const totalReach = a.admins.reduce((s, x) => s + x.functions.reduce((t, f) => t + f.reachableContracts.length, 0), 0)

console.log(`admins:              ${a.admins.length}`)
console.log(`total functions:     ${totalFns}`)
console.log(`total reachableEntries: ${totalReach}`)
console.log(`sum totalDirectCapital:    $${sumDirect.toFixed(0)}`)
console.log(`sum totalReachableCapital: $${sumReach.toFixed(0)}`)
console.log(`sum totalDirectTokenValue: $${sumDirectTok.toFixed(0)}`)
console.log(`sum totalReachableTokenValue: $${sumReachTok.toFixed(0)}`)

// Per-admin checksum: hash of (address, totalDirectCapital, totalReachableCapital, fn count, sum of fn directFundsUsd)
console.log()
console.log('per-admin checksum (top 5 by reachable capital):')
const sorted = [...a.admins].sort((x, y) => y.totalReachableCapital - x.totalReachableCapital).slice(0, 5)
for (const adm of sorted) {
  const rcSum = adm.functions.reduce((s, f) => s + f.reachableContracts.length, 0)
  console.log(`  ${adm.address}  fns=${adm.functions.length}  reach=${rcSum}  direct=$${adm.totalDirectCapital.toFixed(0)}  reachable=$${adm.totalReachableCapital.toFixed(0)}`)
}

// Compare to existing compiled-review.json
const existingPath = path.join(repoRoot, 'packages/defiscan-frontend/public/data', project, 'compiled-review.json')
if (fs.existsSync(existingPath)) {
  const old = JSON.parse(fs.readFileSync(existingPath, 'utf8'))
  console.log()
  console.log('=== existing compiled-review.json ===')
  console.log(`admins:              ${old.admins.length}`)
  console.log(`total functions:     ${old.admins.reduce((s: number, x: any) => s + x.functions.length, 0)}`)
  console.log(`total reachableEntries: ${old.admins.reduce((s: number, x: any) => s + x.functions.reduce((t: number, f: any) => t + (f.reachableContracts?.length ?? 0), 0), 0)}`)
  // sums use slightly different field names; check what's there
  const oldSumDirect = old.admins.reduce((s: number, x: any) => s + (x.totalDirectCapital ?? 0), 0)
  const oldSumReach = old.admins.reduce((s: number, x: any) => s + (x.totalReachableCapital ?? 0), 0)
  console.log(`sum totalDirectCapital:    $${oldSumDirect.toFixed(0)}`)
  console.log(`sum totalReachableCapital: $${oldSumReach.toFixed(0)}`)
}
