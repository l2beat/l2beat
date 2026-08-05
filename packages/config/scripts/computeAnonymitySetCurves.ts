/**
 * Computes the two charts rendered by the Anonymity sets section on the privacy
 * project pages. Both count the same thing - unique qualifying depositors in a
 * trailing window - and differ only in which end of the window moves.
 *
 * CURVES ("anonymity set vs. holding duration"). For every holding duration `x`
 * between 7 and 365 days, a curve value is the number of unique addresses that
 * made a qualifying deposit in the trailing window `[NOW - x days, NOW]`. This
 * is the same metric as `computeAnonymitySets.ts` (see that file for the full
 * list of caveats), generalized from the fixed 30 day window to an arbitrary
 * one: if you deposit and withdraw within `x` days, the depositors of that
 * window are the crowd you blend into.
 *
 * HISTORY ("trailing 30 day anonymity set over time"). The window length is
 * pinned back to 30 days and its end slides across the project's whole life,
 * from the day of its first qualifying deposit up to `NOW`:
 * the value at date `d` is the number of unique addresses that deposited in the
 * 30 calendar days ending on `d`. It answers "how much of a crowd would I have
 * had, had I withdrawn on this day after holding for up to a month", and shows
 * whether a pool's anonymity is growing, flat or collapsing. The last point of
 * the history equals the 30 day point of the curve by construction.
 *
 * What counts as "qualifying" depends on how the protocol accepts deposits:
 * - Tornado Cash has fixed denominations, so every tracked pool is one curve.
 * - Railgun and Privacy Pools take arbitrary amounts, so every tracked token
 *   gets two curves at "at least 0.1 ETH worth" and "at least 10 ETH worth" -
 *   the same "at least" filter `computeAnonymitySets.ts` applies at 0.1, at two
 *   sizes that line up with Tornado's ladder.
 *
 * ASSUMPTIONS / SHORTCUTS specific to this script (on top of the ones listed in
 * `computeAnonymitySets.ts`, all of which still apply):
 *
 * 1. `NOW` is pinned to 2026-07-29, the date the input CSVs were exported.
 *    The data does not grow on its own, so a moving `now` would silently
 *    truncate the most recent window.
 *
 * 2. The input data has block numbers but no timestamps. Instead of resolving a
 *    cutoff block per data point (~360 binary searches), it linearly
 *    interpolates between the ~330 evenly spaced anchor blocks in BLOCK_ANCHORS,
 *    whose real timestamps are frozen below. Block times are stable enough,
 *    before and after the merge, that the error inside a ~7 day anchor gap stays
 *    within a few hours, which is invisible at day granularity. As a
 *    consequence the 30 day values here can
 *    differ by a few addresses from `anonymity_sets.json`, which used an exact
 *    cutoff block.
 *
 * 3. The metric is backward looking and deposit-side only: it counts deposits
 *    that already happened before `NOW`, including from addresses that have
 *    since withdrawn. A depositor's real anonymity also depends on deposits
 *    arriving after theirs, which is not observable here.
 *
 * 4. The ETH-equivalent thresholds are priced with the frozen PRICES_USD table
 *    below and rounded to one significant digit, then applied to the project's
 *    entire history - which now reaches back to 2019 rather than one year. A
 *    token that moved sharply against ETH over that span gets a threshold that
 *    was worth substantially more or less than 0.1/10 ETH at the time of the
 *    older deposits, so the early years of the tiered charts (Railgun, Privacy
 *    Pools) are coarser than the recent ones. The tiers are meant as
 *    order-of-magnitude buckets, not exact valuations. Prices used are recorded
 *    in the output.
 *
 * 5. Tracked buckets with no deposits at all in the source CSVs still produce a
 *    (flat zero) curve, and the script prints a coverage report so gaps between
 *    what the config tracks and what the snapshot contains stay visible.
 *
 * 5b. The history spans each project's whole life, so it needs every deposit in
 *    the snapshot dated - far further back than the curves ever reach.
 *    BLOCK_ANCHORS is sized to cover the snapshot's oldest deposit block, and
 *    `assertAnchorReach` checks that against the parsed data rather than
 *    silently dropping the deposits that fall off the end.
 *
 * 6. The script makes no network calls. Block timestamps and token prices are
 *    frozen tables captured once (see each table for provenance), because the
 *    input CSVs are a frozen snapshot: reading live prices or a live chain tip
 *    would silently change every curve on a re-run without any new data. To
 *    refresh them you need a new CSV export anyway.
 */

import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { privacyPools } from '../src/projects/privacy-pools/privacy-pools'
import { railgun } from '../src/projects/railgun/railgun'
import { tornadoCash } from '../src/projects/tornado-cash/tornado-cash'

dotenv.config()

const DATA_DIR =
  process.env.PRIVACY_DASHBOARD_DATA_DIR ??
  join(
    __dirname,
    '../../../../l2beat-privacy-dashboard-prototype/packages/frontend/data',
  )

const TRXS_WITH_AMOUNTS_FILE = join(
  DATA_DIR,
  'PrivacyFlowTrxs_with_amounts.csv',
)
const PRIVACY_POOLS_FILE = join(DATA_DIR, 'privacy_pools_privacy_flow.csv')

const OUTPUT_FILE = join(
  __dirname,
  '../../frontend/src/server/features/privacy/anonymitySetCurves.json',
)

/** Export date of the input CSVs - see assumption #1. */
const NOW_ISO = '2026-07-29T00:00:00.000Z'
const NOW_SECONDS = Math.floor(new Date(NOW_ISO).getTime() / 1000)

const MIN_DAYS = 7
const MAX_DAYS = 365
const DAY_SECONDS = 24 * 60 * 60
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/** Length of the window whose end slides across a project's whole history. */
const HISTORY_WINDOW_DAYS = 30

/** ~7 days of Ethereum blocks at 12s per block. */
const ANCHOR_STEP_BLOCKS = 50_400

/**
 * `[blockNumber, unixTimestamp]` pairs used to date a deposit - see assumptions
 * #2 and #6. Evenly spaced by ANCHOR_STEP_BLOCKS and newest first, starting at
 * the highest block present in the CSV snapshots and reaching back past the
 * oldest deposit in them (block 9117019, late 2019), because the history now
 * covers each project's full lifetime. `assertAnchorReach` checks that on every
 * run against the actual data rather than against a fixed day count.
 *
 * The step is ~7 days at post-Merge block times and ~7.7 days before it, so
 * interpolating inside an interval can be off by a few hours at most - well
 * inside the daily buckets everything here is counted in.
 *
 * Captured from an Ethereum RPC node on 2026-08-04 (newest ~440 days) and
 * 2026-08-05 (the rest). Block timestamps are immutable, so these never need
 * refreshing unless the CSV snapshot is re-exported with newer blocks - in which
 * case re-capture from the new highest block, stepping back by
 * ANCHOR_STEP_BLOCKS.
 */
const BLOCK_ANCHORS: [block: number, timestamp: number][] = [
  [25638016, 1785322403],
  [25587616, 1784715359],
  [25537216, 1784108399],
  [25486816, 1783501247],
  [25436416, 1782893843],
  [25386016, 1782286499],
  [25335616, 1781679419],
  [25285216, 1781072435],
  [25234816, 1780465019],
  [25184416, 1779857711],
  [25134016, 1779250847],
  [25083616, 1778644007],
  [25033216, 1778037191],
  [24982816, 1777430471],
  [24932416, 1776824135],
  [24882016, 1776217667],
  [24831616, 1775610755],
  [24781216, 1775003879],
  [24730816, 1774396511],
  [24680416, 1773789203],
  [24630016, 1773181307],
  [24579616, 1772573291],
  [24529216, 1771965695],
  [24478816, 1771358591],
  [24428416, 1770751163],
  [24378016, 1770142067],
  [24327616, 1769534327],
  [24277216, 1768926863],
  [24226816, 1768319711],
  [24176416, 1767711923],
  [24126016, 1767104567],
  [24075616, 1766496563],
  [24025216, 1765888679],
  [23974816, 1765278407],
  [23924416, 1764661979],
  [23874016, 1764051839],
  [23823616, 1763439923],
  [23773216, 1762830479],
  [23722816, 1762221407],
  [23672416, 1761612083],
  [23622016, 1761002123],
  [23571616, 1760392655],
  [23521216, 1759783775],
  [23470816, 1759175051],
  [23420416, 1758566435],
  [23370016, 1757957903],
  [23319616, 1757349503],
  [23269216, 1756740947],
  [23218816, 1756133267],
  [23168416, 1755525827],
  [23118016, 1754917823],
  [23067616, 1754309483],
  [23017216, 1753700519],
  [22966816, 1753091855],
  [22916416, 1752483995],
  [22866016, 1751875571],
  [22815616, 1751267027],
  [22765216, 1750658567],
  [22714816, 1750049483],
  [22664416, 1749440651],
  [22614016, 1748831279],
  [22563616, 1748221871],
  [22513216, 1747611743],
  [22462816, 1746999587],
  [22412416, 1746386123],
  [22362016, 1745776451],
  [22311616, 1745169035],
  [22261216, 1744561331],
  [22210816, 1743953927],
  [22160416, 1743346043],
  [22110016, 1742737991],
  [22059616, 1742130179],
  [22009216, 1741522151],
  [21958816, 1740914039],
  [21908416, 1740306359],
  [21858016, 1739697467],
  [21807616, 1739087939],
  [21757216, 1738479839],
  [21706816, 1737871871],
  [21656416, 1737264167],
  [21606016, 1736656067],
  [21555616, 1736047955],
  [21505216, 1735440203],
  [21454816, 1734831659],
  [21404416, 1734223439],
  [21354016, 1733615627],
  [21303616, 1733007383],
  [21253216, 1732398407],
  [21202816, 1731790919],
  [21152416, 1731183263],
  [21102016, 1730575355],
  [21051616, 1729967651],
  [21001216, 1729360187],
  [20950816, 1728751739],
  [20900416, 1728144335],
  [20850016, 1727537135],
  [20799616, 1726929707],
  [20749216, 1726321343],
  [20698816, 1725713231],
  [20648416, 1725105635],
  [20598016, 1724497151],
  [20547616, 1723888919],
  [20497216, 1723280903],
  [20446816, 1722673667],
  [20396416, 1722065639],
  [20346016, 1721457659],
  [20295616, 1720849943],
  [20245216, 1720241675],
  [20194816, 1719633599],
  [20144416, 1719025091],
  [20094016, 1718415971],
  [20043616, 1717807535],
  [19993216, 1717199603],
  [19942816, 1716590843],
  [19892416, 1715981879],
  [19842016, 1715372807],
  [19791616, 1714763795],
  [19741216, 1714154963],
  [19690816, 1713545855],
  [19640416, 1712935619],
  [19590016, 1712325875],
  [19539616, 1711714775],
  [19489216, 1711098995],
  [19438816, 1710487211],
  [19388416, 1709876363],
  [19338016, 1709268215],
  [19287616, 1708658891],
  [19237216, 1708047167],
  [19186816, 1707436199],
  [19136416, 1706824775],
  [19086016, 1706214503],
  [19035616, 1705603487],
  [18985216, 1704994703],
  [18934816, 1704381575],
  [18884416, 1703770247],
  [18834016, 1703159003],
  [18783616, 1702547615],
  [18733216, 1701937583],
  [18682816, 1701327851],
  [18632416, 1700718179],
  [18582016, 1700108399],
  [18531616, 1699499375],
  [18481216, 1698889511],
  [18430816, 1698280079],
  [18380416, 1697670491],
  [18330016, 1697061455],
  [18279616, 1696452227],
  [18229216, 1695843347],
  [18178816, 1695233555],
  [18128416, 1694620619],
  [18078016, 1694010731],
  [18027616, 1693400951],
  [17977216, 1692791399],
  [17926816, 1692181967],
  [17876416, 1691572847],
  [17826016, 1690963643],
  [17775616, 1690354715],
  [17725216, 1689745199],
  [17674816, 1689132431],
  [17624416, 1688520527],
  [17574016, 1687909271],
  [17523616, 1687296995],
  [17473216, 1686685343],
  [17422816, 1686071663],
  [17372416, 1685457899],
  [17322016, 1684845887],
  [17271616, 1684232159],
  [17221216, 1683614927],
  [17170816, 1683002843],
  [17120416, 1682391023],
  [17070016, 1681777475],
  [17019616, 1681152083],
  [16969216, 1680533687],
  [16918816, 1679921315],
  [16868416, 1679309615],
  [16818016, 1678697699],
  [16767616, 1678085063],
  [16717216, 1677472847],
  [16666816, 1676860439],
  [16616416, 1676250047],
  [16566016, 1675641527],
  [16515616, 1675033187],
  [16465216, 1674425195],
  [16414816, 1673817311],
  [16364416, 1673209199],
  [16314016, 1672601399],
  [16263616, 1671993683],
  [16213216, 1671386231],
  [16162816, 1670777951],
  [16112416, 1670168627],
  [16062016, 1669560455],
  [16011616, 1668952031],
  [15961216, 1668343883],
  [15910816, 1667735759],
  [15860416, 1667127347],
  [15810016, 1666518503],
  [15759616, 1665910511],
  [15709216, 1665302555],
  [15658816, 1664693891],
  [15608416, 1664085131],
  [15558016, 1663474835],
  [15507616, 1662795902],
  [15457216, 1662094763],
  [15406816, 1661398147],
  [15356416, 1660708328],
  [15306016, 1660021135],
  [15255616, 1659343326],
  [15205216, 1658664496],
  [15154816, 1657989139],
  [15104416, 1657316080],
  [15054016, 1656643999],
  [15003616, 1655836065],
  [14953216, 1655082218],
  [14902816, 1654339501],
  [14852416, 1653630174],
  [14802016, 1652921554],
  [14751616, 1652228021],
  [14701216, 1651534090],
  [14650816, 1650848880],
  [14600416, 1650165856],
  [14550016, 1649486893],
  [14499616, 1648806465],
  [14449216, 1648128113],
  [14398816, 1647449702],
  [14348416, 1646772879],
  [14298016, 1646096302],
  [14247616, 1645421997],
  [14197216, 1644747596],
  [14146816, 1644075207],
  [14096416, 1643402893],
  [14046016, 1642728930],
  [13995616, 1642056026],
  [13945216, 1641382680],
  [13894816, 1640709090],
  [13844416, 1640034284],
  [13794016, 1639360727],
  [13743616, 1638674211],
  [13693216, 1637977594],
  [13642816, 1637285636],
  [13592416, 1636599169],
  [13542016, 1635916655],
  [13491616, 1635232971],
  [13441216, 1634552151],
  [13390816, 1633867829],
  [13340416, 1633185598],
  [13290016, 1632507297],
  [13239616, 1631833338],
  [13189216, 1631159313],
  [13138816, 1630486699],
  [13088416, 1629813208],
  [13038016, 1629140510],
  [12987616, 1628467863],
  [12937216, 1627787546],
  [12886816, 1627100074],
  [12836416, 1626418486],
  [12786016, 1625737872],
  [12735616, 1625059735],
  [12685216, 1624381030],
  [12634816, 1623703451],
  [12584416, 1623028187],
  [12534016, 1622354604],
  [12483616, 1621680060],
  [12433216, 1621005035],
  [12382816, 1620331741],
  [12332416, 1619659645],
  [12282016, 1618987093],
  [12231616, 1618315338],
  [12181216, 1617646567],
  [12130816, 1616976634],
  [12080416, 1616306596],
  [12030016, 1615635787],
  [11979616, 1614964325],
  [11929216, 1614294454],
  [11878816, 1613624532],
  [11828416, 1612955577],
  [11778016, 1612285049],
  [11727616, 1611613768],
  [11677216, 1610946216],
  [11626816, 1610277910],
  [11576416, 1609609487],
  [11526016, 1608942818],
  [11475616, 1608273898],
  [11425216, 1607603718],
  [11374816, 1606934994],
  [11324416, 1606265705],
  [11274016, 1605597441],
  [11223616, 1604929126],
  [11173216, 1604260789],
  [11122816, 1603592104],
  [11072416, 1602924240],
  [11022016, 1602256332],
  [10971616, 1601574686],
  [10921216, 1600896054],
  [10870816, 1600228135],
  [10820416, 1599560620],
  [10770016, 1598894446],
  [10719616, 1598225608],
  [10669216, 1597555615],
  [10618816, 1596885027],
  [10568416, 1596212262],
  [10518016, 1595538171],
  [10467616, 1594863423],
  [10417216, 1594189393],
  [10366816, 1593516333],
  [10316416, 1592840135],
  [10266016, 1592166490],
  [10215616, 1591492498],
  [10165216, 1590816278],
  [10114816, 1590138454],
  [10064416, 1589461140],
  [10014016, 1588785723],
  [9963616, 1588112324],
  [9913216, 1587437215],
  [9862816, 1586764943],
  [9812416, 1586095167],
  [9762016, 1585425074],
  [9711616, 1584748062],
  [9661216, 1584076085],
  [9610816, 1583405949],
  [9560416, 1582736982],
  [9510016, 1582067792],
  [9459616, 1581396871],
  [9409216, 1580728259],
  [9358816, 1580059366],
  [9308416, 1579392274],
  [9258016, 1578724896],
  [9207616, 1578059058],
  [9157216, 1577215838],
  [9106816, 1576351722],
  [9056416, 1575571813],
  [9006016, 1574799121],
]

/**
 * Spot prices in USD, used only to size the ETH-equivalent tiers - see
 * assumptions #4 and #6. Keyed by the Coingecko id the l2beat config assigns to
 * each token.
 *
 * Captured once on 2026-08-04. Thresholds are rounded to one significant digit,
 * so these only need updating if a price moves far enough to change that digit.
 * A tracked token missing from this table is skipped with a warning.
 */
const PRICES_USD: Record<string, number> = {
  ethereum: 1869.07,
  tether: 0.999123,
  'usd-coin': 0.999545,
  usds: 0.999906,
  'wrapped-steth': 2320.26,
  'wrapped-bitcoin': 63848,
  susds: 1.11,
  dai: 0.999895,
  weth: 1869.9,
  'usd1-wlfi': 0.999246,
  'ethena-usde': 0.999472,
  'frax-usd': 0.999773,
  instadapp: 1.26,
  railgun: 1.48,
  'f-x-protocol-fxusd': 0.999956,
  'liquity-bold-2': 1.001,
  'wrapped-oeth': 2167.75,
  'rainbow-bridged-near-ethereum': 1.75,
}

/** The two ETH-equivalent sizes every arbitrary-amount token is measured at. */
const ETH_TIERS = [0.1, 10]
const ETH_PRICE_ID = 'ethereum'

/** A single line on the chart. */
interface Series {
  id: string
  label: string
  /** Token symbol - the frontend colors one hue per family. */
  family: string
}

/** A qualifying deposit, already assigned to the series it belongs to. */
interface Entry {
  seriesId: string
  blockNum: number
  sender: string
}

interface Anchor {
  blockNumber: number
  timestamp: number
}

interface TrxRow {
  protocol: string
  bucket: string
  blockNum: number
  sender: string
  amountRaw: bigint
}

interface PrivacyPoolsRow {
  action: string
  bucket: string
  address: string
  amountRaw: bigint
  blockNumber: number
}

/** A deposit stripped down to what every protocol has in common. */
interface Deposit {
  bucket: string
  blockNum: number
  sender: string
  amountRaw: bigint
}

interface TokenSpec {
  symbol: string
  decimals: number
  priceId: string
  buckets: { id: string; denomination: string | undefined }[]
}

/** The tokens and buckets the l2beat config actually tracks for a project. */
function getTrackedTokens(project: {
  privacyInfo?: {
    tokens: {
      token: { symbol: string; decimals: number; priceId?: string }
      buckets: { id: string; denomination?: string }[]
    }[]
  }
}): TokenSpec[] {
  return (project.privacyInfo?.tokens ?? []).map((token) => ({
    symbol: token.token.symbol,
    decimals: token.token.decimals,
    priceId: token.token.priceId ?? '',
    buckets: token.buckets.map((bucket) => ({
      id: bucket.id,
      denomination: bucket.denomination,
    })),
  }))
}

// `PrivacyFlowTrxs_with_amounts.csv` has no header row - the column order
// (id, protocol, bucket, block_num, tx_hash, sender, amount, token) is
// hardcoded, see `computeAnonymitySets.ts` assumption #2.
function parseTrxsWithAmounts(path: string): TrxRow[] {
  const lines = readFileSync(path, 'utf-8').split('\n')
  const rows: TrxRow[] = []
  for (const line of lines) {
    if (!line) continue
    const [, protocol, bucket, blockNum, , sender, amount] = line.split(',')
    if (!protocol || !bucket || !blockNum || !sender || !amount) continue
    const lowercasedSender = sender.toLowerCase()
    if (lowercasedSender === ZERO_ADDRESS) continue

    rows.push({
      protocol,
      bucket,
      blockNum: Number(blockNum),
      sender: lowercasedSender,
      amountRaw: BigInt(amount),
    })
  }
  return rows
}

function parsePrivacyPoolsCsv(path: string): PrivacyPoolsRow[] {
  const lines = readFileSync(path, 'utf-8').split('\n').filter(Boolean)
  const [, ...dataLines] = lines // first line is a header
  const rows: PrivacyPoolsRow[] = []
  for (const line of dataLines) {
    const [, action, bucket, address, amountRaw, , , blockNumber] =
      line.split(',')
    if (!action || !bucket || !address || !amountRaw || !blockNumber) continue
    const lowercasedAddress = address.toLowerCase()
    if (lowercasedAddress === ZERO_ADDRESS) continue

    rows.push({
      action,
      bucket,
      address: lowercasedAddress,
      amountRaw: BigInt(amountRaw),
      blockNumber: Number(blockNumber),
    })
  }
  return rows
}

/** One curve per fixed-denomination pool. */
function fromDenominations(deposits: Deposit[], tokens: TokenSpec[]) {
  const series: Series[] = []
  const entries: Entry[] = []

  const byBucket = new Map<string, Deposit[]>()
  for (const deposit of deposits) {
    const existing = byBucket.get(deposit.bucket) ?? []
    existing.push(deposit)
    byBucket.set(deposit.bucket, existing)
  }

  for (const token of sortByActivity(tokens, byBucket)) {
    for (const bucket of token.buckets) {
      series.push({
        id: bucket.id,
        label: `${bucket.denomination ?? '?'} ${token.symbol}`,
        family: token.symbol,
      })
      for (const deposit of byBucket.get(bucket.id) ?? []) {
        entries.push({
          seriesId: bucket.id,
          blockNum: deposit.blockNum,
          sender: deposit.sender,
        })
      }
    }
  }

  return { series, entries }
}

/**
 * Two curves per token, at "at least 0.1 ETH worth" and "at least 10 ETH
 * worth". Tiers are minimums, not ranges: a 10 ETH deposit also covers someone
 * hiding 0.1 ETH.
 */
function fromEthEquivalentTiers(
  deposits: Deposit[],
  tokens: TokenSpec[],
  prices: Map<string, number>,
) {
  const series: Series[] = []
  const entries: Entry[] = []
  const thresholds: Record<string, string> = {}

  const byBucket = new Map<string, Deposit[]>()
  for (const deposit of deposits) {
    const existing = byBucket.get(deposit.bucket) ?? []
    existing.push(deposit)
    byBucket.set(deposit.bucket, existing)
  }

  const ethPrice = prices.get(ETH_PRICE_ID)
  if (!ethPrice) throw new Error('Missing ETH price')

  for (const token of sortByActivity(tokens, byBucket)) {
    const price = prices.get(token.priceId)
    if (!price) {
      console.warn(
        `  ! no price for ${token.symbol} (${token.priceId}), skipped`,
      )
      continue
    }

    for (const ethTier of ETH_TIERS) {
      const amount = roundToOneSignificantDigit((ethTier * ethPrice) / price)
      const minimumRaw = toRawAmount(amount, token.decimals)
      const id = `${token.symbol}-min-${ethTier}eth`

      series.push({
        id,
        label: `≥ ${formatAmount(amount)} ${token.symbol}`,
        family: token.symbol,
      })
      thresholds[id] =
        `${formatAmount(amount)} ${token.symbol} ≈ ${ethTier} ETH`

      for (const bucket of token.buckets) {
        for (const deposit of byBucket.get(bucket.id) ?? []) {
          if (deposit.amountRaw < minimumRaw) continue
          entries.push({
            seriesId: id,
            blockNum: deposit.blockNum,
            sender: deposit.sender,
          })
        }
      }
    }
  }

  return { series, entries, thresholds }
}

/** Busiest tokens first, so the chart hands its strongest hues to real data. */
function sortByActivity(tokens: TokenSpec[], byBucket: Map<string, Deposit[]>) {
  const depositCount = (token: TokenSpec) =>
    token.buckets.reduce(
      (sum, bucket) => sum + (byBucket.get(bucket.id)?.length ?? 0),
      0,
    )
  return [...tokens].sort((a, b) => depositCount(b) - depositCount(a))
}

function roundToOneSignificantDigit(value: number): number {
  if (value === 0) return 0
  // toPrecision keeps the result free of binary float noise, so a threshold
  // comes out as 0.3 rather than 0.30000000000000004.
  return Number(value.toPrecision(1))
}

function toRawAmount(amount: number, decimals: number): bigint {
  // Amounts are already rounded to one significant digit, so a string round
  // trip avoids float noise in the raw integer.
  const [whole, fraction = ''] = amount.toFixed(decimals).split('.')
  return BigInt(`${whole}${fraction.padEnd(decimals, '0')}`)
}

function formatAmount(amount: number): string {
  return amount >= 1 ? amount.toLocaleString('en-US') : amount.toString()
}

// Evenly spaced (block, timestamp) pairs, newest first - see assumption #2.
function getAnchors(): Anchor[] {
  return BLOCK_ANCHORS.map(([blockNumber, timestamp]) => ({
    blockNumber,
    timestamp,
  }))
}

function getPrices(): Map<string, number> {
  return new Map(Object.entries(PRICES_USD))
}

/**
 * Timestamp of a block, linearly interpolated between the two surrounding
 * anchors. Returns undefined for blocks older than the oldest anchor - those
 * are always outside the MAX_DAYS window anyway.
 */
function interpolateTimestamp(
  anchors: Anchor[],
  blockNumber: number,
): number | undefined {
  const newest = anchors[0]
  const oldest = anchors[anchors.length - 1]
  if (!newest || !oldest) return undefined
  if (blockNumber < oldest.blockNumber) return undefined
  if (blockNumber >= newest.blockNumber) return newest.timestamp

  // Anchors are evenly spaced in block space, so the index is a direct lookup.
  const index = Math.floor(
    (newest.blockNumber - blockNumber) / ANCHOR_STEP_BLOCKS,
  )
  const upper = anchors[index]
  const lower = anchors[index + 1]
  if (!upper || !lower) return undefined

  const blockSpan = upper.blockNumber - lower.blockNumber
  const progress = (blockNumber - lower.blockNumber) / blockSpan
  return lower.timestamp + progress * (upper.timestamp - lower.timestamp)
}

/**
 * For each series, the number of unique depositors in the trailing window of
 * `days` days, for every `days` between MIN_DAYS and MAX_DAYS.
 */
function computeCurves(entries: Entry[], series: Series[], anchors: Anchor[]) {
  const bySeries = new Map<string, Map<number, string[]>>()
  for (const s of series) {
    bySeries.set(s.id, new Map())
  }

  for (const entry of entries) {
    const timestamp = interpolateTimestamp(anchors, entry.blockNum)
    if (timestamp === undefined || timestamp > NOW_SECONDS) continue
    // How many days you would have had to hold for this deposit to still be
    // inside your window. Everything at or below MIN_DAYS lands in the first
    // data point.
    const daysAgo = Math.max(
      MIN_DAYS,
      Math.ceil((NOW_SECONDS - timestamp) / DAY_SECONDS),
    )
    if (daysAgo > MAX_DAYS) continue

    const byDay = bySeries.get(entry.seriesId)
    if (!byDay) continue
    const senders = byDay.get(daysAgo) ?? []
    senders.push(entry.sender)
    byDay.set(daysAgo, senders)
  }

  // Windows are nested, so sweeping from MIN_DAYS to MAX_DAYS lets a single
  // running set of addresses produce every point.
  const curves = new Map<string, number[]>()
  for (const s of series) {
    const byDay = bySeries.get(s.id)
    const seen = new Set<string>()
    const sizes: number[] = []
    for (let days = MIN_DAYS; days <= MAX_DAYS; days++) {
      for (const sender of byDay?.get(days) ?? []) {
        seen.add(sender)
      }
      sizes.push(seen.size)
    }
    curves.set(s.id, sizes)
  }

  return curves
}

/**
 * For each series, the number of unique depositors in the HISTORY_WINDOW_DAYS
 * long window ending at each daily timestamp of the project's whole life - from
 * the day of its first qualifying deposit up to `NOW`.
 *
 * A point sits at UTC midnight of its day and looks strictly backwards, exactly
 * like `computeCurves` does at `NOW`: the point at day `d` covers the
 * HISTORY_WINDOW_DAYS whole days `[d - 30, d - 1]`, the ones that had already
 * finished when the window closed. Anchoring both to an instant rather than to
 * a calendar day is what makes the last history point equal the 30 day point of
 * the curve.
 *
 * The first point therefore reads zero by construction - its window ends where
 * the first deposit lands - which is the right baseline for a pool opening.
 */
function computeHistory(entries: Entry[], series: Series[], anchors: Anchor[]) {
  const lastDay = Math.floor(NOW_SECONDS / DAY_SECONDS)

  const bySeries = new Map<string, Map<number, string[]>>()
  for (const s of series) {
    bySeries.set(s.id, new Map())
  }

  // The project's history starts at its first qualifying deposit. A project
  // with no deposits at all still gets a single point, so the chart has an
  // x axis to draw.
  let firstDay = lastDay

  for (const entry of entries) {
    const timestamp = interpolateTimestamp(anchors, entry.blockNum)
    if (timestamp === undefined || timestamp > NOW_SECONDS) continue
    const day = Math.floor(timestamp / DAY_SECONDS)
    if (day < firstDay) firstDay = day

    const byDay = bySeries.get(entry.seriesId)
    if (!byDay) continue
    const senders = byDay.get(day) ?? []
    senders.push(entry.sender)
    byDay.set(day, senders)
  }

  // The oldest window reaches back past the oldest point it produces.
  const oldestDay = firstDay - HISTORY_WINDOW_DAYS

  // Consecutive windows overlap in all but two days, so one multiset of
  // addresses is carried across the sweep, adding the day that enters the
  // window and dropping the one that leaves it. Its size is the answer.
  const histories = new Map<string, number[]>()
  for (const s of series) {
    const byDay = bySeries.get(s.id)
    const counts = new Map<string, number>()

    const add = (day: number) => {
      for (const sender of byDay?.get(day) ?? []) {
        counts.set(sender, (counts.get(sender) ?? 0) + 1)
      }
    }
    const remove = (day: number) => {
      for (const sender of byDay?.get(day) ?? []) {
        const count = (counts.get(sender) ?? 0) - 1
        if (count > 0) counts.set(sender, count)
        else counts.delete(sender)
      }
    }

    // Seed the window of the first point: days [firstDay - 30, firstDay - 1].
    for (let day = oldestDay; day < firstDay; day++) add(day)

    const sizes = [counts.size]
    for (let day = firstDay + 1; day <= lastDay; day++) {
      add(day - 1)
      remove(day - 1 - HISTORY_WINDOW_DAYS)
      sizes.push(counts.size)
    }

    histories.set(s.id, sizes)
  }

  return { histories, firstDay, lastDay }
}

/**
 * The anchors must reach back past the oldest day any chart looks at, or
 * `interpolateTimestamp` silently drops deposits and the oldest points come out
 * too low. Cheaper to fail loudly here than to notice a sagging tail on the
 * chart.
 */
function assertAnchorReach(anchors: Anchor[], oldestDepositBlock: number) {
  const oldest = anchors[anchors.length - 1]
  if (!oldest) throw new Error('No block anchors')

  if (oldest.blockNumber > oldestDepositBlock) {
    throw new Error(
      `BLOCK_ANCHORS only reach block ${oldest.blockNumber} (${new Date(oldest.timestamp * 1000).toISOString()}), ` +
        `but the snapshot's oldest deposit is at block ${oldestDepositBlock}. ` +
        'Extend the table by stepping further back from its oldest block.',
    )
  }
}

/** Where the config and the CSV snapshot disagree about what exists. */
function reportCoverage(
  tokens: TokenSpec[],
  deposits: Deposit[],
  matchesBucket: (csvBucket: string, trackedId: string) => boolean,
) {
  const trackedIds = tokens.flatMap((token) =>
    token.buckets.map((bucket) => bucket.id),
  )
  const csvBuckets = new Set(deposits.map((deposit) => deposit.bucket))

  const empty = trackedIds.filter(
    (id) => ![...csvBuckets].some((csv) => matchesBucket(csv, id)),
  )
  const untracked = [...csvBuckets].filter(
    (csv) => !trackedIds.some((id) => matchesBucket(csv, id)),
  )

  if (empty.length > 0) {
    console.log(`  tracked but absent from snapshot: ${empty.join(', ')}`)
  }
  if (untracked.length > 0) {
    console.log(`  in snapshot but not tracked: ${untracked.join(', ')}`)
  }
  if (empty.length === 0 && untracked.length === 0) {
    console.log('  snapshot and config agree on every bucket')
  }
}

function main() {
  const tornadoTokens = getTrackedTokens(tornadoCash)
  const railgunTokens = getTrackedTokens(railgun)
  const privacyPoolsTokens = getTrackedTokens(privacyPools)

  const prices = getPrices()
  const anchors = getAnchors()

  const trxRows = parseTrxsWithAmounts(TRXS_WITH_AMOUNTS_FILE)
  const ppRows = parsePrivacyPoolsCsv(PRIVACY_POOLS_FILE)

  const oldestDepositBlock = Math.min(
    trxRows.reduce(
      (min, row) => Math.min(min, row.blockNum),
      Number.POSITIVE_INFINITY,
    ),
    ppRows.reduce(
      (min, row) => Math.min(min, row.blockNumber),
      Number.POSITIVE_INFINITY,
    ),
  )
  assertAnchorReach(anchors, oldestDepositBlock)

  const toDeposit = (row: TrxRow): Deposit => ({
    bucket: row.bucket,
    blockNum: row.blockNum,
    sender: row.sender,
    amountRaw: row.amountRaw,
  })

  const tornadoDeposits = trxRows
    .filter((row) => row.protocol === 'tornado-cash')
    .map(toDeposit)
  const railgunDeposits = trxRows
    .filter((row) => row.protocol === 'railgun')
    .map(toDeposit)
  // Privacy Pools bucket ids in the CSV carry a pool address suffix that the
  // config ids do not have, so they are matched by prefix.
  const ppDeposits = ppRows
    .filter((row) => row.action === 'deposit')
    .map((row) => ({
      bucket: row.bucket,
      blockNum: row.blockNumber,
      sender: row.address,
      amountRaw: row.amountRaw,
    }))

  const exact = (csv: string, tracked: string) => csv === tracked
  // Privacy Pools ids differ from the config ones in the pool address suffix
  // and, for wOETH, in capitalisation.
  const prefix = (csv: string, tracked: string) => {
    const a = csv.toLowerCase()
    const b = tracked.toLowerCase()
    return a === b || a.startsWith(`${b}-`)
  }

  console.log('\n=== coverage')
  console.log('tornado-cash')
  reportCoverage(tornadoTokens, tornadoDeposits, exact)
  console.log('railgun')
  reportCoverage(railgunTokens, railgunDeposits, exact)
  console.log('privacy-pools')
  reportCoverage(privacyPoolsTokens, ppDeposits, prefix)

  // Privacy Pools deposits are re-keyed onto the tracked bucket ids so the
  // per-token grouping below can look them up directly.
  const ppTrackedIds = privacyPoolsTokens.flatMap((token) =>
    token.buckets.map((bucket) => bucket.id),
  )
  const ppRekeyed = ppDeposits.map((deposit) => ({
    ...deposit,
    bucket:
      ppTrackedIds.find((id) => prefix(deposit.bucket, id)) ?? deposit.bucket,
  }))

  const projects = [
    {
      slug: 'tornado-cash',
      description:
        'Each line is one fixed-denomination pool, counting the addresses that deposited into it.',
      ...fromDenominations(tornadoDeposits, tornadoTokens),
      thresholds: undefined,
    },
    {
      slug: 'railgun',
      description:
        'Railgun deposits are arbitrary amounts, so each line counts the addresses that deposited at least that much of a token - two sizes per token, worth roughly 0.1 and 10 ETH.',
      ...fromEthEquivalentTiers(railgunDeposits, railgunTokens, prices),
    },
    {
      slug: 'privacy-pools',
      description:
        'Privacy Pools deposits are arbitrary amounts, so each line counts the addresses that deposited at least that much of a token - two sizes per token, worth roughly 0.1 and 10 ETH.',
      ...fromEthEquivalentTiers(ppRekeyed, privacyPoolsTokens, prices),
    },
  ]

  const output: Record<string, unknown> = {}
  for (const project of projects) {
    const curves = computeCurves(project.entries, project.series, anchors)

    const points: number[][] = []
    for (let days = MIN_DAYS; days <= MAX_DAYS; days++) {
      const index = days - MIN_DAYS
      points.push([
        days,
        ...project.series.map((s) => curves.get(s.id)?.[index] ?? 0),
      ])
    }

    const { histories, firstDay, lastDay } = computeHistory(
      project.entries,
      project.series,
      anchors,
    )

    const historyPoints: number[][] = []
    for (let day = firstDay; day <= lastDay; day++) {
      const index = day - firstDay
      historyPoints.push([
        day * DAY_SECONDS,
        ...project.series.map((s) => histories.get(s.id)?.[index] ?? 0),
      ])
    }

    output[project.slug] = {
      description: project.description,
      buckets: project.series,
      points,
      history: historyPoints,
    }

    console.log(
      `\n=== ${project.slug}: ${project.series.length} series, ` +
        `${historyPoints.length} history points from ` +
        `${new Date(firstDay * DAY_SECONDS * 1000).toISOString().slice(0, 10)}`,
    )
    for (const s of project.series) {
      const sizes = curves.get(s.id)
      const history = histories.get(s.id) ?? []
      console.log(
        `  ${s.label.padEnd(22)} 30d: ${String(sizes?.[30 - MIN_DAYS] ?? 0).padStart(5)}   365d: ${String(sizes?.[MAX_DAYS - MIN_DAYS] ?? 0).padStart(5)}   peak 30d: ${String(Math.max(0, ...history)).padStart(5)}`,
      )
    }
  }

  const result = {
    generatedAt: new Date().toISOString(),
    asOf: NOW_ISO,
    minDays: MIN_DAYS,
    maxDays: MAX_DAYS,
    historyWindowDays: HISTORY_WINDOW_DAYS,
    pricesUsd: Object.fromEntries(prices),
    projects: output,
  }

  writeFileSync(OUTPUT_FILE, `${JSON.stringify(result, null, 2)}\n`)

  console.log(
    `\nAnchors: ${anchors.length}, newest block: ${anchors[0]?.blockNumber}`,
  )
  console.log(`Wrote ${OUTPUT_FILE}`)
  console.log('Run `biome format --write` on it before committing.')
}

try {
  main()
} catch (e: unknown) {
  console.error(e)
  process.exit(1)
}
