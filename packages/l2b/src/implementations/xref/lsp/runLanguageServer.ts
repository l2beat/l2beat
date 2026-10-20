import { ConfigReader } from '@l2beat/discovery'
import { existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { getReferencedProjects } from '../../discovery/getReferencedProjects'
import { type FlatLocation, FlatWorkspace } from '../FlatWorkspace'
import { encodeMessage, MessageReader } from './framing'
import { createWorkspaceCache, type LoadedWorkspace } from './workspaceCache'
import { XrefLanguageServer } from './XrefLanguageServer'

export function runLanguageServer() {
  // stdout carries the protocol; anything else printed there corrupts it.
  console.log = console.error
  const reader = new MessageReader()
  const server = new XrefLanguageServer(
    createWorkspaceCache(loadWorkspace),
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
function loadWorkspace(location: FlatLocation): LoadedWorkspace {
  const configReader = new ConfigReader(location.projectsDirectory)
  const projects = [
    location.project,
    ...getReferencedProjects(configReader.readDiscovery(location.project)),
  ]
  const inputs = projects.map((p) => configReader.getProjectPath(p))
  const stamp = stampOf(inputs)
  return {
    workspace: FlatWorkspace.fromProject(configReader, location.project),
    stamp,
    currentStamp: () => stampOf(inputs),
  }
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
