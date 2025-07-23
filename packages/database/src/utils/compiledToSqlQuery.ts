import type { CompiledQuery } from 'kysely'

/**
 * Converts a compiled Kysely query to a SQL string. Useful for debugging.
 * @param compiled - The compiled Kysely query.
 * @returns The SQL string.
 */
export function compiledToSqlQuery(compiled: CompiledQuery<unknown>): string {
  let sql = compiled.sql
  for (const [index, param] of Object.entries(compiled.parameters)) {
    const sqlIndex = Number.parseInt(index) + 1
    sql = sql.replace(`$${sqlIndex}`, parseParam(param))
  }
  return sql
}

function parseParam(param: unknown): string {
  if (typeof param === 'string') {
    return `'${param}'`
  }
  if (param instanceof Date) {
    return `'${param.toISOString()}'`
  }
  if (typeof param === 'number') {
    return param.toString()
  }
  if (typeof param === 'boolean') {
    return param.toString()
  }
  throw new Error(`Unknown param type: ${typeof param}`)
}
