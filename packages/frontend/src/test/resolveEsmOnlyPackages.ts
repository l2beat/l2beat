// Mocha loads tests through tsx's CommonJS require, but @tanstack/charts is
// ESM-only: its exports define only the `import` condition, so require()
// cannot resolve it. Resolve those specifiers to their `import` target and
// let Node's require(esm) load the file.
import fs from 'node:fs'
import Module from 'node:module'
import path from 'node:path'

interface ModuleInternals {
  _resolveFilename(
    request: string,
    parent: { filename?: string } | undefined,
    ...rest: unknown[]
  ): string
  _nodeModulePaths(from: string): string[]
}

const ESM_ONLY = '@tanstack/charts'
const internals = Module as unknown as ModuleInternals
const resolve = internals._resolveFilename

internals._resolveFilename = function (request, parent, ...rest) {
  const target =
    request === ESM_ONLY || request.startsWith(`${ESM_ONLY}/`)
      ? findImportTarget(request, parent?.filename)
      : undefined
  return target ?? resolve.call(this, request, parent, ...rest)
}

function findImportTarget(request: string, from: string | undefined) {
  // package.json is not exported either, so find it on the lookup paths.
  const packageJsonPath = internals
    ._nodeModulePaths(from ? path.dirname(from) : process.cwd())
    .map((dir) => path.join(dir, ESM_ONLY, 'package.json'))
    .find((candidate) => fs.existsSync(candidate))
  if (!packageJsonPath) return undefined
  const { exports } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const subpath = `.${request.slice(ESM_ONLY.length)}`
  const target = exports[subpath]?.import ?? exports[subpath]?.default
  return typeof target === 'string'
    ? path.join(path.dirname(packageJsonPath), target)
    : undefined
}
