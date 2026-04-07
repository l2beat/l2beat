import FakeTimers from '@sinonjs/fake-timers'
import { expect, type MockObject, mockFn, mockObject } from 'earl'
import { describe } from 'mocha'
import type { ElasticSearchClient } from './ElasticSearchClient'
import {
  ElasticSearchTransport,
  type ElasticSearchTransportOptions,
  formatDate,
  type UuidProvider,
} from './ElasticSearchTransport'

const flushInterval = 10
const id = 'some-id'
const indexPrefix = 'logs'
/** Fixed instant so `createIndex()` and assertions share the same index name. */
const fixedNow = new Date('2024-04-24T12:00:00.000Z')
const expectedIndexName = `${indexPrefix}-${formatDate(fixedNow)}`

const log = {
  '@timestamp': '2024-04-24T21:02:30.916Z',
  log: {
    level: 'INFO',
  },
  message: 'Update started',
}

describe(ElasticSearchTransport.name, () => {
  let clock: FakeTimers.InstalledClock
  let savedConsoleLog: typeof console.log

  beforeEach(() => {
    savedConsoleLog = console.log
    console.log = () => {}
    clock = FakeTimers.install({ now: fixedNow, shouldClearNativeTimers: true })
  })

  afterEach(() => {
    console.log = savedConsoleLog
    clock.uninstall()
  })

  it("creates index if doesn't exist", async () => {
    const clientMock = createClientMock(false)
    const transportMock = createTransportMock(clientMock)

    transportMock.push(JSON.stringify(log))

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.indexExist).toHaveBeenOnlyCalledWith(expectedIndexName)
    expect(clientMock.indexCreate).toHaveBeenOnlyCalledWith(expectedIndexName)
  })

  it('does nothing if buffer is empty', async () => {
    const clientMock = createClientMock(false)
    createTransportMock(clientMock)

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).not.toHaveBeenCalled()
  })

  it('pushes logs to ES if there is something in the buffer', async () => {
    const clientMock = createClientMock(false)
    const transportMock = createTransportMock(clientMock)

    transportMock.push(JSON.stringify(log))

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).toHaveBeenOnlyCalledWith(
      [{ id, ...log }],
      expectedIndexName,
    )
  })

  it('keeps only the newest logs when buffer limit is exceeded', async () => {
    const clientMock = createClientMock(false)
    const transportMock = createTransportMock(clientMock, { bufferLimit: 2 })

    transportMock.push(
      JSON.stringify({
        ...log,
        message: 'first',
      }),
    )
    transportMock.push(
      JSON.stringify({
        ...log,
        message: 'second',
      }),
    )
    transportMock.push(
      JSON.stringify({
        ...log,
        message: 'third',
      }),
    )

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).toHaveBeenCalledTimes(2)

    expect(clientMock.bulk).toHaveBeenNthCalledWith(
      1,
      [
        expect.subset({
          id,
          log: { level: 'CRITICAL' },
          parameters: { droppedCount: 1, bufferLimit: 2 },
        }),
      ],
      expectedIndexName,
    )

    expect(clientMock.bulk).toHaveBeenNthCalledWith(
      2,
      [
        { id, ...log, message: 'second' },
        { id, ...log, message: 'third' },
      ],
      expectedIndexName,
    )
  })

  it('uses the default buffer limit when explicit limit is not provided', async () => {
    const clientMock = createClientMock(false)
    const transportMock = createTransportMock(clientMock)

    for (let i = 0; i < 20_001; i++) {
      transportMock.push(
        JSON.stringify({
          ...log,
          message: `log-${i}`,
        }),
      )
    }

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).toHaveBeenCalledTimes(2)

    expect(clientMock.bulk).toHaveBeenNthCalledWith(
      1,
      [
        expect.subset({
          id,
          log: { level: 'CRITICAL' },
          parameters: {
            droppedCount: 1,
            bufferLimit: 20_000,
          },
        }),
      ],
      expectedIndexName,
    )

    const [documents] = clientMock.bulk.calls[1]!.args
    expect(documents).toHaveLength(20_000)
    expect(documents[0]).toEqual({ id, ...log, message: 'log-1' })
    expect(documents[19_999]).toEqual({ id, ...log, message: 'log-20000' })
  })

  it('does not trim logs when buffer stays within the configured limit', async () => {
    const clientMock = createClientMock(false)
    const transportMock = createTransportMock(clientMock, { bufferLimit: 3 })

    transportMock.push(
      JSON.stringify({
        ...log,
        message: 'first',
      }),
    )
    transportMock.push(
      JSON.stringify({
        ...log,
        message: 'second',
      }),
    )

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).toHaveBeenOnlyCalledWith(
      [
        { id, ...log, message: 'first' },
        { id, ...log, message: 'second' },
      ],
      expectedIndexName,
    )
  })

  it('runs recovery bulk with ERROR ECS log when primary bulk reports failures', async () => {
    const failedDocuments = [{ reason: 'test' }]
    const clientMock = createClientMock(false, [
      { isSuccess: false as const, failedDocuments },
      { isSuccess: true as const },
    ])
    const transportMock = createTransportMock(clientMock)

    transportMock.push(JSON.stringify(log))

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).toHaveBeenCalledTimes(2)

    expect(clientMock.bulk).toHaveBeenNthCalledWith(
      1,
      [{ id, ...log }],
      expectedIndexName,
    )

    expect(clientMock.bulk).toHaveBeenNthCalledWith(
      2,
      [
        expect.subset({
          id,
          log: { level: 'ERROR' },
          message: 'Failed to push some logs to Elastic Search node',
          parameters: {
            cause: {
              failedDocuments: JSON.stringify(failedDocuments),
            },
          },
        }),
      ],
      expectedIndexName,
    )
  })

  it('runs recovery bulk when buffer line is not valid JSON', async () => {
    const clientMock = createClientMock(false, [{ isSuccess: true as const }])
    const transportMock = createTransportMock(clientMock)

    transportMock.push('not valid json')

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).toHaveBeenCalledTimes(1)

    const [recoveryDocs] = clientMock.bulk.calls[0]!.args
    expect(recoveryDocs).toHaveLength(1)

    const recoveryDoc = recoveryDocs[0] as Record<string, unknown>
    expect(recoveryDoc.id).toEqual(id)
    const ecs = recoveryDoc as { log: { level: string }; message: string }
    expect(ecs.log.level).toEqual('ERROR')
    expect(ecs.message).toMatchRegex(/not valid JSON|Unexpected token/i)
  })

  it('swallows errors from recovery bulk after primary bulk failure', async () => {
    let bulkCalls = 0
    const clientMock = mockObject<ElasticSearchClient>({
      indexExist: mockFn(async (): Promise<boolean> => false),
      indexCreate: mockFn(async (): Promise<void> => {}),
      bulk: mockFn(async () => {
        bulkCalls++
        if (bulkCalls === 1) {
          return {
            isSuccess: false as const,
            failedDocuments: [{ reason: 'test' }],
          }
        }
        throw new Error('recovery failed')
      }),
    })

    const transportMock = createTransportMock(clientMock)

    transportMock.push(JSON.stringify(log))

    await clock.tickAsync(flushInterval + 1)

    expect(clientMock.bulk).toHaveBeenCalledTimes(2)
  })
})

function createClientMock(
  indexExist = true,
  bulkResponses?: Array<
    | { isSuccess: true }
    | { isSuccess: false; failedDocuments: Record<string, unknown>[] }
  >,
) {
  const queue =
    bulkResponses !== undefined
      ? [...bulkResponses]
      : [{ isSuccess: true as const }]

  return mockObject<ElasticSearchClient>({
    indexExist: mockFn(async (_: string): Promise<boolean> => indexExist),
    indexCreate: mockFn(async (_: string): Promise<void> => {}),
    bulk: mockFn(async () => {
      const next = queue.shift()
      if (next === undefined) {
        return { isSuccess: true as const }
      }
      return next
    }),
  })
}

function createTransportMock(
  clientMock: MockObject<ElasticSearchClient>,
  extraOptions: Partial<ElasticSearchTransportOptions> = {},
) {
  const uuidProviderMock: UuidProvider = () => id

  const options: ElasticSearchTransportOptions = {
    node: 'node',
    apiKey: 'apiKey',
    indexPrefix,
    flushInterval,
    ...extraOptions,
  }

  return new ElasticSearchTransport(options, clientMock, uuidProviderMock)
}
