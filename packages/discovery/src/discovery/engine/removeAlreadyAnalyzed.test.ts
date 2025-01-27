import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'

import type {
  AddressesWithTemplates,
  Analysis,
  AnalyzedContract,
  ExtendedTemplate,
} from '../analysis/AddressAnalyzer'
import { EMPTY_ANALYZED_CONTRACT } from '../utils/testUtils'
import { removeAlreadyAnalyzed } from './removeAlreadyAnalyzed'

describe(removeAlreadyAnalyzed.name, () => {
  const A = EthereumAddress.from('0xA')
  const B = EthereumAddress.from('0xB')
  const C = EthereumAddress.from('0xC')
  const D = EthereumAddress.from('0xD')
  const E = EthereumAddress.from('0xE')
  const F = EthereumAddress.from('0xF')
  const G = EthereumAddress.from('0x1')
  const H = EthereumAddress.from('0x2')

  it('handles combined case', async () => {
    const resolved: Analysis[] = [
      generateFakeAnalysis(A),
      generateFakeAnalysis(B, {
        template: 'templateForB',
        reason: 'byExtends',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000b',
        ),
      }),
      generateFakeAnalysis(C, {
        template: 'templateForC',
        reason: 'byReferrer',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000c',
        ),
      }),
      { address: D, type: 'EOA' },
      generateFakeAnalysis(E, {
        template: 'templateForE',
        reason: 'byReferrer',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000e',
        ),
      }),
      generateFakeAnalysis(F, {
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
      generateFakeAnalysis(A),
      generateFakeAnalysis(B, {
        template: 'templateForB',
        reason: 'byExtends',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000b',
        ),
      }),
      generateFakeAnalysis(
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
      { address: D, type: 'EOA' },
      generateFakeAnalysis(
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
      generateFakeAnalysis(F, {
        template: 'templateForF',
        reason: 'byReferrer',
        templateHash: Hash256(
          '0x000000000000000000000000000000000000000000000000000000000000000f',
        ),
      }),
    ])
  })
})

const generateFakeAnalysis = (
  address: EthereumAddress,
  extendedTemplate?: ExtendedTemplate,
  errors?: Record<string, string>,
): AnalyzedContract => {
  return {
    ...EMPTY_ANALYZED_CONTRACT,
    address,
    name: `NameOf${address.toString()}`,
    derivedName: undefined,
    isVerified: true,
    values: { a: 1 },
    errors: errors ?? {},
    extendedTemplate,
  }
}
