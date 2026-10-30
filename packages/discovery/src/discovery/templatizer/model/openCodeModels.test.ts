import { expect } from 'earl'
import { parseVerboseModels } from './openCodeModels'

describe(parseVerboseModels.name, () => {
  it('reads the effort levels of every model, none for a model without variants', () => {
    const listing = [
      'opencode-go/deepseek-v4.1-flash',
      '{',
      '  "id": "deepseek-v4.1-flash",',
      '  "limit": { "context": 1000000, "output": 384000 },',
      '  "variants": {',
      '    "low": { "reasoningEffort": "low" },',
      '    "high": { "reasoningEffort": "high" },',
      '    "max": { "reasoningEffort": "max" }',
      '  }',
      '}',
      'opencode-go/kimi-k2.7-code',
      '{',
      '  "id": "kimi-k2.7-code",',
      '  "variants": {}',
      '}',
      'opencode-go/minimax-m2.7',
      '{ "id": "minimax-m2.7" }',
      '',
    ].join('\n')

    expect([...parseVerboseModels(listing)]).toEqual([
      ['opencode-go/deepseek-v4.1-flash', ['low', 'high', 'max']],
      ['opencode-go/kimi-k2.7-code', []],
      ['opencode-go/minimax-m2.7', []],
    ])
  })

  it('throws rather than guess when a block no longer parses', () => {
    expect(() =>
      parseVerboseModels('opencode-go/deepseek-v4.1-flash\nid: deepseek\n'),
    ).toThrow(
      "could not read opencode-go/deepseek-v4.1-flash in opencode's model list",
    )
  })
})
