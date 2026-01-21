#!/usr/bin/env node
/**
 * Generate HTML Visualizations
 *
 * Reads all analysis JSON files from /analysis folder and generates
 * HTML visualizations.
 *
 * Usage:
 *   npx ts-node scripts/escrowAnalysis/generateHtml.ts
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { EscrowReport } from './chains/types'

const ANALYSIS_DIR = join(__dirname, 'analysis')

function formatUsd(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toFixed(2)}`
}

function generateHtml(reports: EscrowReport[]): string {
  const totalTvl = reports.reduce((sum, r) => sum + r.summary.totalTvl, 0)
  const totalCanonical = reports.reduce((sum, r) => sum + r.summary.canonicalTvl, 0)
  const totalExternal = reports.reduce((sum, r) => sum + r.summary.externalTvl, 0)
  const totalNative = reports.reduce((sum, r) => sum + r.summary.nativeTvl, 0)
  const totalRollupSecured = reports.reduce((sum, r) => sum + r.summary.rollupSecuredTvl, 0)
  const totalIssuerSecured = reports.reduce((sum, r) => sum + r.summary.issuerSecuredTvl, 0)
  const totalThirdParty = reports.reduce((sum, r) => sum + r.summary.thirdPartySecuredTvl, 0)

  const chainRows = reports
    .sort((a, b) => b.summary.totalTvl - a.summary.totalTvl)
    .map(r => `
      <tr onclick="showChainDetail('${r.projectId}')">
        <td>${r.projectId}</td>
        <td>${formatUsd(r.summary.totalTvl)}</td>
        <td class="canonical">${formatUsd(r.summary.canonicalTvl)}</td>
        <td class="external">${formatUsd(r.summary.externalTvl)}</td>
        <td class="native">${formatUsd(r.summary.nativeTvl)}</td>
        <td class="rollup">${formatUsd(r.summary.rollupSecuredTvl)}</td>
        <td class="issuer">${formatUsd(r.summary.issuerSecuredTvl)}</td>
        <td class="third-party">${formatUsd(r.summary.thirdPartySecuredTvl)}</td>
      </tr>
    `).join('')

  const escrowsJson = JSON.stringify(reports.flatMap(r =>
    r.escrows.map(e => ({ ...e, chain: r.projectId }))
  ))

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escrow Analysis Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      padding: 24px;
    }
    h1 { color: #58a6ff; margin-bottom: 24px; }
    h2 { color: #8b949e; margin: 24px 0 16px; font-size: 14px; text-transform: uppercase; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .summary-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
    }
    .summary-card .label { color: #8b949e; font-size: 12px; margin-bottom: 4px; }
    .summary-card .value { font-size: 24px; font-weight: 600; }
    .summary-card.canonical .value { color: #3fb950; }
    .summary-card.external .value { color: #f0883e; }
    .summary-card.native .value { color: #58a6ff; }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .breakdown-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
    }
    .breakdown-card .label { color: #8b949e; font-size: 12px; margin-bottom: 4px; }
    .breakdown-card .value { font-size: 20px; font-weight: 600; }
    .breakdown-card.rollup .value { color: #3fb950; }
    .breakdown-card.issuer .value { color: #a371f7; }
    .breakdown-card.third-party .value { color: #f85149; }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #161b22;
      border-radius: 8px;
      overflow: hidden;
    }
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #30363d;
    }
    th {
      background: #21262d;
      color: #8b949e;
      font-size: 12px;
      text-transform: uppercase;
    }
    tr:hover { background: #21262d; cursor: pointer; }
    .canonical { color: #3fb950; }
    .external { color: #f0883e; }
    .native { color: #58a6ff; }
    .rollup { color: #3fb950; }
    .issuer { color: #a371f7; }
    .third-party { color: #f85149; }

    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 1000;
      overflow-y: auto;
    }
    .modal.active { display: flex; justify-content: center; padding: 40px; }
    .modal-content {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 24px;
      max-width: 1200px;
      width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
    #modal-body {
      overflow-y: auto;
      flex: 1;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .modal-close {
      background: none;
      border: none;
      color: #8b949e;
      font-size: 24px;
      cursor: pointer;
    }
    .escrow-card {
      background: #21262d;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .escrow-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .escrow-name { font-weight: 600; }
    .escrow-value { color: #3fb950; }
    .escrow-category {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-top: 4px;
    }
    .escrow-category.rollup-secured { background: rgba(63,185,80,0.2); color: #3fb950; }
    .escrow-category.issuer-secured { background: rgba(163,113,247,0.2); color: #a371f7; }
    .escrow-category.third-party-secured { background: rgba(248,81,73,0.2); color: #f85149; }
    .escrow-tokens {
      margin-top: 12px;
      font-size: 13px;
      color: #8b949e;
    }
  </style>
</head>
<body>
  <h1>Escrow Analysis Dashboard</h1>

  <h2>TVL by Messaging Type</h2>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Total TVL</div>
      <div class="value">${formatUsd(totalTvl)}</div>
    </div>
    <div class="summary-card canonical">
      <div class="label">Canonical</div>
      <div class="value">${formatUsd(totalCanonical)}</div>
    </div>
    <div class="summary-card external">
      <div class="label">External</div>
      <div class="value">${formatUsd(totalExternal)}</div>
    </div>
    <div class="summary-card native">
      <div class="label">Native</div>
      <div class="value">${formatUsd(totalNative)}</div>
    </div>
  </div>

  <h2>TVL by Governance</h2>
  <div class="breakdown-grid">
    <div class="breakdown-card rollup">
      <div class="label">Rollup-Secured</div>
      <div class="value">${formatUsd(totalRollupSecured)}</div>
    </div>
    <div class="breakdown-card issuer">
      <div class="label">Issuer-Secured</div>
      <div class="value">${formatUsd(totalIssuerSecured)}</div>
    </div>
    <div class="breakdown-card third-party">
      <div class="label">Third-Party-Secured</div>
      <div class="value">${formatUsd(totalThirdParty)}</div>
    </div>
  </div>

  <h2>Chains (${reports.length})</h2>
  <table>
    <thead>
      <tr>
        <th>Chain</th>
        <th>Total TVL</th>
        <th>Canonical</th>
        <th>External</th>
        <th>Native</th>
        <th>Rollup</th>
        <th>Issuer</th>
        <th>Third-Party</th>
      </tr>
    </thead>
    <tbody>
      ${chainRows}
    </tbody>
  </table>

  <div id="modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modal-title">Chain Details</h2>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div id="modal-body"></div>
    </div>
  </div>

  <script>
    const escrows = ${escrowsJson};
    const reports = ${JSON.stringify(reports)};

    function formatUsd(value) {
      if (value >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
      if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
      if (value >= 1e3) return '$' + (value / 1e3).toFixed(2) + 'K';
      return '$' + value.toFixed(2);
    }

    function showChainDetail(chainId) {
      const report = reports.find(r => r.projectId === chainId);
      if (!report) return;

      document.getElementById('modal-title').textContent = chainId + ' Assets';

      const escrowHtml = '<h3 style="color: #8b949e; margin-bottom: 12px;">Escrows (L1 locked)</h3>' +
        report.escrows
        .sort((a, b) => b.totalValueUsd - a.totalValueUsd)
        .map(e => \`
          <div class="escrow-card">
            <div class="escrow-header">
              <span class="escrow-name">\${e.name}</span>
              <span class="escrow-value">\${formatUsd(e.totalValueUsd)}</span>
            </div>
            <div>
              <span class="escrow-category \${e.category}">\${e.category}</span>
              <span style="color: #8b949e; margin-left: 8px; font-size: 12px;">\${e.bridgeType}</span>
            </div>
            <div class="escrow-tokens">
              \${e.tokens.slice(0, 5).map(t => t.symbol + ': ' + formatUsd(t.valueUsd)).join(' | ')}
              \${e.tokens.length > 5 ? ' | +' + (e.tokens.length - 5) + ' more' : ''}
            </div>
          </div>
        \`).join('');

      const externalHtml = report.externalTokens && report.externalTokens.length > 0 ?
        '<h3 style="color: #8b949e; margin: 24px 0 12px;">External Tokens (burn/mint)</h3>' +
        report.externalTokens
        .sort((a, b) => b.valueUsd - a.valueUsd)
        .map(t => \`
          <div class="escrow-card">
            <div class="escrow-header">
              <span class="escrow-name">\${t.symbol}</span>
              <span class="escrow-value">\${formatUsd(t.valueUsd)}</span>
            </div>
            <div>
              <span class="escrow-category \${t.category}">\${t.category}</span>
              <span style="color: #8b949e; margin-left: 8px; font-size: 12px;">\${t.bridgeProtocol}</span>
            </div>
          </div>
        \`).join('') : '';

      document.getElementById('modal-body').innerHTML = escrowHtml + externalHtml;
      document.getElementById('modal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('modal').classList.remove('active');
    }

    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') closeModal();
    });
  </script>
</body>
</html>`
}

function main(): void {
  console.log('Loading analysis files...')

  const files = readdirSync(ANALYSIS_DIR).filter(f => f.endsWith('.json'))

  if (files.length === 0) {
    console.log('No analysis files found in', ANALYSIS_DIR)
    return
  }

  const reports: EscrowReport[] = []
  for (const file of files) {
    try {
      const content = readFileSync(join(ANALYSIS_DIR, file), 'utf-8')
      const report = JSON.parse(content) as EscrowReport
      reports.push(report)
      console.log(`  Loaded ${file}`)
    } catch (e) {
      console.log(`  Failed to load ${file}`)
    }
  }

  console.log(`\nGenerating HTML for ${reports.length} chains...`)

  const html = generateHtml(reports)
  const outputPath = join(ANALYSIS_DIR, 'dashboard.html')
  writeFileSync(outputPath, html)

  console.log(`\n✓ Dashboard saved to ${outputPath}`)
  console.log(`  Open in browser: file://${outputPath}`)
}

main()
