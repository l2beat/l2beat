/**
 * `BENCHMARK.html`: several benchmark runs side by side, in one file.
 *
 * The question the page answers is "how much of what V1 found does V2 find,
 * and what changed it": a no-plan floor next to a model run, or one model
 * next to another. So every run is one bar of V1's fields split by verdict,
 * with the same colours in every chart, and the number that matters, the
 * share of V1 fields V2 reproduced, is printed on the bar. Below the bars the
 * same data is a table, and each run expands into its contracts and their
 * non-equal fields, because a percentage without the list behind it is not
 * an argument.
 *
 * Self-contained on purpose (data and script inline, no dependencies): it is
 * opened from disk and pasted into a slide, and it must keep working when the
 * runs directory is gone.
 */
import type { ProjectBenchmark } from './types'

export interface NamedReport {
  label: string
  report: ProjectBenchmark
}

export function renderHtml(reports: NamedReport[]): string {
  const data = reports.map(({ label, report }) => ({
    label,
    ...report,
  }))
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Discovery V2 benchmark</title>
<style>${STYLE}</style>
</head>
<body>
<main class="viz-root" id="app"></main>
<script id="data" type="application/json">${escapeForScript(JSON.stringify(data))}</script>
<script>${SCRIPT}</script>
</body>
</html>
`
}

/** `</script>` inside JSON would end the data block early. */
function escapeForScript(json: string): string {
  return json.replace(/</g, '\\u003c')
}

const STYLE = `
.viz-root {
  color-scheme: light;
  --surface-1: #fcfcfb;
  --surface-2: #f1f0ec;
  --border: #dedcd5;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --text-muted: #8a8880;
  --equal: #2a78d6;
  --renamed: #1baf7a;
  --by-value: #4a3aa7;
  --different: #eda100;
  --missed: #e34948;
  --display-only: #b8b6ad;
  --v2-only: #b8b6ad;
}
body { margin: 0; background: var(--surface-1); color: var(--text-primary);
  font: 14px/1.45 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
main { max-width: 1200px; margin: 0 auto; padding: 32px 24px 64px; }
h1 { font-size: 24px; margin: 0 0 4px; }
h2 { font-size: 17px; margin: 40px 0 12px; }
p.lede { color: var(--text-secondary); margin: 0 0 24px; max-width: 70ch; }
.legend { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 8px 0 16px; color: var(--text-secondary); font-size: 13px; }
.legend span::before { content: ""; display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; background: var(--c); vertical-align: -1px; }
.bars { display: grid; grid-template-columns: max-content 1fr 6ch; gap: 10px 14px; align-items: center; }
.bars .name { text-align: right; color: var(--text-secondary); white-space: nowrap; }
.bars .name b { color: var(--text-primary); font-weight: 600; }
.bars .name small { display: block; color: var(--text-muted); font-size: 12px; }
.bar { display: flex; height: 22px; gap: 2px; }
.bar div { border-radius: 3px; position: relative; cursor: default; }
.bar div:hover::after { content: attr(data-tip); position: absolute; left: 50%; top: -34px; transform: translateX(-50%);
  background: var(--text-primary); color: #fff; font-size: 12px; padding: 4px 8px; border-radius: 4px; white-space: nowrap; z-index: 2; }
.pct { font-variant-numeric: tabular-nums; font-weight: 600; text-align: right; }
.scroll { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; }
th, td { text-align: right; padding: 6px 8px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: top; }
th:first-child, td:first-child, th.l, td.l { text-align: left; }
th { color: var(--text-secondary); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: .02em; }
tr.run { background: var(--surface-2); font-weight: 600; }
details { margin: 12px 0; border: 1px solid var(--border); border-radius: 6px; }
summary { padding: 10px 14px; cursor: pointer; font-weight: 600; }
details > div { padding: 0 14px 14px; }
.miss { color: var(--text-secondary); font-size: 13px; }
.miss code { font-size: 12px; background: var(--surface-2); padding: 1px 4px; border-radius: 3px; }
.tag { display: inline-block; font-size: 11px; padding: 1px 6px; border-radius: 10px; color: #fff; background: var(--c); margin-right: 6px; }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 16px 0; }
.tile { border: 1px solid var(--border); border-radius: 6px; padding: 12px 14px; }
.tile .v { font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; }
.tile .k { color: var(--text-muted); font-size: 12px; }
.note { color: var(--text-muted); font-size: 12px; }
`

const SCRIPT = `
const runs = JSON.parse(document.getElementById('data').textContent)
const SEGMENTS = [
  ['equal', 'equal', 'same field name, same value', c => c.equal],
  ['renamed', 'equal, other name', 'same value, V2 names the field after the Solidity getter', c => c.equalRenamed],
  ['by-value', 'same values, other shape', 'every value V1 had is in V2, under another key or nesting (one map instead of one field per key, a struct as a list)', c => c.equalByValue],
  ['different', 'different value', 'same field on both sides, values differ (formatting, type, or a real disagreement); listed per contract below', c => c.different],
  ['missed', 'missed', 'V1 has the value, V2 has nothing holding it', c => c.v1Only.proxy + c.v1Only.getter + c.v1Only.handler],
  ['display-only', 'V1 display-only', 'a V1 template field that repeats or reformats a value counted elsewhere (role member picks, copies, formatted delays); V2 leaves that to the consumer', c => c.v1Only['template-projection']],
]
const FOUND = c => c.equal + c.equalRenamed + c.equalByValue
const EXTRACTED = c => c.v1Fields - c.v1Only['template-projection']

const pct = (a, b) => b === 0 ? '-' : (100 * a / b).toFixed(1) + '%'
const coverage = c => EXTRACTED(c) === 0 ? 0 : FOUND(c) / EXTRACTED(c)
const seconds = ms => (ms / 1000).toFixed(0) + ' s'
const kTokens = t => (t / 1000).toFixed(0) + 'k'
const esc = s => String(s).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]))


function setup(run) {
  if (run.noPlan) return 'empty plan, no model (floor)'
  const parts = [run.model ?? (run.author ? 'model' : 'stored plans only')]
  if (run.reasoning) parts.push('reasoning ' + run.reasoning)
  if (run.repeat) parts.push('repeat ' + run.repeat)
  return parts.join(', ')
}

function bar(counts, total) {
  return '<div class="bar">' + SEGMENTS.map(([key, name, , get]) => {
    const n = get(counts)
    if (n === 0) return ''
    const w = (100 * n / total).toFixed(2)
    return '<div style="flex:0 0 calc(' + w + '% - 2px);background:var(--' + key + ')" data-tip="' + esc(name + ': ' + n + ' (' + pct(n, total) + ')') + '"></div>'
  }).join('') + '</div>'
}

function legend() {
  return '<div class="legend">' + SEGMENTS.map(([key, name, tip]) =>
    '<span style="--c:var(--' + key + ')" title="' + esc(tip) + '">' + esc(name) + '</span>').join('') + '</div>'
}

function runName(run) {
  return '<div class="name"><b>' + esc(run.project) + '</b> · ' + esc(run.label) + '<small>' + esc(setup(run)) + ' · ' + run.totals.contracts + ' contracts · block ' + run.blockNumber + '</small></div>'
}

function coverageChart() {
  return '<div class="bars">' + runs.map(run => {
    const c = run.totals
    return runName(run) + bar(c, c.v1Fields) + '<div class="pct">' + pct(FOUND(c), EXTRACTED(c)) + '</div>'
  }).join('') + '</div>'
}

/** The same split, restricted to V1 fields a researcher wrote a handler for. */
function handlerCounts(run) {
  const fields = run.contracts.flatMap(c => c.fields).filter(f => f.verdict !== 'v2-only' && f.attribution.kind === 'handler')
  const count = verdict => fields.filter(f => f.verdict === verdict).length
  return {
    v1Fields: fields.length,
    equal: count('equal'),
    equalRenamed: count('equal-renamed'),
    equalByValue: count('equal-by-value'),
    different: count('different'),
    v1Only: { proxy: 0, getter: 0, handler: count('v1-only'), 'template-projection': 0 },
  }
}

function handlerChart() {
  const modelRuns = runs.filter(run => !run.noPlan)
  return '<div class="bars">' + modelRuns.map(run => {
    const c = handlerCounts(run)
    return runName(run) + bar(c, c.v1Fields) + '<div class="pct">' + pct(FOUND(c), c.v1Fields) + '</div>'
  }).join('') + '</div>'
}

function summaryTable() {
  const head = ['run', 'contracts', 'V1 fields', 'equal', 'other name', 'other shape', 'different', 'missed getter', 'missed handler', 'V1 display-only', 'V2 new', 'found', 'handler fields', 'handler found', 'model calls', 'tokens in / out', 'wall']
  const rows = runs.map(run => {
    const c = run.totals
    const h = handlerCounts(run)
    const calls = Object.entries(c.roundsDistribution).reduce((s, [, n]) => s + n, 0)
    return [run.project + ' · ' + run.label, c.contracts + (c.failed ? ' (' + c.failed + ' failed)' : ''), c.v1Fields, c.equal, c.equalRenamed, c.equalByValue, c.different,
      c.v1Only.proxy + c.v1Only.getter, c.v1Only.handler, c.v1Only['template-projection'], c.v2Only.new,
      pct(FOUND(c), EXTRACTED(c)), h.v1Fields, FOUND(h) + ' (' + pct(FOUND(h), h.v1Fields) + ')', calls, kTokens(c.tokens.input) + ' / ' + kTokens(c.tokens.output), seconds(c.wallMs)]
  })
  return '<div class="scroll"><table><thead><tr>' + head.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>'
    + rows.map(r => '<tr>' + r.map((v, i) => '<td class="' + (i === 0 ? 'l' : '') + '">' + esc(v) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>'
    + '<p class="note">found = (equal + other name + other shape) / (V1 fields − V1 display-only). handler fields = the V1 fields a researcher wrote a handler for; handler found = how many of those V2 has the values of. V2 new = fields V2 produced that V1 never had (not counted anywhere else; V2 fields V1 listed in ignoreMethods are dropped).</p>'
}

function missList(contract) {
  const interesting = contract.fields.filter(f => f.verdict !== 'equal' && !(f.verdict === 'v2-only' && f.class === 'ignored-by-v1'))
  if (interesting.length === 0) return '<p class="miss">every V1 field matched</p>'
  return '<ul class="miss">' + interesting.map(f => {
    if (f.verdict === 'v2-only') return '<li><span class="tag" style="--c:var(--v2-only)">V2 new</span><code>' + esc(f.name) + '</code></li>'
    const a = f.attribution
    const kind = a.kind === 'handler' ? 'V1 handler ' + a.handlerType : a.kind === 'template-projection' ? 'V1 display-only via ' + a.via : 'V1 ' + a.kind
    const seg = f.verdict === 'equal-renamed' ? 'renamed' : f.verdict === 'equal-by-value' ? 'by-value' : f.verdict === 'different' ? 'different' : a.kind === 'template-projection' ? 'display-only' : 'missed'
    const label = f.verdict === 'equal-renamed' ? 'other name → ' + f.v2Name : f.verdict === 'equal-by-value' ? 'other shape, in ' + f.v2Names.join(', ') : f.verdict === 'different' ? 'different' : a.kind === 'template-projection' ? 'display-only' : 'missed'
    return '<li><span class="tag" style="--c:var(--' + seg + ')">' + esc(label) + '</span><code>' + esc(f.name) + '</code> · ' + esc(kind) + (f.diff ? ' · ' + esc(f.diff) : '') + '</li>'
  }).join('') + '</ul>'
}

function contractsTable(run) {
  const head = ['contract', 'template', 'plan', 'V1 fields', 'equal', 'other name', 'other shape', 'different', 'missed', 'display-only', 'V2 new', 'found', 'rounds', 'tokens in', 'distinct plans']
  const sorted = [...run.contracts].sort((a, b) => coverage(a.counts) - coverage(b.counts))
  return '<div class="scroll"><table><thead><tr>' + head.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' + sorted.map(c => {
    const k = c.counts
    const missed = k.v1Only.proxy + k.v1Only.getter + k.v1Only.handler
    const plan = c.status === 'failed' ? 'FAILED: ' + (c.error ?? '') : c.planStatus + ' (' + c.planSource + ')'
    return '<tr><td class="l">' + esc(c.name ?? c.address) + '</td><td class="l">' + esc(c.template ?? '-') + '</td><td class="l">' + esc(plan) + '</td>'
      + [k.v1Fields, k.equal, k.equalRenamed, k.equalByValue, k.different, missed, k.v1Only['template-projection'], k.v2Only.new, pct(FOUND(k), EXTRACTED(k)), c.rounds, kTokens(c.tokens.input),
         c.repeats ? c.repeats.distinctDecisionHashes + '/' + c.repeats.plans : '-'].map(v => '<td>' + esc(v) + '</td>').join('')
      + '</tr><tr><td colspan="15" class="l">' + missList(c) + '</td></tr>'
  }).join('') + '</tbody></table></div>'
}

function runDetails() {
  return runs.map(run => '<details><summary>' + esc(run.project + ' · ' + run.label) + ' — ' + esc(setup(run)) + '</summary><div>' + contractsTable(run) + '</div></details>').join('')
}

function costTiles() {
  const modelRuns = runs.filter(r => !r.noPlan && r.totals.tokens.input > 0)
  if (modelRuns.length === 0) return ''
  const sum = f => modelRuns.reduce((s, r) => s + f(r), 0)
  const calls = sum(r => Object.values(r.totals.roundsDistribution).reduce((s, n) => s + n, 0))
  const oneRound = sum(r => r.totals.roundsDistribution['1'] ?? 0)
  return '<div class="tiles">'
    + tile(calls, 'model calls across model runs')
    + tile(pct(oneRound, calls), 'accepted after one round')
    + tile(kTokens(sum(r => r.totals.tokens.input)), 'input tokens')
    + tile(kTokens(sum(r => r.totals.tokens.output)), 'output tokens')
    + tile(seconds(sum(r => r.totals.modelMs)), 'time inside the model')
    + tile(sum(r => r.totals.failed), 'contracts that failed')
    + '</div>'
}
const tile = (v, k) => '<div class="tile"><div class="v">' + esc(v) + '</div><div class="k">' + esc(k) + '</div></div>'

document.getElementById('app').innerHTML =
  '<h1>Discovery V2 against V1 discovered.json</h1>'
  + '<p class="lede">Every run re-extracts a V1 project at the block of its committed discovered.json and compares values field by field. Each bar splits V1\\'s fields by what V2 produced for them. Only red means a value V1 had and V2 does not. The percentage is the share of V1\\'s extracted fields whose values V2 has, in any shape or name.</p>'
  + legend()
  + '<h2>The fields V1 needed a handler for</h2>'
  + '<p class="lede">Proxy values and 0-argument getters need no decision and come out the same in every run, so they are left out here. These bars keep only the V1 fields a researcher wrote a handler for (events, access control, arrays, calls with arguments, custom code). This is the part a model, a prompt, a tool or a recipe can move, so this is the bar to compare setups on.</p>'
  + handlerChart()
  + '<h2>All V1 fields, for completeness</h2>'
  + '<p class="lede">The same split over every V1 field. The floor rows run with an empty plan and no model, so they show what the deterministic tools alone reproduce; the difference to the run below each is what the plan bought.</p>'
  + coverageChart()
  + '<h2>Numbers behind the bars</h2>' + summaryTable()
  + '<h2>Cost of the model runs</h2>' + costTiles()
  + '<h2>Contracts, worst coverage first</h2>' + runDetails()
`
