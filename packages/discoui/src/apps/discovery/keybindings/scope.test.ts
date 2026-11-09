import { expect } from 'earl'
import { type ScopeContext, scopeApplies } from './scope'

// Every combination of the context flags, compared with each scope's
// definition written out directly.
describe(scopeApplies.name, () => {
  it('matches each scope definition in every context', () => {
    for (const c of allContexts()) {
      const onCanvas =
        c.nodesPanelActive && !c.searchOpen && !c.dialogFocus && !c.inputFocus
      expect(scopeApplies('anywhere', c)).toEqual(true)
      expect(scopeApplies('notTyping', c)).toEqual(!c.inputFocus)
      expect(scopeApplies('canvas', c)).toEqual(onCanvas)
    }
  })
})

function allContexts(): ScopeContext[] {
  const contexts: ScopeContext[] = []
  for (let bits = 0; bits < 32; bits++) {
    contexts.push({
      inputFocus: (bits & 1) !== 0,
      nodesPanelActive: (bits & 2) !== 0,
      searchOpen: (bits & 4) !== 0,
      controlFocus: (bits & 8) !== 0,
      dialogFocus: (bits & 16) !== 0,
    })
  }
  return contexts
}
