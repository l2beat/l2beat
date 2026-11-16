import { COMMANDS, type CommandId } from './commands'
import { type ScopeContext, scopeApplies } from './scope'
import { type Platform, type Shortcut, shortcutsEqual } from './shortcut'
import type { Keybinding } from './store'

/** The last keybinding that matches wins, so later ones override earlier. */
export function resolveKeybinding(
  keybindings: readonly Keybinding[],
  shortcut: Shortcut,
  context: ScopeContext,
  platform: Platform,
): Keybinding | undefined {
  // A focused button or link keeps the keys that press it, whatever is bound.
  if (context.controlFocus && pressesControl(shortcut)) {
    return undefined
  }
  for (let index = keybindings.length - 1; index >= 0; index--) {
    const keybinding = keybindings[index]
    if (keybinding === undefined) {
      throw new Error('Keybinding index out of bounds')
    }
    if (keybinding.shortcut === null) {
      continue
    }
    if (!shortcutsEqual(keybinding.shortcut, shortcut, platform)) {
      continue
    }
    if (scopeApplies(COMMANDS[keybinding.command].scope, context)) {
      return keybinding
    }
  }
  return undefined
}

function pressesControl(shortcut: Shortcut): boolean {
  const hasModifier =
    shortcut.mod || shortcut.ctrl || shortcut.alt || shortcut.shift
  return !hasModifier && (shortcut.key === 'Space' || shortcut.key === 'Enter')
}

/** The command's first shortcut, the one hints next to buttons show. */
export function findCommandShortcut(
  keybindings: readonly Keybinding[],
  command: CommandId,
): Shortcut | undefined {
  for (const keybinding of keybindings) {
    if (keybinding.command === command && keybinding.shortcut !== null) {
      return keybinding.shortcut
    }
  }
  return undefined
}

/** Other commands bound to the same shortcut, whatever their scopes. */
export function findConflicts(
  keybindings: readonly Keybinding[],
  keybinding: Keybinding,
  platform: Platform,
): Keybinding[] {
  const shortcut = keybinding.shortcut
  if (shortcut === null) {
    return []
  }
  return keybindings.filter(
    (other) =>
      other.command !== keybinding.command &&
      other.shortcut !== null &&
      shortcutsEqual(other.shortcut, shortcut, platform),
  )
}
