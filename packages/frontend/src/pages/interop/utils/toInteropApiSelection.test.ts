import { expect } from 'earl'
import { toInteropApiSelection } from './toInteropApiSelection'

describe(toInteropApiSelection.name, () => {
  it('maps public pair to bidirectional api selection', () => {
    const result = toInteropApiSelection(
      {
        from: ['ethereum'],
        to: ['arbitrum'],
      },
      'public',
    )

    expect(result).toEqual({
      from: ['ethereum', 'arbitrum'],
      to: ['ethereum', 'arbitrum'],
    })
  })

  it('returns empty api selection for incomplete public pair', () => {
    const result = toInteropApiSelection(
      {
        from: ['ethereum'],
        to: [],
      },
      'public',
    )

    expect(result).toEqual({
      from: [],
      to: [],
    })
  })

  it('returns internal selection unchanged', () => {
    const selection = {
      from: ['ethereum'],
      to: ['base'],
    }

    const result = toInteropApiSelection(selection, 'internal')
    expect(result).toEqual(selection)
  })
})
