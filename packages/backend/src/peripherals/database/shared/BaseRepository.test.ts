import { Logger } from '@l2beat/common'
import { expect } from 'earljs'

import { setupDatabaseTestSuite } from '../../../test/database'
import { createMockMetrics } from '../../../test/mocks/Metrics'
import { BaseRepository } from './BaseRepository'

describe(BaseRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const mockMetrics = createMockMetrics()

  it('should wrap all children methods', () => {
    class DummyRepository extends BaseRepository {
      getValue() {
        return [1]
      }

      addValue() {
        return 'abc'
      }

      addValueMany() {
        return 2
      }

      findValue() {
        return 1
      }

      deleteValue() {
        return 1
      }
    }
    const dummyRepository = new DummyRepository(
      database,
      Logger.SILENT,
      mockMetrics,
    )

    const prototype = Object.getPrototypeOf(dummyRepository)
    const dummyMethodNames = Object.getOwnPropertyNames(prototype)

    dummyMethodNames.forEach((methodName) => {
      if (methodName === 'constructor') return
      expect(prototype[methodName].wrapped).toEqual(true)
    })
  })

  it('should throw error', () => {
    // This test will fail until all wrong naming convention will get resolved (refresh, calcDataBoundaries)

    class DummyRepository extends BaseRepository {
      getValue() {
        return [1]
      }

      wrongNameMethod() {
        return [1]
      }
    }

    expect(() => {
      new DummyRepository(database, Logger.SILENT, mockMetrics)
    }).toThrow(Error, 'Wrong method naming convention: wrongNameMethod')
  })

  it('should not wrap the function if it is prefixed with _', () => {
    class DummyRepository extends BaseRepository {
      getValue() {
        return [1]
      }

      _notWrappedFunction() {
        return [1]
      }
    }
    const dummyRepository = new DummyRepository(
      database,
      Logger.SILENT,
      mockMetrics,
    )

    const prototype = Object.getPrototypeOf(dummyRepository)
    expect(prototype.getValue.wrapped).toEqual(true)
    expect(prototype._notWrappedFunction.wrapped).toBeFalsy()
  })
})
