import {
  formatSunsetDate,
  OLD_PUBLIC_API_PATH,
  OLD_PUBLIC_API_SUNSET_AT,
  PUBLIC_API_DOCS_URL,
  PUBLIC_API_URL,
} from '~/consts/publicApi'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'

export const API_MIGRATION_GUIDE_TITLE = 'Moving to the new ETHBEAT API'

/**
 * The guide the old API's `Link` headers and 410 bodies point at. Markdown,
 * so the same text serves the HTML page and its `.md` version, which is what
 * the scripts and agents calling the old API can read.
 *
 * Every difference listed here was read off the code of both APIs. When one
 * of them changes, change the matching line.
 */
export function getApiMigrationGuideMarkdown(): string {
  return [
    getIntro(),
    getIdsSection(),
    getGeneralSection(),
    getSummarySection(),
    getTvsSection(),
    getProjectTvsSection(),
    getBreakdownSection(),
    getActivitySection(),
    getProjectActivitySection(),
  ].join('\n\n')
}

const OLD = `${PRODUCTION_ORIGIN}${OLD_PUBLIC_API_PATH}`
const NEW = PUBLIC_API_URL

function getIntro() {
  return [
    `The JSON endpoints under \`${OLD}/\` are deprecated. They stop working on **${formatSunsetDate(OLD_PUBLIC_API_SUNSET_AT)}** (00:00 UTC). After that they answer \`410 Gone\`.`,
    `Their replacement is the ETHBEAT API at \`${NEW}\`. It is open to everyone and needs no API key. Requests are rate limited: over the limit the answer is \`429\`.`,
    `- Interactive docs: [${PUBLIC_API_DOCS_URL}](${PUBLIC_API_DOCS_URL})\n- OpenAPI schema: [${NEW}/openapi](${NEW}/openapi)`,
    'The old paths do not redirect to the new ones. The new API names projects by id where the old one used slugs, and its responses have a different shape, so a client has to be changed by hand. This page lists what to change for each endpoint.',
    'Until the sunset, every old response carries three headers: `Deprecation` (when the API was deprecated), `Sunset` (when it stops) and `Link` (this page and the new API).',
  ].join('\n\n')
}

function getIdsSection() {
  return [
    '## Project ids replace slugs',
    'The old API took a project slug, the last part of a project page URL. The new API takes a project id. For most projects the two are the same, but not for all: OP Mainnet has the slug `op-mainnet` and the id `optimism`, ZKsync Era has the slug `zksync-era` and the id `zksync2`.',
    `To look ids up, call [\`${NEW}/v1/projects\`](${NEW}/v1/projects). Each entry has both \`id\` and \`slug\`. Find the entry by the slug you use today and keep its \`id\`. An unknown id gets \`404\`.`,
  ].join('\n\n')
}

function getGeneralSection() {
  return [
    '## What changes for every endpoint',
    [
      '- **No wrapper.** The old API answered `{ "success": true, "data": ... }`. The new API returns the data itself: an array or an object.',
      '- **Errors use HTTP status codes.** The old API answered `200` with `{ "success": false, "error": "..." }`. The new API answers `404` with `{ "message": "..." }` for an unknown project and `400` for a bad parameter.',
      '- **Chart points are objects.** The old charts were arrays of numbers, explained by a `types` array beside them. The new charts are arrays of objects with named fields.',
      '- **Missing data is left out.** The old charts held a row for every timestamp and filled the ones without data with `null`. The new charts have no point there. Read each point by its `timestamp` and do not assume even spacing.',
      '- **An empty chart is `[]`.** The old API answered `"Missing data."` in that case.',
    ].join('\n'),
  ].join('\n\n')
}

function getSummarySection() {
  return [
    `## \`${OLD_PUBLIC_API_PATH}/summary\``,
    `Use [\`${NEW}/v1/projects?isArchived=false\`](${NEW}/v1/projects?isArchived=false).`,
    'The old `projects` was an object keyed by project id, holding active layer 2s and layer 3s only, sorted by TVS. The new response is an array of every project ETHBEAT tracks, bridges and other kinds included, in no guaranteed order. To get the old set, keep the entries that have a `layer` field.',
    'Fields of one project:',
    [
      '- `id`, `name`, `shortName`, `slug`, `hostChain`, `purposes`, `stage`, `isArchived`, `isUnderReview`: same name, same value.',
      '- `type` (`"layer2"` or `"layer3"`) is now `layer`.',
      '- `category` (e.g. `"Optimistic Rollup"`) is now `type`. Watch out: the new API also has a `category` field, which means something else (the category of a bridge).',
      '- `providers` is now `stacks`.',
      '- `badges` was an array of objects with `id`, `type`, `name`, `description` and `action`. It is now an array of the badge names.',
      '- `risks`: the same five risks in the same order, each with `name`, `value`, `sentiment`, `description` and `warning`. The Exit Window risk keeps its `regular` field.',
      '- `tvs.breakdown` (`total`, `ether`, `stablecoin`, `associated`): same name, same value. Both leave out restricted RWA tokens.',
      '- `tvs.change7d`: still a fraction (`0.05` is +5%). The old API gave `0` when it could not compute the change; the new one gives `null`. A fall to zero is now `-1`, where the old API gave `0`.',
      '- `tvs.associatedTokens` (objects with `symbol` and `icon`) is now the top-level `associatedTokens`, an array of symbols.',
      '- New: `tvs.timestamp`, the hour the TVS values come from.',
      '- A project with no TVS data had a `tvs.breakdown` of zeros. It now has `tvs: null`: unknown, not zero.',
    ].join('\n'),
    `**The 30-day chart is gone.** The old response had a \`chart\` with 30 days of TVS summed over all layer 2s and layer 3s. The new API has no chart of that sum. The nearest is [\`${NEW}/v1/tvs?range=30d&excludeRwaRestrictedTokens=true\`](${NEW}/v1/tvs?range=30d&excludeRwaRestrictedTokens=true), but it sums every project with TVS data, not only layer 2s and layer 3s, so its numbers are different. See the next section.`,
  ].join('\n\n')
}

const TVS_POINT_FIELDS = [
  '- Each point was `[timestamp, native, canonical, external, ethPrice]`. It is now `{ timestamp, totalTvs, bySource: { native, canonical, external }, byCategory: { ... }, ethPrice }`. `byCategory` is new: the same total split into `stablecoins`, `eth`, `btc`, `other`, `publicRwa` and `restrictedRwa`.',
  '- `usdValue` is gone. It was `native + canonical + external` of the last point that had data. Read `totalTvs` of the last point.',
  '- `ethValue` is gone. It was `usdValue` divided by the `ethPrice` of the same point. Divide `totalTvs` by `ethPrice` of the last point.',
  '- `ethPrice` can be `null` in a point when the price is unknown.',
].join('\n')

const TVS_NUMBER_DIFFERENCES = [
  '- **Restricted RWA tokens are counted by default.** In the old API `excludeRwaRestrictedTokens` defaulted to `true`. In the new one it defaults to `false`. Pass `excludeRwaRestrictedTokens=true` to get the numbers the old API gave by default.',
  '- `excludeAssociatedTokens` works as before and still defaults to `false`. Both parameters now accept only `true` or `false`; anything else is a `400`.',
  '- `range` takes the same values (`7d`, `30d`, `90d`, `180d`, `1y`, `max`) and still defaults to `30d`. Points are spaced as before: hourly for `7d`, every six hours for `30d` and `90d`, daily for the rest.',
  '- **Timestamps with no data are skipped.** The old chart had a row of `null`s for them, and ran on to the present with `null` rows when the data was behind. The new chart ends at its last point with data.',
  '- **The window starts later.** The old chart started at midnight UTC, the given number of days before the day of its last point. The new chart starts exactly that many days before its last hour. It can have up to a day of points fewer at the start.',
].join('\n')

function getTvsSection() {
  return [
    `## \`${OLD_PUBLIC_API_PATH}/tvs\``,
    `Use [\`${NEW}/v1/tvs\`](${NEW}/v1/tvs).`,
    TVS_POINT_FIELDS,
    '- `chart.syncedUntil` is gone. It is the `timestamp` of the last point.',
    'Differences in the numbers:',
    [
      '- **It sums more projects.** The old endpoint summed active layer 2s and layer 3s by default. The new one sums every active project with TVS data, which includes projects ETHBEAT does not list under scaling. The total is higher and there is no parameter to narrow it.',
      '- **`type` and `projectIds` are gone.** There is no chart for rollups only, or for a list of projects. For one project use `/v1/tvs/{projectId}`. Adding up the charts of several projects is not the same as the old sum: a sum of many projects counts a token bridged from one of them to another once, and each project chart counts it for its own project.',
      TVS_NUMBER_DIFFERENCES,
    ].join('\n'),
  ].join('\n\n')
}

function getProjectTvsSection() {
  return [
    `## \`${OLD_PUBLIC_API_PATH}/tvs/{slug}\``,
    `Use \`${NEW}/v1/tvs/{projectId}\`, e.g. [\`${NEW}/v1/tvs/arbitrum\`](${NEW}/v1/tvs/arbitrum).`,
    TVS_POINT_FIELDS,
    'Differences in the numbers:',
    [
      TVS_NUMBER_DIFFERENCES,
      '- The old endpoint knew only layer 2s and layer 3s. The new one answers for any project with TVS data.',
      '- An archived project has no points in the default 30 days, so the answer is `[]`. Pass `range=max` to get its history.',
    ].join('\n'),
  ].join('\n\n')
}

function getBreakdownSection() {
  return [
    `## \`${OLD_PUBLIC_API_PATH}/tvs/{slug}/breakdown\``,
    `Use \`${NEW}/v1/project/{projectId}/tokens\`, e.g. [\`${NEW}/v1/project/arbitrum/tokens\`](${NEW}/v1/project/arbitrum/tokens). The docs mark this endpoint as one that may still change.`,
    'The answer is still one entry per token with a synced value, sorted by its USD value for the project, largest first. Fields of one token:',
    [
      '- `id` is now `tokenId`.',
      '- `name`, `symbol`, `amount`, `category`, `isAssociated`: same name, same value.',
      '- `valueForProject.value` is now `valueUsd`.',
      '- `priceUsd.value` is now `priceUsd`, a plain number.',
      '- `source`: the old value `"custom-canonical"` is now reported as `"canonical"`. `"canonical"`, `"external"` and `"native"` are unchanged.',
      '- `isGasToken` is always present now. The old API left it out for some projects.',
      '- `address` (one address, or the text `"multiple"`) is now `addresses`, an array of `{ address, chain }`. It is empty when the amount comes from a native balance or a fixed value.',
      '- `syncStatus` (a sentence, present only when the token was behind) is now `timestamp`, the hour the values come from, always present.',
      '- `bridgedUsing` is `null` when there is none. The old API left the field out.',
      '- Gone, with no replacement: `valueForProject.change` and `priceUsd.change` (seven-day changes), `value` (the value before the project-specific rules that avoid double counting), `formula`, `iconUrl` and `filterable`.',
    ].join('\n'),
    'A project that exists but has no TVS data answers `[]`. The old API answered `"Project not found."`.',
  ].join('\n\n')
}

const ACTIVITY_POINT_FIELDS =
  '- Each point was `[timestamp, count, uopsCount]`. It is now `{ timestamp, txCount, uopsCount }`: `count` is renamed to `txCount`.'

const ACTIVITY_RANGE =
  '- `range` takes the same values (`30d`, `90d`, `180d`, `1y`, `max`) and still defaults to `30d`. There is one point per day, as before. The window can start a day earlier than the old one.'

function getActivitySection() {
  return [
    `## \`${OLD_PUBLIC_API_PATH}/activity\``,
    `Use [\`${NEW}/v1/activity\`](${NEW}/v1/activity).`,
    ACTIVITY_POINT_FIELDS,
    'Differences in the numbers:',
    [
      '- **Archived projects are left out.** The old default (`type=all`) summed every layer 2 and layer 3 with activity data, archived ones included. The new endpoint sums only active ones, so past days can be lower.',
      '- **`type` and `projectIds` are gone.** There is no chart for rollups only, or for a list of projects. Use `/v1/activity/{projectId}` for each project and add the counts up.',
      '- **The chart ends at the last synced day.** The old chart ran to yesterday and gave `null` for days it had no records for. The new chart stops at the last day that is synced for at least one project, and a synced day without records is `0`. A project that lags behind adds nothing to the newest days.',
      ACTIVITY_RANGE,
    ].join('\n'),
  ].join('\n\n')
}

function getProjectActivitySection() {
  return [
    `## \`${OLD_PUBLIC_API_PATH}/activity/{slug}\``,
    `Use \`${NEW}/v1/activity/{projectId}\`, e.g. [\`${NEW}/v1/activity/arbitrum\`](${NEW}/v1/activity/arbitrum).`,
    ACTIVITY_POINT_FIELDS,
    `- Ethereum is still available: the old slug \`ethereum\` is the id \`ethereum\`, so use [\`${NEW}/v1/activity/ethereum\`](${NEW}/v1/activity/ethereum).`,
    'Differences in the numbers:',
    [
      '- **The chart ends at the last synced day.** The old chart ran to yesterday and gave `null` for the days after the project was last synced. The new chart leaves those days out. Do not read a missing day as zero.',
      '- A project that was never synced answers `[]`. The old API answered `"Missing data."`.',
      ACTIVITY_RANGE,
    ].join('\n'),
  ].join('\n\n')
}
