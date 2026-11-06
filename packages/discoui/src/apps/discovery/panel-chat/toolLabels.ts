// What the agent did in DiscoUI reads as an action on the researcher's
// screen; other calls, like shell commands, show the agent's own title.
const DISCOUI_LABELS: Record<string, string> = {
  show: 'Pointed at it in DiscoUI',
  context: 'Looked at your screen',
  permissions: 'Traced who controls it',
  board: 'Built a board',
  clear: 'Cleared its note',
}

// Claude Code names an MCP tool mcp__server__tool, Codex mcp.server.tool.
const DISCOUI_PREFIXES = ['mcp__discoui__', 'mcp.discoui.']

export interface ToolLabel {
  label: string
  isDiscoUi: boolean
}

export function describeTool(title: string | undefined): ToolLabel {
  if (title === undefined) {
    return { label: 'Tool call', isDiscoUi: false }
  }
  const tool = discoUiTool(title.trim())
  if (tool === undefined) {
    return { label: title, isDiscoUi: false }
  }
  return {
    label: DISCOUI_LABELS[tool] ?? `Used DiscoUI ${tool}`,
    isDiscoUi: true,
  }
}

function discoUiTool(title: string): string | undefined {
  for (const prefix of DISCOUI_PREFIXES) {
    if (title.startsWith(prefix)) {
      return title.slice(prefix.length)
    }
  }
  return undefined
}
