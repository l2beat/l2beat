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
/** The framework section that defines an IP-hiding route and its checks. */
export const PRIVACY_IP_HIDING_ROUTES_ANCHOR = 'ip-hiding-routes'
/** The list of routes under How to stay private, which advice steps link. */
export const PRIVACY_ROUTES_ANCHOR = 'routes'
/** The section project pages link from their app list. */
export const PRIVACY_REFERENCE_APP_ANCHOR = 'reference-app'
/**
 * The guide that walks one protocol's advice by goal. The URL is cited and
 * linked from outside, so it stays as it is.
 */
export const PRIVACY_STAY_PRIVATE_PATH = '/privacy/stay-private'
