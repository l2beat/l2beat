// Where a command's shortcut works. Fixed per command: shortcuts can be
// rebound, but not moved to where they would take keys meant for a field.
export type Scope = 'anywhere' | 'notTyping' | 'canvas'

export interface ScopeContext {
  /** Focus is in a field that takes typing. */
  readonly inputFocus: boolean
  readonly nodesPanelActive: boolean
  readonly searchOpen: boolean
  /** Focus is on a button or link, which Space and Enter press. */
  readonly controlFocus: boolean
}

export const SCOPE_LABELS: Record<Scope, string> = {
  anywhere: 'Always',
  notTyping: 'When not typing',
  canvas: 'When on the canvas',
}

export function scopeApplies(scope: Scope, context: ScopeContext): boolean {
  if (scope === 'anywhere') {
    return true
  }
  if (context.inputFocus) {
    return false
  }
  if (scope === 'notTyping') {
    return true
  }
  return context.nodesPanelActive && !context.searchOpen
}
