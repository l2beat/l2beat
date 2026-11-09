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
  /** Whether holding the key down runs the command again and again. */
  readonly repeats: boolean
}

export const COMMANDS: Record<CommandId, CommandInfo> = {
  'search.toggle': navigation('Search: Toggle'),
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
  'discovery.run': {
    section: 'Discovery',
    title: 'Discovery: Run',
    repeats: false,
  },
  'discovery.kill': {
    section: 'Discovery',
    title: 'Discovery: Kill Command',
    repeats: false,
  },
  'nodes.group': nodes('Nodes: Group Selected'),
  'nodes.ungroup': nodes('Nodes: Ungroup Selected'),
  'nodes.hideSelected': nodes('Nodes: Hide Selected'),
  'nodes.undo': { section: 'Nodes', title: 'Nodes: Undo', repeats: true },
  'nodes.redo': { section: 'Nodes', title: 'Nodes: Redo', repeats: true },
  'tool.select': nodes('Tool: Selection'),
  'tool.hand': nodes('Tool: Hand'),
  'tool.handHold': nodes('Tool: Hand While Held'),
}

function navigation(title: string): CommandInfo {
  return { section: 'Navigation', title, repeats: false }
}

function nodes(title: string): CommandInfo {
  return { section: 'Nodes', title, repeats: false }
}

export interface DefaultKeybinding {
  readonly id: string
  readonly command: CommandId
  readonly shortcut: string
  readonly when: string | null
}

export const LAYOUT_COMMANDS = [
  'layout.select1',
  'layout.select2',
  'layout.select3',
  'layout.select4',
  'layout.select5',
  'layout.select6',
] as const satisfies readonly CommandId[]

// Shortcuts never take keys typed into a field, except the search toggle,
// which works from anywhere. Space leaves a focused button to press itself.
export const NOT_TYPING = '!inputFocus'
export const ON_CANVAS = 'nodesPanelActive && !searchOpen && !inputFocus'
const ON_CANVAS_SPACE = `${ON_CANVAS} && !controlFocus`

export function getDefaultKeybindings(platform: Platform): DefaultKeybinding[] {
  const bindings: Omit<DefaultKeybinding, 'id'>[] = [
    { command: 'search.toggle', shortcut: 'Mod+K', when: null },
    { command: 'search.open', shortcut: '/', when: NOT_TYPING },
    { command: 'search.open', shortcut: 'Alt+P', when: NOT_TYPING },
    ...LAYOUT_COMMANDS.map((command, index) => ({
      command,
      shortcut: `Alt+${index + 1}`,
      when: NOT_TYPING,
    })),
    { command: 'panel.add', shortcut: 'Alt+Enter', when: NOT_TYPING },
    { command: 'panel.close', shortcut: 'Alt+Q', when: NOT_TYPING },
    { command: 'panel.toggleFullScreen', shortcut: 'Alt+F', when: NOT_TYPING },
    { command: 'discovery.run', shortcut: 'Alt+R', when: NOT_TYPING },
    { command: 'discovery.kill', shortcut: 'Alt+K', when: NOT_TYPING },
    { command: 'nodes.group', shortcut: 'Alt+G', when: NOT_TYPING },
    { command: 'nodes.ungroup', shortcut: 'Alt+Shift+G', when: NOT_TYPING },
    // The first shortcut is the one tooltips show, and Mac keyboards label
    // Backspace as delete.
    ...hideShortcuts(platform).map((shortcut) => ({
      command: 'nodes.hideSelected' as const,
      shortcut,
      when: ON_CANVAS,
    })),
    { command: 'nodes.undo', shortcut: 'Mod+Z', when: ON_CANVAS },
    { command: 'nodes.redo', shortcut: 'Mod+Shift+Z', when: ON_CANVAS },
    ...(platform === 'other'
      ? [{ command: 'nodes.redo' as const, shortcut: 'Mod+Y', when: ON_CANVAS }]
      : []),
    { command: 'tool.select', shortcut: 'V', when: ON_CANVAS },
    { command: 'tool.hand', shortcut: 'H', when: ON_CANVAS },
    { command: 'tool.handHold', shortcut: 'Space', when: ON_CANVAS_SPACE },
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
