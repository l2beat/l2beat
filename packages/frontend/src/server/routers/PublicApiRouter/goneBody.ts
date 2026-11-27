import { UnixTime } from '@l2beat/shared-pure'
import { toProductionUrl } from '~/consts/productionOrigin'
import {
  API_MIGRATION_GUIDE_PATH,
  OLD_PUBLIC_API_SUNSET_AT,
  PUBLIC_API_URL,
} from '~/consts/publicApi'

/**
 * The body of the 410 the old API answers with. `success` and `error` keep
 * the shape of the old API's own errors, so a client that prints those shows
 * the message.
 */
export function getGoneBody() {
  const migrationGuide = toProductionUrl(API_MIGRATION_GUIDE_PATH)
  const sunset = UnixTime.toDate(OLD_PUBLIC_API_SUNSET_AT).toISOString()
  return {
    success: false,
    error: `This API was shut down on ${sunset}. Use ${PUBLIC_API_URL} instead: see ${migrationGuide}`,
    sunset,
    migrationGuide,
    newApi: PUBLIC_API_URL,
  }
}
