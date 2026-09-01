import { execFileSync } from 'child_process'

export function quoteIdent(name: string): string {
  return `"${name.replaceAll('"', '""')}"`
}

export function quoteLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`
}

// Runs a query and returns the result rows, one line per row
export function psqlQuery(dbUrl: string, sql: string): string[] {
  const output = execFileSync('psql', [dbUrl, '-tAc', sql], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  return output.split('\n').filter((line) => line !== '')
}

export function psqlExec(dbUrl: string, sql: string): void {
  execFileSync('psql', [dbUrl, '-c', sql], { stdio: 'inherit' })
}

function psqlSucceeds(dbUrl: string, sql: string): boolean {
  try {
    execFileSync('psql', [dbUrl, '-tAc', sql], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export function canConnect(dbUrl: string): boolean {
  return psqlSucceeds(dbUrl, 'SELECT 1')
}

export function isValidTimestamp(dbUrl: string, value: string): boolean {
  return psqlSucceeds(dbUrl, `SELECT ${quoteLiteral(value)}::timestamp`)
}
