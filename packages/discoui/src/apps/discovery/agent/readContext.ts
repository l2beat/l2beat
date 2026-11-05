import type { ApiAgentContext } from '../../../api/types'
import { useCodeStore } from '../../../components/editor/store'
import { CODE_PANEL_EDITOR_ID } from '../panel-code/CodePanel'
import { usePanelStore } from '../store/panel-store'
import { useAgentStore } from './store'

// The server refuses more, and nobody selects this many by hand.
const SELECTED_MAX = 200

// What the researcher looks at, in addresses and offsets only: the server
// reads names and code from disk itself.
export function readContext(project: string | undefined): ApiAgentContext {
  if (project === undefined) {
    return { project: undefined, selected: [] }
  }
  const selected = usePanelStore.getState().selected.slice(0, SELECTED_MAX)
  const { show, index } = useAgentStore.getState()
  return {
    project,
    selected,
    code: readCodeSelection(selected[0]),
    note:
      show?.project === project
        ? { index, stepCount: show.steps.length }
        : undefined,
  }
}

// The code panel shows the first selected contract, one source per file.
function readCodeSelection(
  address: string | undefined,
): ApiAgentContext['code'] {
  if (address === undefined) {
    return undefined
  }
  const editor = useCodeStore.getState().getEditor(CODE_PANEL_EDITOR_ID)
  const prefix = `${address}/`
  const fileId = editor?.activeFileId
  if (editor === undefined || !fileId?.startsWith(prefix)) {
    return undefined
  }
  const { from, to } = editor.getSelection()
  return { address, sourceName: fileId.slice(prefix.length), from, to }
}
