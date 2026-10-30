import { env } from '~/env'

/** For links that must point at production whatever host rendered them. */
export const PRODUCTION_ORIGIN = env.PRODUCTION_ORIGIN

export function toProductionUrl(path: string) {
  return PRODUCTION_ORIGIN + path
}
