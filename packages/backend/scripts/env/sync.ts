import { spawn } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import {
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { createServer, type Server, type ServerResponse } from 'node:http'
import path from 'node:path'
import { getEnv } from '@l2beat/backend-tools'
import { HttpClient } from '@l2beat/shared'
import { config as loadDotenv } from 'dotenv'
import {
  parseGoogleSheetRows,
  upsertGoogleSheetsEnvSection,
} from '../../src/tools/googleSheetsEnvSync'

const GOOGLE_SHEETS_SCOPE =
  'https://www.googleapis.com/auth/spreadsheets.readonly'
const PACKAGE_ROOT = path.join(__dirname, '..', '..')
const ENV_PATH = path.join(PACKAGE_ROOT, '.env')
// Named to match the `*.env` gitignore pattern in case a crash leaves it behind.
const TEMP_ENV_PATH = path.join(PACKAGE_ROOT, '.tmp.env')

// Organization logins with 2FA can easily take longer than a couple of minutes.
const LOGIN_TIMEOUT_MS = 5 * 60_000
const REQUEST_TIMEOUT_MS = 15_000
const REVOKE_TIMEOUT_MS = 5_000

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
      sheetId?: number
      title?: string
    }
  }[]
}

const http = new HttpClient()
let issuedTokens: OAuthTokens | undefined

async function main() {
  // The script configures itself from the .env it manages, no matter which
  // directory it is started from. Variables already exported in the shell
  // still take precedence, as with any dotenv-loaded config.
  loadDotenv({ path: ENV_PATH })
  const env = getEnv()
  const clientId = env.string('GOOGLE_SHEETS_CLIENT_ID')
  const clientSecret = env.optionalString('GOOGLE_SHEETS_CLIENT_SECRET')
  const sheetUrl = env.string('GOOGLE_SHEETS_ENV_URL')
  const { spreadsheetId, sheetId } = parseSpreadsheetUrl(sheetUrl)

  revokeIssuedTokensOnSignals()

  try {
    issuedTokens = await authenticate(clientId, clientSecret)
    const accessToken = issuedTokens.access_token

    const sheetTitle = await getSheetTitle(accessToken, spreadsheetId, sheetId)
    const rows = await getSheetRows(
      accessToken,
      spreadsheetId,
      toA1SheetName(sheetTitle),
    )
    const entries = parseGoogleSheetRows(rows)

    if (entries.length === 0) {
      throw new Error('The selected Google Sheet tab is empty')
    }

    // Read .env as late as possible so that edits made while the browser login
    // was pending are not overwritten.
    const currentEnv = existsSync(ENV_PATH)
      ? readFileSync(ENV_PATH, 'utf8')
      : ''
    writeEnvFile(upsertGoogleSheetsEnvSection(currentEnv, entries, new Date()))

    console.log(`Synced ${entries.length} variables to ${ENV_PATH}`)
  } finally {
    await revokeIssuedTokens()
  }
}

async function authenticate(clientId: string, clientSecret?: string) {
  const codeVerifier = randomBytes(32).toString('base64url')
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')
  const state = randomBytes(16).toString('base64url')
  const server = createServer()

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve())
  })

  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start local OAuth callback server')
  }

  const redirectUri = `http://127.0.0.1:${address.port}`
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

function waitForAuthorizationCode(server: Server, expectedState: string) {
  return new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(
      () => settle({ error: new Error('Timed out waiting for Google login') }),
      LOGIN_TIMEOUT_MS,
    )

    function settle(outcome: { code: string } | { error: Error }) {
      clearTimeout(timeout)
      server.close()
      server.closeAllConnections()
      if ('code' in outcome) {
        resolve(outcome.code)
      } else {
        reject(outcome.error)
      }
    }

    server.on('request', (request, response) => {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1')

      // Only the redirect carrying this run's state is Google's answer. Anything
      // else (favicon requests, port scanners, other local software) is ignored
      // instead of aborting the login.
      if (url.searchParams.get('state') !== expectedState) {
        response.writeHead(404).end()
        return
      }

      const error = url.searchParams.get('error')
      const code = url.searchParams.get('code')

      if (error !== null || code === null) {
        respondHtml(
          response,
          400,
          'Google login failed',
          'Go back to the terminal for details.',
          () =>
            settle({
              error: new Error(
                error !== null
                  ? `Google login failed: ${error}`
                  : 'Google login failed: missing authorization code',
              ),
            }),
        )
        return
      }

      respondHtml(
        response,
        200,
        'Google login complete',
        'You can close this window.',
        () => settle({ code }),
      )
    })

    server.on('error', (error) => settle({ error }))
  })
}

function respondHtml(
  response: ServerResponse,
  status: number,
  title: string,
  message: string,
  onFlushed: () => void,
) {
  response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' })
  response.end(
    `<!doctype html><title>${title}</title><p>${message}</p>`,
    onFlushed,
  )
}

async function exchangeAuthorizationCode(parameters: {
  clientId: string
  clientSecret?: string
  code: string
  codeVerifier: string
  redirectUri: string
}): Promise<OAuthTokens> {
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

  const tokens = await fetchGoogleJson<Partial<OAuthTokens>>(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    },
  )

  if (typeof tokens.access_token !== 'string' || tokens.access_token === '') {
    throw new Error('Google token response did not include an access token')
  }

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  }
}

async function getSheetTitle(
  accessToken: string,
  spreadsheetId: string,
  sheetId: number | undefined,
) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`,
  )
  url.searchParams.set('fields', 'sheets(properties(sheetId,title))')

  const data = await fetchGoogleJson<SpreadsheetMetadataResponse>(
    url.toString(),
    { headers: authorizationHeader(accessToken) },
  )

  // The API returns tabs in display order, so the first one is the default tab.
  const sheets = data.sheets ?? []
  const selectedSheet =
    sheetId === undefined
      ? sheets[0]
      : sheets.find((sheet) => sheet.properties?.sheetId === sheetId)
  const title = selectedSheet?.properties?.title

  if (!title) {
    throw new Error('Could not find the selected tab in Google Sheets')
  }

  return title
}

async function getSheetRows(
  accessToken: string,
  spreadsheetId: string,
  range: string,
) {
  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`,
  )
  url.searchParams.set('majorDimension', 'ROWS')

  const data = await fetchGoogleJson<SheetsResponse>(url.toString(), {
    headers: authorizationHeader(accessToken),
  })
  return data.values ?? []
}

function authorizationHeader(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` }
}

async function fetchGoogleJson<T>(
  url: string,
  init: {
    method?: string
    headers?: Record<string, string>
    body?: URLSearchParams
  },
): Promise<T> {
  const response = await http.fetchRaw(url, {
    ...init,
    timeout: REQUEST_TIMEOUT_MS,
  })

  if (!response.ok) {
    throw new Error(await formatGoogleError(response))
  }

  return (await response.json()) as T
}

function revokeIssuedTokensOnSignals() {
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      // Ctrl+C would otherwise skip the `finally` in main() and leave the
      // token valid until it expires.
      revokeIssuedTokens().finally(() =>
        process.exit(signal === 'SIGINT' ? 130 : 143),
      )
    })
  }
}

async function revokeIssuedTokens() {
  const tokens = issuedTokens
  issuedTokens = undefined

  // Revoking the refresh token also invalidates the access token issued with it.
  const token = tokens?.refresh_token ?? tokens?.access_token
  if (!token) {
    return
  }

  try {
    await http.fetchRaw('https://oauth2.googleapis.com/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token }),
      timeout: REVOKE_TIMEOUT_MS,
    })
  } catch {
    // Best effort only: the token expires on its own and there is nothing
    // more that can be done about it here.
  }
}

function writeEnvFile(content: string) {
  // Write to a temporary file and rename it over .env so that a crash in the
  // middle of the write can never leave the developer's local secrets truncated.
  const mode = existsSync(ENV_PATH) ? statSync(ENV_PATH).mode & 0o777 : 0o600

  try {
    rmSync(TEMP_ENV_PATH, { force: true })
    writeFileSync(TEMP_ENV_PATH, content, { mode })
    renameSync(TEMP_ENV_PATH, ENV_PATH)
  } catch (error) {
    rmSync(TEMP_ENV_PATH, { force: true })
    throw error
  }
}

function parseSpreadsheetUrl(rawUrl: string) {
  const url = new URL(rawUrl)
  const spreadsheetId = url.pathname.match(/\/spreadsheets\/d\/([^/]+)/)?.[1]

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ENV_URL is not a valid Google Sheets URL')
  }

  // Google puts the tab id in the query (?gid=) and/or in the hash (#gid=).
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''))
  const rawSheetId = [url.searchParams.get('gid'), hashParams.get('gid')].find(
    (value): value is string => value !== null && value !== '',
  )

  if (rawSheetId === undefined) {
    return { spreadsheetId, sheetId: undefined }
  }

  if (!/^\d+$/.test(rawSheetId)) {
    throw new Error('GOOGLE_SHEETS_ENV_URL contains an invalid gid')
  }

  return { spreadsheetId, sheetId: Number(rawSheetId) }
}

function toA1SheetName(title: string) {
  return `'${title.replaceAll("'", "''")}'`
}

function openBrowser(url: string) {
  const child =
    process.platform === 'win32'
      ? // `start` takes its first quoted argument as the window title, and the
        // URL has to be quoted so that cmd does not split it on `&`.
        spawn('cmd', ['/c', 'start', '""', `"${url}"`], {
          detached: true,
          stdio: 'ignore',
          windowsVerbatimArguments: true,
        })
      : spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], {
          detached: true,
          stdio: 'ignore',
        })

  child.on('error', () => undefined)
  child.unref()
}

async function formatGoogleError(response: {
  status: number
  statusText: string
  text(): Promise<string>
}) {
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
