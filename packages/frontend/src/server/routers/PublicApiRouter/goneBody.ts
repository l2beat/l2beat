import { UnixTime } from '@l2beat/shared-pure'
import { toProductionUrl } from '~/consts/productionOrigin'
import { API_MIGRATION_GUIDE_PATH, PUBLIC_API_URL } from '~/consts/publicApi'

/**
 * The body of a 410 from the old API. `success` and `error` keep the shape of
 * the old API's own errors, so a client that prints those shows the message.
 */
export function getGoneBody(options: {
  sunsetAt: UnixTime
  brownout: { end: UnixTime }
}) {
  const migrationGuide = toProductionUrl(API_MIGRATION_GUIDE_PATH)
  const sunset = UnixTime.toDate(options.sunsetAt).toISOString()
  const endsAt = UnixTime.toDate(options.brownout.end).toISOString()
  return {
    success: false,
    error: `This API is deprecated and stops working for good on ${sunset}. This is a scheduled test outage that ends at ${endsAt}. Move to ${PUBLIC_API_URL}: see ${migrationGuide}`,
    sunset,
    brownout: { scheduled: true, endsAt },
    migrationGuide,
    newApi: PUBLIC_API_URL,
  }
}
