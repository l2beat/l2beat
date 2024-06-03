import { EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { getRelativesWithSuggestedTemplates } from './getRelativesWithSuggestedTemplates'

describe(getRelativesWithSuggestedTemplates.name, () => {
  const ADDRESS_A = EthereumAddress.random()
  const ADDRESS_B = EthereumAddress.random()
  const ADDRESS_C = EthereumAddress.random()
  const ADDRESS_D = EthereumAddress.random()
  const ADDRESS_E = EthereumAddress.random()

  it('returns addresses found in values', () => {
    const relatives = getRelativesWithSuggestedTemplates([
      { field: 'a', value: ADDRESS_A.toString() },
      { field: 'b', value: [ADDRESS_B.toString(), ADDRESS_C.toString()] },
      {
        field: 'c',
        value: { d: ADDRESS_D.toString(), e: ADDRESS_E.toString() },
      },
    ])

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(),
      [ADDRESS_B.toString()]: new Set(),
      [ADDRESS_C.toString()]: new Set(),
      [ADDRESS_D.toString()]: new Set(),
      [ADDRESS_E.toString()]: new Set(),
    })
  })

  it('deduplicated addresses', () => {
    const relatives = getRelativesWithSuggestedTemplates([
      { field: 'a', value: ADDRESS_A.toString() },
      { field: 'b', value: ADDRESS_A.toString() },
      { field: 'c', value: ADDRESS_B.toString() },
    ])

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(),
      [ADDRESS_B.toString()]: new Set(),
    })
  })

  it('ignores fields with ignoreRelative', () => {
    const relatives = getRelativesWithSuggestedTemplates([
      { field: 'a', value: ADDRESS_A.toString() },
      { field: 'b', value: ADDRESS_B.toString(), ignoreRelative: true },
      { field: 'c', value: ADDRESS_C.toString() },
    ])

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(),
      [ADDRESS_C.toString()]: new Set(),
    })
  })

  it('ignores fields in the ignoreFields array', () => {
    const relatives = getRelativesWithSuggestedTemplates(
      [
        { field: 'a', value: ADDRESS_A.toString() },
        { field: 'b', value: ADDRESS_B.toString() },
        { field: 'c', value: ADDRESS_C.toString() },
      ],
      ['b'],
    )

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(),
      [ADDRESS_C.toString()]: new Set(),
    })
  })

  it('includes known relatives', () => {
    const relatives = getRelativesWithSuggestedTemplates(
      [
        { field: 'a', value: ADDRESS_A.toString() },
        { field: 'b', value: ADDRESS_B.toString() },
      ],
      [],
      [ADDRESS_C],
    )

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(),
      [ADDRESS_B.toString()]: new Set(),
      [ADDRESS_C.toString()]: new Set(),
    })
  })

  it('ignores ignored addresses', () => {
    const relatives = getRelativesWithSuggestedTemplates(
      [
        { field: 'a', value: ADDRESS_A.toString() },
        { field: 'b', value: ADDRESS_B.toString() },
        { field: 'c', value: ADDRESS_C.toString() },
      ],
      [],
      [],
      [ADDRESS_B],
    )

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(),
      [ADDRESS_C.toString()]: new Set(),
    })
  })

  it('returns addresses found in values with proper suggested templates', () => {
    const relatives = getRelativesWithSuggestedTemplates(
      [
        { field: 'a', value: ADDRESS_A.toString() },
        { field: 'b', value: [ADDRESS_B.toString(), ADDRESS_C.toString()] },
        {
          field: 'c',
          value: { d: ADDRESS_D.toString(), e: ADDRESS_E.toString() },
        },
        { field: 'd', value: ADDRESS_A.toString() },
      ],
      undefined,
      undefined,
      undefined,
      {
        a: {
          target: {
            template: 'template1',
          },
        },
        b: {
          target: {
            template: 'template2',
          },
        },
        c: {
          target: {
            template: 'template4',
          },
        },
        d: {
          target: {
            template: 'template3',
          },
        },
      },
    )

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(['template1', 'template3']),
      [ADDRESS_B.toString()]: new Set(['template2']),
      [ADDRESS_C.toString()]: new Set(['template2']),
      [ADDRESS_D.toString()]: new Set(['template4']),
      [ADDRESS_E.toString()]: new Set(['template4']),
    })
  })

  it('follows all rules at the same time', () => {
    const relatives = getRelativesWithSuggestedTemplates(
      [
        { field: 'first', value: ADDRESS_A.toString() },
        { field: 'second', value: ADDRESS_B.toString() },
        { field: 'third', value: ADDRESS_A.toString() },
        { field: 'fourth', value: ADDRESS_C.toString() },
        { field: 'fifth', value: ADDRESS_C.toString() },
      ],
      ['second'],
      [ADDRESS_D],
      [ADDRESS_C],
      {
        first: {
          target: {
            template: 'template1',
          },
        },
        second: {
          target: {
            template: 'template2',
          },
        },
        third: {
          target: {
            template: 'template2',
          },
        },
      },
    )

    expect(relatives).toEqual({
      [ADDRESS_A.toString()]: new Set(['template1', 'template2']),
      [ADDRESS_D.toString()]: new Set(),
    })
  })
})
