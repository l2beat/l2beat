import { existsSync, unlinkSync } from 'fs'
import path from 'path'
import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { LocalStorage } from './LocalStorage'

const TEST_FILE_PATH = path.join(__dirname, 'local-data-test.json')

describe(LocalStorage.name, () => {
  afterEach(() => {
    if (existsSync(TEST_FILE_PATH)) {
      unlinkSync(TEST_FILE_PATH)
    }
  })

  describe('amounts', () => {
    it('can write and read amount', async () => {
      const storage = new LocalStorage(TEST_FILE_PATH)
      const timestamp = UnixTime.now()
      await storage.writeAmount('token1', timestamp, 1000n)
      const amount = await storage.getAmount('token1', timestamp)
      expect(amount).toEqual(1000n)
    })

    it('persists amounts between instances', async () => {
      const timestamp = UnixTime.now()
      let storage = new LocalStorage(TEST_FILE_PATH)
      await storage.writeAmount('token1', timestamp, 1000n)

      storage = new LocalStorage(TEST_FILE_PATH)
      const amount = await storage.getAmount('token1', timestamp)
      expect(amount).toEqual(1000n)
    })
  })

  describe('prices', () => {
    it('can write and read price', async () => {
      const storage = new LocalStorage(TEST_FILE_PATH)
      const timestamp = UnixTime.now()
      await storage.writePrice('token1', timestamp, 1234.56)
      const price = await storage.getPrice('token1', timestamp)
      expect(price).toEqual(1234.56)
    })

    it('persists prices between instances', async () => {
      const timestamp = UnixTime.now()
      let storage = new LocalStorage(TEST_FILE_PATH)
      await storage.writePrice('token1', timestamp, 1234.56)

      storage = new LocalStorage(TEST_FILE_PATH)
      const price = await storage.getPrice('token1', timestamp)
      expect(price).toEqual(1234.56)
    })
  })

  describe('multiple operations', () => {
    it('can store multiple items for different timestamps', async () => {
      const storage = new LocalStorage(TEST_FILE_PATH)
      const timestamp1 = UnixTime(1000)
      const timestamp2 = UnixTime(2000)

      await storage.writeAmount('token1', timestamp1, 1000n)
      await storage.writeAmount('token1', timestamp2, 2000n)
      await storage.writePrice('token1', timestamp1, 100)
      await storage.writePrice('token1', timestamp2, 200)

      expect(await storage.getAmount('token1', timestamp1)).toEqual(1000n)
      expect(await storage.getAmount('token1', timestamp2)).toEqual(2000n)
      expect(await storage.getPrice('token1', timestamp1)).toEqual(100)
      expect(await storage.getPrice('token1', timestamp2)).toEqual(200)
    })

    it('can store data for multiple tokens', async () => {
      const storage = new LocalStorage(TEST_FILE_PATH)
      const timestamp = UnixTime.now()

      await storage.writeAmount('token1', timestamp, 1000n)
      await storage.writeAmount('token2', timestamp, 2000n)
      await storage.writePrice('token1', timestamp, 100)
      await storage.writePrice('token2', timestamp, 200)

      expect(await storage.getAmount('token1', timestamp)).toEqual(1000n)
      expect(await storage.getAmount('token2', timestamp)).toEqual(2000n)
      expect(await storage.getPrice('token1', timestamp)).toEqual(100)
      expect(await storage.getPrice('token2', timestamp)).toEqual(200)
    })
  })
})
