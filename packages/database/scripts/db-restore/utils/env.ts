import { config as dotenv } from 'dotenv'

export interface DbUrls {
  localDbUrl: string
  remoteDbUrl: string
}

export function loadDbUrls(): DbUrls {
  dotenv()
  const localDbUrl = process.env.DEV_LOCAL_DB_URL
  const remoteDbUrl = process.env.DEV_REMOTE_DB_URL_READ_ONLY
  if (!localDbUrl || !remoteDbUrl) {
    console.error(
      'Error: DEV_LOCAL_DB_URL and DEV_REMOTE_DB_URL_READ_ONLY must be set in .env',
    )
    process.exit(1)
  }
  return { localDbUrl, remoteDbUrl }
}
