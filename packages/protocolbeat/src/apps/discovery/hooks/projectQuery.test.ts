import { QueryClient } from '@tanstack/react-query'
import { expect } from 'earl'
import { invalidateProjectPayloads } from './projectQuery'

describe(invalidateProjectPayloads.name, () => {
  const KEYS = [
    ['projects', 'ccip', null],
    ['projects', 'ccip', 2],
    ['projects', 'lido', null],
    ['projects', 'ccip', 'preview'],
    ['projects', 'ccip', 'code', 'eth:0x01'],
    ['projects', 'ccip', 'tvl', 'eth:0x01', 10],
    ['projects'],
  ] as const

  function invalidatedAfter(project: string | undefined) {
    const queryClient = new QueryClient()
    for (const key of KEYS) {
      queryClient.setQueryData(key, {})
    }
    void invalidateProjectPayloads(queryClient, project)
    return KEYS.filter(
      (key) => queryClient.getQueryState(key)?.isInvalidated === true,
    )
  }

  it('invalidates only the payloads of the given project', () => {
    expect(invalidatedAfter('ccip')).toEqual([
      ['projects', 'ccip', null],
      ['projects', 'ccip', 2],
    ])
  })

  it('invalidates the payloads of every project', () => {
    expect(invalidatedAfter(undefined)).toEqual([
      ['projects', 'ccip', null],
      ['projects', 'ccip', 2],
      ['projects', 'lido', null],
    ])
  })
})
