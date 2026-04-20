import { join } from 'node:path'
import { command, option, positional, run, string } from 'cmd-ts'
import { config as loadEnv } from 'dotenv'

import {
  type CoolifyApplication,
  CoolifyClient,
  type CoolifyEnvRow,
  type EnvironmentLabelMap,
} from './CoolifyClient'

loadEnv({
  path: join(__dirname, '../../.env'),
})

const args = {
  envVarName: positional({
    type: string,
    displayName: 'envVarName',
    description:
      'Environment variable key to look for (exact match on Coolify key)',
  }),
  server: option({
    type: string,
    long: 'server',
    short: 's',
    env: 'COOLIFY_SERVER',
    defaultValue: () => 'https://coolify.l2beat.com',
    defaultValueIsSerializable: true,
    description: 'Coolify base URL',
  }),
  apiKey: option({
    type: string,
    long: 'api-key',
    defaultValue: () => process.env.COOLIFY_API_KEY?.trim() ?? '',
    description: 'API token (uses COOLIFY_API_KEY when omitted)',
  }),
}

const cmd = command({
  name: 'check-env',
  description:
    'Check which Coolify applications define a given environment variable.',
  args,
  handler: async (cliArgs) => {
    const base = cliArgs.server.trim()
    const token = cliArgs.apiKey.trim()
    if (!token) {
      console.error('error: COOLIFY_API_KEY must be set or pass --api-key')
      process.exit(1)
    }

    const client = new CoolifyClient(base, token)

    const labelMapResult = await client.getEnvironmentLabelMap()
    if (!labelMapResult.ok) {
      console.error(
        `FAIL list projects / environments (${labelMapResult.reason})`,
      )
      process.exit(1)
    }

    const listResult = await client.getApplications()
    if (!listResult.ok) {
      console.error(`FAIL list applications (${listResult.reason})`)
      process.exit(1)
    }

    const { data: applications } = listResult
    const { data: byEnvironmentId } = labelMapResult

    if (applications.length === 0) {
      console.log('no applications returned from API')
      console.log('---')
      console.log('OK: 0, MISSING: 0, FAILED: 0')
      process.exit(0)
    }

    let ok = 0
    let missing = 0
    let failed = 0

    for (const app of applications) {
      const label = formatAppLabel(app, byEnvironmentId)
      const result = await client.getApplicationEnvs(app.uuid)

      if (!result.ok) {
        console.error(`FAIL ${label}  (${result.reason})`)
        failed++
        continue
      }

      if (hasEnvKey(result.data, cliArgs.envVarName)) {
        console.log(`OK   ${label}`)
        ok++
      } else {
        console.log(`MISSING ${label}`)
        missing++
      }
    }

    console.log('---')
    console.log(`OK: ${ok}, MISSING: ${missing}, FAILED: ${failed}`)

    process.exit(0)
  },
})

run(cmd, process.argv.slice(2))

function formatAppLabel(
  app: CoolifyApplication,
  byEnvironmentId: EnvironmentLabelMap,
): string {
  const appName = app.name ?? '?'

  if (typeof app.environment_id !== 'number') {
    return `?/?/${appName}`
  }

  const ctx = byEnvironmentId.get(app.environment_id)
  if (!ctx) {
    return `?/?/${appName}`
  }

  return `${ctx.project}/${ctx.env}/${appName}`
}

function hasEnvKey(rows: CoolifyEnvRow[], name: string): boolean {
  return rows.some((row) => row.key === name)
}
