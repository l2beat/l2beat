import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { posix } from 'path'

interface Project {
  project: string
  diffHistoryPaths: string[]
}

function getPaths(): Project[] {
  const entries = readdirSync('./src/projects', { withFileTypes: true })
  return entries
    .filter((x) => x.isDirectory())
    .flatMap((entry) => {
      if (entry.name.startsWith('(') && entry.name.endsWith(')')) {
        return readdirSync(`./src/projects/${entry.name}`, {
          withFileTypes: true,
        })
          .filter((x) => x.isDirectory())
          .map((x) => ({
            ...x,
            name: `${entry.name}/${x.name}`,
          }))
      }
      return [entry]
    })
    .map((entry) => ({
      project: entry.name,
      diffHistoryPaths: readdirSync(`./src/projects/${entry.name}`)
        .filter((path) =>
          existsSync(`./src/projects/${entry.name}/${path}/diffHistory.md`),
        )
        .map((path) => `./src/projects/${entry.name}/${path}/diffHistory.md`),
    }))
    .filter((x) => x.diffHistoryPaths.length > 0)
}

interface DiffEntry {
  timestamp: number
  content: string
  discoveredHash?: string
}

function addChain(content: string, chain: string): string {
    return content.replace(
        /^- author:/m,
        `- chain: ${chain}\n- author:`,
    )
}

function getDiffEntries(path: string): DiffEntry[] {
  const chain = posix.basename(posix.dirname(path))
  const content = readFileSync(path, 'utf8')
  const lines = content.split(/\r?\n/)

  const entries: DiffEntry[] = []
  const isDiffHeader = (line: string) => line.startsWith('# Diff at ')
  const isDiscoveredHash = (line: string) =>
    /^Generated with discovered\.json:\s*0x[0-9a-fA-F]+$/.test(line)

  let i = 0
  while (i < lines.length) {
    if (!isDiffHeader(lines[i])) {
      i++
      continue
    }

    // Parse timestamp from the header line
    const cleanedHeader = lines[i]
      .replace(/^# Diff at /, '')
      .replace(/:$/, '') // trailing colon in the source
      .trim()
    const date = new Date(cleanedHeader)

    // Section content = lines until the next "# Diff at " or EOF
    const startIdx = i + 1
    let endIdx = lines.length
    for (let j = startIdx; j < lines.length; j++) {
      if (
        isDiffHeader(lines[j]) ||
        lines[j].startsWith('Generated with discovered.json:')
      ) {
        endIdx = j
        break
      }
    }
    const sectionContent = lines.slice(startIdx, endIdx).join('\n').trim()

    // discovered.json hash = the closest "Generated with discovered.json: 0x..."
    // that appears ABOVE this "# Diff at" header
    let discoveredHash: string | undefined
    for (let k = i - 1; k >= 0; k--) {
      if (isDiffHeader(lines[k])) break // crossed into previous diff; stop
      if (isDiscoveredHash(lines[k])) {
        const m = lines[k].match(/0x[0-9a-fA-F]+/)
        if (m) discoveredHash = m[0]
        break
      }
    }

    entries.push({
      timestamp: date.getTime(),
      content: addChain(sectionContent, chain),
      discoveredHash,
    })

    i = endIdx
  }

  return entries
}

const timestamp = 1756720870000
const discoveryPaths = getDiscoveryPaths()
const configReader = new ConfigReader(discoveryPaths.discovery)

function getNewestDiffEntry(path: Project): DiffEntry {
  return {
    timestamp,
    discoveredHash: configReader.readDiscoveryHash(path.project),
    content: 'Merge mark',
  }
}

const paths = getPaths()
for (const path of paths) {
  const entries = path.diffHistoryPaths.flatMap(getDiffEntries)
  const combinedEntries: DiffEntry[] = [
    ...entries,
    getNewestDiffEntry(path),
  ].sort((a, b) => b.timestamp - a.timestamp)
  let result = ''
  for (const entry of combinedEntries) {
    if (entry.discoveredHash !== undefined) {
      result += `Generated with discovered.json: ${entry.discoveredHash}\n\n`
    }
    result += `# Diff at ${new Date(entry.timestamp).toUTCString()}:\n\n`
    result += entry.content
    result += '\n\n'
  }
  writeFileSync(`./src/projects/${path.project}/diffHistory.md`, result)
}
