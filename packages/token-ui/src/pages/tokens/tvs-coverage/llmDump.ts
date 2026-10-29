import { type Names, type Row, rowId, type Snapshot } from './rows'

const DEFINITIONS = {
  side: {
    chain:
      "The token is deployed on the project's own chain and was seen in interop transfers there. Only tokens with at least interopWindow.minChainVolumeUsd of volume in the window are included.",
    escrow:
      "The token is on another chain and was moved by the project's own lock-and-mint bridge, so it is expected to sit in the project's escrows.",
  },
  status: {
    counted:
      "The project's TVS config has an active formula for this exact token.",
    countedViaCounterpart:
      "The token is not counted itself, but its lock-and-mint counterpart moved by the project's own bridge is counted.",
    scheduled:
      "The project's TVS config has a formula for this token that starts in the future.",
    sameAssetOnly:
      'The project counts another deployment of the same asset, but not this one.',
    missing:
      "The project's TVS config counts neither this token nor any other deployment of its asset.",
  },
  estimate:
    "For chain rows, amount is the token's totalSupply on its chain, or CoinGecko's circulating supply when that is lower. For escrow rows, amount is the larger of escrowBalance (summed over escrowAddresses) and the supply of the copy the project's own bridge minted, which also covers escrows the TVS config does not list. amountSource says which of these was used, and amountUnavailable says why amount is null. circulatingSupplyUnknown is true when CoinGecko has no circulating supply for the token, so a chain row's amount is its whole totalSupply, which may include a premint, a treasury or locked tokens. valueUsd = amount * priceUsd. Estimates exist only for rows that are not counted.",
  interop:
    'Volume and transfer counts are summed over the interop window, per bridge, from transfers L2BEAT matched to this token. lastSeen is the end of the last UTC day with a transfer.',
  warnings:
    'Problems while building the snapshot, such as a chain whose RPC could not be read. Rows on such a chain have no amount.',
}

export function toJsonDump(rows: Row[], snapshot: Snapshot, names: Names) {
  const explorerUrls = explorers(snapshot)
  const projects = new Map(snapshot.projects.map((p) => [p.id, p]))
  return JSON.stringify(
    {
      source: 'L2BEAT token-ui TVS gaps',
      snapshotAt: iso(snapshot.generatedAt),
      interopWindow: {
        days: snapshot.window.days,
        from: iso(snapshot.window.from),
        to: iso(snapshot.window.to),
        minChainVolumeUsd: snapshot.minChainVolumeUsd,
      },
      warnings: snapshot.warnings,
      definitions: DEFINITIONS,
      rows: rows.map((row) => ({
        id: rowId(row),
        project: {
          id: row.projectId,
          name: names.project(row.projectId),
          chain: projects.get(row.projectId)?.chain ?? null,
        },
        side: row.side,
        token: {
          chain: row.chain,
          address: row.address,
          symbol: row.symbol ?? null,
          decimals: row.decimals ?? null,
          explorerUrl: explorerUrl(explorerUrls, row),
          abstractTokenId: row.abstractTokenId ?? null,
          abstractSymbol: row.abstractSymbol ?? null,
          issuer: row.issuer ?? null,
          coingeckoId: row.coingeckoId ?? null,
          relationRole: row.role ?? null,
          ignoredInTokenDb: row.ignored,
        },
        tvs: {
          status: row.status,
          countedVia: row.countedVia ?? null,
        },
        escrowAddresses: row.side === 'escrow' ? row.escrowAddresses : null,
        estimate: row.value
          ? {
              amount: row.value.amount ?? null,
              amountSource: row.value.amountSource ?? null,
              amountUnavailable: row.value.amountGap ?? null,
              circulatingSupplyUnknown: row.value.circulatingSupplyUnknown,
              escrowBalance: row.value.escrowBalance ?? null,
              mintedCopy: row.value.mintedCopy
                ? {
                    chain: row.value.mintedCopy.chain,
                    address: row.value.mintedCopy.address,
                    symbol: row.value.mintedCopy.symbol ?? null,
                    supply: row.value.mintedCopy.supply ?? null,
                  }
                : null,
              priceUsd: row.value.priceUsd ?? null,
              valueUsd: row.value.valueUsd ?? null,
              priceCoingeckoId: row.pricing?.coingeckoId ?? null,
              pricedViaCounterpart: row.pricing?.via ?? null,
              erc4626Asset: row.value.vaultAsset ?? null,
            }
          : null,
        interop: {
          volumeUsd: round(row.volumeUsd),
          transferCount: row.transferCount,
          lastSeen: iso(row.lastSeen),
          bridges: row.bridges.map((bridge) => ({
            id: bridge.id,
            name: names.bridge(bridge.id),
            bridgeType: bridge.bridgeType,
            volumeUsd: round(bridge.volumeUsd),
            transferCount: bridge.transferCount,
          })),
        },
        dismissal: row.dismissal
          ? {
              reason: row.dismissal.reason,
              comment: row.dismissal.comment ?? null,
            }
          : null,
      })),
    },
    null,
    2,
  )
}

const CSV_COLUMNS: [string, (row: Row, ctx: CsvContext) => unknown][] = [
  ['project_id', (row) => row.projectId],
  ['project_name', (row, ctx) => ctx.names.project(row.projectId)],
  ['project_chain', (row, ctx) => ctx.projectChains.get(row.projectId)],
  ['side', (row) => row.side],
  ['chain', (row) => row.chain],
  ['address', (row) => row.address],
  ['symbol', (row) => row.symbol],
  ['decimals', (row) => row.decimals],
  ['abstract_token_id', (row) => row.abstractTokenId],
  ['abstract_symbol', (row) => row.abstractSymbol],
  ['issuer', (row) => row.issuer],
  ['coingecko_id', (row) => row.coingeckoId],
  ['ignored_in_token_db', (row) => row.ignored],
  ['status', (row) => row.status],
  [
    'counted_via',
    (row) =>
      row.countedVia && `${row.countedVia.chain}:${row.countedVia.address}`,
  ],
  ['relation_role', (row) => row.role],
  ['amount', (row) => row.value?.amount],
  ['amount_source', (row) => row.value?.amountSource],
  ['amount_unavailable', (row) => row.value?.amountGap],
  ['circulating_supply_unknown', (row) => row.value?.circulatingSupplyUnknown],
  ['escrow_balance', (row) => row.value?.escrowBalance],
  [
    'minted_copy',
    (row) =>
      row.value?.mintedCopy &&
      `${row.value.mintedCopy.chain}:${row.value.mintedCopy.address}`,
  ],
  ['minted_copy_symbol', (row) => row.value?.mintedCopy?.symbol],
  ['minted_supply', (row) => row.value?.mintedCopy?.supply],
  ['price_usd', (row) => row.value?.priceUsd],
  ['value_usd', (row) => row.value?.valueUsd],
  ['price_coingecko_id', (row) => row.pricing?.coingeckoId],
  [
    'priced_via',
    (row) =>
      row.pricing?.via && `${row.pricing.via.chain}:${row.pricing.via.address}`,
  ],
  ['priced_via_symbol', (row) => row.pricing?.via?.symbol],
  ['erc4626_asset', (row) => row.value?.vaultAsset?.address],
  ['erc4626_asset_symbol', (row) => row.value?.vaultAsset?.symbol],
  ['erc4626_asset_counted', (row) => row.value?.vaultAsset?.counted],
  ['volume_usd', (row) => round(row.volumeUsd)],
  ['transfer_count', (row) => row.transferCount],
  ['last_seen', (row) => iso(row.lastSeen)],
  [
    'bridges',
    (row, ctx) =>
      row.bridges
        .map(
          (bridge) =>
            `${ctx.names.bridge(bridge.id)} (${bridge.bridgeType}, ${round(bridge.volumeUsd)} USD, ${bridge.transferCount} transfers)`,
        )
        .join('; '),
  ],
  ['escrow_addresses', (row) => row.escrowAddresses.join(' ')],
  ['explorer_url', (row, ctx) => explorerUrl(ctx.explorerUrls, row)],
  ['dismissal', (row) => row.dismissal?.reason],
  ['dismissal_comment', (row) => row.dismissal?.comment],
]

interface CsvContext {
  names: Names
  explorerUrls: Map<string, string | undefined>
  projectChains: Map<string, string | undefined>
}

export function toCsvDump(rows: Row[], snapshot: Snapshot, names: Names) {
  const ctx: CsvContext = {
    names,
    explorerUrls: explorers(snapshot),
    projectChains: new Map(
      snapshot.projects.map((project) => [project.id, project.chain]),
    ),
  }
  return [
    CSV_COLUMNS.map(([name]) => name).join(','),
    ...rows.map((row) =>
      CSV_COLUMNS.map(([, get]) => csvField(get(row, ctx))).join(','),
    ),
  ].join('\n')
}

// Token symbols are set by whoever deploys the token, and a spreadsheet runs
// a field that starts with = + - or @ as a formula.
function csvField(value: unknown) {
  if (value === undefined || value === null) return ''
  const text =
    typeof value === 'string' && /^[=+\-@\t\r]/.test(value)
      ? `'${value}`
      : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function explorers(snapshot: Snapshot) {
  return new Map(
    snapshot.chains.map((chain) => [chain.name, chain.explorerUrl]),
  )
}

function explorerUrl(urls: Map<string, string | undefined>, row: Row) {
  const base = urls.get(row.chain)
  if (!base || !/^0x[0-9a-f]{40}$/.test(row.address)) return null
  return `${base.replace(/\/$/, '')}/address/${row.address}`
}

function iso(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
