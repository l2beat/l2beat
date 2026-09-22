/**
 * Identity of a plan's *decisions*, as opposed to its text.
 *
 * Two authoring runs over ScrollChain produced the same steps and the same
 * skips but different `reason` sentences ("isProver is written only by
 * addProver/removeProver (onlyOwner)…" against a paraphrase), so `planHash`
 * called them different plans. The benchmark's consistency number must not:
 * a step's `reason` is the model's justification, read by humans and never
 * executed, and it varies with wording where nothing the executor does has
 * changed. A skip's `reason` stays in the hash because it is one of the
 * closed verdicts, not prose; changing `user-activity` to `unbounded` is a
 * different ruling on the same item.
 *
 * Step and skip order is also erased (steps sort by `id`, skips by `item`),
 * because the validator forbids duplicate ids and the executor resolves
 * `$step` references by name, so the same set of steps in another order is
 * the same plan. Keys are sorted as in `planHash`.
 */
import type { Plan, Step } from '../plan/Plan'
import { planHash } from './planHash'

export function decisionHash(plan: Plan): string {
  return planHash(decisionsOf(plan))
}

/** The plan with every step `reason` removed and its arrays in canonical order. */
export function decisionsOf(plan: Plan): Omit<Plan, 'steps'> & {
  steps: Omit<Step, 'reason'>[]
} {
  return {
    ...plan,
    steps: [...plan.steps].sort(byKey('id')).map(withoutReason),
    skips: [...plan.skips].sort(byKey('item')),
  }
}

function withoutReason(step: Step): Omit<Step, 'reason'> {
  const { reason: _reason, ...decision } = step
  return decision
}

function byKey<K extends string>(key: K) {
  return (a: Record<K, string>, b: Record<K, string>): number =>
    a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
}
