import { Logger } from '@l2beat/common'
import { expect } from 'earljs'
import { describe } from 'mocha'

import { Metrics } from '../../../Metrics'
import { setupDatabaseTestSuite } from '../../../test/database'
import { createMockRepoMetrics } from '../../../test/mocks/Metrics'
import { BaseRepository, CheckConvention } from './BaseRepository'
import { Database } from './Database'

describe(BaseRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const mockMetrics = createMockRepoMetrics()

  describe(BaseRepository.prototype.autoWrap.name, () => {
    it('should wrap all methods', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger, metrics: Metrics) {
          super(database, logger, metrics)
          this.autoWrap<CheckConvention<DummyRepository>>(this)
        }

        async addOne(): Promise<number> {
          return 1
        }

        async getAll(): Promise<string[]> {
          return []
        }

        async findBy(): Promise<string | undefined> {
          return undefined
        }

        async deleteAll(): Promise<number> {
          return 1
        }
      }
      const dummyRepository = new DummyRepository(
        database,
        Logger.SILENT,
        mockMetrics,
      )

      expect((dummyRepository.addOne as any).wrapped).toEqual(true)
      expect((dummyRepository.getAll as any).wrapped).toEqual(true)
      expect((dummyRepository.findBy as any).wrapped).toEqual(true)
      expect((dummyRepository.deleteAll as any).wrapped).toEqual(true)
    })

    it('should throw error', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger, metrics: Metrics) {
          super(database, logger, metrics)
          this.autoWrap<CheckConvention<DummyRepository>>(this)
        }

        async getAll(): Promise<string[]> {
          return []
        }

        unconventionalMethodName() {
          return [1]
        }
      }

      expect(() => {
        new DummyRepository(database, Logger.SILENT, mockMetrics)
      }).toThrow(
        Error,
        'Wrong repository method naming convention: unconventionalMethodName',
      )
    })

    it('should not wrap the function if it is prefixed with _', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger, metrics: Metrics) {
          super(database, logger, metrics)
          this.autoWrap<CheckConvention<DummyRepository>>(this)
        }

        async getAll(): Promise<string[]> {
          return []
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

      expect((dummyRepository.getAll as any).wrapped).toEqual(true)
      expect((dummyRepository._notWrappedFunction as any).wrapped).toBeFalsy()
    })

    it('should not wrap the function if it is wrapped manually', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger, metrics: Metrics) {
          super(database, logger, metrics)

          this.refresh = this.wrapAny(this.refresh)
          this.autoWrap<CheckConvention<DummyRepository>>(this)
        }

        async getAll(): Promise<string[]> {
          return []
        }

        async refresh(): Promise<string[]> {
          return []
        }
      }

      const dummyRepository = new DummyRepository(
        database,
        Logger.SILENT,
        mockMetrics,
      )

      expect((dummyRepository.getAll as any).wrapped).toEqual(true)
      expect((dummyRepository.refresh as any).wrapped).toEqual(true)
    })
    /* eslint-disable @typescript-eslint/no-unused-vars */
    describe.skip('checkConvention', () => {
      describe('GetMethod', () => {
        it('should show error if returning wrong type', () => {
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger, metrics: Metrics) {
              super(database, logger, metrics)
              // @ts-expect-error get method should return array
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async getAll(): Promise<number> {
              return 1
            }
          }
        })
      })

      describe('AddMethod', () => {
        it('should show error if convention is wrong', () => {
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger, metrics: Metrics) {
              super(database, logger, metrics)
              // @ts-expect-error add method should take only one argument
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async addWithTooMuchArguments(
              a: string,
              b: string,
            ): Promise<number> {
              return 1
            }
          }
        })
      })

      describe('AddManyMethod', () => {
        it('should show error if return type is wrong', () => {
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger, metrics: Metrics) {
              super(database, logger, metrics)
              // @ts-expect-error addMany method should return array or number
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async addMany(a: string[]): Promise<string> {
              return ''
            }
          }
        })

        it('should show error if argument is of wrong type', () => {
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger, metrics: Metrics) {
              super(database, logger, metrics)
              // @ts-expect-error addMany method should take array as argument
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async addManyWithWrongArgumentType(a: string): Promise<number> {
              return 1
            }
          }
        })

        it('should show error if function takes too much arguments', () => {
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger, metrics: Metrics) {
              super(database, logger, metrics)
              // @ts-expect-error addMany method should take only one argument
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async addManyWithTooMuchArguments(
              a: string[],
              b: string,
            ): Promise<number> {
              return 1
            }
          }
        })
      })

      describe('DeleteMethod', () => {
        it('should show error if return type is wrong', () => {
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger, metrics: Metrics) {
              super(database, logger, metrics)
              // @ts-expect-error delete method should return number
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async deleteOne(): Promise<number[]> {
              return [1]
            }
          }
        })
      })
    })
    /* eslint-enable @typescript-eslint/no-unused-vars */
  })
})
