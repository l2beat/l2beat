import { getConfig } from '../../../src/config'
import { DatabaseService } from '../../../src/peripherals/database/DatabaseService'

export function setupDatabaseTestSuite() {
  const config = getConfig('test')
  const knex = DatabaseService.createKnexInstance(config.databaseUrl)
  const skip = config.databaseUrl === 'xXTestDatabaseUrlXx'

  before(async function () {
    if (skip) {
      this.skip()
    } else {
      await knex.migrate.latest()
    }
  })

  after(async () => {
    await knex.destroy()
  })

  return { knex }
}
