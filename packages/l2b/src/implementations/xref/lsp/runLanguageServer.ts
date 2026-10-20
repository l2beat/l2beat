import { ConfigReader } from '@l2beat/discovery'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { getReferencedProjects } from '../../discovery/getReferencedProjects'
import { FlatWorkspace, locateFlat } from '../FlatWorkspace'
import { encodeMessage, MessageReader } from './framing'
import { XrefLanguageServer } from './XrefLanguageServer'

export function runLanguageServer() {
  // stdout carries the protocol; anything else printed there corrupts it.
  console.log = console.error
  const reader = new MessageReader()
  const server = new XrefLanguageServer(
    createWorkspaceCache(),
    (message) => process.stdout.write(encodeMessage(message)),
    (code) => process.exit(code),
  )
  process.stdin.on('data', (chunk: Buffer) => {
    for (const body of reader.push(chunk)) {
      server.receive(body)
    }
  })
  process.stdin.on('end', () => process.exit(0))
}

// Rebuilt when discovery rewrites any input: discovered.json or the flats, of
// the project or of a module it references. Discovery recreates .flat file by
// file, so every top-level entry counts, not just the folder.
function createWorkspaceCache(): (path: string) => FlatWorkspace | undefined {
  const cache = new Map<string, CachedWorkspace>()
  return (path) => {
    const location = locateFlat(path)
    if (location === undefined) {
      return undefined
    }
    const { projectsDirectory, project } = location
    const key = join(projectsDirectory, project)
    const cached = cache.get(key)
    if (cached !== undefined && cached.stamp === stampOf(cached.inputs)) {
      return cached.workspace
    }
    const configReader = new ConfigReader(projectsDirectory)
    const projects = [
      project,
      ...getReferencedProjects(configReader.readDiscovery(project)),
    ]
    const inputs = projects.map((p) => configReader.getProjectPath(p))
    const stamp = stampOf(inputs)
    const workspace = FlatWorkspace.fromProject(configReader, project)
    cache.set(key, { inputs, stamp, workspace })
    return workspace
  }
}

interface CachedWorkspace {
  inputs: string[]
  stamp: string
  workspace: FlatWorkspace
}

function stampOf(projectDirectories: string[]): string {
  const times: number[] = []
  for (const directory of projectDirectories) {
    times.push(statSync(join(directory, 'discovered.json')).mtimeMs)
    const flats = join(directory, '.flat')
    if (!existsSync(flats)) {
      continue
    }
    times.push(statSync(flats).mtimeMs)
    for (const child of readdirSync(flats)) {
      times.push(statSync(join(flats, child)).mtimeMs)
    }
  }
  return times.join()
}
