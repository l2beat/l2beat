// Where a command's shortcut works. Fixed per command: shortcuts can be
// rebound, but not moved to where they would take keys meant for a field.
export type Scope = 'anywhere' | 'notTyping' | 'canvas' | 'canvasNoButton'

export interface ScopeContext {
  /** Focus is in a field that takes typing. */
  readonly inputFocus: boolean
  readonly nodesPanelActive: boolean
  readonly searchOpen: boolean
  /** Focus is on a button or link, which Space presses. */
  readonly controlFocus: boolean
}

export const SCOPE_LABELS: Record<Scope, string> = {
  anywhere: 'Always',
  notTyping: 'When not typing',
  canvas: 'When on the canvas',
  canvasNoButton: 'When on the canvas, unless a button has focus',
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
  if (!context.nodesPanelActive || context.searchOpen) {
    return false
  }
  return scope === 'canvas' || !context.controlFocus
}
