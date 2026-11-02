import { createHash } from 'node:crypto'
import type { Rolldown } from 'vite'

type ChunkingContext = Rolldown.ChunkingContext

/**
 * Rolldown's default split gives every set of pages that shares a module a
 * chunk of its own, so a project page loads over a hundred chunks, most under
 * 2 kB. Each costs the main thread a request, a compile and a link before
 * first paint, even from the cache.
 *
 * This group makes the same split, then moves each chunk under `maxBytes` of
 * source into a bigger one that every page loading it loads already, along
 * with everything it imports. A page may then load a few small chunks' worth
 * of code it doesn't use, but never a chunk it didn't load before. Rolldown's
 * `entriesAwareMergeThreshold` can't promise that: it picks the target by
 * pages alone, and even at 1 kB it had /defi/summary load the 98 kB chart
 * chunk.
 */
export function smallSharedChunks(maxBytes: number) {
  const candidates: string[] = []
  let names: Map<string, string> | undefined

  return {
    name: (id: string, ctx: ChunkingContext) => {
      names ??= planChunks(candidates, ctx, maxBytes)
      return names.get(id) ?? null
    },
    test: (id: string) => {
      if (!/\.[cm]?[jt]sx?$/.test(id)) return false
      candidates.push(id)
      return true
    },
    // A module only one page loads stays in that page's chunk
    minShareCount: 2,
    // Each module's chunk is planned here, dependencies included
    includeDependenciesRecursively: false,
  }
}

interface Chunk {
  // The entries and dynamic imports that load it
  roots: Set<string>
  ids: string[]
  bytes: number
}

function planChunks(ids: string[], ctx: ChunkingContext, maxBytes: number) {
  // The entry is index.html, which isn't a candidate, so look at importers too
  const seen = new Set(ids)
  for (const id of ids) {
    for (const importer of ctx.getModuleInfo(id)?.importers ?? []) {
      seen.add(importer)
    }
  }
  const roots = [...seen].filter((id) => {
    const info = ctx.getModuleInfo(id)
    return info?.isEntry || (info?.dynamicImporters.length ?? 0) > 0
  })
  const rootsOf = findRootsOf(roots, ctx)
  const entries = roots.filter((id) => ctx.getModuleInfo(id)?.isEntry)

  // Pass 1: Rolldown's default split, a chunk per set of roots
  const chunkOf = new Map<string, Chunk>()
  const byRoots = new Map<string, Chunk>()
  for (const id of ids) {
    const loadedBy = rootsOf.get(id)
    // The entry's chunk and each page's own chunk stay as Rolldown makes them
    if (!loadedBy || loadedBy.size < 2) continue
    if (entries.some((entry) => loadedBy.has(entry))) continue
    const key = [...loadedBy].sort().join('|')
    let chunk = byRoots.get(key)
    if (!chunk) {
      chunk = { roots: loadedBy, ids: [], bytes: 0 }
      byRoots.set(key, chunk)
    }
    chunk.ids.push(id)
    chunk.bytes += ctx.getModuleInfo(id)?.code?.length ?? 0
    chunkOf.set(id, chunk)
  }

  // Pass 2: move each small chunk, smallest first, into the safe chunk with
  // the fewest roots, until none can move
  const chunks = new Set(byRoots.values())
  const covers = (outer: Set<string>, inner: Set<string>) =>
    [...inner].every((root) => outer.has(root))
  const findTarget = (chunk: Chunk) => {
    const imported = new Set<Chunk>()
    for (const id of chunk.ids) {
      for (const dep of ctx.getModuleInfo(id)?.importedIds ?? []) {
        const depChunk = chunkOf.get(dep)
        if (depChunk && depChunk !== chunk) imported.add(depChunk)
      }
    }
    let best: Chunk | undefined
    for (const other of chunks) {
      if (other === chunk) continue
      if (other.roots.size >= (best?.roots.size ?? Number.POSITIVE_INFINITY))
        continue
      // Every root that loads this chunk must load the target already...
      if (!covers(other.roots, chunk.roots)) continue
      // ...and what this one imports, or the target's roots would load more
      const safe = [...imported].every(
        (dep) => dep === other || covers(dep.roots, other.roots),
      )
      if (safe) best = other
    }
    return best
  }
  for (let moved = true; moved; ) {
    moved = false
    const bySize = [...chunks].sort((a, b) => a.bytes - b.bytes)
    for (const chunk of bySize) {
      // Sizes can grow mid-pass, so the order is only a hint
      if (chunk.bytes >= maxBytes) continue
      const target = findTarget(chunk)
      if (!target) continue
      target.ids.push(...chunk.ids)
      target.bytes += chunk.bytes
      for (const id of chunk.ids) chunkOf.set(id, target)
      chunks.delete(chunk)
      moved = true
    }
  }

  const names = new Map<string, string>()
  for (const [id, chunk] of chunkOf) {
    const key = [...chunk.roots].sort().join('|')
    const hash = createHash('sha256').update(key).digest('hex').slice(0, 8)
    names.set(id, `shared-${hash}`)
  }
  return names
}

// For each module, the roots (entries and dynamic imports) whose static
// imports reach it: each root is a chunk the browser loads on its own
function findRootsOf(roots: string[], ctx: ChunkingContext) {
  const rootsOf = new Map<string, Set<string>>()
  for (const root of roots) {
    const stack = [root]
    while (stack.length > 0) {
      // biome-ignore lint/style/noNonNullAssertion: length checked above
      const id = stack.pop()!
      const loadedBy = rootsOf.get(id) ?? new Set<string>()
      if (loadedBy.has(root)) continue
      loadedBy.add(root)
      rootsOf.set(id, loadedBy)
      stack.push(...(ctx.getModuleInfo(id)?.importedIds ?? []))
    }
  }
  return rootsOf
}
