import type { ApiAgentStep } from '../../../api/types'
import { useCodeStore } from '../../../components/editor/store'
import { useDockingStore } from '../multi-view/store'
import { usePanelStore } from '../store/panel-store'

// Moves the selection and the code view like "go to definition": nothing is
// put back when the researcher pages on or closes the note.
export function applyStep(step: ApiAgentStep) {
  // The graph follows the global selection, drawing what it can, and the
  // code panel shows its first contract, the step's code contract.
  if (step.select.length > 0) {
    usePanelStore.getState().select(step.select)
  }
  if (step.code === undefined) {
    return
  }
  useDockingStore.getState().ensureLeaf('code')
  const code = useCodeStore.getState()
  code.setSourceIndex(step.code.address, step.code.sourceIndex)
  code.showRange(step.code.address, {
    startOffset: step.code.offset,
    length: step.code.length,
  })
}
