import type { PanelId } from '../multi-view/store'

type DirtyCheck = () => boolean

const dirtyChecks = new Map<PanelId, DirtyCheck>()

export function registerPanelDirtyCheck(
  panelId: PanelId,
  check: DirtyCheck,
): () => void {
  dirtyChecks.set(panelId, check)
  return () => {
    dirtyChecks.delete(panelId)
  }
}

export function confirmPanelLeave(panelId: PanelId): boolean {
  const check = dirtyChecks.get(panelId)
  if (!check || !check()) return true
  return window.confirm(
    'You have unsaved changes. Are you sure you want to leave?',
  )
}
