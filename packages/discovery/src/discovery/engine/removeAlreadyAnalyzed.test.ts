import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'

import type {
  AddressesWithTemplates,
  Analysis,
  AnalyzedContract,
  ExtendedTemplate,
} from '../analysis/AddressAnalyzer'
import { EMPTY_ANALYZED_CONTRACT, EMPTY_ANALYZED_EOA } from '../utils/testUtils'
import { removeAlreadyAnalyzed } from './removeAlreadyAnalyzed'

describe(removeAlreadyAnalyzed.name, () => {
  const A = ChainSpecificAddress.random()
  const B = ChainSpecificAddress.random()
  const C = ChainSpecificAddress.random()
  const D = ChainSpecificAddress.random()
  const E = ChainSpecificAddress.random()
  const F = ChainSpecificAddress.random()
  const G = ChainSpecificAddress.random()
  const H = ChainSpecificAddress.random()

  it('handles combined case', async () => {
    const resolved: Analysis[] = [
      mockContract(A),
      mockContract(B, {
        template: 'templateForB',
        reason: 'byExtends',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000b',
        ),
      }),
      mockContract(C, {
        template: 'templateForC',
        reason: 'byReferrer',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000c',
        ),
      }),
      { ...EMPTY_ANALYZED_EOA, address: D, type: 'EOA' },
      mockContract(E, {
        template: 'templateForE',
        reason: 'byReferrer',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000e',
        ),
      }),
      mockContract(F, {
        template: 'templateForF',
        reason: 'byReferrer',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000f',
        ),
      }),
    ]
    const toAnalyze: AddressesWithTemplates = {
      [A.toString()]: new Set(['templateForA']),
      [B.toString()]: new Set(['newTemplateForB']), // should be ignored because of the explicit template
      [C.toString()]: new Set(['newTemplateForC']), // should add an error to resolved and be skipped
      [D.toString()]: new Set(['templateForD']), // should be ignored because it's an EOA
      [E.toString()]: new Set(['newTemplateForE1', 'newTemplateForE2']), // should add an error to resolved and be skipped
      [F.toString()]: new Set(['templateForF']), // should be skipped because exactly the same template was analyzed
      [G.toString()]: new Set(['newTemplateForG']),
      [H.toString()]: new Set([]),
    }
    removeAlreadyAnalyzed(toAnalyze, resolved)
    expect(toAnalyze).toEqual({
      [A.toString()]: new Set(['templateForA']),
      [G.toString()]: new Set(['newTemplateForG']),
      [H.toString()]: new Set([]),
    })
    expect(resolved).toEqual([
      mockContract(A),
      mockContract(B, {
        template: 'templateForB',
        reason: 'byExtends',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000b',
        ),
      }),
      mockContract(
        C,
        {
          template: 'templateForC',
          reason: 'byReferrer',
          templateHash: Hash256(
            '0x000000000000000000000000000000000000000000000000000000000000000c',
          ),
        },
        {
          '@template': 'Conflicting templates: newTemplateForC',
        },
      ),
      { ...EMPTY_ANALYZED_EOA, address: D, type: 'EOA' },
      mockContract(
        E,
        {
          template: 'templateForE',
          reason: 'byReferrer',
          templateHash: Hash256(
            '0x000000000000000000000000000000000000000000000000000000000000000e',
          ),
        },
        {
          '@template':
            'Conflicting templates: newTemplateForE1, newTemplateForE2',
        },
      ),
      mockContract(F, {
        template: 'templateForF',
        reason: 'byReferrer',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000f',
        ),
      }),
    ])
  })
})

const mockContract = (
  address: ChainSpecificAddress,
  extendedTemplate?: ExtendedTemplate,
  errors?: Record<string, string>,
): AnalyzedContract => {
  return {
    ...EMPTY_ANALYZED_CONTRACT,
    address,
    name: `NameOf${address.toString()}`,
    isVerified: true,
    values: { a: 1 },
    errors: errors ?? {},
    extendedTemplate,
  }
}
