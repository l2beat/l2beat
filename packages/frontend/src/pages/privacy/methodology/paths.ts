/** The methodology is a publication, rendered by its own page. */
export const PRIVACY_METHODOLOGY_ID = 'privacy-methodology'
/**
 * Client code reads the path and anchors from here. Config repeats them for
 * the links in its usage flow steps (`PRIVACY_METHODOLOGY_URL`, `USAGE_FLOW_ANCHORS`),
 * and `paths.test.ts` keeps the two equal. Importing config's build into
 * client code breaks hydration.
 */
export const PRIVACY_METHODOLOGY_PATH = `/publications/${PRIVACY_METHODOLOGY_ID}`
/** The Reviewed usage flow section, which project pages link once. */
export const PRIVACY_ADVICE_ANCHOR = 'usage-flow'
/**
 * The anchor of the former How to stay private section, here and on project
 * pages. Links to it are out in the wild, and a fragment never reaches the
 * server, so the pages themselves send it on to the new anchor.
 */
export const PRIVACY_LEGACY_ADVICE_ANCHOR = 'stay-private'
/**
 * Title and link of that section. The summary page's banner reads them from
 * here, not from adviceUi: sharing adviceUi between the summary page and
 * project pages gives every project page one more JS chunk (e2e/nav-perf).
 */
export const PRIVACY_ADVICE_TITLE = 'Reviewed usage flow'
export const PRIVACY_ADVICE_HREF = `${PRIVACY_METHODOLOGY_PATH}#${PRIVACY_ADVICE_ANCHOR}`
/** The framework section that defines an IP-hiding route and its checks. */
export const PRIVACY_IP_HIDING_ROUTES_ANCHOR = 'ip-hiding-routes'
/** The list of routes under Reviewed usage flow, which steps link. */
export const PRIVACY_ROUTES_ANCHOR = 'routes'
/** The section project pages link from their app list. */
export const PRIVACY_REFERENCE_APP_ANCHOR = 'reference-app'
