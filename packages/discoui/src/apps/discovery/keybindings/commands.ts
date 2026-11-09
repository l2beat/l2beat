import type { Scope } from './scope'
import type { Platform } from './shortcut'

export const PRESS_COMMAND_IDS = [
  'search.toggle',
  'search.open',
  'layout.select1',
  'layout.select2',
  'layout.select3',
  'layout.select4',
  'layout.select5',
  'layout.select6',
  'panel.add',
  'panel.close',
  'panel.toggleFullScreen',
  'discovery.run',
  'discovery.kill',
  'nodes.group',
  'nodes.ungroup',
  'nodes.hideSelected',
  'nodes.undo',
  'nodes.redo',
  'tool.select',
  'tool.hand',
] as const

// Hold commands act while their key is down, and stop when it comes up.
export const HOLD_COMMAND_IDS = ['tool.handHold'] as const

export type PressCommandId = (typeof PRESS_COMMAND_IDS)[number]
export type HoldCommandId = (typeof HOLD_COMMAND_IDS)[number]
export type CommandId = PressCommandId | HoldCommandId

export const COMMAND_IDS: readonly CommandId[] = [
  ...PRESS_COMMAND_IDS,
  ...HOLD_COMMAND_IDS,
]

export const COMMAND_SECTIONS = ['Navigation', 'Discovery', 'Nodes'] as const
export type CommandSection = (typeof COMMAND_SECTIONS)[number]

export interface CommandInfo {
  readonly section: CommandSection
  readonly title: string
  readonly scope: Scope
  /** Whether holding the key down runs the command again and again. */
  readonly repeats: boolean
}

// Shortcuts never take keys typed into a field, except the search toggle,
// which works from anywhere. Space leaves a focused button to press itself.
export const COMMANDS: Record<CommandId, CommandInfo> = {
  'search.toggle': navigation('Search: Toggle', 'anywhere'),
  'search.open': navigation('Search: Open'),
  'layout.select1': navigation('Layout: Select 1'),
  'layout.select2': navigation('Layout: Select 2'),
  'layout.select3': navigation('Layout: Select 3'),
  'layout.select4': navigation('Layout: Select 4'),
  'layout.select5': navigation('Layout: Select 5'),
  'layout.select6': navigation('Layout: Select 6'),
  'panel.add': navigation('Panel: Add'),
  'panel.close': navigation('Panel: Close'),
  'panel.toggleFullScreen': navigation('Panel: Toggle Full Screen'),
  'discovery.run': discovery('Discovery: Run'),
  'discovery.kill': discovery('Discovery: Kill Command'),
  'nodes.group': nodes('Nodes: Group Selected', 'notTyping'),
  'nodes.ungroup': nodes('Nodes: Ungroup Selected', 'notTyping'),
  'nodes.hideSelected': nodes('Nodes: Hide Selected', 'canvas'),
  'nodes.undo': { ...nodes('Nodes: Undo', 'canvas'), repeats: true },
  'nodes.redo': { ...nodes('Nodes: Redo', 'canvas'), repeats: true },
  'tool.select': nodes('Tool: Selection', 'canvas'),
  'tool.hand': nodes('Tool: Hand', 'canvas'),
  'tool.handHold': nodes('Tool: Hand While Held', 'canvasNoButton'),
}

function navigation(title: string, scope: Scope = 'notTyping'): CommandInfo {
  return { section: 'Navigation', title, scope, repeats: false }
}

function discovery(title: string): CommandInfo {
  return { section: 'Discovery', title, scope: 'notTyping', repeats: false }
}

function nodes(title: string, scope: Scope): CommandInfo {
  return { section: 'Nodes', title, scope, repeats: false }
}

export interface DefaultKeybinding {
  readonly id: string
  readonly command: CommandId
  readonly shortcut: string
}

export const LAYOUT_COMMANDS = [
  'layout.select1',
  'layout.select2',
  'layout.select3',
  'layout.select4',
  'layout.select5',
  'layout.select6',
] as const satisfies readonly CommandId[]

export function getDefaultKeybindings(platform: Platform): DefaultKeybinding[] {
  const bindings: Omit<DefaultKeybinding, 'id'>[] = [
    { command: 'search.toggle', shortcut: 'Mod+K' },
    { command: 'search.open', shortcut: '/' },
    { command: 'search.open', shortcut: 'Alt+P' },
    ...LAYOUT_COMMANDS.map((command, index) => ({
      command,
      shortcut: `Alt+${index + 1}`,
    })),
    { command: 'panel.add', shortcut: 'Alt+Enter' },
    { command: 'panel.close', shortcut: 'Alt+Q' },
    { command: 'panel.toggleFullScreen', shortcut: 'Alt+F' },
    { command: 'discovery.run', shortcut: 'Alt+R' },
    { command: 'discovery.kill', shortcut: 'Alt+K' },
    { command: 'nodes.group', shortcut: 'Alt+G' },
    { command: 'nodes.ungroup', shortcut: 'Alt+Shift+G' },
    // The first shortcut is the one tooltips show, and Mac keyboards label
    // Backspace as delete.
    ...hideShortcuts(platform).map((shortcut) => ({
      command: 'nodes.hideSelected' as const,
      shortcut,
    })),
    { command: 'nodes.undo', shortcut: 'Mod+Z' },
    { command: 'nodes.redo', shortcut: 'Mod+Shift+Z' },
    ...(platform === 'other'
      ? [{ command: 'nodes.redo' as const, shortcut: 'Mod+Y' }]
      : []),
    { command: 'tool.select', shortcut: 'V' },
    { command: 'tool.hand', shortcut: 'H' },
    { command: 'tool.handHold', shortcut: 'Space' },
  ]
  return bindings.map((binding) => ({
    ...binding,
    id: `${binding.command}/${binding.shortcut}`,
  }))
}

function hideShortcuts(platform: Platform): string[] {
  return platform === 'mac' ? ['Backspace', 'Delete'] : ['Delete', 'Backspace']
}

export function isHoldCommand(command: CommandId): command is HoldCommandId {
  return HOLD_COMMAND_IDS.some((id) => id === command)
}

export function parseCommandId(value: string): CommandId | undefined {
  return COMMAND_IDS.find((id) => id === value)
}
