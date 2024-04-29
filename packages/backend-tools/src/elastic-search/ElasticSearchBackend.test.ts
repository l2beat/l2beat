import { expect, mockFn, MockObject, mockObject } from 'earl'

import {
  ElasticSearchBackend,
  ElasticSearchBackendOptions,
  UuidProvider,
} from './ElasticSearchBackend'
import { ElasticSearchClient } from './ElasticSearchClient'
import { formatDate } from '../helpers/formatDate'

const flushInterval = 10
const id = 'some-id'
const indexPrefix = 'logs'
const indexName = createIndexName()
const log = {
  '@timestamp': '2024-04-24T21:02:30.916Z',
  log: {
    level: 'INFO',
  },
  message: 'Update started',
}

describe(ElasticSearchBackend.name, () => {
  it("creates index if doesn't exist", async () => {
    const clientMock = createClienMock(false)
    const backendMock = createBackendMock(clientMock)

    backendMock.log(JSON.stringify(log))

    // wait for log flus
    await delay(flushInterval + 10)

    expect(clientMock.indexExist).toHaveBeenOnlyCalledWith(indexName)
    expect(clientMock.indexCreate).toHaveBeenOnlyCalledWith(indexName)
  })

  it('does nothing if buffer is empty', async () => {
    const clientMock = createClienMock(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const backendMock = createBackendMock(clientMock)

    // wait for log flush
    await delay(flushInterval + 10)

    expect(clientMock.bulk).not.toHaveBeenCalled()
  })

  it('pushes logs to ES if there is something in the buffer', async () => {
    const clientMock = createClienMock(false)
    const backendMock = createBackendMock(clientMock)

    backendMock.log(JSON.stringify(log))

    // wait for log flush
    await delay(flushInterval + 10)

    expect(clientMock.bulk).toHaveBeenOnlyCalledWith(
      [{ id, ...log }],
      indexName,
    )
  })
})

function createClienMock(indextExist = true) {
  return mockObject<ElasticSearchClient>({
    indexExist: mockFn(async (_: string): Promise<boolean> => indextExist),
    indexCreate: mockFn(async (_: string): Promise<void> => {}),
    bulk: mockFn(async (_: object[]): Promise<boolean> => true),
  })
}

function createBackendMock(clientMock: MockObject<ElasticSearchClient>) {
  const uuidProviderMock: UuidProvider = () => id

  const options: ElasticSearchBackendOptions = {
    node: 'node',
    apiKey: 'apiKey',
    indexPrefix,
    flushInterval,
  }

  return new ElasticSearchBackend(options, clientMock, uuidProviderMock)
}

function createIndexName() {
  return `${indexPrefix}-${formatDate(new Date())}`
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
