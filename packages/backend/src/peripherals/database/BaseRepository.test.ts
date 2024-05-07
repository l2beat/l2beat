import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { describe } from 'mocha'

import { describeDatabase } from '../../test/database'
import { BaseRepository, CheckConvention } from './BaseRepository'
import { Database } from './Database'

describeDatabase(BaseRepository.name, (database) => {
  describe(BaseRepository.prototype.autoWrap.name, () => {
    it('should wrap all methods', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger) {
          super(database, logger)
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
      const dummyRepository = new DummyRepository(database, Logger.SILENT)

      expect((dummyRepository.addOne as any).wrapped).toEqual(true)
      expect((dummyRepository.getAll as any).wrapped).toEqual(true)
      expect((dummyRepository.findBy as any).wrapped).toEqual(true)
      expect((dummyRepository.deleteAll as any).wrapped).toEqual(true)
    })

    it('should throw error', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger) {
          super(database, logger)
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
        new DummyRepository(database, Logger.SILENT)
      }).toThrow(
        Error,
        'Wrong repository method naming convention: unconventionalMethodName',
      )
    })

    it('should not wrap the function if it is prefixed with _', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger) {
          super(database, logger)
          this.autoWrap<CheckConvention<DummyRepository>>(this)
        }

        async getAll(): Promise<string[]> {
          return []
        }

        _notWrappedFunction() {
          return [1]
        }
      }
      const dummyRepository = new DummyRepository(database, Logger.SILENT)

      expect((dummyRepository.getAll as any).wrapped).toEqual(true)
      expect((dummyRepository._notWrappedFunction as any).wrapped).toBeFalsy()
    })

    it('should not wrap the function if it is wrapped manually', () => {
      class DummyRepository extends BaseRepository {
        constructor(database: Database, logger: Logger) {
          super(database, logger)

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

      const dummyRepository = new DummyRepository(database, Logger.SILENT)

      expect((dummyRepository.getAll as any).wrapped).toEqual(true)
      expect((dummyRepository.refresh as any).wrapped).toEqual(true)
    })

    describe.skip('checkConvention', () => {
      describe('GetMethod', () => {
        it('should show error if returning wrong type', () => {
          // biome-ignore lint/correctness/noUnusedVariables: it's used
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger) {
              super(database, logger)
              // @ts-expect-error get method should return array
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async getAll(): Promise<number> {
              return 1
            }
          }
        })
      })

      describe('AddManyMethod', () => {
        it('should show error if return type is wrong', () => {
          // biome-ignore lint/correctness/noUnusedVariables: it's used
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger) {
              super(database, logger)
              // @ts-expect-error addMany method should return array or number
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async addMany(_a: string[]): Promise<string> {
              return ''
            }
          }
        })

        it('should show error if argument is of wrong type', () => {
          // biome-ignore lint/correctness/noUnusedVariables: it's used
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger) {
              super(database, logger)
              // @ts-expect-error addMany method should take array as argument
              this.autoWrap<CheckConvention<DummyRepository>>(this)
            }

            async addManyWithWrongArgumentType(_a: string): Promise<number> {
              return 1
            }
          }
        })
      })

      describe('DeleteMethod', () => {
        it('should show error if return type is wrong', () => {
          // biome-ignore lint/correctness/noUnusedVariables: it's used
          class DummyRepository extends BaseRepository {
            constructor(database: Database, logger: Logger) {
              super(database, logger)
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
  })
})
