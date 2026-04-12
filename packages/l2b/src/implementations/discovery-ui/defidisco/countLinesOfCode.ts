import type { ConfigReader, DiscoveryPaths } from '@l2beat/discovery'
import { existsSync, readFileSync } from 'fs'
import { getCodePaths } from '../getCode'
import { addressesEqual } from './addressUtils'
import { getContractTags } from './contractTags'
import { updateLinesOfCode } from './resources'

interface CountResult {
  count: number
  details: {
    totalContracts: number
    externalSkipped: number
    duplicateSkipped: number
    uniqueContracts: number
    filesProcessed: number
    declarationsFound: number
    uniqueDeclarations: number
  }
}

export function countLinesOfCode(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
): CountResult {
  const discovery = configReader.readDiscovery(project)
  const contracts = discovery.entries.filter((e) => e.type === 'Contract')

  // Build set of external addresses from contract tags
  const tagsResponse = getContractTags(paths, project)
  const externalAddresses = new Set<string>()
  for (const tag of tagsResponse.tags) {
    if (tag.isExternal) {
      externalAddresses.add(tag.contractAddress.toLowerCase())
    }
  }

  // Filter to internal contracts
  const isExternal = (address: string) => {
    for (const ext of externalAddresses) {
      if (addressesEqual(address, ext)) return true
    }
    return false
  }

  const internalContracts = contracts.filter((c) => !isExternal(c.address))
  const externalSkipped = contracts.length - internalContracts.length

  // Deduplicate by sourceHashes
  const seenHashes = new Set<string>()
  const uniqueContracts = internalContracts.filter((c) => {
    const key = (c.sourceHashes ?? []).join(',')
    if (!key || seenHashes.has(key)) return false
    seenHashes.add(key)
    return true
  })
  const duplicateSkipped = internalContracts.length - uniqueContracts.length

  // Collect all flat file paths for unique internal contracts
  const filePaths: string[] = []
  for (const contract of uniqueContracts) {
    try {
      const { codePaths } = getCodePaths(
        configReader,
        project,
        contract.address,
      )
      for (const cp of codePaths) {
        if (existsSync(cp.path)) {
          filePaths.push(cp.path)
        }
      }
    } catch {
      // Contract may not have flat source (e.g. unverified)
    }
  }

  // Parse all files and deduplicate declarations
  const seenDeclarations = new Set<string>()
  let totalCount = 0
  let declarationsFound = 0

  for (const filePath of filePaths) {
    const content = readFileSync(filePath, 'utf-8')
    const declarations = extractDeclarations(content)

    for (const decl of declarations) {
      declarationsFound++
      if (!seenDeclarations.has(decl.key)) {
        seenDeclarations.add(decl.key)
        totalCount += decl.lineCount
      }
    }
  }

  // Save to resources.json
  updateLinesOfCode(paths, project, totalCount)

  return {
    count: totalCount,
    details: {
      totalContracts: contracts.length,
      externalSkipped,
      duplicateSkipped,
      uniqueContracts: uniqueContracts.length,
      filesProcessed: filePaths.length,
      declarationsFound,
      uniqueDeclarations: seenDeclarations.size,
    },
  }
}

interface Declaration {
  key: string // "contract MyContract" — used for dedup
  lineCount: number
}

const DECL_REGEX = /^(library|contract|abstract\s+contract|interface)\s+(\w+)/

function extractDeclarations(source: string): Declaration[] {
  const lines = source.split('\n')
  const declarations: Declaration[] = []

  let inDecl = false
  let declKey = ''
  let declLineCount = 0
  let braceDepth = 0
  let inMultiLineComment = false

  for (const rawLine of lines) {
    let line = rawLine

    // Handle multi-line comments
    if (inMultiLineComment) {
      const endIdx = line.indexOf('*/')
      if (endIdx === -1) continue
      line = line.substring(endIdx + 2)
      inMultiLineComment = false
    }

    // Strip comments for brace counting
    const stripped = stripComments(line)

    // Check for multi-line comment start (that doesn't close on same line)
    const mlStart = line.indexOf('/*')
    if (mlStart !== -1) {
      const mlEnd = line.indexOf('*/', mlStart + 2)
      if (mlEnd === -1) {
        inMultiLineComment = true
      }
    }

    if (!inDecl) {
      const match = stripped.match(DECL_REGEX)
      if (match) {
        const kind = match[1].replace(/\s+/g, ' ')
        const name = match[2]
        declKey = `${kind} ${name}`
        declLineCount = 1
        braceDepth = countBraces(stripped)
        inDecl = braceDepth > 0
        if (braceDepth === 0 && stripped.includes('{')) {
          // Opening brace on same line but also closes — single-line declaration
          inDecl = false
          declarations.push({ key: declKey, lineCount: 1 })
        } else if (braceDepth === 0 && !stripped.includes('{')) {
          // Declaration header without opening brace yet — keep scanning
          inDecl = true
          braceDepth = 0
        }
      }
    } else {
      declLineCount++
      braceDepth += countBraces(stripped)
      if (braceDepth <= 0 && stripped.includes('}')) {
        declarations.push({ key: declKey, lineCount: declLineCount })
        inDecl = false
        declKey = ''
        declLineCount = 0
        braceDepth = 0
      }
    }
  }

  return declarations
}

function stripComments(line: string): string {
  // Remove single-line comments
  let result = ''
  let inString = false
  let stringChar = ''

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    const next = line[i + 1]

    if (inString) {
      result += ch
      if (ch === '\\') {
        result += next ?? ''
        i++
      } else if (ch === stringChar) {
        inString = false
      }
    } else {
      if (ch === '/' && next === '/') break
      if (ch === '/' && next === '*') {
        // Find end of multi-line comment on same line
        const end = line.indexOf('*/', i + 2)
        if (end !== -1) {
          i = end + 1
        } else {
          break
        }
      } else if (ch === '"' || ch === "'") {
        inString = true
        stringChar = ch
        result += ch
      } else {
        result += ch
      }
    }
  }

  return result
}

function countBraces(stripped: string): number {
  let count = 0
  for (const ch of stripped) {
    if (ch === '{') count++
    else if (ch === '}') count--
  }
  return count
}
