import { Logger } from '@l2beat/backend-tools'
import type { json } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { ClientCore } from './ClientCore'
import type { HttpClient } from './http/HttpClient'

describe(ClientCore.name, () => {
  describe(ClientCore.prototype.fetch.name, () => {
    it('Fetches URL with params and returns response', async () => {
      const { clientCore, http } = mocks()

      const response = await clientCore.fetch('https://api.test.com/data', {
        timeout: 1,
      })

      expect(response).toEqual({ result: 'success' })
      expect(http.fetch).toHaveBeenOnlyCalledWith('https://api.test.com/data', {
        timeout: 1,
      })
    })

    it('Retries on error', async () => {
      const { clientCore, http } = mocks()
      http.fetch.rejectsWithOnce(new Error('Network error'))

      await clientCore.fetch('https://api.test.com/data', {})

      expect(http.fetch).toHaveBeenCalledTimes(2)
    })

    it('Throws on invalid response', async () => {
      const { clientCore, http } = mocks()
      http.fetch.resolvesTo(null)

      await expect(
        async () => await clientCore.fetch('https://api.test.com/data', {}),
      ).toBeRejected()
    })
  })
})

function mocks(callsPerMinute?: number) {
  const http = mockObject<HttpClient>({
    fetch: async () => ({ result: 'success' }) as json,
  })

  class TestClientCore extends ClientCore {
    validateResponse(response: unknown): {
      success: boolean
      message?: string
    } {
      return { success: !!response }
    }
  }

  const clientCore = new TestClientCore({
    http,
    callsPerMinute: callsPerMinute ?? 100_000,
    retryStrategy: 'TEST',
    logger: Logger.SILENT,
    sourceName: 'test',
  })

  return {
    clientCore,
    http,
  }
}
