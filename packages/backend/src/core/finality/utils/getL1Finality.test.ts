import { HttpClient } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { getL1Finality } from './getL1Finality'

describe(getL1Finality.name, () => {
  it('returns delay for first slot in epoch', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: async () =>
        new Response(
          JSON.stringify({
            data: [
              {
                posConsensus: {
                  slot: 8308960,
                  epoch: 259655,
                },
              },
            ],
          }),
        ),
    })
    const delay = await getL1Finality(httpClient, 19112204)

    expect(delay).toEqual(64 * 12)
  })

  it('returns delay for 3rd slot in epoch', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: async () =>
        new Response(
          JSON.stringify({
            data: [
              {
                posConsensus: {
                  slot: 8308962,
                  epoch: 259655,
                },
              },
            ],
          }),
        ),
    })
    const delay = await getL1Finality(httpClient, 19112204)

    expect(delay).toEqual((29 + 64 + 1) * 12)
  })

  it('returns delay for last slot in epoch', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: async () =>
        new Response(
          JSON.stringify({
            data: [
              {
                posConsensus: {
                  slot: 8308991,
                  epoch: 259655,
                },
              },
            ],
          }),
        ),
    })
    const delay = await getL1Finality(httpClient, 19112204)

    expect(delay).toEqual((0 + 64 + 1) * 12)
  })

  it('returns undefined when wrong response', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: async () =>
        new Response(
          JSON.stringify({
            data: null,
          }),
        ),
    })
    const delay = await getL1Finality(httpClient, 1911220411111)

    expect(delay).toEqual(undefined)
  })
})
