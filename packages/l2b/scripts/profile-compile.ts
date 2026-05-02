/* eslint-disable */
import { ConfigReader, TemplateService, type DiscoveryPaths } from '@l2beat/discovery'
import * as fs from 'fs'
import * as path from 'path'
import { ProjectAnalysis } from '../src/implementations/discovery-ui/defidisco/projectAnalysis'

function ms(start: bigint): string {
  const ns = Number(process.hrtime.bigint() - start)
  return (ns / 1e6).toFixed(0).padStart(6) + ' ms'
}

const project = process.argv[2] ?? 'aave-v3'

const repoRoot = path.resolve(__dirname, '../../..')
const paths: DiscoveryPaths = {
  root: repoRoot,
  discovery: path.join(repoRoot, 'packages/config/src/projects'),
} as DiscoveryPaths

let t = process.hrtime.bigint()

console.log('--- compile profile for', project, '---')

const t0 = process.hrtime.bigint()

t = process.hrtime.bigint()
const configReader = new ConfigReader(paths.discovery)
const templateService = new TemplateService(paths.discovery)
console.log('init readers           ', ms(t))

t = process.hrtime.bigint()
const analysis = new ProjectAnalysis(paths, configReader, templateService, project)
console.log('new ProjectAnalysis    ', ms(t))

t = process.hrtime.bigint()
const admins = analysis.getAdmins()
console.log('getAdmins              ', ms(t), '  admins=', admins.admins.length, ' fns=', admins.admins.reduce((s, a) => s + a.functions.length, 0))

t = process.hrtime.bigint()
const deps = analysis.getDependencies()
console.log('getDependencies        ', ms(t), '  deps=', deps.dependencies.length, ' fns=', deps.dependencies.reduce((s, d) => s + d.functions.length, 0))

t = process.hrtime.bigint()
const json = JSON.stringify({ admins, deps })
console.log('JSON.stringify         ', ms(t), '  bytes=', (json.length / 1024 / 1024).toFixed(1), 'MB')

console.log('TOTAL                  ', ms(t0))
