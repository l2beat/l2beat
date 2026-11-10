/** The methodology is a publication, rendered by its own page. */
export const PRIVACY_METHODOLOGY_ID = 'privacy-methodology'
/**
 * Client code reads the path and anchors from here. Config repeats them for
 * the links in its advice steps (`PRIVACY_METHODOLOGY_URL`, `ADVICE_ANCHORS`),
 * and `paths.test.ts` keeps the two equal. Importing config's build into
 * client code breaks hydration.
 */
export const PRIVACY_METHODOLOGY_PATH = `/publications/${PRIVACY_METHODOLOGY_ID}`
/** The How to stay private section, which project pages link once. */
export const PRIVACY_ADVICE_ANCHOR = 'stay-private'
/**
 * Title and link of that section. The summary page's banner reads them from
 * here, not from adviceUi: sharing adviceUi between the summary page and
 * project pages gives every project page one more JS chunk (e2e/nav-perf).
 */
export const PRIVACY_ADVICE_TITLE = 'How to stay private'
export const PRIVACY_ADVICE_HREF = `${PRIVACY_METHODOLOGY_PATH}#${PRIVACY_ADVICE_ANCHOR}`
/** The route list, which advice steps link. */
export const PRIVACY_IP_HIDING_ROUTES_ANCHOR = 'ip-hiding-routes'
/** The section project pages link from their app list. */
export const PRIVACY_REFERENCE_APP_ANCHOR = 'reference-app'
