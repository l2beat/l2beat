import type { SolidityOutput } from '@ethereum-sourcify/compilers-types'
import { assert } from '@l2beat/shared-pure'

export interface SolcNode {
  id: number
  nodeType: string
  src: string
}

export interface StorageSlot {
  astId: number
  slot: string
  offset: number
  type: string
}

export interface CompiledFlat {
  ast: SolcNode
  storage: Map<string, StorageSlot[]>
}

const SOURCE_NAME = 'flat.sol'
const RELEASES_URL = 'https://binaries.soliditylang.org/bin/list.json'
const PRAGMA = 'pragma solidity '
const ENCODER_PRAGMA = '\npragma experimental ABIEncoderV2;\n'

// A flat solc rejects, as opposed to a compiler that failed to load.
export class FlatCompileError extends Error {}

interface SolcJs {
  compile(input: string): string
}

// One soljson instance per version, reused for every flat. Creating one per
// compile (what useSolidityCompiler does) exhausts V8's wasm reservations.
export class SolcCompilers {
  private readonly loaded = new Map<string, Promise<SolcJs>>()

  constructor(
    private readonly soljsonDirectory: string,
    private readonly releases: Map<string, string>,
  ) {}

  // Only the analysis passes run: storage layout needs no code generation, so
  // the optimizer settings of the original deployment do not matter here.
  async compile(text: string): Promise<CompiledFlat> {
    const { version, source } = takeExactPragma(text)
    const longVersion = this.releases.get(version)
    if (longVersion === undefined) {
      throw new FlatCompileError('Unknown solc version')
    }
    const solc = await this.load(longVersion)
    const input = {
      language: 'Solidity',
      sources: { [SOURCE_NAME]: { content: source } },
      settings: {
        // Compilers before 0.5.13 lack storageLayout; abi makes them still
        // return the contracts.
        outputSelection: {
          '*': { '': ['ast'], '*': ['abi', 'storageLayout'] },
        },
      },
    }
    const output = JSON.parse(solc.compile(JSON.stringify(input)))
    return toCompiledFlat(output as SolidityOutput)
  }

  private load(longVersion: string): Promise<SolcJs> {
    let solc = this.loaded.get(longVersion)
    if (solc === undefined) {
      solc = import('@ethereum-sourcify/compilers').then(
        ({ getSolcJs }) =>
          getSolcJs(this.soljsonDirectory, longVersion) as Promise<SolcJs>,
      )
      this.loaded.set(longVersion, solc)
    }
    return solc
  }
}

export async function fetchSolcReleases(): Promise<Map<string, string>> {
  const response = await fetch(RELEASES_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch solc releases', {
      cause: { status: response.status },
    })
  }
  const list = (await response.json()) as { releases: Record<string, string> }
  const releases = new Map<string, string>()
  for (const [version, file] of Object.entries(list.releases)) {
    // soljson-v0.8.25+commit.b61c2a91.js -> 0.8.25+commit.b61c2a91
    releases.set(version, file.slice('soljson-v'.length, -'.js'.length))
  }
  return releases
}

// The flattener writes the exact compiler version, sometimes without the
// leading zero (`.8.16`), which solc rejects. Commenting the pragma out keeps
// every offset intact, so positions in the AST still match the flat.
export function takeExactPragma(text: string): {
  version: string
  source: string
} {
  const start = text.indexOf(PRAGMA)
  if (start === -1) {
    throw new FlatCompileError('Flat has no pragma')
  }
  const end = text.indexOf(';', start)
  const written = text.slice(start + PRAGMA.length, end).trim()
  const version = written.startsWith('.') ? `0${written}` : written
  if (!isExactVersion(version)) {
    throw new FlatCompileError('Flat pragma is not an exact version')
  }
  const commented = `//${text.slice(start + 2, end + 1)}`
  // The flattener drops `pragma experimental ABIEncoderV2`; appending it
  // restores it without moving anything.
  const hasEncoder = text.includes('ABIEncoderV2') || text.includes('abicoder')
  const encoder =
    hasEncoder || !supportsEncoderPragma(version) ? '' : ENCODER_PRAGMA
  return {
    version,
    source: text.slice(0, start) + commented + text.slice(end + 1) + encoder,
  }
}

// From 0.4.19, when it appeared, to 0.8, which made it the default.
function supportsEncoderPragma(version: string): boolean {
  const [, minor = 0, patch = 0] = version.split('.').map(Number)
  if (minor === 4) {
    return patch >= 19
  }
  return minor >= 5 && minor < 8
}

function isExactVersion(version: string): boolean {
  const parts = version.split('.')
  return (
    parts.length === 3 &&
    parts.every((part) => part.length > 0 && !Number.isNaN(Number(part)))
  )
}

function toCompiledFlat(output: SolidityOutput): CompiledFlat {
  const errors = (output.errors ?? []).filter((e) => e.severity === 'error')
  if (errors.length > 0) {
    throw new FlatCompileError('Flat does not compile', {
      cause: { message: errors[0]?.formattedMessage },
    })
  }
  const ast = output.sources?.[SOURCE_NAME]?.ast as SolcNode | undefined
  assert(ast !== undefined, 'Compiler returned no AST')
  const storage = new Map<string, StorageSlot[]>()
  for (const [name, contract] of Object.entries(
    output.contracts?.[SOURCE_NAME] ?? {},
  )) {
    const layout = contract.storageLayout as
      | { storage: StorageSlot[] }
      | undefined
    storage.set(name, layout?.storage ?? [])
  }
  return { ast, storage }
}
