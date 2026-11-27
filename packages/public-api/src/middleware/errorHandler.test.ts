import type { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import type { Request, Response } from 'express'
import { errorHandler } from './errorHandler'

// Why: partners may still send the API key they were once given, and a
// failed request must not write that secret to the logs.
// How: a failing request with ?apiKey= reaches the handler; read the log.
describe(errorHandler.name, () => {
  it('leaves the API key out of the error log', () => {
    const error = mockFn().returns(undefined)
    const logger = mockObject<Logger>({
      for: () => mockObject<Logger>({ error, warn: mockFn() }),
    })
    const req = mockObject<Request>({
      method: 'GET',
      originalUrl: '/v1/tvs?range=7d&apiKey=secret',
      headers: {},
    })
    const res = mockObject<Response>({
      headersSent: false,
      statusCode: 500,
      status: mockFn().returns(undefined),
      setHeader: mockFn().returns(undefined),
      json: mockFn().returns(undefined),
    })

    errorHandler(logger)(new Error('boom'), req, res, mockFn())

    expect(error).toHaveBeenOnlyCalledWith(
      'Error processing request',
      expect.subset({ url: '/v1/tvs', queryParams: { range: '7d' } }),
    )
    expect(JSON.stringify(error.calls[0]?.args)).not.toInclude('secret')
  })
})
