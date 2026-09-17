import { type DiscoveryOutput, getReferencedProjects } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'

// Modules must be saved before consumers load their modelling inputs from disk.
export function orderProjectsForModelling(
  discoveries: DiscoveryOutput[],
): string[] {
  const remaining = new Map<string, number>()
  const consumers = new Map<string, string[]>()
  for (const discovery of discoveries) {
    consumers.set(discovery.name, [])
  }
  for (const discovery of discoveries) {
    const references = getReferencedProjects(discovery)
    remaining.set(discovery.name, references.length)
    for (const reference of references) {
      const dependents = consumers.get(reference)
      assert(
        dependents,
        `Missing discovery ${reference}, referenced by ${discovery.name}.`,
      )
      dependents.push(discovery.name)
    }
  }

  const ready = [...remaining.keys()].filter(
    (name) => remaining.get(name) === 0,
  )
  const ordered: string[] = []
  while (ready.length > 0) {
    ready.sort()
    const name = ready.shift()
    assert(name !== undefined)
    ordered.push(name)
    remaining.delete(name)
    for (const consumer of consumers.get(name) ?? []) {
      const count = remaining.get(consumer)
      assert(count !== undefined)
      remaining.set(consumer, count - 1)
      if (count === 1) ready.push(consumer)
    }
  }

  assert(
    remaining.size === 0,
    `Cannot order projects for modelling: ${[...remaining.keys()].sort().join(', ')}. Check for cyclic references.`,
  )
  return ordered
}
