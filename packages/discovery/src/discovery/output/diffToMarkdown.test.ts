import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DiscoveryDiff } from './diffDiscovery'
import {
  contractDiffToMarkdown,
  discoveryDiffToMarkdown,
  fieldDiffToMarkdown,
} from './diffToMarkdown'

const ADDRESS = ChainSpecificAddress.random()

describe(discoveryDiffToMarkdown.name, () => {
  const SECOND_ADDRESS = ChainSpecificAddress.random()

  const FOO_CONTRACT_DIFF: DiscoveryDiff = {
    name: 'foo',
    address: ADDRESS,
    addressType: 'Contract',
    diff: [
      {
        key: 'values.baz',
        before: 'quax',
        after: 'quox',
        description: 'The foo value',
        severity: 'LOW',
      },
    ],
  }
  const BAR_CONTRACT_DIFF: DiscoveryDiff = {
    name: 'bar',
    address: SECOND_ADDRESS,
    addressType: 'Contract',
    description: 'The contract getting deleted',
    type: 'deleted',
  }

  it('multi contract diff, meta', () => {
    const result = discoveryDiffToMarkdown([
      FOO_CONTRACT_DIFF,
      BAR_CONTRACT_DIFF,
    ])

    expect(result).toEqual(
      [
        '```diff',
        `    contract foo (${ADDRESS.toString()}) {`,
        '    +++ description: None',
        '+++ description: The foo value',
        '+++ severity: LOW',
        '      values.baz:',
        '-        quax',
        '+        quox',
        '    }',
        '```',
        '',
        '```diff',
        '-   Status: DELETED',
        `    contract bar (${SECOND_ADDRESS.toString()})`,
        '    +++ description: The contract getting deleted',
        '```',
      ].join('\n'),
    )
  })

  it('truncating, multiple contracts with meta', () => {
    const maxLength = 128
    const result = discoveryDiffToMarkdown(
      [FOO_CONTRACT_DIFF, BAR_CONTRACT_DIFF],
      maxLength,
    )

    expect(result.length).toBeLessThanOrEqual(maxLength)
    expect(result).toEqual(
      [
        '```diff',
        `    contract foo (${ADDRESS.toString()}) {`,
        '    +++ description: Non... (message too long)',
        '```',
      ].join('\n'),
    )
  })

  it('truncating, single contract with meta', () => {
    const maxLength = 48
    const result = discoveryDiffToMarkdown([FOO_CONTRACT_DIFF], maxLength)

    expect(result.length).toBeLessThanOrEqual(maxLength)
    expect(result).toEqual(
      ['```diff', '    contract f... (message too long)', '```'].join('\n'),
    )
  })

  it('multi contract diff, no meta', () => {
    const result = discoveryDiffToMarkdown([
      {
        ...FOO_CONTRACT_DIFF,
        diff: FOO_CONTRACT_DIFF.diff?.map((d) => ({
          ...d,
          description: undefined,
          severity: undefined,
        })),
      },
      { ...BAR_CONTRACT_DIFF, description: undefined },
    ])

    expect(result).toEqual(
      [
        '```diff',
        `    contract foo (${ADDRESS.toString()}) {`,
        '    +++ description: None',
        '      values.baz:',
        '-        quax',
        '+        quox',
        '    }',
        '```',
        '',
        '```diff',
        '-   Status: DELETED',
        `    contract bar (${SECOND_ADDRESS.toString()})`,
        '    +++ description: None',
        '```',
      ].join('\n'),
    )
  })

  it('single contract diff, no meta', () => {
    const result = discoveryDiffToMarkdown([
      {
        ...FOO_CONTRACT_DIFF,
        diff: FOO_CONTRACT_DIFF.diff?.map((d) => ({
          ...d,
          description: undefined,
          severity: undefined,
        })),
      },
    ])

    expect(result).toEqual(
      [
        '```diff',
        `    contract foo (${ADDRESS.toString()}) {`,
        '    +++ description: None',
        '      values.baz:',
        '-        quax',
        '+        quox',
        '    }',
        '```',
      ].join('\n'),
    )
  })

  it('empty diffs, no meta', () => {
    const result = discoveryDiffToMarkdown([])
    expect(result).toEqual('')
  })
})

describe(contractDiffToMarkdown.name, () => {
  it('contract creation without diff, no meta', () => {
    const result = contractDiffToMarkdown(
      {
        name: 'foo',
        address: ADDRESS,
        addressType: 'Contract',
        type: 'created',
      },
      undefined,
    )

    expect(result).toEqual(
      [
        '```diff',
        '+   Status: CREATED',
        `    contract foo (${ADDRESS.toString()})`,
        '    +++ description: None',
        '```',
      ].join('\n'),
    )
  })

  it('contract delete without diff, no meta', () => {
    const result = contractDiffToMarkdown(
      {
        name: 'foo',
        address: ADDRESS,
        addressType: 'Contract',
        type: 'deleted',
      },
      undefined,
    )

    expect(result).toEqual(
      [
        '```diff',
        '-   Status: DELETED',
        `    contract foo (${ADDRESS.toString()})`,
        '    +++ description: None',
        '```',
      ].join('\n'),
    )
  })

  it('contract with a known diff, no meta', () => {
    const result = contractDiffToMarkdown(
      {
        name: 'foo',
        address: ADDRESS,
        addressType: 'Contract',
        diff: [
          { key: 'values.bar', before: 'oldValue', after: 'newValue' },
          { key: 'values.baz', before: 'bad', after: 'good' },
        ],
      },
      undefined,
    )

    expect(result).toEqual(
      [
        '```diff',
        `    contract foo (${ADDRESS.toString()}) {`,
        '    +++ description: None',
        '      values.bar:',
        '-        oldValue',
        '+        newValue',
        '      values.baz:',
        '-        bad',
        '+        good',
        '    }',
        '```',
      ].join('\n'),
    )
  })

  it('truncating, no meta', () => {
    const maxLength = 48
    const result = contractDiffToMarkdown(
      {
        name: 'foo',
        address: ADDRESS,
        addressType: 'Contract',
        diff: [
          { key: 'values.bar', before: 'oldValue', after: 'newValue' },
          { key: 'values.baz', before: 'bad', after: 'good' },
        ],
      },
      maxLength,
    )

    expect(result.length).toBeLessThanOrEqual(maxLength)
    expect(result).toEqual(
      ['```diff', '    contract f... (message too long)', '```'].join('\n'),
    )
  })

  it('contract with a known diff, meta', () => {
    const result = contractDiffToMarkdown({
      name: 'foo',
      address: ADDRESS,
      addressType: 'Contract',
      description: 'The foo contract',
      diff: [
        { key: 'values.bar', before: 'oldValue', after: 'newValue' },
        {
          key: 'values.baz',
          before: 'bad',
          after: 'good',
          description: 'The baz value',
          severity: 'LOW',
        },
      ],
    })

    expect(result).toEqual(
      [
        '```diff',
        `    contract foo (${ADDRESS.toString()}) {`,
        '    +++ description: The foo contract',
        '      values.bar:',
        '-        oldValue',
        '+        newValue',
        '+++ description: The baz value',
        '+++ severity: LOW',
        '      values.baz:',
        '-        bad',
        '+        good',
        '    }',
        '```',
      ].join('\n'),
    )
  })
})

describe(fieldDiffToMarkdown.name, () => {
  it('full, no meta', () => {
    const diff = {
      key: 'values.bar',
      before: 'oldValue',
      after: 'newValue',
    }

    expect(fieldDiffToMarkdown(diff, undefined)).toEqual(
      [
        '      values.bar:', // prettier hack
        '-        oldValue',
        '+        newValue',
      ].join('\n'),
    )
  })

  it('before unset', () => {
    const diff = {
      key: 'values.bar',
      after: 'newValue',
    }

    expect(fieldDiffToMarkdown(diff)).toEqual(
      [
        '      values.bar:', // prettier hack
        '+        newValue',
      ].join('\n'),
    )
  })

  it('truncating with no meta', () => {
    const diff = {
      key: 'values.bar',
      before: 'oldValue',
      after: 'newValue',
    }

    const maxLength = 32
    const result = fieldDiffToMarkdown(diff, maxLength)
    expect(result).toEqual('      valu... (message too long)')
    expect(result.length).toBeLessThanOrEqual(maxLength)
  })

  it('all meta information', () => {
    const diff = {
      key: 'values.bar',
      before: 'oldValue',
      after: 'newValue',
      description: 'The bar value',
      severity: 'LOW',
    } as const

    expect(fieldDiffToMarkdown(diff)).toEqual(
      [
        '+++ description: The bar value', // prettier hack
        '+++ severity: LOW',
        '      values.bar:',
        '-        oldValue',
        '+        newValue',
      ].join('\n'),
    )
  })

  it('some meta information', () => {
    const diff = {
      key: 'values.bar',
      before: 'oldValue',
      after: 'newValue',
      severity: 'LOW',
    } as const

    expect(fieldDiffToMarkdown(diff)).toEqual(
      [
        '+++ severity: LOW',
        '      values.bar:',
        '-        oldValue',
        '+        newValue',
      ].join('\n'),
    )
  })

  it('truncating, all meta information', () => {
    const diff = {
      key: 'values.bar',
      before: 'oldValue',
      after: 'newValue',
      description: 'The bar value',
      severity: 'LOW',
    } as const

    const maxLength = 48
    const result = fieldDiffToMarkdown(diff, maxLength)
    expect(result.length).toBeLessThanOrEqual(maxLength)
    expect(result).toEqual('+++ description: The bar v... (message too long)')
  })
})
