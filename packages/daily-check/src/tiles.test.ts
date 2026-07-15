import { expect } from 'earl'
import { parseControls } from './tiles'

describe('parseControls', () => {
  it('converts the environment options list (production selected)', () => {
    const result = parseControls({
      panels: {
        'control-1': {
          order: 0,
          type: 'options_list_control',
          config: {
            field_name: 'environment',
            exclude: false,
            exists_selected: false,
            selected_options: ['production'],
            single_select: true,
          },
        },
      },
    })
    expect(result.filters).toEqual([
      { match_phrase: { environment: 'production' } },
    ])
    expect(result.descriptions).toEqual(['environment: production'])
    expect(result.unsupported).toEqual([])
  })

  it('combines multiple selected options with should', () => {
    const result = parseControls({
      panels: {
        'control-1': {
          type: 'options_list_control',
          config: {
            field_name: 'chain',
            selected_options: ['ethereum', 'base'],
          },
        },
      },
    })
    expect(result.filters).toEqual([
      {
        bool: {
          should: [
            { match_phrase: { chain: 'ethereum' } },
            { match_phrase: { chain: 'base' } },
          ],
          minimum_should_match: 1,
        },
      },
    ])
  })

  it('handles exclude and no-selection controls', () => {
    const result = parseControls({
      panels: {
        excluded: {
          order: 1,
          type: 'options_list_control',
          config: {
            field_name: 'environment',
            exclude: true,
            selected_options: ['staging'],
          },
        },
        empty: {
          order: 0,
          type: 'options_list_control',
          config: { field_name: 'chain', selected_options: [] },
        },
      },
    })
    expect(result.filters).toEqual([
      {
        bool: {
          must_not: [{ match_phrase: { environment: 'staging' } }],
        },
      },
    ])
    expect(result.descriptions).toEqual(['NOT environment: staging'])
  })

  it('reports unsupported control types instead of ignoring them', () => {
    const result = parseControls({
      panels: {
        'control-1': { type: 'range_slider_control', config: {} },
      },
    })
    expect(result.filters).toEqual([])
    expect(result.unsupported).toEqual([
      'dashboard control of type "range_slider_control"',
    ])
  })

  it('handles dashboards without controls', () => {
    expect(parseControls(undefined)).toEqual({
      filters: [],
      descriptions: [],
      unsupported: [],
    })
  })
})
