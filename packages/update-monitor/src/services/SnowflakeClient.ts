import snowflake from 'snowflake-sdk'

export class SnowflakeClient {
  private pool: ReturnType<typeof snowflake.createPool>

  constructor(options: snowflake.ConnectionOptions) {
    this.pool = snowflake.createPool(options)
  }

  query<T>(sql: string, binds?: snowflake.Binds) {
    return this.pool.use(async (connection) => {
      return new Promise<T[]>((resolve, reject) => {
        connection.execute({
          sqlText: sql,
          binds,
          complete(err, stmt, rows) {
            if (err) {
              reject(err)
            } else {
              resolve(rows ?? [])
            }
          },
        })
      })
    })
  }
}
