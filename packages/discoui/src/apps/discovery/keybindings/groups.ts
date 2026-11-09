import { COMMAND_SECTIONS, COMMANDS, type CommandSection } from './commands'
import { formatShortcut, type Platform, shortcutLabels } from './shortcut'
import type { Keybinding } from './store'

export interface KeybindingSection {
  readonly title: CommandSection
  readonly keybindings: readonly Keybinding[]
}

/**
 * Sections in a fixed order, commands by title within one, and keybindings of
 * one command in precedence order. Every word of the query must match the
 * title, command id, when clause or shortcut.
 */
export function groupKeybindings(
  keybindings: readonly Keybinding[],
  query: string,
  platform: Platform,
): KeybindingSection[] {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  const matching = keybindings.filter((keybinding) => {
    const haystack = searchText(keybinding, platform)
    return words.every((word) => haystack.includes(word))
  })
  const sections: KeybindingSection[] = []
  for (const title of COMMAND_SECTIONS) {
    const inSection = matching
      .filter((keybinding) => COMMANDS[keybinding.command].section === title)
      .sort((a, b) =>
        COMMANDS[a.command].title.localeCompare(COMMANDS[b.command].title),
      )
    if (inSection.length > 0) {
      sections.push({ title, keybindings: inSection })
    }
  }
  return sections
}

function searchText(keybinding: Keybinding, platform: Platform): string {
  const parts = [COMMANDS[keybinding.command].title, keybinding.command]
  if (keybinding.when === null) {
    parts.push('always')
  } else {
    parts.push(keybinding.when.source)
  }
  if (keybinding.shortcut !== null) {
    parts.push(formatShortcut(keybinding.shortcut))
    parts.push(shortcutLabels(keybinding.shortcut, platform).join('+'))
  }
  return parts.join(' ').toLowerCase()
}
