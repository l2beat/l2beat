import { expect } from 'earl'
import { readConfigOptions } from './config'

describe(readConfigOptions.name, () => {
  it('keeps the model and effort, in that order, flattening groups', () => {
    const options = readConfigOptions({
      configOptions: [
        {
          id: 'effort',
          name: 'Effort',
          category: 'thought_level',
          type: 'select',
          currentValue: 'high',
          options: [{ value: 'high', name: 'High', description: null }],
        },
        {
          id: 'mode',
          name: 'Mode',
          category: 'mode',
          type: 'select',
          currentValue: 'auto',
          options: [{ value: 'auto', name: 'Auto' }],
        },
        {
          id: 'model',
          name: 'Model',
          category: 'model',
          type: 'select',
          currentValue: 'opus',
          options: [
            { group: 'latest', options: [{ value: 'opus', name: 'Opus' }] },
            { value: 'haiku', name: 'Haiku', description: 'Fastest' },
          ],
        },
      ],
    })
    expect(options).toEqual([
      {
        id: 'model',
        name: 'Model',
        category: 'model',
        currentValue: 'opus',
        values: [
          { value: 'opus', name: 'Opus' },
          { value: 'haiku', name: 'Haiku', description: 'Fastest' },
        ],
      },
      {
        id: 'effort',
        name: 'Effort',
        category: 'thought_level',
        currentValue: 'high',
        values: [{ value: 'high', name: 'High' }],
      },
    ])
  })

  it('skips options it cannot read and bounds what it keeps', () => {
    const many = Array.from({ length: 80 }, (_, i) => ({
      value: `m${i}`,
      name: 'x'.repeat(500),
    }))
    const options = readConfigOptions({
      configOptions: [
        { id: 'model', category: 'model', type: 'boolean', currentValue: true },
        {
          id: 'model',
          name: 'Model',
          category: 'model',
          type: 'select',
          currentValue: 'm0',
          options: many,
        },
      ],
    })
    expect(options?.[0]?.values.length).toEqual(60)
    // A value goes back to the agent as it came, so a long one is skipped.
    const long = readConfigOptions({
      configOptions: [
        {
          id: 'model',
          name: 'Model',
          category: 'model',
          type: 'select',
          currentValue: 'm0',
          options: [
            { value: 'm0', name: 'M0' },
            { value: 'x'.repeat(300), name: 'Long' },
          ],
        },
      ],
    })
    expect(long?.[0]?.values.map((v) => v.value)).toEqual(['m0'])
    expect(options?.[0]?.values[0]?.name.length).toEqual(200)
    // A message without options says nothing about them.
    expect(readConfigOptions({ sessionId: 's1' })).toEqual(undefined)
  })
})
