export interface UpgradePath {
  steps: string[]
  /** Remarks about the path as a whole, written after its last step. */
  note?: string
}

/**
 * Configs write an upgrade path as "step → step → step. Optional remarks.",
 * so spaced arrows mark step boundaries and whatever follows the last step's
 * first sentence is a remark. Steps start capitalized because each one
 * stands alone in the timeline. Unspaced arrows ("L2→L1") stay inside a step.
 * Returns undefined for text that is not a path, so callers can render it as prose.
 */
export function parseUpgradePath(text: string): UpgradePath | undefined {
  const steps = text.split(/\s+→\s+/).map(capitalize)
  const last = steps.pop()
  if (last === undefined || steps.length === 0) return undefined

  const noteStart = last.search(/\.\s+[A-Z]/)
  if (noteStart === -1) {
    return { steps: [...steps, last.replace(/\.$/, '')] }
  }
  return {
    steps: [...steps, last.slice(0, noteStart)],
    note: last.slice(noteStart + 1).trim(),
  }
}

/** Waiting steps are where users get time to exit, so the timeline sets them apart. */
export function isWaitingStep(step: string) {
  return /^wait\b|\btimelock\b|\boutbox\b|\bdelay\b|\bveto (window|period)\b/i.test(
    step,
  )
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
