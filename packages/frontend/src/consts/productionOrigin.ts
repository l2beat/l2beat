/** For links that must point at production whatever host rendered them. */
export const PRODUCTION_ORIGIN = 'https://l2beat.com'

export function toProductionUrl(path: string) {
  return PRODUCTION_ORIGIN + path
}
