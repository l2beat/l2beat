/**
 * R9: an event skipped as activity that only privileged code emits.
 *
 * In the research benchmark three event-only histories were lost this way
 * (reverted batches, verifier routes, challenges): the model skipped the
 * event as `user-activity` or `not-state` although only the owner could
 * emit it, so it was configuration with no getter. When every emitter is
 * the constructor or guarded by an owner/role-style modifier this is an
 * error; when the guards name something else (a messenger counterpart, an
 * allow-list) it is only a warning, because on the suite those guard user
 * withdrawals and deposits. The source analysis is in `privilegedEvents`.
 */
import { privilegedEmitters } from './privilegedEvents'
import type { RuleContext } from './ruleContext'

const ACTIVITY_REASONS: readonly string[] = ['user-activity', 'not-state']
const ACTIVITY_WORDS: Record<string, string> = {
  'user-activity': 'user activity',
  'not-state': 'something without state',
}

export function checkPrivilegedSkips(ctx: RuleContext): void {
  const events = new Set(ctx.worklist.events.map((event) => event.name))
  ctx.draft.skips.forEach((skip, i) => {
    if (!ACTIVITY_REASONS.includes(skip.reason) || !events.has(skip.item)) {
      return
    }
    const found = privilegedEmitters(ctx.facts.sources, skip.item)
    if (found === undefined) {
      return
    }
    const path = `skips[${i}].reason`
    const emitters = found.emitters.join(', ')
    if (found.privilege === 'authority') {
      ctx.findings.error(
        path,
        `${skip.item} is emitted only by privileged code (${emitters}), so it records configuration, not ${ACTIVITY_WORDS[skip.reason]}; fold it into an event field, or skip it as \`covered\` if a baseline getter or another field already exposes this state`,
      )
      return
    }
    ctx.findings.warning(
      path,
      `${skip.item} is emitted only behind \`only*\` guards (${emitters}); if they stand for an owner or role, it records configuration: fold it into an event field or skip it as \`covered\`; if they authenticate a messenger or allow-list acting for users, keep ${skip.reason}`,
    )
  })
}
