import { spawn } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import path from 'node:path'
import { getEnv } from '@l2beat/backend-tools'
import {
  parseGoogleSheetRows,
  upsertGoogleSheetsEnvSection,
} from '../../src/tools/googleSheetsEnvSync'

const GOOGLE_SHEETS_SCOPE =
  'https://www.googleapis.com/auth/spreadsheets.readonly'
const PACKAGE_ROOT = path.join(__dirname, '..', '..')
const ENV_PATH = path.join(PACKAGE_ROOT, '.env')

interface OAuthTokens {
  access_token: string
  refresh_token?: string
}

interface SheetsResponse {
  values?: string[][]
}

interface SpreadsheetMetadataResponse {
  sheets?: {
    properties?: {
      index?: number
      sheetId?: number
      title?: string
    }
  }[]
}

async function main() {
  const env = getEnv()
  const clientId = env.string('GOOGLE_SHEETS_CLIENT_ID')
  const clientSecret = env.optionalString('GOOGLE_SHEETS_CLIENT_SECRET')
  const sheetUrl = env.string('GOOGLE_SHEETS_ENV_URL')
  const currentEnv = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf8') : ''
  const { spreadsheetId, sheetId } = parseSpreadsheetUrl(sheetUrl)

  let tokens: OAuthTokens | undefined

  try {
    tokens = await authenticate(clientId, clientSecret)

    const sheetTitle = await getSheetTitle(
      tokens.access_token,
      spreadsheetId,
      sheetId,
    )
    const rows = await getSheetRows(
      tokens.access_token,
      spreadsheetId,
      `${toA1SheetName(sheetTitle)}!A:B`,
    )
    const entries = parseGoogleSheetRows(rows)

    if (entries.length === 0) {
      throw new Error('The selected Google Sheet tab is empty')
    }

    const nextEnv = upsertGoogleSheetsEnvSection(currentEnv, entries)
    writeFileSync(ENV_PATH, nextEnv)

    console.log(`Synced ${entries.length} variables to ${ENV_PATH}`)
  } finally {
    const tokenToRevoke = tokens?.refresh_token ?? tokens?.access_token
    if (tokenToRevoke) {
      await revokeToken(tokenToRevoke).catch(() => undefined)
    }
  }
}

async function authenticate(clientId: string, clientSecret?: string) {
  const codeVerifier = base64Url(randomBytes(32))
  const codeChallenge = base64Url(
    createHash('sha256').update(codeVerifier).digest(),
  )
  const state = base64Url(randomBytes(16))
  const server = createServer()

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start local OAuth callback server')
  }

  const redirectUri = `http://127.0.0.1:${(address as AddressInfo).port}`
  const authorizationUrl = new URL(
    'https://accounts.google.com/o/oauth2/v2/auth',
  )
  authorizationUrl.searchParams.set('client_id', clientId)
  authorizationUrl.searchParams.set('redirect_uri', redirectUri)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', GOOGLE_SHEETS_SCOPE)
  authorizationUrl.searchParams.set('code_challenge', codeChallenge)
  authorizationUrl.searchParams.set('code_challenge_method', 'S256')
  authorizationUrl.searchParams.set('state', state)

  console.log(
    `Open this URL if the browser does not open automatically:\n${authorizationUrl.toString()}\n`,
  )
  openBrowser(authorizationUrl.toString())

  const code = await waitForAuthorizationCode(server, state)
  return exchangeAuthorizationCode({
    clientId,
    clientSecret,
    code,
    codeVerifier,
    redirectUri,
  })
}

function waitForAuthorizationCode(
  server: ReturnType<typeof createServer>,
  expectedState: string,
) {
  return new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close()
      reject(new Error('Timed out waiting for Google login'))
    }, 120_000)

    server.once('request', (request, response) => {
      try {
        const url = new URL(request.url ?? '/', 'http://127.0.0.1')
        const error = url.searchParams.get('error')
        const state = url.searchParams.get('state')
        const code = url.searchParams.get('code')

        if (error) {
          throw new Error(`Google login failed: ${error}`)
        }

        if (state !== expectedState) {
          throw new Error('Google login failed: invalid state')
        }

        if (!code) {
          throw new Error('Google login failed: missing authorization code')
        }

        response.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
        })
        response.end(
          '<!doctype html><title>Google login complete</title><p>You can close this window.</p>',
        )

        clearTimeout(timeout)
        server.close()
        resolve(code)
      } catch (error) {
        response.writeHead(400, {
          'Content-Type': 'text/html; charset=utf-8',
        })
        response.end('<!doctype html><title>Google login failed</title>')

        clearTimeout(timeout)
        server.close()
        reject(error)
      }
    })

    server.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
  })
}

async function exchangeAuthorizationCode(parameters: {
  clientId: string
  clientSecret?: string
  code: string
  codeVerifier: string
  redirectUri: string
}) {
  const body = new URLSearchParams({
    client_id: parameters.clientId,
    code: parameters.code,
    code_verifier: parameters.codeVerifier,
    grant_type: 'authorization_code',
    redirect_uri: parameters.redirectUri,
  })

  if (parameters.clientSecret) {
    body.set('client_secret', parameters.clientSecret)
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    throw new Error(await formatGoogleError(response))
  }

  return (await response.json()) as OAuthTokens
}

async function getSheetTitle(
  accessToken: string,
  spreadsheetId: string,
  sheetId: number | undefined,
) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets(properties(sheetId%2Ctitle%2Cindex))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(await formatGoogleError(response))
  }

  const data = (await response.json()) as SpreadsheetMetadataResponse
  const sheets =
    data.sheets
      ?.flatMap((sheet) => (sheet.properties ? [sheet.properties] : []))
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0)) ?? []

  const selectedSheet =
    sheetId === undefined
      ? sheets[0]
      : sheets.find((sheet) => sheet.sheetId === sheetId)

  if (!selectedSheet?.title) {
    throw new Error('Could not find the selected tab in Google Sheets')
  }

  return selectedSheet.title
}

async function getSheetRows(
  accessToken: string,
  spreadsheetId: string,
  range: string,
) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?majorDimension=ROWS`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error(await formatGoogleError(response))
  }

  const data = (await response.json()) as SheetsResponse
  return data.values ?? []
}

async function revokeToken(token: string) {
  await fetch(
    `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(token)}`,
    {
      method: 'POST',
    },
  )
}

function parseSpreadsheetUrl(rawUrl: string) {
  const url = new URL(rawUrl)
  const spreadsheetId = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/)?.[1]

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ENV_URL is not a valid Google Sheets URL')
  }

  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''))
  const rawSheetId = url.searchParams.get('gid') ?? hashParams.get('gid')

  if (rawSheetId === null) {
    return { spreadsheetId, sheetId: undefined }
  }

  const sheetId = Number(rawSheetId)
  if (!Number.isInteger(sheetId)) {
    throw new Error('GOOGLE_SHEETS_ENV_URL contains an invalid gid')
  }

  return { spreadsheetId, sheetId }
}

function toA1SheetName(title: string) {
  return `'${title.replaceAll("'", "''")}'`
}

function base64Url(buffer: Buffer) {
  return buffer
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/g, '')
}

function openBrowser(url: string) {
  const command =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'cmd'
        : 'xdg-open'
  const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url]

  const child = spawn(command, args, {
    detached: true,
    stdio: 'ignore',
  })
  child.on('error', () => undefined)
  child.unref()
}

async function formatGoogleError(response: Response) {
  const text = await response.text()

  try {
    const json = JSON.parse(text) as {
      error?: {
        message?: string
      }
      error_description?: string
    }

    const message = json.error?.message ?? json.error_description
    if (message) {
      return `Google request failed: ${message}`
    }
  } catch {
    // Ignore malformed error bodies.
  }

  return `Google request failed: ${response.status} ${response.statusText}`
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
