import { expect } from 'earl'
import { sharedName } from './sharedName'

describe(sharedName.name, () => {
  it('keeps the words all names start with', () => {
    expect(sharedName(['InfStones 01', 'InfStones - Claystack'])).toEqual(
      'InfStones',
    )
    expect(sharedName(['Finoa CS - EtherFi10', 'Finoa CS - EtherFi2'])).toEqual(
      'Finoa CS',
    )
  })

  it('drops a word the names only share in part', () => {
    expect(
      sharedName(['Chainnodes - EtherFi5', 'Chainnodes - Etherfi10']),
    ).toEqual('Chainnodes')
    expect(
      sharedName(['NodeMonster - EtherFi', 'NodeMonster - EtherFi10']),
    ).toEqual('NodeMonster')
  })

  it('drops protocol names the operator added', () => {
    expect(sharedName(['Lido - Nethermind'])).toEqual('Nethermind')
    expect(
      sharedName(['Chainnodes - EtherFi5', 'Lido - Chainnodes 1']),
    ).toEqual('Chainnodes')
  })

  it('keeps a name followed only by numbers', () => {
    expect(sharedName(['Kiln1', 'Kiln2'])).toEqual('Kiln')
    expect(sharedName(['Stakin', 'Stakingverse'])).toEqual(undefined)
  })

  it('gives nothing when the names share no word', () => {
    expect(sharedName(['Alpha 1', 'Beta 2'])).toEqual(undefined)
    expect(sharedName(['EtherFi 1', 'EtherFi 2'])).toEqual(undefined)
    expect(sharedName([])).toEqual(undefined)
  })
})
