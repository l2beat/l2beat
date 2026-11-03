import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'

export type DeferredPastUpgrades = Record<string, PastUpgradesData['upgrades']>

/**
 * Takes the upgrade lists out of a project entry, leaving their stats and a
 * `deferred` pointer for the dialog to load them from `src` when it opens.
 * Only the open dialog shows the list, and on arbitrum the lists were 147 KB
 * of the page data.
 *
 * Lists are found by shape, wherever sections nest them (contracts,
 * permissions, governance, groups). Keys name the contract rather than its
 * position, so a list fetched after the server rebuilt the entry still
 * belongs to the contract the dialog was opened for.
 */
export function deferPastUpgrades<T>(
  value: T,
  src: string,
): { value: T; upgrades: DeferredPastUpgrades } {
  const upgrades: DeferredPastUpgrades = {}

  function visit(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(visit)
    if (!isObject(node)) return node

    const result: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(node)) {
      if (key === 'pastUpgrades' && isPastUpgradesData(child)) {
        const deferKey = getDeferKey(node, upgrades)
        upgrades[deferKey] = child.upgrades
        result[key] = {
          stats: child.stats,
          upgrades: [],
          deferred: { src, key: deferKey, length: child.upgrades.length },
        } satisfies PastUpgradesData
      } else {
        result[key] = visit(child)
      }
    }
    return result
  }

  return { value: visit(value) as T, upgrades }
}

function getDeferKey(owner: object, taken: DeferredPastUpgrades): string {
  const contract = owner as {
    chain?: string
    addresses?: { address?: string }[]
    id?: string
  }
  const base =
    contract.chain !== undefined
      ? `${contract.chain}:${contract.addresses?.[0]?.address ?? contract.id}`
      : 'project'
  let key = base
  for (let i = 2; key in taken; i++) key = `${base}#${i}`
  return key
}

function isPastUpgradesData(value: unknown): value is PastUpgradesData {
  return (
    isObject(value) &&
    Array.isArray((value as Partial<PastUpgradesData>).upgrades) &&
    isObject((value as Partial<PastUpgradesData>).stats)
  )
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null
}
