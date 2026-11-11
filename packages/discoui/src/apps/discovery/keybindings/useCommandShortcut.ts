import type { CommandId } from './commands'
import { findCommandShortcut } from './resolve'
import { PLATFORM, shortcutLabels } from './shortcut'
import { selectKeybindings, useKeybindingsStore } from './store'

/** Labels of the command's first shortcut, for hints next to buttons. */
export function useCommandShortcut(command: CommandId): string[] | undefined {
  const shortcut = useKeybindingsStore((state) =>
    findCommandShortcut(selectKeybindings(state), command),
  )
  if (shortcut === undefined) {
    return undefined
  }
  return shortcutLabels(shortcut, PLATFORM)
}
