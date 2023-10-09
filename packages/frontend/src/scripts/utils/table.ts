type TableState = 'empty' | null

export function setTableState(table: HTMLElement, state: TableState) {
  if (state === null) {
    delete table.dataset.state
    return
  }
  table.dataset.state = state
}
