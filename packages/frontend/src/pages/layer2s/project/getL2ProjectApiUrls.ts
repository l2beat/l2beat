import { toProductionUrl } from '~/consts/productionOrigin'

/** The project's public JSON endpoints, as cited by its markdown alternate and its JSON-LD. */
export function getL2ProjectApiUrls(slug: string) {
  const api = toProductionUrl('/api/scaling')
  return {
    tvs: `${api}/tvs/${slug}`,
    tvsBreakdown: `${api}/tvs/${slug}/breakdown`,
    activity: `${api}/activity/${slug}`,
  }
}
