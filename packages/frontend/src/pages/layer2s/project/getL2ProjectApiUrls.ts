import { toProductionUrl } from '~/consts/productionOrigin'

/** The project's public JSON endpoints. */
export function getL2ProjectApiUrls(slug: string) {
  const api = toProductionUrl('/api/scaling')
  return {
    tvs: `${api}/tvs/${slug}`,
    tvsBreakdown: `${api}/tvs/${slug}/breakdown`,
    activity: `${api}/activity/${slug}`,
  }
}
