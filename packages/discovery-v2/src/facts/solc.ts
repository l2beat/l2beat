/**
 * The compiler AST of one flattened source, from the exact compiler that
 * verified it.
 *
 * The explorer tells us the version (`v0.8.24+commit.e11b9ed9`), so the
 * matching `soljson` build is downloaded once from binaries.soliditylang.org
 * into a user cache and loaded through solc-js's wrapper. Resolving from the
 * pragma instead would pick a newer compiler whose AST may differ, and a
 * flattened file often carries several pragmas. Only the AST is requested,
 * so no bytecode is generated and a 100 kB source compiles in well under a
 * second.
 *
 * The EVM version matters even for an AST: Yul builtins such as `blobhash`
 * are type-checked against it, and the explorer's settings are not in the
 * source. So compilation is tried with the compiler's default first and
 * retried on the newest EVM versions the compiler knows when the error names
 * a builtin that a later EVM introduced.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import solcWrapper from 'solc/wrapper'

export interface SolcCompiler {
  compile(input: string): string
  version(): string
}

export interface AstCompilation {
  /** The `SourceUnit` node. */
  ast: SolcNode
  compilerVersion: string
  evmVersion?: string
}

export interface SolcNode {
  id?: number
  nodeType?: string
  src?: string
  [key: string]: unknown
}

export class SolcError extends Error {
  constructor(
    message: string,
    readonly errors: string[],
  ) {
    super(message)
    this.name = 'SolcError'
  }
}

const BINARIES = 'https://binaries.soliditylang.org/bin'
/** Newest first: a source that needs `blobhash` also compiles under Prague. */
const LATER_EVM_VERSIONS = ['prague', 'cancun', 'shanghai'] as const
const EVM_DEPENDENT_ERROR =
  /blobhash|blobbasefee|mcopy|tstore|tload|push0|basefee|difficulty|prevrandao|evmVersion|EVM version/i

export function defaultSolcCacheDir(): string {
  return (
    process.env.DISCOVERY_V2_SOLC_CACHE ??
    path.join(os.homedir(), '.cache', 'discovery-v2', 'solc')
  )
}

/** `v0.8.24+commit.e11b9ed9` → the cached `soljson` file, downloading it on first use. */
export async function loadCompiler(
  version: string,
  cacheDir = defaultSolcCacheDir(),
): Promise<SolcCompiler> {
  const tag = normaliseVersion(version)
  const file = path.join(cacheDir, `soljson-${tag}.js`)
  if (!fs.existsSync(file)) {
    await download(`${BINARIES}/soljson-${tag}.js`, file)
  }
  const soljson: unknown = require(file)
  return solcWrapper(soljson) as SolcCompiler
}

/** Etherscan writes `v0.8.24+commit.e11b9ed9`; the binary list uses the same tag with the `v`. */
function normaliseVersion(version: string): string {
  const trimmed = version.trim()
  if (!/^v?\d+\.\d+\.\d+\+commit\.[0-9a-f]{8}$/.test(trimmed)) {
    throw new Error(`unrecognised compiler version "${version}"`)
  }
  return trimmed.startsWith('v') ? trimmed : `v${trimmed}`
}

async function download(url: string, file: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`could not download ${url}: HTTP ${response.status}`)
  }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const partial = `${file}.part`
  fs.writeFileSync(partial, Buffer.from(await response.arrayBuffer()))
  fs.renameSync(partial, file)
}

export function compileAst(
  compiler: SolcCompiler,
  fileName: string,
  source: string,
): AstCompilation {
  let lastErrors: string[] = []
  for (const evmVersion of [undefined, ...LATER_EVM_VERSIONS]) {
    const output = compileOnce(compiler, fileName, source, evmVersion)
    lastErrors = output.errors
    if (output.ast !== undefined) {
      return {
        ast: output.ast,
        compilerVersion: compiler.version(),
        evmVersion,
      }
    }
    if (!output.errors.some((error) => EVM_DEPENDENT_ERROR.test(error))) {
      break
    }
  }
  throw new SolcError(
    `solc ${compiler.version()} could not compile ${fileName}: ${lastErrors[0] ?? 'no AST produced'}`,
    lastErrors,
  )
}

function compileOnce(
  compiler: SolcCompiler,
  fileName: string,
  source: string,
  evmVersion: string | undefined,
): { ast?: SolcNode; errors: string[] } {
  const input = {
    language: 'Solidity',
    sources: { [fileName]: { content: source } },
    settings: {
      ...(evmVersion === undefined ? {} : { evmVersion }),
      outputSelection: { '*': { '': ['ast'] } },
    },
  }
  const output = JSON.parse(compiler.compile(JSON.stringify(input))) as {
    errors?: { severity: string; message: string; formattedMessage?: string }[]
    sources?: Record<string, { ast?: SolcNode }>
  }
  const errors = (output.errors ?? [])
    .filter((error) => error.severity === 'error')
    .map((error) => error.formattedMessage ?? error.message)
  const ast = output.sources?.[fileName]?.ast
  return errors.length > 0 || ast === undefined ? { errors } : { ast, errors }
}
