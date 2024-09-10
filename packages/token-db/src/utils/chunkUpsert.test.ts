import { expect, test } from 'vitest'
import { chunkUpsert } from './chunkUpsert.js'

test('correctly chunks an array', () => {
  expect(
    chunkUpsert([{ id: 1 }, { id: 1 }, { id: 1 }], (elem) =>
      elem.id.toString(),
    ),
  ).toStrictEqual([[{ id: 1 }], [{ id: 1 }], [{ id: 1 }]])

  expect(
    chunkUpsert([{ id: 1 }, { id: 2 }, { id: 3 }], (elem) =>
      elem.id.toString(),
    ),
  ).toStrictEqual([[{ id: 1 }, { id: 2 }, { id: 3 }]])

  expect(
    chunkUpsert(
      [{ id: 1 }, { id: 2 }, { id: 3 }],
      (elem) => elem.id.toString(),
      2,
    ),
  ).toStrictEqual([[{ id: 1 }, { id: 2 }], [{ id: 3 }]])
})
