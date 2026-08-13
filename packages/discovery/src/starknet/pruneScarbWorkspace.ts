// Voyager returns the full verified Scarb workspace, which may contain
// packages unrelated to the deployed class (e.g. sibling contracts built from
// the same repo). Keep only the packages whose crates the class ABI actually
// references (plus their intra-workspace dependencies) and the root manifests.

import type { SierraAbi } from './sierraAbi'

export function pruneScarbWorkspace(
  files: Record<string, string>,
  abi: SierraAbi,
): Record<string, string> {
  const packages = groupByPackage(files)
  if (packages.size <= 1) {
    return files // single-package repo, nothing to prune
  }

  const crateToPackage = new Map<string, string>()
  const packageDeps = new Map<string, Set<string>>()
  for (const [dir, paths] of packages) {
    const manifestPath = paths.find((p) => p.endsWith('Scarb.toml'))
    const manifest =
      manifestPath === undefined ? '' : (files[manifestPath] ?? '')
    const crate = manifest.match(/^\s*name\s*=\s*"([^"]+)"/m)?.[1] ?? dir
    crateToPackage.set(crate, dir)
    // Path dependencies (`foo = { path = "..." }`) from [dependencies] only -
    // [dev-dependencies] are not compiled into the deployed class
    const deps = new Set<string>()
    const dependenciesSection =
      manifest.match(/^\[dependencies\]([^[]*)/m)?.[1] ?? ''
    for (const match of dependenciesSection.matchAll(
      /^\s*([A-Za-z_][A-Za-z0-9_-]*)\s*=\s*\{[^}]*path\s*=/gm,
    )) {
      const dep = match[1]
      if (dep !== undefined) {
        deps.add(dep)
      }
    }
    packageDeps.set(dir, deps)
  }

  const needed = new Set<string>()
  const queue = [...referencedCrates(abi)]
  while (queue.length > 0) {
    const crate = queue.pop()
    if (crate === undefined) {
      continue
    }
    const dir = crateToPackage.get(crate)
    if (dir === undefined || needed.has(dir)) {
      continue
    }
    needed.add(dir)
    queue.push(...(packageDeps.get(dir) ?? []))
  }

  if (needed.size === 0) {
    return files // detection failed, keep everything
  }

  const result: Record<string, string> = {}
  for (const [path, content] of Object.entries(files)) {
    const dir = packageDir(path)
    if (dir === undefined || needed.has(dir)) {
      result[path] = content
    }
  }
  return result
}

/** All crate names (path roots) mentioned anywhere in the ABI */
export function referencedCrates(abi: SierraAbi): Set<string> {
  const typeStrings: string[] = [
    ...abi.structs.keys(),
    ...abi.enums.keys(),
    ...abi.events.map((e) => e.name),
  ]
  for (const fn of abi.functions) {
    if (fn.interfaceName !== undefined) {
      typeStrings.push(fn.interfaceName)
    }
    typeStrings.push(
      ...fn.inputs.map((i) => i.type),
      ...fn.outputs.map((o) => o.type),
    )
  }

  const crates = new Set<string>()
  for (const type of typeStrings) {
    for (const match of type.matchAll(
      /(?:^|[<(,@\s])([A-Za-z_][A-Za-z0-9_]*)::/g,
    )) {
      const crate = match[1]
      if (crate !== undefined && crate !== 'core') {
        crates.add(crate)
      }
    }
  }
  return crates
}

function groupByPackage(files: Record<string, string>): Map<string, string[]> {
  const packages = new Map<string, string[]>()
  for (const path of Object.keys(files)) {
    const dir = packageDir(path)
    if (dir === undefined) {
      continue
    }
    packages.set(dir, [...(packages.get(dir) ?? []), path])
  }
  return packages
}

/** 'packages/privacy/src/lib.cairo' -> 'packages/privacy'; root files -> undefined */
function packageDir(path: string): string | undefined {
  const match = path.match(/^(packages\/[^/]+)\//)
  return match?.[1]
}
