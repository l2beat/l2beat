import { ConfigReader } from '@l2beat/discovery'
import { statSync } from 'fs'
import { join } from 'path'
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

// Rebuilt when discovery rewrites discovered.json, which is also when the
// flats change.
function createWorkspaceCache(): (path: string) => FlatWorkspace | undefined {
  const cache = new Map<string, { stamp: number; workspace: FlatWorkspace }>()
  return (path) => {
    const location = locateFlat(path)
    if (location === undefined) {
      return undefined
    }
    const { projectsDirectory, project } = location
    const discovered = join(projectsDirectory, project, 'discovered.json')
    const stamp = statSync(discovered).mtimeMs
    const cached = cache.get(discovered)
    if (cached?.stamp === stamp) {
      return cached.workspace
    }
    const workspace = FlatWorkspace.fromProject(
      new ConfigReader(projectsDirectory),
      project,
    )
    cache.set(discovered, { stamp, workspace })
    return workspace
  }
}
