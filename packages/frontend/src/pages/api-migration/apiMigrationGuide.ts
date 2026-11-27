import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import {
  formatSunsetDate,
  OLD_PUBLIC_API_PATH,
  OLD_PUBLIC_API_SUNSET_AT,
  PUBLIC_API_DOCS_URL,
  PUBLIC_API_URL,
} from '~/consts/publicApi'

/**
 * The guide the old API's 410 answers point at: one set of
 * facts, laid out as a page by ApiMigrationPage and as markdown by
 * renderApiMigrationGuideMarkdown for the scripts and agents that call the
 * old API.
 *
 * Every difference listed here was read off the code of both APIs. When one
 * of them changes, change the matching line. Texts are inline markdown.
 */
export function getApiMigrationGuide(): ApiMigrationGuide {
  return {
    title: 'Upgrade to the ETHBEAT API',
    lede: `ETHBEAT data now comes from a documented API. Every endpoint is described in an OpenAPI 3.1 schema, with Swagger docs where you can try each request in the browser. It replaces the undocumented JSON endpoints under \`${OLD}/\`, which were shut down on **${SUNSET_DATE}**.`,
    links: [
      { label: 'Open the API docs', url: PUBLIC_API_DOCS_URL },
      { label: 'OpenAPI schema', url: `${NEW}/openapi` },
    ],
    benefits: {
      title: 'What you get',
      notes: [
        {
          title: 'Documented end to end',
          text: 'Swagger docs list every endpoint, parameter and response field. Try a request without writing code.',
        },
        {
          title: 'An OpenAPI 3.1 schema',
          text: `Generate a typed client, or check your own against it, from \`${NEW}/openapi\`.`,
        },
        {
          title: 'Named fields',
          text: 'Chart points are objects with named fields, where the old API returned bare arrays of numbers.',
        },
        {
          title: 'Real HTTP errors',
          text: '`404` for an unknown project and `400` for a bad parameter, each with a message. The old API answered `200` for an unknown project, with the error inside the body.',
        },
        {
          title: 'More data',
          text: 'Every project ETHBEAT tracks, not only layer 2s and layer 3s. Also project contracts, the TVS history of a single token, TVS split by asset category, and interop protocols and chains.',
        },
        {
          title: 'Open to everyone',
          text: 'No API key and no sign-up. Requests are rate limited: over the limit the answer is `429`.',
        },
      ],
    },
    migration: {
      title: 'You have to migrate',
      facts: [
        {
          label: 'Old API stopped',
          value: SUNSET_DATE,
          detail: 'It now answers `410 Gone`',
        },
        {
          label: 'New API',
          value: NEW.replace('https://', ''),
          detail: 'One host for every endpoint',
        },
        {
          label: 'Redirects',
          value: 'None',
          detail: 'Old paths do not forward to new ones',
        },
      ],
      intro: [
        'The upgrade is not a drop-in replacement. The new API names projects by id where the old one used slugs, and its responses have a different shape, so a client has to be changed by hand. This page lists what to change for each endpoint.',
      ],
    },
    ids: {
      title: 'Project ids replace slugs',
      text: [
        'The old API took a project slug, the last part of a project page URL. The new API takes a project id. For most projects the two are the same, but not for all.',
        `To look ids up, call [\`${NEW}/v1/projects\`](${NEW}/v1/projects). Each entry has both \`id\` and \`slug\`. Find the entry by the slug you use today and keep its \`id\`. An unknown id gets \`404\`.`,
      ],
      examples: [
        { project: 'Arbitrum One', slug: 'arbitrum', id: 'arbitrum' },
        { project: 'OP Mainnet', slug: 'op-mainnet', id: 'optimism' },
        { project: 'ZKsync Era', slug: 'zksync-era', id: 'zksync2' },
      ],
    },
    general: {
      title: 'What changes for every endpoint',
      notes: [
        {
          title: 'No wrapper',
          text: 'The old API answered `{ "success": true, "data": ... }`, except for `/summary`, which was never wrapped. The new API returns the data itself: an array or an object.',
        },
        {
          title: 'Errors use HTTP status codes',
          text: 'For an unknown project the old API answered `200` with `{ "success": false, "error": "..." }`. The new API answers `404` with `{ "message": "..." }`, also for a project that exists but has no data of the kind asked for; the message says which. A bad parameter is a `400` in both, but its text moved from `error` to `message`.',
        },
        {
          title: 'Chart points are objects',
          text: 'The old charts were arrays of numbers, explained by a `types` array beside them. The new charts are arrays of objects with named fields.',
        },
        {
          title: 'Missing data is left out',
          text: 'The old charts held a row for every timestamp and filled the ones without data with `null`. The new charts have no point there. Read each point by its `timestamp` and do not assume even spacing.',
        },
        {
          title: 'An empty chart is `[]`',
          text: 'The old API answered `"Missing data."` in that case.',
        },
      ],
    },
    endpoints: [
      SUMMARY,
      TVS,
      PROJECT_TVS,
      BREAKDOWN,
      ACTIVITY,
      PROJECT_ACTIVITY,
    ],
  }
}

export interface ApiMigrationGuide {
  title: string
  lede: string
  links: { label: string; url: string }[]
  benefits: { title: string; notes: GuideNote[] }
  migration: {
    title: string
    facts: { label: string; value: string; detail: string }[]
    intro: string[]
  }
  ids: {
    title: string
    text: string[]
    examples: { project: string; slug: string; id: string }[]
  }
  general: { title: string; notes: GuideNote[] }
  endpoints: EndpointGuide[]
}

export interface GuideNote {
  title?: string
  text: string
}

/** `after` is undefined for a field that is gone, `before` for one that is new. */
export interface FieldChange {
  before?: string
  after?: string
  note?: string
}

export interface EndpointGuide {
  /** The anchor of its section. */
  id: string
  name: string
  oldPath: string
  newPath: string
  /** A URL of the new endpoint that answers as it is. */
  exampleUrl: string
  text: string[]
  fields?: { title: string; changes: FieldChange[] }
  differences: GuideNote[]
}

const OLD = `${PRODUCTION_ORIGIN}${OLD_PUBLIC_API_PATH}`
const NEW = PUBLIC_API_URL
const SUNSET_DATE = formatSunsetDate(OLD_PUBLIC_API_SUNSET_AT)
const SAME = 'Same name, same value.'

const SUMMARY: EndpointGuide = {
  id: 'summary',
  name: 'Scaling summary',
  oldPath: `${OLD_PUBLIC_API_PATH}/summary`,
  newPath: '/v1/projects?isArchived=false',
  exampleUrl: `${NEW}/v1/projects?isArchived=false`,
  text: [
    'The old `projects` was an object keyed by project id, holding active layer 2s and layer 3s only, sorted by TVS. The new response is an array of every project ETHBEAT tracks, bridges and other kinds included, in no guaranteed order. To get the old set, keep the entries that have a `layer` field.',
  ],
  fields: {
    title: 'Fields of one project',
    changes: [
      {
        before:
          '`id`, `name`, `shortName`, `slug`, `hostChain`, `purposes`, `stage`, `isArchived`, `isUnderReview`',
        after: 'Unchanged',
        note: SAME,
      },
      {
        before: '`type`',
        after: '`layer`',
        note: '`"layer2"` or `"layer3"`.',
      },
      {
        before: '`category`',
        after: '`type`',
        note: 'E.g. `"Optimistic Rollup"`. Watch out: the new API also has a `category` field, which means something else (the category of a bridge).',
      },
      { before: '`providers`', after: '`stacks`' },
      {
        before: '`badges`',
        after: '`badges`',
        note: 'Was an array of objects with `id`, `type`, `name`, `description` and `action`. Now an array of the badge names.',
      },
      {
        before: '`risks`',
        after: '`risks`',
        note: 'The same five risks in the same order, each with `name`, `value`, `sentiment`, `description` and `warning`. The Exit Window risk keeps its `regular` field.',
      },
      {
        before: '`tvs.breakdown`',
        after: '`tvs.breakdown`',
        note: '`total`, `ether`, `stablecoin`, `associated`: same name, same value. Both leave out restricted RWA tokens. A project with no TVS data had a breakdown of zeros; it now has `tvs: null`: unknown, not zero.',
      },
      {
        before: '`tvs.change7d`',
        after: '`tvs.change7d`',
        note: 'Still a fraction (`0.05` is +5%). The old API gave `0` when it could not compute the change; the new one gives `null`. A fall to zero is now `-1`, where the old API gave `0`.',
      },
      {
        before: '`tvs.associatedTokens`',
        after: '`associatedTokens`',
        note: 'Was objects with `symbol` and `icon`, inside `tvs`. Now a top-level array of symbols.',
      },
      {
        after: '`tvs.timestamp`',
        note: 'The hour the TVS values come from.',
      },
      {
        before: '`chart`',
        note: `The 30-day chart. It held 30 days of TVS summed over all layer 2s and layer 3s, and the new API has no chart of that sum. The nearest is [\`/v1/tvs?range=30d&excludeRwaRestrictedTokens=true\`](${NEW}/v1/tvs?range=30d&excludeRwaRestrictedTokens=true), but it sums every project with TVS data, so its numbers are different.`,
      },
    ],
  },
  differences: [],
}

const TVS_POINT_FIELDS: FieldChange[] = [
  {
    before: '`[timestamp, native, canonical, external, ethPrice]`',
    after:
      '`{ timestamp, totalTvs, bySource: { native, canonical, external }, byCategory: { ... }, ethPrice }`',
    note: 'One chart point. `byCategory` is new: the same total split into `stablecoins`, `eth`, `btc`, `other`, `publicRwa` and `restrictedRwa`. `ethPrice` can be `null` when the price is unknown.',
  },
  {
    before: '`usdValue`',
    note: 'It was `native + canonical + external` of the last point that had data. Read `totalTvs` of the last point.',
  },
  {
    before: '`ethValue`',
    note: 'It was `usdValue` divided by the `ethPrice` of the same point. Divide `totalTvs` by `ethPrice` of the last point. When that `ethPrice` is `null`, the value in ETH is unknown: do not divide.',
  },
]

const TVS_NUMBER_DIFFERENCES: GuideNote[] = [
  {
    title: 'Restricted RWA tokens are counted by default',
    text: 'In the old API `excludeRwaRestrictedTokens` defaulted to `true`. In the new one it defaults to `false`. Pass `excludeRwaRestrictedTokens=true` to leave them out, as the old API did by default.',
  },
  {
    title: 'Parameters',
    text: '`excludeAssociatedTokens` works as before and still defaults to `false`. Both parameters now take `true` or `false`; another word is a `400`. `range` takes the same values (`7d`, `30d`, `90d`, `180d`, `1y`, `max`) and still defaults to `30d`. Points are spaced as before: hourly for `7d`, every six hours for `30d` and `90d`, daily for the rest.',
  },
  {
    title: 'Timestamps with no data are skipped',
    text: 'The old chart had a row of `null`s for them, and ran on to the present with `null` rows when the data was behind. The new chart ends at its last point with data.',
  },
  {
    title: 'The first and last points differ',
    text: 'The old chart started at midnight UTC, the given number of days before the day it ended. The new chart counts the days back from its end hour and starts at the next point of its grid, so it can have up to a day of points fewer at the start. The old chart could also end with one extra point off the grid, which the new one does not have. Match points by `timestamp` before comparing values.',
  },
]

const TVS: EndpointGuide = {
  id: 'tvs',
  name: 'Scaling TVS',
  oldPath: `${OLD_PUBLIC_API_PATH}/tvs`,
  newPath: '/v1/tvs',
  exampleUrl: `${NEW}/v1/tvs`,
  text: [],
  fields: {
    title: 'Fields',
    changes: [
      ...TVS_POINT_FIELDS,
      {
        before: '`chart.syncedUntil`',
        note: 'It is the `timestamp` of the last point.',
      },
    ],
  },
  differences: [
    {
      title: 'It sums more projects',
      text: 'The old endpoint summed active layer 2s and layer 3s by default. The new one sums every active project with TVS data, which includes projects ETHBEAT does not list under scaling. The total is higher and there is no parameter to narrow it.',
    },
    {
      title: '`type` and `projectIds` are gone',
      text: 'There is no chart for rollups only, or for a list of projects. For one project use `/v1/tvs/{projectId}`. Adding up the charts of several projects is not the same as the old sum: a sum of many projects counts a token bridged from one of them to another once, and each project chart counts it for its own project.',
    },
    ...TVS_NUMBER_DIFFERENCES,
  ],
}

const PROJECT_TVS: EndpointGuide = {
  id: 'project-tvs',
  name: 'Project TVS',
  oldPath: `${OLD_PUBLIC_API_PATH}/tvs/{slug}`,
  newPath: '/v1/tvs/{projectId}',
  exampleUrl: `${NEW}/v1/tvs/arbitrum`,
  text: [],
  fields: { title: 'Fields', changes: TVS_POINT_FIELDS },
  differences: [
    ...TVS_NUMBER_DIFFERENCES,
    {
      title: 'More projects answer',
      text: 'The old endpoint knew only layer 2s and layer 3s. The new one answers for any project with TVS data.',
    },
    {
      title: 'Archived projects',
      text: 'A project archived more than 30 days ago has no points in the default range, so the answer is `[]`. Pass `range=max` to get its history.',
    },
  ],
}

const BREAKDOWN: EndpointGuide = {
  id: 'breakdown',
  name: 'Project TVS breakdown',
  oldPath: `${OLD_PUBLIC_API_PATH}/tvs/{slug}/breakdown`,
  newPath: '/v1/project/{projectId}/tokens',
  exampleUrl: `${NEW}/v1/project/arbitrum/tokens`,
  text: [
    'The docs mark this endpoint as one that may still change. The answer is still one entry per token with a synced value, sorted by its USD value for the project, largest first.',
  ],
  fields: {
    title: 'Fields of one token',
    changes: [
      { before: '`id`', after: '`tokenId`' },
      {
        before: '`name`, `symbol`, `amount`, `category`, `isAssociated`',
        after: 'Unchanged',
        note: SAME,
      },
      { before: '`valueForProject.value`', after: '`valueUsd`' },
      {
        before: '`priceUsd.value`',
        after: '`priceUsd`',
        note: 'A plain number.',
      },
      {
        before: '`source`',
        after: '`source`',
        note: 'The old value `"custom-canonical"` is now reported as `"canonical"`. `"canonical"`, `"external"` and `"native"` are unchanged.',
      },
      {
        before: '`isGasToken`',
        after: '`isGasToken`',
        note: 'Always present now. The old API left it out for some projects.',
      },
      {
        before: '`address`',
        after: '`addresses`',
        note: 'Was one address, or the text `"multiple"`. Now an array of `{ address, chain }`, empty when the amount comes from a native balance or a fixed value.',
      },
      {
        before: '`syncStatus`',
        after: '`timestamp`',
        note: 'Was a sentence, present only when the token was behind. Now the hour the values come from, always present.',
      },
      {
        before: '`bridgedUsing`',
        after: '`bridgedUsing`',
        note: '`null` when there is none. The old API left the field out.',
      },
      {
        before:
          '`valueForProject.change`, `priceUsd.change`, `value`, `formula`, `iconUrl`, `filterable`',
        note: 'No replacement. The two `change` fields were seven-day changes; `value` was the value before the project-specific rules that avoid double counting.',
      },
    ],
  },
  differences: [
    {
      title: 'A project without TVS data',
      text: 'A project that exists but has no TVS data answers `[]`. The old API answered `"Project not found."`.',
    },
  ],
}

const ACTIVITY_POINT_FIELDS: FieldChange[] = [
  {
    before: '`[timestamp, count, uopsCount]`',
    after: '`{ timestamp, txCount, uopsCount }`',
    note: 'One chart point. `count` is renamed to `txCount`.',
  },
]

const ACTIVITY_RANGE: GuideNote = {
  title: 'Parameters',
  text: '`range` takes the same values (`30d`, `90d`, `180d`, `1y`, `max`) and still defaults to `30d`. There is one point per day, as before. The first day can differ from the old one: the new chart starts at the first day in the range that has any transactions.',
}

const ACTIVITY: EndpointGuide = {
  id: 'activity',
  name: 'Scaling activity',
  oldPath: `${OLD_PUBLIC_API_PATH}/activity`,
  newPath: '/v1/activity',
  exampleUrl: `${NEW}/v1/activity`,
  text: [],
  fields: { title: 'Fields', changes: ACTIVITY_POINT_FIELDS },
  differences: [
    {
      title: 'Archived projects are left out',
      text: 'The old default (`type=all`) summed every layer 2 and layer 3 with activity data, archived ones included. The new endpoint sums only active ones, so past days can be lower.',
    },
    {
      title: '`type` and `projectIds` are gone',
      text: 'There is no chart for rollups only, or for a list of projects. Use `/v1/activity/{projectId}` for each project and add the counts up.',
    },
    {
      title: 'The chart ends at the last synced day',
      text: 'The old chart ran to the last full day our activity data as a whole had reached, and gave `null` for days it had no records for. The new chart stops at the last day that is synced for at least one project, and a synced day without records is `0`. A project that lags behind adds nothing to the newest days, or only part of its count for the day it is syncing.',
    },
    ACTIVITY_RANGE,
  ],
}

const PROJECT_ACTIVITY: EndpointGuide = {
  id: 'project-activity',
  name: 'Project activity',
  oldPath: `${OLD_PUBLIC_API_PATH}/activity/{slug}`,
  newPath: '/v1/activity/{projectId}',
  exampleUrl: `${NEW}/v1/activity/arbitrum`,
  text: [
    `Ethereum is still available: the old slug \`ethereum\` is the id \`ethereum\`, so use [\`${NEW}/v1/activity/ethereum\`](${NEW}/v1/activity/ethereum).`,
  ],
  fields: { title: 'Fields', changes: ACTIVITY_POINT_FIELDS },
  differences: [
    {
      title: 'The chart ends at the last synced day',
      text: 'The old chart ran to the last full day our activity data as a whole had reached, and gave `null` for the days after the project was last synced. The new chart leaves those days out. Do not read a missing day as zero.',
    },
    {
      title: 'A project that was never synced',
      text: 'It answers `[]`. The old API answered `"Missing data."`.',
    },
    ACTIVITY_RANGE,
  ],
}
