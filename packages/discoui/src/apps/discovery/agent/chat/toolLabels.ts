// What the agent did in DiscoUI reads as an action on the researcher's
// screen; the call stays one hover away.
const DISCOUI_LABELS: Record<string, string> = {
  context: 'Looked at your screen',
  state: 'Read your graph',
  permissions: 'Traced who controls it',
  find: 'Searched the graph',
  show: 'Pointed at it in DiscoUI',
  tour: 'Built a tour in DiscoUI',
  view: 'Changed your graph',
  control_map: 'Mapped who controls what',
  discard: 'Put your graph back',
  clear: 'Cleared its note',
  board: 'Built a board',
  boards: 'Looked at your boards',
}

const DRY_RUN_LABELS: Record<string, string> = {
  view: 'Tried a view',
  control_map: 'Tried a control map',
}

// Claude Code names an MCP tool mcp__server__tool, Codex mcp.server.tool,
// and a shell call runs the same tool as `l2b ui-agent <tool>`.
const DISCOUI_PREFIXES = ['mcp__discoui__', 'mcp.discoui.']
const CLI_COMMAND = 'ui-agent '

export interface ToolLabel {
  label: string
  inDiscoUi: boolean
  // The agent's own title, like a shell command, shown as code.
  verbatim: boolean
}

export function describeTool(title: string, dryRun = false): ToolLabel {
  const command = unquote(title.trim())
  // Claude names a shell call before it knows the command.
  if (command === 'Terminal') {
    return { label: 'Running a command', inDiscoUi: false, verbatim: false }
  }
  if (command === 'ToolSearch') {
    return { label: 'Looked up its tools', inDiscoUi: false, verbatim: false }
  }
  const tool = discoUiTool(command)
  if (tool === undefined) {
    return { label: command, inDiscoUi: false, verbatim: true }
  }
  const label =
    (dryRun || command.includes('--dry-run')
      ? DRY_RUN_LABELS[tool]
      : undefined) ??
    DISCOUI_LABELS[tool] ??
    `Used DiscoUI ${tool}`
  return { label, inDiscoUi: true, verbatim: false }
}

const BOARD_RESULT = 'Board '

// The board tool answers "Board <id> ...", which lets the transcript open
// the board it built.
export function builtBoardId(
  title: string,
  output: string,
): string | undefined {
  if (discoUiTool(unquote(title.trim())) !== 'board') {
    return undefined
  }
  const text = output.startsWith('```')
    ? output.slice(output.indexOf('\n') + 1)
    : output
  if (!text.startsWith(BOARD_RESULT)) {
    return undefined
  }
  const rest = text.slice(BOARD_RESULT.length)
  const end = rest.indexOf(' ')
  return end > 0 ? rest.slice(0, end) : undefined
}

function discoUiTool(command: string): string | undefined {
  for (const prefix of DISCOUI_PREFIXES) {
    if (command.startsWith(prefix)) {
      return command.slice(prefix.length)
    }
  }
  const at = command.indexOf(CLI_COMMAND)
  if (at === -1) {
    return undefined
  }
  const rest = command.slice(at + CLI_COMMAND.length).trimStart()
  const end = rest.indexOf(' ')
  return (end === -1 ? rest : rest.slice(0, end)).replaceAll('-', '_')
}

function unquote(text: string): string {
  if (text.length >= 2 && text.startsWith('"') && text.endsWith('"')) {
    return text.slice(1, -1)
  }
  return text
}
