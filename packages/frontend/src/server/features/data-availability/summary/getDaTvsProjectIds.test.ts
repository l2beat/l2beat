import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getDaTvsProjectIds } from './getDaTvsProjectIds'

describe(getDaTvsProjectIds.name, () => {
  it('splits projects by whether their data goes to Ethereum', () => {
    const result = getDaTvsProjectIds([
      system('ethereum', [['base', 'arbitrum']]),
      system('celestia', [['eclipse'], ['derive']]),
      system('eigenda', [['celo']]),
    ])

    expect(result).toEqual({
      fullData: ['base', 'arbitrum'],
      settlementOnly: ['eclipse', 'derive', 'celo'],
    })
  })

  it('counts a project once even when several bridges list it', () => {
    const result = getDaTvsProjectIds([
      system('ethereum', [['base'], ['base']]),
      system('celestia', [['eclipse'], ['eclipse']]),
    ])

    expect(result).toEqual({ fullData: ['base'], settlementOnly: ['eclipse'] })
  })

  it('counts a project that also uses Ethereum as full data', () => {
    const result = getDaTvsProjectIds([
      system('ethereum', [['celo']]),
      system('eigenda', [['celo', 'rise']]),
    ])

    expect(result).toEqual({ fullData: ['celo'], settlementOnly: ['rise'] })
  })

  it('returns nothing when there are no systems', () => {
    expect(getDaTvsProjectIds([])).toEqual({ fullData: [], settlementOnly: [] })
  })
})

function system(id: string, bridges: string[][]) {
  return {
    id: ProjectId(id),
    bridges: bridges.map((ids) => ({ usedIn: ids.map((id) => ({ id })) })),
  }
}
